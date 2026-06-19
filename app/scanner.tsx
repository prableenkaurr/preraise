"use client";

import { useState } from "react";
import type { Brand } from "@/lib/fund";
import type { ScanResult, RankedStartup, SourceName, SourceSignal, Trend } from "@/lib/types";

const EXAMPLES = ["AI fashion tech", "developer tools", "consumer AI", "AI agents", "fintech for gen z"];

const SOURCE_LABEL: Record<SourceName, string> = {
  hackernews: "Hacker News",
  producthunt: "ProductHunt",
  googletrends: "Google Trends",
};

const SOURCE_SHORT: Record<SourceName, string> = {
  hackernews: "HN",
  producthunt: "PH",
  googletrends: "Trends",
};

const BAR_COLOR: Record<SourceName, string> = {
  hackernews: "bg-hn",
  producthunt: "bg-ph",
  googletrends: "bg-trends",
};

export default function Scanner({ brand }: { brand: Brand }) {
  const [sector, setSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function scan(q: string) {
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/scan?sector=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data as ScanResult);
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const started = loading || result || error;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <span className="text-lg font-bold tracking-tight">
            {brand.personalized ? (
              <>
                PreRaise.ai <span className="text-ink-soft font-medium">for {brand.fundName}</span>
              </>
            ) : (
              "PreRaise.ai"
            )}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-ink-soft sm:block">
            Pre-mainstream startup radar
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5">
        {/* Hero + centered search */}
        <section className={`flex flex-col items-center text-center ${started ? "pt-12 pb-8" : "pt-24 pb-10"}`}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {brand.personalized ? `PreRaise.ai for ${brand.fundName}` : "PreRaise.ai"}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Enter an investment thesis or sector. We surface startups gaining real traction{" "}
            <span className="text-ink">before they go mainstream</span> — ranked by early signal strength
            across Hacker News, ProductHunt, and Google Trends.
          </p>

          <form
            className="mt-8 flex w-full max-w-xl items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              scan(sector);
            }}
          >
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="e.g. AI fashion tech"
              aria-label="Investment thesis or sector"
              className="flex-1 rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink shadow-sm outline-none transition focus:border-surfaced focus:ring-2 focus:ring-surfaced/20"
            />
            <button
              type="submit"
              disabled={loading || !sector.trim()}
              className="rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Surfacing…" : "Surface"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setSector(ex);
                  scan(ex);
                }}
                className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft transition hover:border-surfaced hover:text-ink"
              >
                {ex}
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4 pb-16">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && result && <Results result={result} />}
      </main>

      <footer className="mt-auto border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-6 text-center text-xs leading-relaxed text-ink-soft">
          Surfaced score blends Show HN traction, ProductHunt vote velocity, and Google Trends trajectory.
          It rewards cross-source corroboration and early acceleration over raw popularity.
        </div>
      </footer>
    </div>
  );
}

function Results({ result }: { result: ScanResult }) {
  if (result.startups.length === 0) {
    return (
      <div className="py-16 text-center text-ink-soft">
        No startups surfaced for “{result.sector}”. Try a broader or differently-worded thesis.
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
        <span className="font-semibold text-ink">{result.startups.length} startups surfaced</span>
        <span>·</span>
        <SourceStatusRow result={result} />
      </div>
      <div className="space-y-4">
        {result.startups.map((s) => (
          <StartupCard key={s.rank} s={s} />
        ))}
      </div>
    </div>
  );
}

function SourceStatusRow({ result }: { result: ScanResult }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: momentumHex(result.sectorMomentum) }}
        />
        Sector momentum {result.sectorMomentum}/100
      </span>
      {result.sources.map((src) => (
        <span
          key={src.source}
          title={src.note || ""}
          className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 ${
            src.ok ? "" : "opacity-50"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${src.ok ? "bg-emerald-500" : "bg-gray-300"}`} />
          {SOURCE_LABEL[src.source]} {src.ok ? `(${src.count})` : "—"}
        </span>
      ))}
    </span>
  );
}

function StartupCard({ s }: { s: RankedStartup }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-7 flex-shrink-0 pt-1 text-center text-xl font-extrabold text-ink-soft/60">
          {s.rank}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-tight">
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-surfaced hover:underline">
                {s.name}
              </a>
            ) : (
              s.name
            )}
          </h3>
          {s.tagline && <p className="mt-1 text-sm leading-snug text-ink-soft">{s.tagline}</p>}
        </div>

        {/* Prominent overall score */}
        <div className="flex-shrink-0 text-right">
          <div className="text-3xl font-extrabold leading-none" style={{ color: momentumHex(s.surfacedScore) }}>
            {s.surfacedScore}
          </div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-soft">
            Surfaced
          </div>
        </div>
      </div>

      {/* Per-source signal bars */}
      <div className="mt-4 space-y-2.5">
        {s.signals.map((sig) => (
          <SignalBar key={sig.source} sig={sig} />
        ))}
      </div>

      {/* Why now */}
      <p className="mt-4 border-t border-line pt-3 text-sm italic text-ink-soft">
        <span className="font-semibold not-italic text-ink">Why now: </span>
        {s.whyNow}
      </p>
    </article>
  );
}

function SignalBar({ sig }: { sig: SourceSignal }) {
  return (
    <div className="flex items-center gap-3" title={sig.detail}>
      <span className="w-12 flex-shrink-0 text-xs font-bold text-ink-soft">
        {SOURCE_SHORT[sig.source]}
      </span>
      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-canvas">
        <span
          className={`absolute inset-y-0 left-0 rounded-full ${BAR_COLOR[sig.source]} ${
            sig.present ? "" : "opacity-30"
          }`}
          style={{ width: `${Math.max(sig.score, sig.present ? 4 : 0)}%` }}
        />
      </span>
      <span className="flex w-16 flex-shrink-0 items-center justify-end gap-1 text-xs font-semibold tabular-nums">
        {sig.present ? Math.round(sig.score) : "—"}
        <Arrow trend={sig.trend} present={sig.present} />
      </span>
    </div>
  );
}

function Arrow({ trend, present }: { trend: Trend; present: boolean }) {
  if (!present) return <span className="text-ink-soft/40">·</span>;
  const map: Record<Trend, { char: string; cls: string }> = {
    up: { char: "↑", cls: "text-emerald-600" },
    flat: { char: "→", cls: "text-amber-500" },
    down: { char: "↓", cls: "text-red-500" },
  };
  const { char, cls } = map[trend];
  return <span className={cls}>{char}</span>;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="h-6 w-7 animate-shimmer rounded skeleton-fill" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-1/3 animate-shimmer rounded skeleton-fill" />
          <div className="h-4 w-2/3 animate-shimmer rounded skeleton-fill" />
        </div>
        <div className="h-9 w-12 animate-shimmer rounded skeleton-fill" />
      </div>
      <div className="mt-4 space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-2 w-full animate-shimmer rounded-full skeleton-fill" />
        ))}
      </div>
    </div>
  );
}

function momentumHex(score: number): string {
  if (score >= 70) return "#059669"; // emerald-600
  if (score >= 45) return "#d97706"; // amber-600
  return "#dc2626"; // red-600
}
