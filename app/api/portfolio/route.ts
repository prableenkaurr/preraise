import { NextRequest, NextResponse } from "next/server";
import { enrichPortfolioAnalysis, enrichPortfolioComparison } from "@/lib/gemini";
import { parsePortfolioRequest, PortfolioDataError } from "@/lib/portfolio-data";
import { PortfolioAnalysisResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let firm: unknown;
  try {
    ({ firm } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof firm !== "string" || !firm.trim()) {
    return NextResponse.json({ error: "Enter a VC firm name." }, { status: 400 });
  }
  if (firm.length > 160) {
    return NextResponse.json({ error: "That firm name is too long." }, { status: 400 });
  }

  try {
    const base = parsePortfolioRequest(firm);
    let result: PortfolioAnalysisResult;

    if (base.mode === "compare" && base.comparison) {
      const [left, right] = await Promise.all(
        base.comparison.analyses.map((analysis) => enrichPortfolioAnalysis(analysis))
      );
      const comparison = await enrichPortfolioComparison({
        ...base.comparison,
        analyses: [left, right],
      });
      result = { ...base, comparison };
    } else if (base.analysis) {
      result = { ...base, analysis: await enrichPortfolioAnalysis(base.analysis) };
    } else {
      return NextResponse.json({ error: "Could not analyze that portfolio." }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof PortfolioDataError) {
      return NextResponse.json({ error: e.message }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Something went wrong analyzing that portfolio. Please try again." },
      { status: 500 }
    );
  }
}
