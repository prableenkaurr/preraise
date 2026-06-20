import { NextRequest, NextResponse } from "next/server";
import { scrapeSite, ScrapeError } from "@/lib/scrape";
import { generateMemo, GeminiError } from "@/lib/gemini";
import { MemoResult } from "@/lib/types";

// Scraping + an LLM call need the Node runtime and room to breathe.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let url: unknown;
  try {
    ({ url } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "A 'url' string is required." }, { status: 400 });
  }
  if (url.length > 2048) {
    return NextResponse.json({ error: "That URL is too long." }, { status: 400 });
  }

  try {
    const site = await scrapeSite(url);
    const memo = await generateMemo(site);
    const result: MemoResult = { memo, site, generatedAt: new Date().toISOString() };
    return NextResponse.json(result);
  } catch (e) {
    // ScrapeError / GeminiError carry user-safe messages; anything else is masked.
    if (e instanceof ScrapeError) {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    if (e instanceof GeminiError) {
      return NextResponse.json({ error: e.message }, { status: 502 });
    }
    return NextResponse.json(
      { error: "Something went wrong generating the memo. Please try again." },
      { status: 500 }
    );
  }
}
