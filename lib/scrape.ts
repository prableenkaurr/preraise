import * as cheerio from "cheerio";
import { PageType, ScrapedPage, ScrapedSite } from "./types";

// Keep per-page text bounded so we never blow up the model context window. The
// homepage gets a bigger budget since it's the densest signal.
const PER_PAGE_CHARS: Record<PageType, number> = {
  homepage: 6000,
  about: 4000,
  careers: 3000,
  pricing: 3000,
};

const FETCH_TIMEOUT_MS = 8000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Anchor text / href fragments that identify each secondary page. First match
// wins, so order within a list is priority order.
const PAGE_HINTS: Record<Exclude<PageType, "homepage">, string[]> = {
  about: ["about", "company", "our-story", "mission", "who-we-are"],
  careers: ["careers", "career", "jobs", "join", "hiring", "we-are-hiring", "work-with-us"],
  pricing: ["pricing", "plans", "price", "subscribe"],
};

export class ScrapeError extends Error {}

/** Add a scheme if missing and validate. Throws ScrapeError on garbage input. */
export function normalizeUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new ScrapeError("Please enter a URL.");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new ScrapeError(`"${raw}" doesn't look like a valid URL.`);
  }
  if (!url.hostname.includes(".")) {
    throw new ScrapeError(`"${raw}" doesn't look like a valid URL.`);
  }
  return url;
}

/** Fetch a URL as text with a hard timeout. Returns null on any failure. */
async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Strip boilerplate and collapse a page down to clean visible text. */
function extractText($: cheerio.CheerioAPI, cap: number): string {
  $("script, style, noscript, svg, iframe, template").remove();
  // Prefer main content if the page marks it; otherwise fall back to body.
  const root = $("main").length ? $("main") : $("body");
  const text = root.text().replace(/\s+/g, " ").trim();
  return text.slice(0, cap);
}

/** Find the best internal link for each secondary page type. */
function discoverLinks($: cheerio.CheerioAPI, base: URL): Partial<Record<PageType, string>> {
  const found: Partial<Record<PageType, string>> = {};
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    let target: URL;
    try {
      target = new URL(href, base);
    } catch {
      return;
    }
    // Only follow links on the same registered domain.
    if (target.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) return;

    const haystack = `${target.pathname} ${$(el).text()}`.toLowerCase();
    for (const [type, hints] of Object.entries(PAGE_HINTS) as [
      Exclude<PageType, "homepage">,
      string[]
    ][]) {
      if (found[type]) continue;
      if (hints.some((h) => haystack.includes(h))) {
        found[type] = target.href;
      }
    }
  });
  return found;
}

function titleOf($: cheerio.CheerioAPI, fallback: string): string {
  return ($("title").first().text() || $("h1").first().text() || fallback)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/**
 * Scrape a startup site: always the homepage, plus About / Careers / Pricing
 * when we can find them. Secondary pages are best-effort — a failure on any one
 * is recorded but never aborts the scrape. Throws ScrapeError only when the
 * homepage itself can't be loaded (nothing to analyze).
 */
export async function scrapeSite(rawUrl: string): Promise<ScrapedSite> {
  const base = normalizeUrl(rawUrl);
  const domain = base.hostname.replace(/^www\./, "");

  const homeHtml = await fetchHtml(base.href);
  if (!homeHtml) {
    throw new ScrapeError(
      `Couldn't load ${domain}. Check the URL is reachable and serves a public website.`
    );
  }

  const $home = cheerio.load(homeHtml);
  const metaDesc = $home('meta[name="description"]').attr("content")?.trim() ?? "";
  const homeText = [metaDesc, extractText($home, PER_PAGE_CHARS.homepage)]
    .filter(Boolean)
    .join(" ")
    .slice(0, PER_PAGE_CHARS.homepage);

  const pages: ScrapedPage[] = [
    { type: "homepage", url: base.href, title: titleOf($home, domain), text: homeText },
  ];
  const failed: ScrapedSite["failed"] = [];

  const links = discoverLinks($home, base);
  // Fetch the secondary pages concurrently; tolerate individual failures.
  const secondary = Object.entries(links) as [Exclude<PageType, "homepage">, string][];
  const results = await Promise.all(
    secondary.map(async ([type, url]) => {
      const html = await fetchHtml(url);
      if (!html) return { type, url, ok: false as const };
      const $ = cheerio.load(html);
      return {
        type,
        url,
        ok: true as const,
        page: {
          type,
          url,
          title: titleOf($, type),
          text: extractText($, PER_PAGE_CHARS[type]),
        } satisfies ScrapedPage,
      };
    })
  );

  for (const r of results) {
    if (r.ok && r.page.text.length > 0) pages.push(r.page);
    else failed.push({ type: r.type, url: r.url, reason: "unreachable or empty" });
  }

  return { url: base.href, domain, pages, failed };
}

/** Flatten a scrape into a single labeled block for the model prompt. */
export function siteToContext(site: ScrapedSite): string {
  return site.pages
    .map((p) => `### ${p.type.toUpperCase()} — ${p.title}\n${p.url}\n${p.text}`)
    .join("\n\n");
}
