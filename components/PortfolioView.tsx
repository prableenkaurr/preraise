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

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-canvas px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function CompanyTable({ companies }: { companies: CompanyMetrics[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="min-w-[860px] divide-y divide-line text-left text-sm">
        <thead className="bg-canvas text-xs uppercase tracking-wide text-ink/70">
          <tr>
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Sector</th>
            <th className="px-4 py-3 font-semibold">Founded</th>
            <th className="px-4 py-3 font-semibold">Funding</th>
            <th className="px-4 py-3 font-semibold">Employees</th>
            <th className="px-4 py-3 font-semibold">Signals</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white text-ink-soft">
          {companies.map((company) => (
            <tr key={company.companyName}>
              <td className="px-4 py-3 font-medium text-ink">{company.companyName}</td>
              <td className="px-4 py-3">{company.sector}</td>
              <td className="px-4 py-3">{company.foundedYear}</td>
              <td className="px-4 py-3">
                {company.totalFunding}
                <span className="block text-xs text-ink-soft/75">{company.latestRound}</span>
              </td>
              <td className="px-4 py-3">
                {company.employeeCount.toLocaleString()}
                <span className="block text-xs text-ink-soft/75">
                  {company.hiringVelocity > 0 ? "+" : ""}
                  {company.hiringVelocity}% hiring velocity
                </span>
              </td>
              <td className="px-4 py-3">
                {company.githubStars ? `${company.githubStars.toLocaleString()} GitHub stars` : null}
                {company.productHuntVotes ? (
                  <span className="block">{company.productHuntVotes.toLocaleString()} PH votes</span>
                ) : null}
                {company.websiteTraffic ? (
                  <span className="block">
                    {(company.websiteTraffic / 1_000_000).toFixed(1)}M visits
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SingleAnalysis({ analysis }: { analysis: PortfolioAnalysis }) {
  return (
    <div className="print-full min-w-0 space-y-5">
      <MemoSection id="portfolio-summary" index={1} title="Portfolio Summary">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Companies sampled" value={analysis.portfolio.length} />
          <Metric label="Median funding" value={analysis.fundingAnalysis.medianFundingRaised} />
          <Metric label="Entry stage" value={analysis.fundingAnalysis.averageEntryStage} />
        </div>
        <Field label="Emerging thesis">{analysis.emergingThesis}</Field>
        <Field label="Top performers">
          <Bullets items={analysis.topPerformers} />
        </Field>
      </MemoSection>

      <MemoSection id="portfolio-patterns" index={2} title="Pattern Detection">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Sector analysis">
            <div className="space-y-3">
              {analysis.sectorAnalysis.map((item) => (
                <Bar key={item.sector} label={item.sector} value={item.percent} />
              ))}
            </div>
          </Field>
          <Field label="Founder analysis">
            <div className="space-y-3">
              {analysis.founderAnalysis.map((item) => (
                <Bar key={item.pattern} label={item.pattern} value={item.percent} />
              ))}
            </div>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Avg. first check" value={analysis.fundingAnalysis.averageFirstCheck} />
          <Metric label="Funding leader" value={analysis.successRankings.fundingRaised[0]} />
          <Metric label="Adoption leader" value={analysis.successRankings.productAdoption[0]} />
        </div>
      </MemoSection>

      <MemoSection id="portfolio-insights" index={3} title="LLM Insights">
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

      <MemoSection id="portfolio-companies" index={4} title="Company Signals">
        <CompanyTable companies={analysis.companies} />
      </MemoSection>

      <MemoSection id="portfolio-sources" index={5} title="Source Notes">
        <Bullets items={analysis.sourceNotes} />
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
          Portfolio concentration, founder archetypes, public adoption signals, and AI-generated
          investment themes.
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
