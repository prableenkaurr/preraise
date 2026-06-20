export const LOADING_STEPS = [
  "Scraping website",
  "Extracting company information",
  "Analyzing market",
  "Generating investment memo",
  "Finalizing report",
] as const;

interface LoadingStepsProps {
  /** Index of the step currently in progress. */
  current: number;
  domain?: string;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function LoadingSteps({ current, domain }: LoadingStepsProps) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-sm font-medium text-ink-soft">
        Reading {domain ?? "the website"}&hellip;
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
        Building your investment memo
      </h2>

      <ol className="mt-8 space-y-3">
        {LOADING_STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                active
                  ? "border-ink/20 bg-white shadow-sm"
                  : "border-line bg-white/50"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  done
                    ? "bg-ink text-canvas"
                    : active
                    ? "bg-ink/10 text-ink"
                    : "bg-line text-ink-soft/60"
                }`}
              >
                {done ? <Check /> : active ? <Spinner /> : i + 1}
              </span>
              <span
                className={`text-sm ${
                  done ? "text-ink-soft line-through decoration-line" : active ? "font-medium text-ink" : "text-ink-soft/60"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Skeleton preview of the memo being assembled. */}
      <div className="mt-10 space-y-4" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-line bg-white p-5">
            <div className="skeleton-fill animate-shimmer h-4 w-1/3 rounded" />
            <div className="mt-4 space-y-2">
              <div className="skeleton-fill animate-shimmer h-3 w-full rounded" />
              <div className="skeleton-fill animate-shimmer h-3 w-11/12 rounded" />
              <div className="skeleton-fill animate-shimmer h-3 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
