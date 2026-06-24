"use client";

import { useRef, useState } from "react";
import { Brand } from "@/lib/fund";
import { MemoResult, PortfolioAnalysisResult } from "@/lib/types";
import Navbar from "./Navbar";
import UrlInput from "./UrlInput";
import LoadingSteps, { LOADING_STEPS } from "./LoadingSteps";
import MemoView from "./MemoView";
import PortfolioInput from "./PortfolioInput";
import PortfolioView from "./PortfolioView";

type View = "idle" | "loading" | "result";
type Tab = "memo" | "portfolio";

const PORTFOLIO_STEPS = [
  "Finding portfolio companies",
  "Gathering public company signals",
  "Detecting portfolio patterns",
  "Generating investment themes",
  "Finalizing analysis",
] as const;

/** Best-effort hostname for the loading screen (the server does the real parse). */
function displayDomain(url: string): string {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function MemoApp({ brand }: { brand: Brand }) {
  const [tab, setTab] = useState<Tab>("portfolio");
  const [view, setView] = useState<View>("idle");
  const [result, setResult] = useState<MemoResult | null>(null);
  const [portfolioResult, setPortfolioResult] = useState<PortfolioAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [domain, setDomain] = useState<string>();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopTimer() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  function selectTab(next: Tab) {
    if (next === tab) return;
    stopTimer();
    setError(null);
    setStep(0);
    setDomain(undefined);
    setTab(next);
    setView(next === "memo" ? (result ? "result" : "idle") : portfolioResult ? "result" : "idle");
  }

  async function generate(url: string) {
    setTab("memo");
    setError(null);
    setResult(null);
    setDomain(displayDomain(url));
    setStep(0);
    setView("loading");

    // Advance the visible steps on a timer, but hold at the second-to-last
    // ("Generating") until the real request returns — then we finalize.
    stopTimer();
    timer.current = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 2));
    }, 1700);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate the memo.");

      stopTimer();
      setStep(LOADING_STEPS.length - 1); // "Finalizing report"
      setResult(data as MemoResult);
      // Brief beat on the final step so the transition doesn't feel abrupt.
      setTimeout(() => setView("result"), 550);
    } catch (e) {
      stopTimer();
      setError((e as Error).message);
      setView("idle");
    }
  }

  async function analyzePortfolio(firm: string) {
    setTab("portfolio");
    setError(null);
    setPortfolioResult(null);
    setDomain(firm);
    setStep(0);
    setView("loading");

    stopTimer();
    timer.current = setInterval(() => {
      setStep((s) => Math.min(s + 1, PORTFOLIO_STEPS.length - 2));
    }, 1500);

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to analyze the portfolio.");

      stopTimer();
      setStep(PORTFOLIO_STEPS.length - 1);
      setPortfolioResult(data as PortfolioAnalysisResult);
      setTimeout(() => setView("result"), 550);
    } catch (e) {
      stopTimer();
      setError((e as Error).message);
      setView("idle");
    }
  }

  function reset() {
    stopTimer();
    setView("idle");
    if (tab === "memo") setResult(null);
    else setPortfolioResult(null);
    setError(null);
  }

  return (
    <>
      <Navbar brand={brand} onReset={reset} showReset={view === "result"} />
      <div className="no-print border-b border-line bg-canvas">
        <div className="mx-auto flex max-w-6xl gap-2 px-5 py-3">
          {[
            ["memo", "Startup Memo"],
            ["portfolio", "Portfolio Analysis"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => selectTab(id as Tab)}
              disabled={view === "loading"}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                tab === id
                  ? "bg-ink text-canvas"
                  : "border border-line bg-white text-ink-soft hover:border-ink hover:text-ink"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {view === "idle" &&
        (tab === "memo" ? (
          <UrlInput brand={brand} onSubmit={generate} error={error} />
        ) : (
          <PortfolioInput brand={brand} onSubmit={analyzePortfolio} error={error} />
        ))}
      {view === "loading" && (
        <LoadingSteps
          current={step}
          domain={domain}
          steps={tab === "memo" ? LOADING_STEPS : PORTFOLIO_STEPS}
          title={tab === "memo" ? "Building your investment memo" : "Building portfolio intelligence"}
          subtitle={
            tab === "memo"
              ? undefined
              : `Analyzing ${domain ?? "the selected fund"}...`
          }
        />
      )}
      {view === "result" &&
        (tab === "memo" && result ? (
          <MemoView result={result} brand={brand} />
        ) : tab === "portfolio" && portfolioResult ? (
          <PortfolioView result={portfolioResult} brand={brand} />
        ) : null)}
    </>
  );
}
