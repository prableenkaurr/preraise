"use client";

import { useState } from "react";
import { Brand } from "@/lib/fund";

const EXAMPLES = ["https://cursor.com", "https://perplexity.ai", "https://scale.com"];

interface UrlInputProps {
  brand: Brand;
  onSubmit: (url: string) => void;
  error?: string | null;
}

export default function UrlInput({ brand, onSubmit, error }: UrlInputProps) {
  const [url, setUrl] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center px-5 pb-20">
      {brand.personalized && (
        <span className="mb-5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft">
          Prepared for {brand.fundName}
        </span>
      )}

      <h1 className="text-center text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Any startup. One memo.
        <br />
        <span className="text-ink-soft">In under 60 seconds.</span>
      </h1>
      <p className="mt-4 max-w-xl text-center text-base text-ink-soft">
        Paste a startup&rsquo;s website and {brand.title} reads it like a VC associate —
        returning a full investment memo with a bull case, bear case, and a call.
      </p>

      <form onSubmit={submit} className="mt-9 w-full max-w-xl">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            inputMode="url"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourstartup.com"
            className="h-12 flex-1 rounded-xl border border-line bg-white px-4 text-base text-ink shadow-sm outline-none transition placeholder:text-ink-soft/60 focus:border-ink focus:ring-4 focus:ring-ink/5"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="h-12 rounded-xl bg-ink px-6 text-base font-medium text-canvas transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate Memo
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
            {ex.replace("https://", "")}
          </button>
        ))}
      </div>
    </main>
  );
}
