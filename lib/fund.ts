/**
 * URL personalization. `?fund=PearVC` re-brands the whole app to
 * "10-Minute Memo for Pear VC". Unknown funds are still accepted — we just
 * prettify the camelCase slug into spaced words.
 */

const BASE_BRAND = "10-Minute Memo";

// Nicely-formatted display names for funds we know about. Anything not listed
// falls back to camelCase splitting (e.g. "PearVC" -> "Pear VC").
const KNOWN_FUNDS: Record<string, string> = {
  pearvc: "Pear VC",
  tribecapital: "Tribe Capital",
  sequoia: "Sequoia",
  a16z: "a16z",
  ycombinator: "Y Combinator",
  founders: "Founders Fund",
  foundersfund: "Founders Fund",
  greylock: "Greylock",
  accel: "Accel",
  benchmark: "Benchmark",
};

export interface Brand {
  /** The raw fund slug from the URL, if any. */
  fund?: string;
  /** Display name of the fund, prettified. */
  fundName?: string;
  /** Full brand string, e.g. "PreRaise.ai for Pear VC". */
  title: string;
  /** Whether a fund parameter was present. */
  personalized: boolean;
}

/** Turn a `?fund=` value (string | string[] | undefined) into a Brand. */
export function resolveBrand(fundParam?: string | string[]): Brand {
  const raw = Array.isArray(fundParam) ? fundParam[0] : fundParam;
  const fund = raw?.trim();
  if (!fund) {
    return { title: BASE_BRAND, personalized: false };
  }

  const fundName = prettifyFund(fund);
  return {
    fund,
    fundName,
    title: `${BASE_BRAND} for ${fundName}`,
    personalized: true,
  };
}

function prettifyFund(slug: string): string {
  const known = KNOWN_FUNDS[slug.toLowerCase().replace(/[^a-z0-9]/g, "")];
  if (known) return known;

  // Split camelCase / PascalCase boundaries: "PearVC" -> "Pear VC".
  const spaced = slug
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

  return spaced || slug;
}
