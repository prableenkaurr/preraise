export default function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score));
  const tone =
    pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          Confidence
        </span>
        <span className="text-sm font-semibold text-ink">{pct}/100</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-700 ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
