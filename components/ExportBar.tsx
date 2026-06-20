"use client";

import { useState } from "react";
import { MemoResult } from "@/lib/types";
import { memoToMarkdown } from "@/lib/memo-markdown";

interface ExportBarProps {
  result: MemoResult;
  brandTitle: string;
}

export default function ExportBar({ result, brandTitle }: ExportBarProps) {
  const [copied, setCopied] = useState(false);
  const company = result.memo.companySnapshot.name;

  function exportPdf() {
    // The PDF "title" (used as the default filename/header) is the document
    // title, so we brand it per-fund, print, then restore.
    const prev = document.title;
    document.title = `${company} — Investment Memo · ${brandTitle}`;
    const restore = () => {
      document.title = prev;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  function exportMarkdown() {
    const md = memoToMarkdown(result, brandTitle);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${slug(company)}-memo.md`;
    a.click();
    URL.revokeObjectURL(href);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(memoToMarkdown(result, brandTitle));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const btn =
    "rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink";

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button onClick={exportPdf} className={btn}>
        Export PDF
      </button>
      <button onClick={exportMarkdown} className={btn}>
        Export Markdown
      </button>
      <button onClick={copy} className={btn}>
        {copied ? "Copied!" : "Copy memo"}
      </button>
    </div>
  );
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "startup";
}
