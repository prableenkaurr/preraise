import { Recommendation } from "@/lib/types";

const STYLES: Record<Recommendation, string> = {
  "Strong Buy": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Worth Further Research": "bg-amber-50 text-amber-700 border-amber-200",
  Pass: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function RecommendationBadge({
  recommendation,
  size = "md",
}: {
  recommendation: Recommendation;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${pad} ${STYLES[recommendation]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {recommendation}
    </span>
  );
}
