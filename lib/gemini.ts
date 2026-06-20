import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, Memo, ScrapedSite } from "./types";
import { chatSystemInstruction, memoPrompt } from "./prompts";

const MODEL = "gemini-2.5-flash";

export class GeminiError extends Error {}

let client: GoogleGenAI | null = null;

/** Lazily construct the SDK client so a missing key surfaces a clean error. */
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError(
      "GEMINI_API_KEY is not set. Add it to .env.local (or your Vercel project)."
    );
  }
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

const stringArray = { type: Type.ARRAY, items: { type: Type.STRING } } as const;

// Response schema mirrors the Memo type. Forcing structured JSON makes the
// parse total — no brittle regex over free-form model text.
const MEMO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    companySnapshot: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        oneLiner: { type: Type.STRING },
        industry: { type: Type.STRING },
        businessModel: { type: Type.STRING },
      },
      required: ["name", "oneLiner", "industry", "businessModel"],
    },
    problem: {
      type: Type.OBJECT,
      properties: { statement: { type: Type.STRING }, importance: { type: Type.STRING } },
      required: ["statement", "importance"],
    },
    product: {
      type: Type.OBJECT,
      properties: {
        core: { type: Type.STRING },
        keyFeatures: stringArray,
        differentiation: { type: Type.STRING },
      },
      required: ["core", "keyFeatures", "differentiation"],
    },
    market: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        trends: stringArray,
        adoptionDrivers: stringArray,
      },
      required: ["category", "trends", "adoptionDrivers"],
    },
    competition: {
      type: Type.OBJECT,
      properties: { competitors: stringArray, advantages: stringArray, weaknesses: stringArray },
      required: ["competitors", "advantages", "weaknesses"],
    },
    team: {
      type: Type.OBJECT,
      properties: {
        hiringActivity: { type: Type.STRING },
        growthIndicators: stringArray,
        strengths: stringArray,
      },
      required: ["hiringActivity", "growthIndicators", "strengths"],
    },
    bullCase: stringArray,
    bearCase: {
      type: Type.OBJECT,
      properties: {
        risks: stringArray,
        competitiveThreats: stringArray,
        executionRisks: stringArray,
      },
      required: ["risks", "competitiveThreats", "executionRisks"],
    },
    investmentThesis: { type: Type.STRING },
    recommendation: {
      type: Type.STRING,
      enum: ["Strong Buy", "Worth Further Research", "Pass"],
    },
    confidenceScore: { type: Type.NUMBER },
  },
  required: [
    "companySnapshot",
    "problem",
    "product",
    "market",
    "competition",
    "team",
    "bullCase",
    "bearCase",
    "investmentThesis",
    "recommendation",
    "confidenceScore",
  ],
} as const;

/** Run the scraped site through Gemini and return a validated memo. */
export async function generateMemo(site: ScrapedSite): Promise<Memo> {
  const ai = getClient();
  let raw: string | undefined;
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: memoPrompt(site),
      config: {
        responseMimeType: "application/json",
        responseSchema: MEMO_SCHEMA,
        temperature: 0.4,
      },
    });
    raw = res.text;
  } catch (e) {
    throw new GeminiError(`Gemini request failed: ${(e as Error).message}`);
  }

  if (!raw) throw new GeminiError("Gemini returned an empty response.");

  let memo: Memo;
  try {
    memo = JSON.parse(raw) as Memo;
  } catch {
    throw new GeminiError("Gemini returned malformed JSON.");
  }

  // Defensive clamp — the model occasionally returns out-of-range scores.
  memo.confidenceScore = Math.max(0, Math.min(100, Math.round(memo.confidenceScore)));
  return memo;
}

/** Answer a follow-up question grounded in the memo + scraped content. */
export async function chatWithMemo(
  memo: Memo,
  site: ScrapedSite,
  history: ChatMessage[],
  question: string
): Promise<string> {
  const ai = getClient();
  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [
        ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: "user" as const, parts: [{ text: question }] },
      ],
      config: {
        systemInstruction: chatSystemInstruction(memo, site),
        temperature: 0.5,
      },
    });
    const text = res.text;
    if (!text) throw new GeminiError("Gemini returned an empty response.");
    return text;
  } catch (e) {
    if (e instanceof GeminiError) throw e;
    throw new GeminiError(`Gemini request failed: ${(e as Error).message}`);
  }
}
