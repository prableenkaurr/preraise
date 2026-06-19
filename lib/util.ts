/** Clamp a number into [min, max]. */
export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/** Hours elapsed between an ISO/epoch timestamp and now. Floors at ~0.5h. */
export function hoursSince(ts: string | number): number {
  const then = typeof ts === "number" ? ts * 1000 : new Date(ts).getTime();
  const diffMs = Date.now() - then;
  return Math.max(0.5, diffMs / (1000 * 60 * 60));
}

/**
 * Normalize a product/startup name for cross-source matching.
 * Strips punctuation, common suffixes and lowercases.
 */
export function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\b(inc|labs?|ai|app|io|hq|the)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Squash unbounded positive metrics into 0-100 with diminishing returns. */
export function logScale(value: number, midpoint: number): number {
  if (value <= 0) return 0;
  // value == midpoint -> 50; grows toward 100 with diminishing returns.
  const ratio = value / midpoint;
  return clamp((ratio / (ratio + 1)) * 100);
}

/** Map a 0-100 signal score to an up / flat / down arrow direction. */
export function trendFromScore(score: number): "up" | "flat" | "down" {
  if (score >= 60) return "up";
  if (score >= 38) return "flat";
  return "down";
}

/** Build keyword tokens from a free-text sector query. */
export function sectorKeywords(sector: string): string[] {
  return sector
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
}

/** Does a candidate's text plausibly relate to the sector keywords? */
export function matchesSector(text: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const hay = text.toLowerCase();
  return keywords.some((k) => hay.includes(k));
}
