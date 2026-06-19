import { RawCandidate, RankedStartup, SourceName, SourceSignal, Trend } from "./types";
import { normalizeName, clamp } from "./util";

// Weight each source contributes to the blended Surfaced score. Early detection
// rewards corroboration: a startup seen on multiple sources is a stronger early
// signal than a single loud one, so present sources are renormalized and
// multi-source hits get a corroboration bump in finalize().
const SOURCE_WEIGHT: Record<SourceName, number> = {
  hackernews: 0.4,
  producthunt: 0.4,
  googletrends: 0.2,
};

const SOURCE_ORDER: SourceName[] = ["hackernews", "producthunt", "googletrends"];

const SOURCE_LABEL: Record<SourceName, string> = {
  hackernews: "Hacker News",
  producthunt: "ProductHunt",
  googletrends: "Google Trends",
};

interface MergeInput {
  candidates: RawCandidate[];
  risingTerms: { term: string; value: number }[];
  sectorMomentum: number;
}

/**
 * Merge candidates by normalized name, fold in Google Trends rising-term
 * trajectory and sector momentum, then produce a ranked top-10. Every ranked
 * startup carries exactly three signals (HN, ProductHunt, Trends) — sources
 * with no data become an explicit "no signal" placeholder so the UI can always
 * render three bars.
 */
export function rankStartups({ candidates, risingTerms, sectorMomentum }: MergeInput): RankedStartup[] {
  const groups = new Map<string, { display: RawCandidate; signals: Map<SourceName, SourceSignal> }>();

  for (const c of candidates) {
    const key = normalizeName(c.name);
    if (!key) continue;
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { display: c, signals: new Map([[c.signal.source, c.signal]]) });
    } else {
      // Keep the richest display (prefer one with a tagline/url).
      if (!existing.display.tagline && c.tagline) existing.display = c;
      const prev = existing.signals.get(c.signal.source);
      // If the same source surfaces a name twice, keep the stronger signal.
      if (!prev || c.signal.score > prev.score) existing.signals.set(c.signal.source, c.signal);
    }
  }

  // Index rising-search queries so we can attach a Google Trends signal to any
  // discovered startup whose name shows up as a rising query.
  const risingIndex = risingTerms.map((t) => ({ norm: normalizeName(t.term), ...t }));

  const ranked: RankedStartup[] = [];
  for (const [, group] of groups) {
    const nameNorm = normalizeName(group.display.name);

    // Synthesize a Google Trends signal from the rising-query trajectory.
    if (!group.signals.has("googletrends")) {
      const match = risingIndex.find(
        (t) => t.norm && (t.norm.includes(nameNorm) || nameNorm.includes(t.norm))
      );
      if (match) {
        const score = clamp(match.value > 0 ? 60 + Math.min(40, match.value / 25) : 55);
        group.signals.set("googletrends", {
          source: "googletrends",
          score,
          trend: match.value >= 0 ? "up" : "down",
          present: true,
          detail: `Rising search query "${match.term}" (+${match.value}% over 90d)`,
          metrics: { risingValue: match.value, query: match.term },
        });
      }
    }

    ranked.push(finalize(group.display, group.signals, sectorMomentum));
  }

  ranked.sort((a, b) => b.surfacedScore - a.surfacedScore);
  return ranked.slice(0, 10).map((s, i) => ({ ...s, rank: i + 1 }));
}

function finalize(
  display: RawCandidate,
  present: Map<SourceName, SourceSignal>,
  sectorMomentum: number
): RankedStartup {
  // Weighted blend over present sources only, renormalized so a missing source
  // doesn't silently drag the score to zero.
  let weighted = 0;
  let weightSum = 0;
  for (const s of present.values()) {
    weighted += s.score * SOURCE_WEIGHT[s.source];
    weightSum += SOURCE_WEIGHT[s.source];
  }
  const base = weightSum > 0 ? weighted / weightSum : 0;

  const corroboration = 1 + (present.size - 1) * 0.12; // +12% per extra source
  const momentumFactor = 0.85 + (sectorMomentum / 100) * 0.3; // ±15% sector nudge
  const surfacedScore = Math.round(clamp(base * corroboration * momentumFactor));

  // Build the full three-signal array, filling absent sources with placeholders.
  const signals: SourceSignal[] = SOURCE_ORDER.map(
    (src) =>
      present.get(src) ?? {
        source: src,
        score: 0,
        trend: "flat" as Trend,
        present: false,
        detail: "No signal yet",
        metrics: {},
      }
  );

  return {
    rank: 0,
    name: display.name,
    tagline: display.tagline,
    url: display.url,
    surfacedScore,
    signals,
    whyNow: whyNow(display.name, present),
  };
}

/** One sentence on the single strongest present signal. */
function whyNow(name: string, present: Map<SourceName, SourceSignal>): string {
  const strongest = [...present.values()].sort((a, b) => b.score - a.score)[0];
  if (!strongest) return `${name} is surfacing across early-stage channels.`;

  const m = strongest.metrics;
  switch (strongest.source) {
    case "hackernews":
      return `Show HN traction is the loudest tell — ${m.points ?? 0} points and ${m.comments ?? 0} comments in just ${m.ageHours ?? 0}h.`;
    case "producthunt":
      return `Riding fast ProductHunt momentum — ${m.votes ?? 0} votes at ${m.voteVelocity ?? 0}/h, ahead of the curve.`;
    case "googletrends":
      return `Search demand is inflecting — "${m.query ?? name}" is a rising query (+${m.risingValue ?? 0}%) before the press caught on.`;
    default:
      return `${name} is gaining early traction across ${SOURCE_LABEL[strongest.source]}.`;
  }
}
