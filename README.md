# Partner Memo

Generate a venture-style investment memo from any startup website in under a minute.

Partner Memo helps investors, founders, operators, and students quickly understand a company by transforming publicly available information into a structured investment memo.

Live Demo: /https://preraise.vercel.app/

## What It Does

Paste a startup URL:

```text
https://cursor.com
https://perplexity.ai
https://scale.com
```

Partner Memo automatically analyzes the company and generates a structured report covering:

* Company Snapshot
* Problem
* Product
* Market Opportunity
* Competitive Landscape
* Team Signals
* Bull Case
* Bear Case
* Investment Thesis
* Investment Recommendation

## Example Output

For each company, Partner Memo generates:

### Company Snapshot

A concise overview of the company, product, and business model.

### Problem

The customer pain point being addressed and why it matters.

### Product

Key features, differentiation, and value proposition.

### Market Opportunity

Market category, adoption drivers, and growth potential.

### Competitive Landscape

Likely competitors, strengths, weaknesses, and positioning.

### Team Signals

Hiring activity and indicators of company growth.

### Bull Case

Reasons the company could become a category leader.

### Bear Case

Risks, execution challenges, and competitive threats.

### Investment Thesis

A concise VC-style summary of the opportunity.

### Recommendation

* Strong Buy
* Worth Further Research
* Pass

## Features

* Startup website analysis
* Automated investment memo generation
* AI-powered competitive analysis
* Export to PDF
* Export to Markdown
* Copy-to-clipboard support
* Mobile responsive design
* Investor-specific branding support

## Tech Stack

* Next.js 14
* TypeScript
* Tailwind CSS
* Google Gemini
* Cheerio
* Vercel

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

```env
GEMINI_API_KEY=your_api_key
```

## Deployment

```bash
npm run build
vercel --prod
```

## Why Partner Memo?

Early-stage investors spend significant time researching companies, synthesizing information, and drafting investment memos.

Partner Memo accelerates the first-pass diligence process by transforming a startup website into a structured investment analysis in under a minute.
