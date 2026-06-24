"use client";

import { Brand } from "@/lib/fund";
import { CompanyMetrics, PortfolioAnalysis, PortfolioAnalysisResult } from "@/lib/types";
import MemoSection, { Bullets, Field } from "./MemoSection";

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-soft">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-ink/10">
        <div className="h-2 rounded-full bg-surfaced" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

const STAGE_COLORS: Record<string, string> = {
  "Seed": "bg-violet-50 text-violet-700 border-violet-200",
  "Series A–B": "bg-blue-50 text-blue-700 border-blue-200",
  "Series C–D": "bg-sky-50 text-sky-700 border-sky-200",
  "Growth": "bg-amber-50 text-amber-700 border-amber-200",
  "Public": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Acquired": "bg-slate-50 text-slate-600 border-slate-200",
};

function CompanyList({ companies }: { companies: CompanyMetrics[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {companies.map((c) => (
        <div key={c.companyName} className="rounded-lg border border-line bg-canvas p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{c.companyName}</p>
              <p className="text-xs text-ink-soft">{c.sector} · {c.foundedYear}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STAGE_COLORS[c.stage] ?? "bg-line text-ink-soft border-line"}`}>
              {c.stage}
            </span>
          </div>
          {c.founders.length > 0 && (
            <p className="mt-1.5 text-xs text-ink-soft/80">{c.founders.join(", ")}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SingleAnalysis({ analysis }: { analysis: PortfolioAnalysis }) {
  return (
    <div className="print-full min-w-0 space-y-5">
      <MemoSection id="portfolio-summary" index={1} title="Portfolio Overview">
        <Field label="Emerging thesis">{analysis.emergingThesis}</Field>
        {analysis.topPerformers.length > 0 && (
          <Field label="Notable breakouts">
            <Bullets items={analysis.topPerformers} />
          </Field>
        )}
      </MemoSection>

      <MemoSection id="portfolio-patterns" index={2} title="Pattern Detection">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Sector concentration">
            <div className="space-y-3">
              {analysis.sectorAnalysis.map((item) => (
                <Bar key={item.sector} label={item.sector} value={item.percent} />
              ))}
            </div>
          </Field>
          <Field label="Founder archetypes">
            <div className="space-y-3">
              {analysis.founderAnalysis.map((item) => (
                <Bar key={item.pattern} label={item.pattern} value={item.percent} />
              ))}
            </div>
          </Field>
        </div>
      </MemoSection>

      {analysis.insights.length > 0 && (
        <MemoSection id="portfolio-insights" index={3} title="AI Insights">
          <div className="grid gap-4">
            {analysis.insights.map((insight) => (
              <div key={insight.title} className="rounded-lg border border-line bg-canvas p-4">
                <h3 className="font-semibold text-ink">{insight.title}</h3>
                <p className="mt-1">{insight.observation}</p>
                <div className="mt-3">
                  <Bullets items={insight.evidence} />
                </div>
              </div>
            ))}
          </div>
        </MemoSection>
      )}

      <MemoSection id="portfolio-companies" index={analysis.insights.length > 0 ? 4 : 3} title="Portfolio Companies">
        <CompanyList companies={analysis.companies} />
      </MemoSection>
    </div>
  );
}

export default function PortfolioView({
  result,
  brand,
}: {
  result: PortfolioAnalysisResult;
  brand: Brand;
}) {
  const comparison = result.comparison;
  const analysis = result.analysis;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="print-full mb-8">
        {brand.personalized && (
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Prepared for {brand.fundName}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
          {comparison ? `${comparison.firms[0]} vs ${comparison.firms[1]}` : analysis?.firm}
        </h1>
        <p className="mt-2 max-w-3xl text-ink-soft">
          Portfolio concentration, founder archetypes, and AI-generated investment themes.
        </p>
      </div>

      {comparison ? (
        <div className="print-full space-y-5">
          <MemoSection id="comparison" index={1} title="Fund Comparison">
            <Field label="Summary">{comparison.summary}</Field>
            <div className="grid gap-4 md:grid-cols-2">
              {comparison.differences.map((item) => (
                <div key={item.firm} className="rounded-lg border border-line bg-canvas p-4">
                  <h3 className="font-semibold text-ink">{item.firm}</h3>
                  <div className="mt-3">
                    <Bullets items={item.points} />
                  </div>
                </div>
              ))}
            </div>
            <Field label="Shared themes">
              <Bullets items={comparison.sharedThemes} />
            </Field>
          </MemoSection>

          {comparison.analyses.map((item, index) => (
            <div key={item.firm} className="space-y-5">
              <SingleAnalysis analysis={item} />
              {index === 0 && <div className="h-px bg-line" />}
            </div>
          ))}
        </div>
      ) : analysis ? (
        <SingleAnalysis analysis={analysis} />
      ) : null}
    </main>
  );
}
