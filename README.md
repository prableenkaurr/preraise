# PreRaise.ai

PreRaise startups **before they go mainstream.** Enter an investment thesis or
sector — `AI fashion tech`, `developer tools`, `consumer AI` — and PreRaise.ai
discovers companies gaining early traction and ranks them by signal strength.

Live: **[surfaced.ai](https://surfaced.ai)**

## How it works

For a given sector the app queries three independent sources, server-side, and
blends them into a single **Surfaced score (0–100)**:

| Signal | Source | What it measures |
| --- | --- | --- |
| **HN** | [Hacker News Algolia API](https://hn.algolia.com/api) | Show HN traction over the last 90 days — recency-weighted points + comment velocity. No key required. |
| **PH** | [ProductHunt API v2 (GraphQL)](https://api.producthunt.com/v2/docs) | Vote velocity on recent launches relative to time since launch. |
| **Trends** | Google Trends | Search-interest *trajectory* (not absolute volume) for discovered startup names. |

The Surfaced score renormalizes over whichever sources fired, adds a
corroboration bonus when a startup shows up on more than one, and nudges by the
sector's overall Google Trends momentum. Each result card shows the overall
score, a per-source signal bar with an up / flat / down arrow, and a **"Why
now"** sentence explaining the single strongest signal.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- All third-party API calls run server-side (in `/app/api/scan`) to keep keys off the client
- Deploys to Vercel as-is

## Local development

```bash
npm install
cp .env.example .env.local   # optional: add PRODUCTHUNT_TOKEN
npm run dev                  # http://localhost:3000
```

### Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `PRODUCTHUNT_TOKEN` | Optional | ProductHunt API v2 developer token. Without it the ProductHunt signal is skipped and ranking proceeds on Hacker News + Google Trends. Create one under your [PH API applications](https://www.producthunt.com/v2/oauth/applications). |

Hacker News needs no key. Google Trends has no official API — the app hits the
public frontend endpoints and degrades gracefully (neutral momentum) if they
rate-limit.

## Deploy

```bash
npm run build
vercel --prod
```

Set `PRODUCTHUNT_TOKEN` in the Vercel project's environment variables to enable
the ProductHunt signal in production.
