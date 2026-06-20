import { NextRequest, NextResponse } from "next/server";
import { chatWithMemo, GeminiError } from "@/lib/gemini";
import { ChatMessage, Memo, ScrapedSite } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface ChatBody {
  memo: Memo;
  site: ScrapedSite;
  history: ChatMessage[];
  question: string;
}

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { memo, site, history, question } = body ?? {};
  if (!memo || !site || typeof question !== "string" || !question.trim()) {
    return NextResponse.json(
      { error: "memo, site, and a non-empty question are required." },
      { status: 400 }
    );
  }
  if (question.length > 1000) {
    return NextResponse.json({ error: "That question is too long." }, { status: 400 });
  }

  try {
    const safeHistory = Array.isArray(history) ? history.slice(-12) : [];
    const reply = await chatWithMemo(memo, site, safeHistory, question.trim());
    return NextResponse.json({ reply });
  } catch (e) {
    if (e instanceof GeminiError) {
      return NextResponse.json({ error: e.message }, { status: 502 });
    }
    return NextResponse.json({ error: "Chat failed. Please try again." }, { status: 500 });
  }
}
