"use client";

import { useState } from "react";
import { Brand } from "@/lib/fund";

const EXAMPLES = ["Greylock", "Sequoia Capital", "Accel", "Sequoia Capital vs Accel"];

interface PortfolioInputProps {
  brand: Brand;
  onSubmit: (firm: string) => void;
  error?: string | null;
}

export default function PortfolioInput({ brand, onSubmit, error }: PortfolioInputProps) {
  const [firm, setFirm] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = firm.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-3xl flex-col items-center justify-center px-5 pb-20">
      {brand.personalized && (
        <span className="mb-5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft">
          Prepared for {brand.fundName}
        </span>
      )}

      <h1 className="text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Portfolio intelligence.
        <br />
        <span className="text-ink-soft">Fund patterns in minutes.</span>
      </h1>
      <p className="mt-4 max-w-xl text-center text-base text-ink-soft">
        Enter a VC firm, or compare two funds, to map portfolio concentration,
        founder archetypes, public adoption signals, and emerging investment themes.
      </p>

      <form onSubmit={submit} className="mt-9 w-full max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            autoFocus
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            placeholder="Greylock or Sequoia Capital vs Accel"
            className="h-12 flex-1 rounded-xl border border-line bg-white px-4 text-base text-ink shadow-sm outline-none transition placeholder:text-ink-soft/60 focus:border-ink focus:ring-4 focus:ring-ink/5"
          />
          <button
            type="submit"
            disabled={!firm.trim()}
            className="h-12 rounded-xl bg-ink px-6 text-base font-medium text-canvas transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-ink-soft/70">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onSubmit(ex)}
            className="rounded-full border border-line bg-white px-3 py-1 text-ink-soft transition hover:border-ink hover:text-ink"
          >
            {ex}
          </button>
        ))}
      </div>
    </main>
  );
}
