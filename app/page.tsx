import type { Metadata } from "next";
import { resolveBrand } from "@/lib/fund";
import Scanner from "./scanner";

interface PageProps {
  searchParams: { fund?: string | string[] };
}

// Personalize the browser tab title from ?fund= (server-rendered).
export function generateMetadata({ searchParams }: PageProps): Metadata {
  const brand = resolveBrand(searchParams.fund);
  return {
    title: brand.personalized
      ? `${brand.title} — surface startups early`
      : "PreRaise.ai — surface startups before they go mainstream",
  };
}

export default function Page({ searchParams }: PageProps) {
  const brand = resolveBrand(searchParams.fund);
  return <Scanner brand={brand} />;
}
