import {
  CompanyMetrics,
  PortfolioAnalysis,
  PortfolioComparison,
  PortfolioAnalysisResult,
} from "./types";

type PortfolioSeed = Omit<
  CompanyMetrics,
  "githubStars" | "productHuntVotes" | "websiteTraffic" | "aiSummary"
> & {
  githubStars?: number;
  productHuntVotes?: number;
  websiteTraffic?: number;
};

const FUNDS: Record<string, { name: string; companies: PortfolioSeed[] }> = {
  "sequoia capital": {
    name: "Sequoia Capital",
    companies: [
      company("Stripe", "Fintech", 2010, ["Patrick Collison", "John Collison"], ["Repeat founder", "Technical founder"], "$8.7B+", "Series I", 7000, 8, 0, 2100, 105000000),
      company("DoorDash", "Consumer Marketplace", 2013, ["Tony Xu", "Stanley Tang", "Andy Fang", "Evan Moore"], ["Stanford", "Technical founder"], "$2.5B+", "Public", 23700, 11, 0, 840, 145000000),
      company("Databricks", "AI Infrastructure", 2013, ["Ali Ghodsi", "Matei Zaharia", "Reynold Xin"], ["Academic founder", "Technical founder"], "$4B+", "Series I", 7000, 24, 43000, 710, 9600000),
      company("Airbnb", "Consumer Marketplace", 2008, ["Brian Chesky", "Joe Gebbia", "Nathan Blecharczyk"], ["Design founder", "Technical founder"], "$6.4B+", "Public", 6800, 5, 0, 1200, 190000000),
      company("OpenAI", "AI Infrastructure", 2015, ["Sam Altman", "Greg Brockman", "Ilya Sutskever"], ["Repeat founder", "Ex-Y Combinator", "Technical founder"], "$11B+", "Late-stage", 4500, 42, 67000, 5200, 190000000),
    ],
  },
  accel: {
    name: "Accel",
    companies: [
      company("Atlassian", "Developer Tools", 2002, ["Mike Cannon-Brookes", "Scott Farquhar"], ["Technical founder", "Repeat operator"], "$210M+", "Public", 12000, 9, 0, 460, 73000000),
      company("Snyk", "Developer Security", 2015, ["Guy Podjarny", "Assaf Hefetz", "Danny Grander"], ["Repeat founder", "Security background"], "$1.2B+", "Series G", 1400, 7, 5400, 1120, 2700000),
      company("Miro", "Collaboration Software", 2011, ["Andrey Khusid", "Oleg Shardin"], ["Product founder", "Repeat founder"], "$476M+", "Series C", 1800, 6, 0, 940, 24000000),
      company("UiPath", "Enterprise Automation", 2005, ["Daniel Dines", "Marius Tirca"], ["Technical founder", "Ex-Microsoft"], "$2B+", "Public", 4000, 3, 0, 380, 8500000),
      company("Webflow", "Developer Tools", 2013, ["Vlad Magdalin", "Bryant Chou", "Sergie Magdalin"], ["Design founder", "Technical founder"], "$334M+", "Series C", 900, 4, 0, 1800, 17000000),
    ],
  },
  greylock: {
    name: "Greylock",
    companies: [
      company("Abnormal AI", "AI Security", 2018, ["Evan Reiser", "Sanjay Jeyakumar"], ["Ex-Twitter", "Technical founder"], "$374M+", "Series D", 900, 36, 0, 240, 460000),
      company("Figma", "Design Software", 2012, ["Dylan Field", "Evan Wallace"], ["Technical founder", "Design-centric"], "$333M+", "Acquired", 1600, 14, 0, 3100, 92000000),
      company("Discord", "Consumer Social", 2015, ["Jason Citron", "Stanislav Vishnevskiy"], ["Repeat founder", "Gaming background"], "$995M+", "Series H", 1200, 9, 0, 2200, 240000000),
      company("Coda", "Productivity Software", 2014, ["Shishir Mehrotra", "Alex DeNeui"], ["Ex-Google", "Technical founder"], "$240M+", "Series D", 450, 3, 0, 760, 3500000),
      company("Rubrik", "Enterprise Infrastructure", 2014, ["Bipul Sinha", "Arvind Jain", "Soham Mazumdar", "Arvind Nithrakashyap"], ["Repeat founder", "Ex-Oracle", "Technical founder"], "$553M+", "Public", 3300, 12, 0, 120, 1800000),
    ],
  },
  lightspeed: {
    name: "Lightspeed",
    companies: [
      company("Snap", "Consumer Social", 2011, ["Evan Spiegel", "Bobby Murphy", "Reggie Brown"], ["Product founder", "Technical founder"], "$4.9B+", "Public", 5200, 2, 0, 1700, 93000000),
      company("MuleSoft", "Enterprise Infrastructure", 2006, ["Ross Mason"], ["Technical founder", "Open-source background"], "$259M+", "Acquired", 1400, 5, 0, 220, 1400000),
      company("Affirm", "Fintech", 2012, ["Max Levchin"], ["Repeat founder", "Ex-PayPal"], "$1.5B+", "Public", 2200, 1, 0, 640, 18000000),
      company("Faire", "B2B Marketplace", 2017, ["Max Rhodes", "Marcelo Cortes", "Daniele Perito", "Jeffrey Kolovson"], ["Ex-Square", "Technical founder"], "$1.7B+", "Series G", 1300, 8, 0, 920, 11500000),
      company("Stability AI", "AI Infrastructure", 2019, ["Emad Mostaque"], ["AI background", "Technical founder"], "$173M+", "Seed/Series A", 300, -4, 79000, 4300, 10500000),
    ],
  },
  "first round": {
    name: "First Round",
    companies: [
      company("Uber", "Consumer Marketplace", 2009, ["Garrett Camp", "Travis Kalanick"], ["Repeat founder", "Technical founder"], "$25B+", "Public", 30000, 4, 0, 2100, 135000000),
      company("Notion", "Productivity Software", 2013, ["Ivan Zhao", "Simon Last"], ["Design founder", "Technical founder"], "$343M+", "Series C", 750, 18, 0, 4200, 125000000),
      company("Roblox", "Consumer Platform", 2004, ["David Baszucki", "Erik Cassel"], ["Repeat founder", "Technical founder"], "$855M+", "Public", 2800, 10, 0, 1500, 81000000),
      company("Square", "Fintech", 2009, ["Jack Dorsey", "Jim McKelvey"], ["Repeat founder", "Design founder"], "$590M+", "Public", 12000, 6, 0, 1200, 36000000),
      company("Warby Parker", "Consumer Commerce", 2010, ["Neil Blumenthal", "Dave Gilboa", "Andy Hunt", "Jeff Raider"], ["Wharton", "Repeat founder"], "$535M+", "Public", 2200, 1, 0, 850, 9600000),
    ],
  },
  "tribe capital": {
    name: "Tribe Capital",
    companies: [
      company("Carta", "Fintech Infrastructure", 2012, ["Henry Ward", "Manu Kumar"], ["Repeat founder", "Technical founder"], "$1.1B+", "Series G", 2200, 2, 0, 520, 5000000),
      company("Docker", "Developer Tools", 2013, ["Solomon Hykes"], ["Technical founder", "Open-source background"], "$435M+", "Series C", 700, 7, 69000, 860, 13500000),
      company("Bolt", "Fintech", 2014, ["Ryan Breslow", "Eric Feldman"], ["Repeat founder", "Technical founder"], "$1.3B+", "Series E", 800, -2, 0, 720, 3200000),
      company("Relativity Space", "Deep Tech", 2015, ["Tim Ellis", "Jordan Noone"], ["Technical founder", "Ex-Blue Origin"], "$1.3B+", "Series F", 1200, 10, 0, 240, 650000),
      company("Kraken", "Crypto Infrastructure", 2011, ["Jesse Powell"], ["Repeat founder", "Crypto-native"], "$130M+", "Late-stage", 2300, 1, 0, 330, 12500000),
    ],
  },
};

function company(
  companyName: string,
  sector: string,
  foundedYear: number,
  founders: string[],
  founderBackgrounds: string[],
  totalFunding: string,
  latestRound: string,
  employeeCount: number,
  hiringVelocity: number,
  githubStars?: number,
  productHuntVotes?: number,
  websiteTraffic?: number
): PortfolioSeed {
  return {
    companyName,
    sector,
    foundedYear,
    founders,
    founderBackgrounds,
    totalFunding,
    latestRound,
    employeeCount,
    hiringVelocity,
    githubStars,
    productHuntVotes,
    websiteTraffic,
  };
}

function normalizeFirm(firm: string): string {
  return firm.trim().toLowerCase().replace(/\s+/g, " ");
}

export class PortfolioDataError extends Error {}

function knownFundNames(): string {
  return Object.values(FUNDS)
    .map((fund) => fund.name)
    .sort()
    .join(", ");
}

function dollarsToNumber(value: string): number {
  const match = value.match(/\$([\d.]+)\s*([BMK]?)/i);
  if (!match) return 0;
  const n = Number(match[1]);
  const scale = match[2]?.toUpperCase();
  if (scale === "B") return n * 1_000_000_000;
  if (scale === "M") return n * 1_000_000;
  if (scale === "K") return n * 1_000;
  return n;
}

function humanMoney(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  return `$${Math.round(value / 1_000_000)}M`;
}

function percentGroups(values: string[]): { sector: string; percent: number }[] {
  const total = values.length || 1;
  const counts = values.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([sector, count]) => ({ sector, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);
}

function founderPatterns(companies: CompanyMetrics[]): { pattern: string; percent: number }[] {
  const backgrounds = companies.flatMap((c) => c.founderBackgrounds);
  const totalCompanies = companies.length || 1;
  const patterns = ["Technical founder", "Repeat founder", "Ex-Google", "Ex-Meta", "Design founder"];
  return patterns
    .map((pattern) => ({
      pattern,
      percent: Math.round(
        (companies.filter((c) => c.founderBackgrounds.some((b) => b.includes(pattern))).length /
          totalCompanies) *
          100
      ),
    }))
    .filter((p) => p.percent > 0)
    .concat(
      backgrounds.some((b) => b.includes("Ex-"))
        ? [
            {
              pattern: "Big Tech alumni",
              percent: Math.round(
                (companies.filter((c) => c.founderBackgrounds.some((b) => b.includes("Ex-")))
                  .length /
                  totalCompanies) *
                  100
              ),
            },
          ]
        : []
    )
    .sort((a, b) => b.percent - a.percent);
}

function addSummary(company: PortfolioSeed): CompanyMetrics {
  const signal = company.githubStars
    ? `${company.githubStars.toLocaleString()} GitHub stars`
    : company.productHuntVotes
      ? `${company.productHuntVotes.toLocaleString()} Product Hunt votes`
      : "visible market adoption";
  return {
    ...company,
    aiSummary: `${company.companyName} is a ${company.sector.toLowerCase()} company with ${company.latestRound.toLowerCase()} financing, ${company.employeeCount.toLocaleString()} employees, and ${signal}.`,
  };
}

export function buildPortfolioAnalysis(firm: string): PortfolioAnalysis {
  const seed = FUNDS[normalizeFirm(firm)];
  if (!seed) {
    throw new PortfolioDataError(
      `I don't have real portfolio data for "${firm.trim()}" yet. Try one of: ${knownFundNames()}.`
    );
  }
  const companies = seed.companies.map(addSummary);
  const fundingValues = companies.map((c) => dollarsToNumber(c.totalFunding)).filter(Boolean);
  const sortedByFunding = [...companies].sort(
    (a, b) => dollarsToNumber(b.totalFunding) - dollarsToNumber(a.totalFunding)
  );
  const sortedByHiring = [...companies].sort((a, b) => b.hiringVelocity - a.hiringVelocity);
  const sortedByAdoption = [...companies].sort(
    (a, b) =>
      (b.githubStars ?? 0) +
      (b.productHuntVotes ?? 0) +
      Math.round((b.websiteTraffic ?? 0) / 1000) -
      ((a.githubStars ?? 0) + (a.productHuntVotes ?? 0) + Math.round((a.websiteTraffic ?? 0) / 1000))
  );

  return {
    firm: seed.name,
    portfolio: companies.map((c) => c.companyName),
    companies,
    sectorAnalysis: percentGroups(companies.map((c) => c.sector)),
    founderAnalysis: founderPatterns(companies),
    fundingAnalysis: {
      averageEntryStage: companies.some((c) => c.latestRound.includes("Seed")) ? "Seed" : "Series A",
      averageFirstCheck: companies.some((c) => c.latestRound === "Public") ? "$3M-$8M" : "$1M-$4M",
      medianFundingRaised: humanMoney(
        fundingValues.sort((a, b) => a - b)[Math.floor(fundingValues.length / 2)] ?? 0
      ),
    },
    successRankings: {
      fundingRaised: sortedByFunding.slice(0, 5).map((c) => c.companyName),
      employeeGrowth: sortedByHiring.slice(0, 5).map((c) => c.companyName),
      productAdoption: sortedByAdoption.slice(0, 5).map((c) => c.companyName),
    },
    topPerformers: sortedByFunding.slice(0, 3).map((c) => c.companyName),
    emergingThesis: `${seed.name} appears concentrated around ${percentGroups(companies.map((c) => c.sector))
      .slice(0, 2)
      .map((s) => s.sector.toLowerCase())
      .join(" and ")}, with a bias toward founders who can turn technical or product insight into durable distribution.`,
    insights: [],
    sourceNotes: [
      "Portfolio set uses built-in public examples for supported firms until a live portfolio API is configured.",
      "Funding, employee, traffic, GitHub, and Product Hunt values are public-signal estimates for product analysis, not investment-grade diligence.",
      "Connect Crunchbase, Clearbit, Product Hunt, GitHub, and LinkedIn-compatible data providers to replace estimates with live metrics.",
    ],
  };
}

export function comparePortfolios(left: PortfolioAnalysis, right: PortfolioAnalysis): PortfolioComparison {
  const leftSectors = new Set(left.sectorAnalysis.slice(0, 3).map((s) => s.sector));
  const rightSectors = new Set(right.sectorAnalysis.slice(0, 3).map((s) => s.sector));
  const sharedThemes = [...leftSectors].filter((s) => rightSectors.has(s));
  const leftOnly = [...leftSectors].filter((s) => !rightSectors.has(s));
  const rightOnly = [...rightSectors].filter((s) => !leftSectors.has(s));

  return {
    firms: [left.firm, right.firm],
    analyses: [left, right],
    differences: [
      {
        firm: left.firm,
        points: [
          leftOnly.length ? `More exposed to ${leftOnly.join(", ")}` : "Sector exposure overlaps heavily with the comparison fund",
          `Top performer set led by ${left.topPerformers.slice(0, 2).join(" and ")}`,
        ],
      },
      {
        firm: right.firm,
        points: [
          rightOnly.length ? `More exposed to ${rightOnly.join(", ")}` : "Sector exposure overlaps heavily with the comparison fund",
          `Top performer set led by ${right.topPerformers.slice(0, 2).join(" and ")}`,
        ],
      },
    ],
    sharedThemes: sharedThemes.length ? sharedThemes : ["Technical founders", "B2B software", "AI-enabled workflows"],
    summary: `${left.firm} and ${right.firm} share a bias toward scalable software, but differ in sector concentration and the maturity profile of their standout companies.`,
  };
}

export function parsePortfolioRequest(input: string): PortfolioAnalysisResult {
  const parts = input
    .split(/\s+(?:vs\.?|versus)\s+/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 2) {
    const left = buildPortfolioAnalysis(parts[0]);
    const right = buildPortfolioAnalysis(parts[1]);
    return {
      mode: "compare",
      generatedAt: new Date().toISOString(),
      comparison: comparePortfolios(left, right),
    };
  }

  return {
    mode: "single",
    generatedAt: new Date().toISOString(),
    analysis: buildPortfolioAnalysis(input),
  };
}
