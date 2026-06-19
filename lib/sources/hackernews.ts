import { RawCandidate } from "../types";
import { hoursSince, logScale, matchesSector, sectorKeywords, clamp, trendFromScore } from "../util";

const HN_SEARCH = "https://hn.algolia.com/api/v1/search_by_date";

interface HNHit {
  objectID: string;
  title: string;
  url: string | null;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
}

/**
 * Pull recent "Show HN" submissions matching the sector and turn them into
 * candidates. Show HN threads are where founders self-announce, so they are a
 * strong early-traction signal. No API key required (Algolia HN Search API).
 */
export async function fetchHackerNews(sector: string): Promise<RawCandidate[]> {
  const keywords = sectorKeywords(sector);
  const query = encodeURIComponent(sector);
  // tags=show_hn restricts to Show HN; numericFilters keeps it recent (~90 days).
  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90;
  const url =
    `${HN_SEARCH}?query=${query}&tags=show_hn` +
    `&numericFilters=created_at_i>${since}&hitsPerPage=50`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HN API ${res.status}`);
  const data = (await res.json()) as { hits: HNHit[] };

  const candidates: RawCandidate[] = [];
  for (const hit of data.hits ?? []) {
    if (!hit.title) continue;
    if (!matchesSector(hit.title, keywords)) continue;
    const { name, description } = splitShowHnTitle(hit.title);

    const points = hit.points ?? 0;
    const comments = hit.num_comments ?? 0;
    const ageH = hoursSince(hit.created_at_i);

    // Velocity: engagement per hour, recency-weighted. We favor fresh threads
    // gaining traction over old high-score ones.
    const velocity = (points + comments * 1.5) / Math.sqrt(ageH);
    const recencyBoost = clamp(100 - ageH / 12); // decays over ~50 days
    const score = clamp(0.7 * logScale(velocity, 4) + 0.3 * recencyBoost);

    candidates.push({
      name,
      tagline: description,
      url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      signal: {
        source: "hackernews",
        score,
        trend: trendFromScore(score),
        present: true,
        detail: `${points} points · ${comments} comments · ${Math.round(ageH)}h old`,
        url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        metrics: { points, comments, ageHours: Math.round(ageH), velocity: Number(velocity.toFixed(2)) },
      },
    });
  }
  return candidates;
}

/** "Show HN: Acme – a tool for X" -> { name: "Acme", description: "a tool for X" }. */
function splitShowHnTitle(title: string): { name: string; description: string } {
  const stripped = title.replace(/^show hn:?\s*/i, "").trim();
  // Split name from description on the first " – ", " — ", " - " or ": ".
  const parts = stripped.split(/\s[–—-]\s|:\s/);
  const name = (parts[0] || stripped).replace(/\s+/g, " ").trim().slice(0, 60);
  const description = parts.slice(1).join(" – ").replace(/\s+/g, " ").trim().slice(0, 140);
  return { name, description };
}
