import { clamp } from "../util";

export interface TrendsResult {
  ok: boolean;
  /** Rising related queries for the sector. */
  risingTerms: { term: string; value: number }[];
  /** 0-100 momentum of the sector overall over the trailing window. */
  momentum: number;
  note?: string;
}

const EXPLORE = "https://trends.google.com/trends/api/explore";
const RELATED = "https://trends.google.com/trends/api/widgetdata/relatedsearches";
const TIMESERIES = "https://trends.google.com/trends/api/widgetdata/multiline";

// Google prefixes its JSON responses with this XSSI guard.
const XSSI = ")]}',";

/**
 * Google has no official Trends API. This hits the same public endpoints the
 * trends.google.com frontend uses (a token handshake via /explore, then the
 * related-searches + timeseries widgets). It is rate-limited and often blocks
 * datacenter IPs, so EVERY path is wrapped to degrade gracefully: on any
 * failure we return ok:false with a neutral momentum, and the rest of the app
 * proceeds on ProductHunt + Hacker News alone.
 */
export async function fetchGoogleTrends(sector: string): Promise<TrendsResult> {
  try {
    const widgets = await getWidgets(sector);
    const related = widgets.find((w) => w.id === "RELATED_QUERIES");
    const timeseries = widgets.find((w) => w.id === "TIMESERIES");

    const risingTerms = related ? await getRisingTerms(related) : [];
    const momentum = timeseries ? await getMomentum(timeseries) : 50;

    return {
      ok: true,
      risingTerms,
      momentum,
      note: risingTerms.length ? undefined : "No rising related queries returned",
    };
  } catch (e) {
    return {
      ok: false,
      risingTerms: [],
      momentum: 50,
      note: `Trends unavailable (${(e as Error).message}); using neutral momentum`,
    };
  }
}

interface Widget {
  id: string;
  token: string;
  request: unknown;
}

async function getWidgets(sector: string): Promise<Widget[]> {
  const req = {
    comparisonItem: [{ keyword: sector, geo: "", time: "today 3-m" }],
    category: 0,
    property: "",
  };
  const url = `${EXPLORE}?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(req))}`;
  const res = await fetch(url, { headers: browserHeaders() });
  if (!res.ok) throw new Error(`explore ${res.status}`);
  const json = parseXssi(await res.text());
  return (json.widgets ?? []) as Widget[];
}

async function getRisingTerms(widget: Widget): Promise<{ term: string; value: number }[]> {
  const url =
    `${RELATED}?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(widget.request))}` +
    `&token=${widget.token}`;
  const res = await fetch(url, { headers: browserHeaders() });
  if (!res.ok) return [];
  const json = parseXssi(await res.text());
  const ranked = json?.default?.rankedList ?? [];
  // rankedList[1] is "rising"; fall back to [0] ("top") if needed.
  const rising = ranked[1]?.rankedKeyword ?? ranked[0]?.rankedKeyword ?? [];
  return rising.slice(0, 15).map((k: { query: string; value: number }) => ({
    term: k.query,
    value: k.value,
  }));
}

async function getMomentum(widget: Widget): Promise<number> {
  const url =
    `${TIMESERIES}?hl=en-US&tz=0&req=${encodeURIComponent(JSON.stringify(widget.request))}` +
    `&token=${widget.token}`;
  const res = await fetch(url, { headers: browserHeaders() });
  if (!res.ok) return 50;
  const json = parseXssi(await res.text());
  const points: { value: number[] }[] = json?.default?.timelineData ?? [];
  if (points.length < 4) return 50;
  const vals = points.map((p) => p.value?.[0] ?? 0);
  // Momentum = recent quarter average vs. first quarter average, mapped to 0-100.
  const q = Math.max(1, Math.floor(vals.length / 4));
  const early = avg(vals.slice(0, q));
  const recent = avg(vals.slice(-q));
  if (early === 0) return recent > 0 ? 75 : 50;
  const growth = (recent - early) / early; // -1 .. +inf
  return clamp(50 + growth * 50);
}

function parseXssi(text: string): any {
  const cleaned = text.startsWith(XSSI) ? text.slice(XSSI.length) : text;
  return JSON.parse(cleaned);
}

function avg(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function browserHeaders(): Record<string, string> {
  return {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  };
}
