import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PreRaise.ai — surface startups before they go mainstream",
  description:
    "Enter an investment thesis or sector and PreRaise.ai discovers startups gaining early traction, ranked by signal strength across Hacker News, ProductHunt, and Google Trends.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-ink antialiased">{children}</body>
    </html>
  );
}
