"use client";

import { useRef, useState } from "react";
import { ChatMessage, Memo, ScrapedSite } from "@/lib/types";

const SUGGESTIONS = [
  "What are the biggest risks?",
  "Who are the strongest competitors?",
  "How defensible is this business?",
  "Would this fit an early-stage VC investment thesis?",
];

interface ChatPanelProps {
  memo: Memo;
  site: ScrapedSite;
}

export default function ChatPanel({ memo, site }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setError(null);
    setInput("");

    const history = messages;
    const next = [...history, { role: "user" as const, content: q }];
    setMessages(next);
    setBusy(true);
    // Defer scroll until the new message is painted.
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo, site, history, question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat failed.");
      setMessages((m) => [...m, { role: "model", content: data.reply }]);
    } catch (e) {
      setError((e as Error).message);
      // Roll back the optimistic user message so they can retry cleanly.
      setMessages(history);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
    }
  }

  return (
    <div className="no-print flex h-full flex-col rounded-2xl border border-line bg-white shadow-sm">
      <div className="border-b border-line px-5 py-3.5">
        <h3 className="text-sm font-semibold text-ink">Ask about {memo.companySnapshot.name}</h3>
        <p className="text-xs text-ink-soft">Grounded in this memo and the scraped site.</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-ink-soft">Try asking:</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="block w-full rounded-lg border border-line px-3 py-2 text-left text-sm text-ink-soft transition hover:border-ink hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`animate-rise max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-ink text-canvas"
                : "mr-auto whitespace-pre-wrap border border-line bg-canvas text-ink"
            }`}
          >
            {m.content}
          </div>
        ))}

        {busy && (
          <div className="mr-auto flex gap-1 rounded-2xl border border-line bg-canvas px-3.5 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up…"
          className="h-10 flex-1 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="h-10 rounded-lg bg-ink px-4 text-sm font-medium text-canvas transition hover:bg-ink/90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
