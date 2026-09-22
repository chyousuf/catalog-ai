import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 5);

  return NextResponse.json({
    hasGeminiKey: isConfigured,
    keyPrefix: isConfigured ? `${apiKey!.slice(0, 4)}...${apiKey!.slice(-3)}` : null,
    provider: isConfigured ? "Google Gemini (Server-side)" : "CatalogAI Built-in Engine",
    mode: isConfigured ? "cloud_ai" : "local_smart_engine",
  });
}
