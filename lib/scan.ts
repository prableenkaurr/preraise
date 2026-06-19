import { fetchProductHunt } from "./sources/producthunt";
import { fetchHackerNews } from "./sources/hackernews";
import { fetchGoogleTrends } from "./sources/googletrends";
import { rankStartups } from "./score";
import { RawCandidate, ScanResult, SourceStatus } from "./types";

/**
 * Orchestrate all three sources concurrently, merge + rank, and assemble the
 * full ScanResult. Each source is independently fault-tolerant: a failure in
 * one is recorded in `sources` and never aborts the scan.
 */
export async function runScan(sector: string): Promise<ScanResult> {
  const [hn, ph, trends] = await Promise.allSettled([
    fetchHackerNews(sector),
    fetchProductHunt(sector),
    fetchGoogleTrends(sector),
  ]);

  const candidates: RawCandidate[] = [];
  const sources: SourceStatus[] = [];

  // Hacker News
  if (hn.status === "fulfilled") {
    candidates.push(...hn.value);
    sources.push({ source: "hackernews", ok: true, count: hn.value.length });
  } else {
    sources.push({ source: "hackernews", ok: false, count: 0, note: String(hn.reason?.message ?? hn.reason) });
  }

  // ProductHunt
  if (ph.status === "fulfilled") {
    candidates.push(...ph.value);
    sources.push({ source: "producthunt", ok: true, count: ph.value.length });
  } else {
    const skipped = (ph.reason as { skipped?: boolean })?.skipped;
    sources.push({
      source: "producthunt",
      ok: false,
      count: 0,
      note: skipped ? "Skipped — set PRODUCTHUNT_TOKEN to enable" : String(ph.reason?.message ?? ph.reason),
    });
  }

  // Google Trends
  let risingTerms: { term: string; value: number }[] = [];
  let sectorMomentum = 50;
  if (trends.status === "fulfilled") {
    risingTerms = trends.value.risingTerms;
    sectorMomentum = trends.value.momentum;
    sources.push({
      source: "googletrends",
      ok: trends.value.ok,
      count: trends.value.risingTerms.length,
      note: trends.value.note,
    });
  } else {
    sources.push({ source: "googletrends", ok: false, count: 0, note: String(trends.reason) });
  }

  const startups = rankStartups({ candidates, risingTerms, sectorMomentum });

  return {
    sector,
    generatedAt: new Date().toISOString(),
    startups,
    sources,
    sectorMomentum: Math.round(sectorMomentum),
  };
}
