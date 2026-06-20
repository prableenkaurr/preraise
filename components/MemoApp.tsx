"use client";

import { useRef, useState } from "react";
import { Brand } from "@/lib/fund";
import { MemoResult } from "@/lib/types";
import Navbar from "./Navbar";
import UrlInput from "./UrlInput";
import LoadingSteps, { LOADING_STEPS } from "./LoadingSteps";
import MemoView from "./MemoView";

type View = "idle" | "loading" | "result";

/** Best-effort hostname for the loading screen (the server does the real parse). */
function displayDomain(url: string): string {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function MemoApp({ brand }: { brand: Brand }) {
  const [view, setView] = useState<View>("idle");
  const [result, setResult] = useState<MemoResult | null>(null);
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

  async function generate(url: string) {
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

  function reset() {
    stopTimer();
    setView("idle");
    setResult(null);
    setError(null);
  }

  return (
    <>
      <Navbar brand={brand} onReset={reset} showReset={view === "result"} />
      {view === "idle" && <UrlInput brand={brand} onSubmit={generate} error={error} />}
      {view === "loading" && <LoadingSteps current={step} domain={domain} />}
      {view === "result" && result && <MemoView result={result} brand={brand} />}
    </>
  );
}
