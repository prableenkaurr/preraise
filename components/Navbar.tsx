import { Brand } from "@/lib/fund";

interface NavbarProps {
  brand: Brand;
  /** Shown when a memo is on screen — lets the user start over. */
  onReset?: () => void;
  showReset?: boolean;
}

export default function Navbar({ brand, onReset, showReset }: NavbarProps) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-left"
          aria-label="Home"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ink text-[11px] font-bold text-canvas">
            10
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            {brand.title}
          </span>
        </button>
        {showReset && (
          <button
            onClick={onReset}
            className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
          >
            New memo
          </button>
        )}
      </div>
    </header>
  );
}
