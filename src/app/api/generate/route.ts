import { NextRequest, NextResponse } from "next/server";
import { generateGeminiCatalogCopy, generateOfflineCatalogCopy } from "@/lib/aiEngine";
import { AIGenerationRequest } from "@/types/product";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, currency = "USD", knownDetails = "", confirmedSpecs } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const payload: AIGenerationRequest = {
      name: name.trim(),
      price: Number(price) || 0,
      currency: currency.trim() || "USD",
      knownDetails: (knownDetails || "").trim(),
      confirmedSpecs: confirmedSpecs || {},
    };

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const geminiResult = await generateGeminiCatalogCopy(payload, apiKey.trim());
        return NextResponse.json(geminiResult);
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to built-in generator:", geminiError);
        const fallbackResult = generateOfflineCatalogCopy(payload);
        return NextResponse.json({
          ...fallbackResult,
          warning: "Generated via CatalogAI built-in engine (Gemini call failed or quota reached)",
        });
      }
    }

    // No API key configured: use high-fidelity offline catalog generator
    const offlineResult = generateOfflineCatalogCopy(payload);
    return NextResponse.json(offlineResult);
  } catch (err: unknown) {
    console.error("API error in /api/generate:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
