import { ReactNode } from "react";

interface MemoSectionProps {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}

/** A single numbered memo section card; `id` is the scroll/nav anchor. */
export default function MemoSection({ id, index, title, children }: MemoSectionProps) {
  return (
    <section
      id={id}
      // scroll-mt offsets the sticky navbar when jumping via the sidebar.
      className="memo-section scroll-mt-20 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink/5 text-xs font-semibold text-ink-soft">
          {index}
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

/** Labeled sub-block within a section. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">{label}</p>
      <div className="mt-1 text-ink-soft">{children}</div>
    </div>
  );
}

/** Bulleted list with a subtle marker. */
export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
