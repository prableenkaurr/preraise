"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/lib/fund";
import { MemoResult } from "@/lib/types";
import MemoSection, { Bullets, Field } from "./MemoSection";
import RecommendationBadge from "./RecommendationBadge";
import ConfidenceMeter from "./ConfidenceMeter";
import ExportBar from "./ExportBar";
import ChatPanel from "./ChatPanel";

const NAV = [
  { id: "snapshot", label: "Company Snapshot" },
  { id: "problem", label: "Problem" },
  { id: "product", label: "Product" },
  { id: "market", label: "Market Opportunity" },
  { id: "competition", label: "Competitive Landscape" },
  { id: "team", label: "Team Signals" },
  { id: "bull", label: "Bull Case" },
  { id: "bear", label: "Bear Case" },
  { id: "thesis", label: "Investment Thesis" },
  { id: "recommendation", label: "Recommendation" },
] as const;

export default function MemoView({ result, brand }: { result: MemoResult; brand: Brand }) {
  const { memo, site } = result;
  const [active, setActive] = useState<string>(NAV[0].id);

  // Scroll-spy: highlight the nav item for the section nearest the top.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      {/* Header */}
      <div className="print-full mb-8">
        {brand.personalized && (
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Prepared for {brand.fundName}
          </p>
        )}
        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              {memo.companySnapshot.name}
            </h1>
            <p className="mt-1 max-w-2xl text-ink-soft">{memo.companySnapshot.oneLiner}</p>
            <a
              href={site.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-surfaced hover:underline"
            >
              {site.domain} ↗
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <RecommendationBadge recommendation={memo.recommendation} />
            <div className="w-44">
              <ConfidenceMeter score={memo.confidenceScore} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ExportBar result={result} brandTitle={brand.title} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,1fr)_340px]">
        {/* Sidebar nav */}
        <nav className="no-print hidden lg:block">
          <ul className="sticky top-20 space-y-1">
            {NAV.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block rounded-md px-3 py-1.5 text-sm transition ${
                    active === id
                      ? "bg-ink/5 font-medium text-ink"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="mr-1.5 text-ink-soft/50">{i + 1}.</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Memo content */}
        <div className="print-full min-w-0 space-y-5">
          <MemoSection id="snapshot" index={1} title="Company Snapshot">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Company">{memo.companySnapshot.name}</Field>
              <Field label="Industry">{memo.companySnapshot.industry}</Field>
              <Field label="One-liner">{memo.companySnapshot.oneLiner}</Field>
              <Field label="Business model">{memo.companySnapshot.businessModel}</Field>
            </div>
          </MemoSection>

          <MemoSection id="problem" index={2} title="Problem">
            <p>{memo.problem.statement}</p>
            <Field label="Why it matters">{memo.problem.importance}</Field>
          </MemoSection>

          <MemoSection id="product" index={3} title="Product">
            <Field label="Core product">{memo.product.core}</Field>
            <Field label="Key features">
              <Bullets items={memo.product.keyFeatures} />
            </Field>
            <Field label="Differentiation">{memo.product.differentiation}</Field>
          </MemoSection>

          <MemoSection id="market" index={4} title="Market Opportunity">
            <Field label="Category">{memo.market.category}</Field>
            <Field label="Trends">
              <Bullets items={memo.market.trends} />
            </Field>
            <Field label="Adoption drivers">
              <Bullets items={memo.market.adoptionDrivers} />
            </Field>
          </MemoSection>

          <MemoSection id="competition" index={5} title="Competitive Landscape">
            <Field label="Likely competitors">
              <Bullets items={memo.competition.competitors} />
            </Field>
            <Field label="Competitive advantages">
              <Bullets items={memo.competition.advantages} />
            </Field>
            <Field label="Potential weaknesses">
              <Bullets items={memo.competition.weaknesses} />
            </Field>
          </MemoSection>

          <MemoSection id="team" index={6} title="Team Signals">
            <Field label="Hiring activity">{memo.team.hiringActivity}</Field>
            <Field label="Growth indicators">
              <Bullets items={memo.team.growthIndicators} />
            </Field>
            <Field label="Organizational strengths">
              <Bullets items={memo.team.strengths} />
            </Field>
          </MemoSection>

          <MemoSection id="bull" index={7} title="Bull Case">
            <Bullets items={memo.bullCase} />
          </MemoSection>

          <MemoSection id="bear" index={8} title="Bear Case">
            <Field label="Top risks">
              <Bullets items={memo.bearCase.risks} />
            </Field>
            <Field label="Competitive threats">
              <Bullets items={memo.bearCase.competitiveThreats} />
            </Field>
            <Field label="Execution risks">
              <Bullets items={memo.bearCase.executionRisks} />
            </Field>
          </MemoSection>

          <MemoSection id="thesis" index={9} title="Investment Thesis">
            <p className="text-ink">{memo.investmentThesis}</p>
          </MemoSection>

          <MemoSection id="recommendation" index={10} title="Recommendation">
            <div className="flex flex-wrap items-center gap-4">
              <RecommendationBadge recommendation={memo.recommendation} />
              <div className="w-48">
                <ConfidenceMeter score={memo.confidenceScore} />
              </div>
            </div>
          </MemoSection>
        </div>

        {/* Chat panel — sticky beside the memo on xl, stacked below otherwise */}
        <aside className="no-print xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
          <ChatPanel memo={memo} site={site} />
        </aside>
      </div>
    </main>
  );
}
