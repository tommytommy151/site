import { GoogleGenAI } from "@google/genai";

export function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY nu este configurată.");
  return new GoogleGenAI({ apiKey });
}

export const VEO_MODEL = "veo-3.1-generate-preview";
