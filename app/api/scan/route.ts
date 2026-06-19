import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scan";

// External fetches need the Node.js runtime; keep results reasonably fresh.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const sector = req.nextUrl.searchParams.get("sector")?.trim();
  if (!sector) {
    return NextResponse.json({ error: "Missing 'sector' query parameter" }, { status: 400 });
  }
  if (sector.length > 100) {
    return NextResponse.json({ error: "'sector' is too long" }, { status: 400 });
  }

  try {
    const result = await runScan(sector);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Scan failed", detail: (e as Error).message },
      { status: 500 }
    );
  }
}
