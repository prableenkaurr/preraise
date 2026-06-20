import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "10-Minute Memo — VC investment memos from any startup URL",
  description:
    "Paste a startup website and get a professional, VC-style investment memo in under 60 seconds — problem, product, market, competition, bull & bear case, and a recommendation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
