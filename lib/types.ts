// ---------------------------------------------------------------------------
// Scraping
// ---------------------------------------------------------------------------

/** The kind of page we try to find and scrape on a startup's site. */
export type PageType = "homepage" | "about" | "careers" | "pricing";

/** A single scraped page reduced to clean, model-ready text. */
export interface ScrapedPage {
  type: PageType;
  url: string;
  title: string;
  /** Cleaned, whitespace-collapsed visible text (already length-capped). */
  text: string;
}

/** Everything we managed to pull from a company's website. */
export interface ScrapedSite {
  /** The canonical URL the user submitted (normalized). */
  url: string;
  /** Hostname, e.g. "cursor.com" — a decent fallback company name. */
  domain: string;
  pages: ScrapedPage[];
  /** Pages we attempted but failed to fetch, for transparency. */
  failed: { type: PageType; url: string; reason: string }[];
}

// ---------------------------------------------------------------------------
// Memo
// ---------------------------------------------------------------------------

export type Recommendation = "Strong Buy" | "Worth Further Research" | "Pass";

export interface CompanySnapshot {
  name: string;
  oneLiner: string;
  industry: string;
  businessModel: string;
}

export interface Memo {
  companySnapshot: CompanySnapshot;
  problem: {
    statement: string;
    importance: string;
  };
  product: {
    core: string;
    keyFeatures: string[];
    differentiation: string;
  };
  market: {
    category: string;
    trends: string[];
    adoptionDrivers: string[];
  };
  competition: {
    competitors: string[];
    advantages: string[];
    weaknesses: string[];
  };
  team: {
    hiringActivity: string;
    growthIndicators: string[];
    strengths: string[];
  };
  /** Exactly three reasons this could become a category leader. */
  bullCase: string[];
  bearCase: {
    risks: string[];
    competitiveThreats: string[];
    executionRisks: string[];
  };
  /** One concise paragraph, VC-associate voice. */
  investmentThesis: string;
  recommendation: Recommendation;
  /** 0-100 — how confident the analysis is given the available signal. */
  confidenceScore: number;
}

/**
 * Full payload returned by /api/generate. The complete `site` is included so
 * the client can pass it back to /api/chat as grounding context — the API
 * stays stateless (no server-side session storage).
 */
export interface MemoResult {
  memo: Memo;
  site: ScrapedSite;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Portfolio Intelligence
// ---------------------------------------------------------------------------

export interface CompanyMetrics {
  companyName: string;
  sector: string;
  foundedYear: number;
  founders: string[];
  founderBackgrounds: string[];
  /** Broad stage label only — e.g. "Seed", "Series A–B", "Growth", "Public", "Acquired". */
  stage: string;
}

export interface PortfolioInsight {
  title: string;
  observation: string;
  evidence: string[];
}

export interface PortfolioAnalysis {
  firm: string;
  portfolio: string[];
  companies: CompanyMetrics[];
  sectorAnalysis: { sector: string; percent: number }[];
  founderAnalysis: { pattern: string; percent: number }[];
  topPerformers: string[];
  emergingThesis: string;
  insights: PortfolioInsight[];
  sourceNotes: string[];
}

export interface PortfolioComparison {
  firms: [string, string];
  analyses: [PortfolioAnalysis, PortfolioAnalysis];
  differences: { firm: string; points: string[] }[];
  sharedThemes: string[];
  summary: string;
}

export interface PortfolioAnalysisResult {
  mode: "single" | "compare";
  generatedAt: string;
  analysis?: PortfolioAnalysis;
  comparison?: PortfolioComparison;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export type ChatRole = "user" | "model";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
