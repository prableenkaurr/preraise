import type { Metadata } from "next";
import { resolveBrand } from "@/lib/fund";
import MemoApp from "@/components/MemoApp";

interface PageProps {
  searchParams: { fund?: string | string[] };
}

/** Personalize the browser tab title from ?fund=. */
export function generateMetadata({ searchParams }: PageProps): Metadata {
  const brand = resolveBrand(searchParams.fund);
  return {
    title: brand.personalized
      ? `${brand.title} — instant VC investment memos`
      : "10-Minute Memo — VC investment memos from any startup URL",
  };
}

export default function Page({ searchParams }: PageProps) {
  const brand = resolveBrand(searchParams.fund);
  return <MemoApp brand={brand} />;
}
