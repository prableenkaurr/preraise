import { RawCandidate } from "../types";
import { hoursSince, logScale, matchesSector, sectorKeywords, clamp, trendFromScore } from "../util";

const PH_GRAPHQL = "https://api.producthunt.com/v2/api/graphql";

interface PHPost {
  name: string;
  tagline: string;
  votesCount: number;
  createdAt: string;
  url: string;
  topics: { edges: { node: { name: string } }[] };
}

/**
 * Query the ProductHunt API v2 (GraphQL) for recent launches and score them by
 * vote velocity. Requires PRODUCTHUNT_TOKEN. If the token is missing we throw a
 * sentinel error so the orchestrator can mark the source as skipped rather than
 * failed.
 */
export async function fetchProductHunt(sector: string): Promise<RawCandidate[]> {
  const token = process.env.PRODUCTHUNT_TOKEN;
  if (!token) {
    const err = new Error("PRODUCTHUNT_TOKEN not set") as Error & { skipped?: boolean };
    err.skipped = true;
    throw err;
  }

  const keywords = sectorKeywords(sector);
  // Pull recent posts ordered by votes; we filter to the sector client-side so
  // we keep a single cheap query regardless of how the sector is phrased.
  const query = `
    query RecentPosts {
      posts(order: VOTES, first: 50, postedAfter: "${postedAfterISO()}") {
        edges {
          node {
            name
            tagline
            votesCount
            createdAt
            url
            topics(first: 5) { edges { node { name } } }
          }
        }
      }
    }`;

  const res = await fetch(PH_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`ProductHunt API ${res.status}`);
  const json = (await res.json()) as {
    data?: { posts?: { edges: { node: PHPost }[] } };
    errors?: { message: string }[];
  };
  if (json.errors?.length) throw new Error(`ProductHunt: ${json.errors[0].message}`);

  const edges = json.data?.posts?.edges ?? [];
  const candidates: RawCandidate[] = [];
  for (const { node } of edges) {
    const topics = node.topics?.edges?.map((e) => e.node.name).join(" ") ?? "";
    const haystack = `${node.name} ${node.tagline} ${topics}`;
    if (!matchesSector(haystack, keywords)) continue;

    const ageH = hoursSince(node.createdAt);
    const velocity = node.votesCount / ageH; // votes per hour
    const score = clamp(0.8 * logScale(velocity, 8) + 0.2 * logScale(node.votesCount, 200));

    candidates.push({
      name: node.name.trim().slice(0, 60),
      tagline: node.tagline,
      url: node.url,
      signal: {
        source: "producthunt",
        score,
        trend: trendFromScore(score),
        present: true,
        detail: `${node.votesCount} votes · ${velocity.toFixed(1)}/h velocity · ${Math.round(ageH)}h old`,
        url: node.url,
        metrics: {
          votes: node.votesCount,
          ageHours: Math.round(ageH),
          voteVelocity: Number(velocity.toFixed(2)),
          topics,
        },
      },
    });
  }
  return candidates;
}

/** ISO timestamp ~30 days ago for the postedAfter filter. */
function postedAfterISO(): string {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
}
