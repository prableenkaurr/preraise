import { CompanyMetrics, PortfolioAnalysis, PortfolioComparison, PortfolioAnalysisResult } from "./types";

// Stage labels only — no specific dollar amounts or headcount.
type Stage = "Seed" | "Series A–B" | "Series C–D" | "Growth" | "Public" | "Acquired";

type CompanySeed = Omit<CompanyMetrics, never>;

function co(
  companyName: string,
  sector: string,
  foundedYear: number,
  founders: string[],
  founderBackgrounds: string[],
  stage: Stage
): CompanySeed {
  return { companyName, sector, foundedYear, founders, founderBackgrounds, stage };
}

const FUNDS: Record<string, { name: string; companies: CompanySeed[] }> = {
  "645 ventures": {
    name: "645 Ventures",
    companies: [
      co("Hims & Hers", "Consumer Health", 2017, ["Andrew Dudum"], ["Repeat founder", "Technical founder"], "Public"),
      co("Nomad Health", "Healthcare Staffing", 2015, ["Alexi Nazem", "Andrei Zimiles"], ["Technical founder", "Ex-McKinsey"], "Growth"),
      co("Squire", "Vertical SaaS", 2015, ["Songe LaCoste", "Dave Salvant"], ["Repeat founder", "Technical founder"], "Series C–D"),
      co("Goldbelly", "Consumer Marketplace", 2013, ["Joe Ariel"], ["Repeat founder", "Product founder"], "Series A–B"),
      co("Lunchbox", "Restaurant Tech", 2019, ["Nabeel Alamgir", "Andrew Boryk"], ["Technical founder", "Ex-Bareburger"], "Series A–B"),
    ],
  },
  "tribe capital": {
    name: "Tribe Capital",
    companies: [
      co("Carta", "Fintech Infrastructure", 2012, ["Henry Ward", "Manu Kumar"], ["Repeat founder", "Technical founder"], "Growth"),
      co("Slack", "Collaboration Software", 2009, ["Stewart Butterfield", "Cal Henderson"], ["Repeat founder", "Technical founder"], "Acquired"),
      co("Brex", "Fintech", 2017, ["Henrique Dubugras", "Pedro Franceschi"], ["Repeat founder", "Technical founder"], "Growth"),
      co("Affinity", "Relationship Intelligence", 2014, ["Ray Zhou", "Joe Lonsdale"], ["Stanford", "Technical founder"], "Series C–D"),
      co("SpaceX", "Aerospace", 2002, ["Elon Musk"], ["Repeat founder", "Technical founder"], "Growth"),
    ],
  },
  "pear vc": {
    name: "Pear VC",
    companies: [
      co("DoorDash", "Consumer Marketplace", 2013, ["Tony Xu", "Stanley Tang", "Andy Fang", "Evan Moore"], ["Stanford", "Technical founder"], "Public"),
      co("Branch", "Mobile Attribution", 2014, ["Alex Austin", "Dmitri Gaskin", "Mike Molinet"], ["Stanford", "Technical founder"], "Growth"),
      co("Guardant Health", "Healthcare Diagnostics", 2012, ["Helmy Eltoukhy", "AmirAli Talasaz"], ["Stanford", "Technical founder"], "Public"),
      co("Verkada", "Enterprise Security", 2016, ["Filip Kaliszan", "James Ren", "Benjamin Bercovici"], ["Stanford", "Technical founder"], "Series C–D"),
      co("Athelas", "Healthcare AI", 2016, ["Deepika Bodapati", "Tanay Tandon"], ["Stanford", "Technical founder"], "Series C–D"),
    ],
  },
  "unusual ventures": {
    name: "Unusual Ventures",
    companies: [
      co("Harness", "Developer Tools", 2017, ["Jyoti Bansal", "Rajan Singh"], ["Repeat founder", "Ex-AppDynamics"], "Series C–D"),
      co("Starburst", "Data Infrastructure", 2017, ["Justin Borgman", "Matt Fuller", "Kamil Bajda-Pawlikowski"], ["Technical founder", "Academic founder"], "Series C–D"),
      co("Locus Robotics", "Robotics", 2014, ["Bruce Welty", "Mike Johnson"], ["Technical founder", "Repeat founder"], "Growth"),
      co("Mabl", "Developer Tools", 2017, ["Izzy Azeri", "Dan Belcher"], ["Repeat founder", "Ex-HubSpot"], "Series A–B"),
      co("Syndio", "HR Analytics", 2016, ["Zev Eigen", "Maria Colacurcio"], ["Technical founder", "Ex-Oracle"], "Series A–B"),
    ],
  },
  "engineering capital": {
    name: "Engineering Capital",
    companies: [
      co("Sentry", "Developer Tools", 2012, ["David Cramer", "Chris Jennings"], ["Technical founder", "Open-source background"], "Series C–D"),
      co("Replit", "Developer Tools", 2016, ["Amjad Masad", "Faris Masad"], ["Technical founder", "Ex-Facebook"], "Series A–B"),
      co("Persona", "Identity Infrastructure", 2018, ["Rick Song", "Charles Yeh"], ["Technical founder", "Ex-Square"], "Series C–D"),
      co("Cribl", "Data Infrastructure", 2018, ["Clint Sharp", "Ledion Bitincka"], ["Technical founder", "Ex-Splunk"], "Series C–D"),
      co("Incident.io", "Developer Tools", 2021, ["Chris Evans", "Pete Hamilton", "Mikey Clarke"], ["Technical founder", "Ex-Monzo"], "Series A–B"),
    ],
  },
  heavybit: {
    name: "Heavybit",
    companies: [
      co("PagerDuty", "DevOps", 2009, ["Andrew Miklas", "Alex Solomon", "Baskar Puvanathasan"], ["Technical founder", "Ex-Amazon"], "Public"),
      co("Fastly", "Cloud Infrastructure", 2011, ["Artur Bergman"], ["Technical founder", "Repeat founder"], "Public"),
      co("CircleCI", "Developer Tools", 2011, ["Paul Biggar", "Allen Rohner"], ["Technical founder", "Open-source background"], "Acquired"),
      co("Honeycomb", "Developer Observability", 2016, ["Christine Yen", "Charity Majors"], ["Technical founder", "Ex-Parse"], "Series A–B"),
      co("Snyk", "Developer Security", 2015, ["Guy Podjarny", "Assaf Hefetz", "Danny Grander"], ["Repeat founder", "Security background"], "Growth"),
    ],
  },
  "susa ventures": {
    name: "Susa Ventures",
    companies: [
      co("Robinhood", "Fintech", 2013, ["Vlad Tenev", "Baiju Bhatt"], ["Technical founder", "Repeat founder"], "Public"),
      co("Flexport", "Logistics", 2013, ["Ryan Petersen"], ["Repeat founder", "Technical founder"], "Growth"),
      co("Andela", "Future of Work", 2014, ["Jeremy Johnson", "Christina Sass"], ["Repeat founder", "Ex-2U"], "Series C–D"),
      co("Premise", "Data Analytics", 2012, ["Joe Reisinger"], ["Technical founder", "Academic founder"], "Series A–B"),
      co("Lob", "Developer Infrastructure", 2013, ["Harry Zhang", "Leore Avidar"], ["Technical founder", "Y Combinator"], "Series A–B"),
    ],
  },
  "kindred ventures": {
    name: "Kindred Ventures",
    companies: [
      co("Figma", "Design Software", 2012, ["Dylan Field", "Evan Wallace"], ["Technical founder", "Design-centric"], "Acquired"),
      co("Lyft", "Consumer Marketplace", 2012, ["Logan Green", "John Zimmer"], ["Repeat founder", "Product founder"], "Public"),
      co("Weights & Biases", "AI Infrastructure", 2017, ["Lukas Biewald", "Shawn Lewis", "Chris Van Pelt"], ["Technical founder", "Ex-CrowdFlower"], "Series C–D"),
      co("Rigetti Computing", "Quantum Computing", 2013, ["Chad Rigetti"], ["Technical founder", "Academic founder"], "Public"),
      co("Embark Trucks", "Autonomous Vehicles", 2016, ["Alex Rodrigues", "Brandon Moak"], ["Technical founder", "Academic founder"], "Public"),
    ],
  },
  "xyz venture capital": {
    name: "XYZ Venture Capital",
    companies: [
      co("Joby Aviation", "Air Mobility", 2009, ["JoeBen Bevirt"], ["Technical founder", "Repeat founder"], "Public"),
      co("Bird", "Micromobility", 2017, ["Travis VanderZanden"], ["Repeat founder", "Ex-Lyft"], "Public"),
      co("Built Robotics", "Robotics", 2016, ["Noah Ready-Campbell"], ["Technical founder", "Ex-Google"], "Series A–B"),
      co("Alto Pharmacy", "Healthcare", 2015, ["Jamie Karraker", "Mattieu Gamache-Asselin"], ["Technical founder", "Repeat founder"], "Series C–D"),
      co("Branch Insurance", "Insurtech", 2017, ["Steve Lekas", "Joe Emison"], ["Repeat founder", "Technical founder"], "Series A–B"),
    ],
  },
  "costanoa ventures": {
    name: "Costanoa Ventures",
    companies: [
      co("Tealium", "Data Infrastructure", 2008, ["Mike Anderson", "Ali Behnam"], ["Technical founder", "Repeat founder"], "Growth"),
      co("Corvus Insurance", "Insurtech", 2017, ["Phil Edmundson", "Madhu Tadikonda"], ["Technical founder", "Repeat founder"], "Series A–B"),
      co("EvenUp", "Legal AI", 2019, ["Rami Karabibar", "Ray Mieszaniec", "David Haber"], ["Technical founder", "Ex-Google"], "Series C–D"),
      co("Zipline", "Drone Logistics", 2014, ["Keller Rinaudo Cliffton"], ["Technical founder", "Repeat founder"], "Growth"),
      co("Domo", "Business Intelligence", 2010, ["Josh James"], ["Repeat founder", "Ex-Omniture"], "Public"),
    ],
  },
  "wing venture capital": {
    name: "Wing Venture Capital",
    companies: [
      co("Snowflake", "Data Infrastructure", 2012, ["Benoit Dageville", "Thierry Cruanes", "Marcin Zukowski"], ["Technical founder", "Academic founder"], "Public"),
      co("HashiCorp", "Developer Tools", 2012, ["Mitchell Hashimoto", "Armon Dadgar"], ["Technical founder", "Open-source background"], "Acquired"),
      co("Verkada", "Enterprise Security", 2016, ["Filip Kaliszan", "James Ren"], ["Stanford", "Technical founder"], "Series C–D"),
      co("Weights & Biases", "AI Infrastructure", 2017, ["Lukas Biewald", "Shawn Lewis"], ["Technical founder", "Ex-CrowdFlower"], "Series C–D"),
      co("Abnormal Security", "AI Security", 2018, ["Evan Reiser", "Sanjay Jeyakumar"], ["Ex-Twitter", "Technical founder"], "Series C–D"),
    ],
  },
  "amplify partners": {
    name: "Amplify Partners",
    companies: [
      co("CockroachDB", "Data Infrastructure", 2015, ["Spencer Kimball", "Peter Mattis", "Ben Darnell"], ["Technical founder", "Ex-Google"], "Growth"),
      co("dbt Labs", "Data Infrastructure", 2016, ["Tristan Handy", "Drew Banin"], ["Technical founder", "Open-source background"], "Series C–D"),
      co("Retool", "Developer Tools", 2017, ["David Hsu", "Martin Raison"], ["Technical founder", "Stanford"], "Series A–B"),
      co("Temporal", "Developer Infrastructure", 2019, ["Maxim Fateev", "Samar Abbas"], ["Technical founder", "Ex-Uber"], "Series A–B"),
      co("Teleport", "Developer Security", 2015, ["Ev Kontsevoy", "Alexander Klizhentas"], ["Technical founder", "Repeat founder"], "Series A–B"),
    ],
  },
  crv: {
    name: "CRV",
    companies: [
      co("Airtable", "Productivity Software", 2012, ["Howie Liu", "Andrew Ofstad", "Emmett Nicholas"], ["Technical founder", "Design founder"], "Growth"),
      co("Zendesk", "Customer Support", 2007, ["Mikkel Svane", "Morten Primdahl", "Alexander Aghassipour"], ["Technical founder", "Repeat founder"], "Acquired"),
      co("DoorDash", "Consumer Marketplace", 2013, ["Tony Xu", "Stanley Tang", "Andy Fang"], ["Stanford", "Technical founder"], "Public"),
      co("Drift", "Sales Software", 2014, ["David Cancel", "Elias Torres"], ["Repeat founder", "Technical founder"], "Acquired"),
      co("Podium", "Local Business SaaS", 2014, ["Eric Rea", "Dennis Steele"], ["Technical founder", "Repeat founder"], "Series C–D"),
    ],
  },
  "emergence capital": {
    name: "Emergence Capital",
    companies: [
      co("Zoom", "Collaboration Software", 2011, ["Eric Yuan"], ["Repeat founder", "Ex-Cisco"], "Public"),
      co("Veeva Systems", "Vertical SaaS", 2007, ["Peter Gassner", "Matt Wallach"], ["Repeat founder", "Ex-Salesforce"], "Public"),
      co("Box", "Cloud Storage", 2005, ["Aaron Levie", "Dylan Smith"], ["Repeat founder", "Technical founder"], "Public"),
      co("Salesforce", "CRM", 1999, ["Marc Benioff", "Parker Harris"], ["Repeat founder", "Ex-Oracle"], "Public"),
      co("ServiceMax", "Field Service SaaS", 2007, ["Athani Krishna", "Hari Subramanian"], ["Technical founder", "Ex-Siemens"], "Acquired"),
    ],
  },
  "500 global": {
    name: "500 Global",
    companies: [
      co("Canva", "Design Software", 2013, ["Melanie Perkins", "Cliff Obrecht", "Cameron Adams"], ["Repeat founder", "Design founder"], "Growth"),
      co("Credit Karma", "Fintech", 2007, ["Kenneth Lin", "Ryan Graciano", "Nichole Mustard"], ["Technical founder", "Repeat founder"], "Acquired"),
      co("Grab", "Super App", 2012, ["Anthony Tan", "Tan Hooi Ling"], ["Repeat founder", "Harvard MBA"], "Public"),
      co("Talkdesk", "Contact Center AI", 2011, ["Tiago Paiva", "Cristina Fonseca"], ["Technical founder", "Repeat founder"], "Series C–D"),
      co("Twilio", "Developer Infrastructure", 2008, ["Jeff Lawson", "Evan Cooke", "John Wolthuis"], ["Technical founder", "Ex-Amazon"], "Public"),
    ],
  },
  "bonfire ventures": {
    name: "Bonfire Ventures",
    companies: [
      co("FloQast", "Accounting Software", 2013, ["Mike Whitmire", "Cullen Zandstra", "Chris Sluty"], ["Repeat founder", "Accounting background"], "Series C–D"),
      co("ServiceTitan", "Field Service SaaS", 2012, ["Ara Mahdessian", "Vahe Kuzoyan"], ["Technical founder", "Repeat founder"], "Public"),
      co("Common Room", "Community Intelligence", 2020, ["Linda Lian", "Francis Luu", "Tom Kleinpeter", "Pauline Strong"], ["Ex-Microsoft", "Technical founder"], "Series A–B"),
      co("Nowsta", "Workforce Management", 2017, ["Matt Tepper"], ["Technical founder", "Repeat founder"], "Series A–B"),
      co("Gradguard", "Insurtech", 2009, ["John Fees"], ["Repeat founder", "Finance background"], "Series A–B"),
    ],
  },
  "sancus ventures": {
    name: "Sancus Ventures",
    companies: [
      co("Pactum", "Enterprise AI", 2019, ["Martin Rand"], ["Technical founder", "Repeat founder"], "Series A–B"),
      co("Humanly", "HR AI", 2019, ["Prem Kumar", "Noel Lim"], ["Technical founder", "Ex-Google"], "Seed"),
      co("Gable", "Workplace Infrastructure", 2020, ["Liza Mash Levin", "Roee Adler"], ["Repeat founder", "Technical founder"], "Seed"),
      co("Arist", "Learning Platform", 2019, ["Michael Ioffe", "Jake Eaton"], ["Technical founder", "Academic founder"], "Seed"),
    ],
  },
  "sequoia capital": {
    name: "Sequoia Capital",
    companies: [
      co("Stripe", "Fintech", 2010, ["Patrick Collison", "John Collison"], ["Repeat founder", "Technical founder"], "Growth"),
      co("Databricks", "AI Infrastructure", 2013, ["Ali Ghodsi", "Matei Zaharia", "Reynold Xin"], ["Academic founder", "Technical founder"], "Growth"),
      co("Airbnb", "Consumer Marketplace", 2008, ["Brian Chesky", "Joe Gebbia", "Nathan Blecharczyk"], ["Design founder", "Technical founder"], "Public"),
      co("OpenAI", "AI Infrastructure", 2015, ["Sam Altman", "Greg Brockman", "Ilya Sutskever"], ["Repeat founder", "Technical founder"], "Growth"),
      co("DoorDash", "Consumer Marketplace", 2013, ["Tony Xu", "Stanley Tang", "Andy Fang"], ["Stanford", "Technical founder"], "Public"),
    ],
  },
  accel: {
    name: "Accel",
    companies: [
      co("Atlassian", "Developer Tools", 2002, ["Mike Cannon-Brookes", "Scott Farquhar"], ["Technical founder", "Repeat operator"], "Public"),
      co("Snyk", "Developer Security", 2015, ["Guy Podjarny", "Assaf Hefetz", "Danny Grander"], ["Repeat founder", "Security background"], "Growth"),
      co("Miro", "Collaboration Software", 2011, ["Andrey Khusid", "Oleg Shardin"], ["Product founder", "Repeat founder"], "Series C–D"),
      co("UiPath", "Enterprise Automation", 2005, ["Daniel Dines", "Marius Tirca"], ["Technical founder", "Ex-Microsoft"], "Public"),
      co("Webflow", "Developer Tools", 2013, ["Vlad Magdalin", "Bryant Chou", "Sergie Magdalin"], ["Design founder", "Technical founder"], "Series C–D"),
    ],
  },
  greylock: {
    name: "Greylock",
    companies: [
      co("Abnormal Security", "AI Security", 2018, ["Evan Reiser", "Sanjay Jeyakumar"], ["Ex-Twitter", "Technical founder"], "Series C–D"),
      co("Figma", "Design Software", 2012, ["Dylan Field", "Evan Wallace"], ["Technical founder", "Design-centric"], "Acquired"),
      co("Discord", "Consumer Social", 2015, ["Jason Citron", "Stanislav Vishnevskiy"], ["Repeat founder", "Gaming background"], "Growth"),
      co("Coda", "Productivity Software", 2014, ["Shishir Mehrotra", "Alex DeNeui"], ["Ex-Google", "Technical founder"], "Series C–D"),
      co("Rubrik", "Enterprise Infrastructure", 2014, ["Bipul Sinha", "Arvind Jain", "Soham Mazumdar", "Arvind Nithrakashyap"], ["Repeat founder", "Ex-Oracle", "Technical founder"], "Public"),
    ],
  },
};

function normalizeFirm(firm: string): string {
  return firm.trim().toLowerCase().replace(/\s+/g, " ");
}

export class PortfolioDataError extends Error {}

function knownFundNames(): string {
  return Object.values(FUNDS).map((f) => f.name).sort().join(", ");
}

function percentGroups(values: string[]): { sector: string; percent: number }[] {
  const total = values.length || 1;
  const counts = values.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([sector, count]) => ({ sector, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);
}

function founderPatterns(companies: CompanyMetrics[]): { pattern: string; percent: number }[] {
  const total = companies.length || 1;
  const patterns = ["Technical founder", "Repeat founder", "Design founder", "Academic founder", "Open-source background"];
  return patterns
    .map((pattern) => ({
      pattern,
      percent: Math.round(
        (companies.filter((c) => c.founderBackgrounds.some((b) => b.includes(pattern))).length / total) * 100
      ),
    }))
    .filter((p) => p.percent > 0)
    .concat(
      companies.some((c) => c.founderBackgrounds.some((b) => b.startsWith("Ex-")))
        ? [{
            pattern: "Big Tech alumni",
            percent: Math.round(
              (companies.filter((c) => c.founderBackgrounds.some((b) => b.startsWith("Ex-"))).length / total) * 100
            ),
          }]
        : []
    )
    .sort((a, b) => b.percent - a.percent);
}

export function buildPortfolioAnalysis(firm: string): PortfolioAnalysis {
  const seed = FUNDS[normalizeFirm(firm)];
  if (!seed) {
    throw new PortfolioDataError(
      `No portfolio data for "${firm.trim()}". Supported funds: ${knownFundNames()}.`
    );
  }
  const companies: CompanyMetrics[] = seed.companies;
  const topSectors = percentGroups(companies.map((c) => c.sector));

  return {
    firm: seed.name,
    portfolio: companies.map((c) => c.companyName),
    companies,
    sectorAnalysis: topSectors,
    founderAnalysis: founderPatterns(companies),
    topPerformers: companies
      .filter((c) => c.stage === "Public" || c.stage === "Acquired" || c.stage === "Growth")
      .slice(0, 3)
      .map((c) => c.companyName),
    emergingThesis: `${seed.name} shows concentration in ${topSectors
      .slice(0, 2)
      .map((s) => s.sector.toLowerCase())
      .join(" and ")}, with a consistent preference for founders who combine deep technical or product expertise with durable distribution instincts.`,
    insights: [],
    sourceNotes: [],
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
          leftOnly.length ? `Heavier exposure to ${leftOnly.join(", ")}` : "Sector overlap is high with the comparison fund",
          `Breakout companies include ${left.topPerformers.slice(0, 2).join(" and ")}`,
        ],
      },
      {
        firm: right.firm,
        points: [
          rightOnly.length ? `Heavier exposure to ${rightOnly.join(", ")}` : "Sector overlap is high with the comparison fund",
          `Breakout companies include ${right.topPerformers.slice(0, 2).join(" and ")}`,
        ],
      },
    ],
    sharedThemes: sharedThemes.length ? sharedThemes : ["Technical founders", "B2B software", "AI-enabled workflows"],
    summary: `${left.firm} and ${right.firm} share a bias toward scalable software but differ in sector concentration and the maturity profile of their breakout companies.`,
  };
}

export function parsePortfolioRequest(input: string): PortfolioAnalysisResult {
  const parts = input
    .split(/\s+(?:vs\.?|versus)\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 2) {
    const left = buildPortfolioAnalysis(parts[0]);
    const right = buildPortfolioAnalysis(parts[1]);
    return { mode: "compare", generatedAt: new Date().toISOString(), comparison: comparePortfolios(left, right) };
  }

  return { mode: "single", generatedAt: new Date().toISOString(), analysis: buildPortfolioAnalysis(input) };
}
