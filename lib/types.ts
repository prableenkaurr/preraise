export type SourceName = "hackernews" | "producthunt" | "googletrends";

/** Direction of the signal — drives the arrow indicator in the UI. */
export type Trend = "up" | "flat" | "down";

export interface SourceSignal {
  source: SourceName;
  /** 0-100 normalized strength of this source's signal for the startup. */
  score: number;
  /** Trajectory arrow — rising, holding, or fading. */
  trend: Trend;
  /** Whether this source actually had data for the startup. */
  present: boolean;
  /** Human-readable evidence for why this source fired. */
  detail: string;
  /** Link back to the originating item, when available. */
  url?: string;
  /** Raw metrics kept around for transparency / debugging. */
  metrics: Record<string, number | string>;
}

export interface RawCandidate {
  /** Display name of the startup / product. */
  name: string;
  tagline?: string;
  url?: string;
  signal: SourceSignal;
}

export interface RankedStartup {
  rank: number;
  name: string;
  /** One-line description. */
  tagline?: string;
  url?: string;
  /** Overall 0-100 Surfaced score. */
  surfacedScore: number;
  /** Always three signals, ordered Hacker News, ProductHunt, Google Trends. */
  signals: SourceSignal[];
  /** One sentence explaining the strongest signal driving this ranking. */
  whyNow: string;
}

export interface SourceStatus {
  source: SourceName;
  ok: boolean;
  /** Number of candidates / terms this source contributed. */
  count: number;
  note?: string;
}

export interface ScanResult {
  sector: string;
  generatedAt: string;
  startups: RankedStartup[];
  sources: SourceStatus[];
  /** 0-100 momentum of the sector overall, from Google Trends. */
  sectorMomentum: number;
}
