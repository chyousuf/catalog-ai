import { AIGenerationRequest, AIGenerationResponse, MissingSpecItem, ProductSpecifications } from "@/types/product";

// Specification keywords to check in user input
const SPEC_PATTERNS = {
  material: [
    "wood", "walnut", "oak", "pine", "bamboo", "metal", "steel", "aluminum", "brass", "copper",
    "leather", "cotton", "linen", "silk", "wool", "canvas", "ceramic", "porcelain", "stoneware",
    "glass", "clay", "wax", "soy", "plastic", "silicone", "acrylic", "resin", "gold", "silver"
  ],
  dimensions: [
    "inch", "inches", "cm", "mm", "meter", "oz", "ml", "liter", "grams", "kg", "lbs",
    "width", "height", "depth", "diameter", "size", "small", "medium", "large", "xl", "dimension"
  ],
  certifications: [
    "certified", "certification", "fsc", "oeko-tex", "gots", "organic", "cruelty-free", "vegan",
    "ce", "ul", "fda", "fair trade", "b-corp", "lead-free", "bpa-free", "recycled"
  ],
  brand: [
    "brand", "by ", "crafted by", "studio", "label", "maker", "made by", "company", "co."
  ]
};

export function detectProvidedAndMissingSpecs(
  name: string,
  knownDetails: string,
  confirmedSpecs?: ProductSpecifications
): { specs: ProductSpecifications; missing: MissingSpecItem[] } {
  const combinedText = `${name} ${knownDetails}`.toLowerCase();
  const specs: ProductSpecifications = { ...(confirmedSpecs || {}) };
  const missing: MissingSpecItem[] = [];

  // 1. Material
  if (!specs.material) {
    const matched = SPEC_PATTERNS.material.filter(m => combinedText.includes(m));
    if (matched.length > 0) {
      specs.material = `Contains ${matched.join(", ")} (from product details)`;
    } else {
      missing.push({
        key: "material",
        label: "Product Material",
        question: "What material or fabric is this product crafted from? (e.g. 100% Linen, Ceramic Stoneware, Walnut Wood)",
      });
    }
  }

  // 2. Dimensions / Sizing
  if (!specs.dimensions) {
    const hasDimensions = SPEC_PATTERNS.dimensions.some(d => combinedText.includes(d));
    if (hasDimensions) {
      // Find possible snippet
      specs.dimensions = "Measurements noted in product details";
    } else {
      missing.push({
        key: "dimensions",
        label: "Dimensions / Sizing",
        question: "What are the exact dimensions, weight, or size measurements? (e.g. 12\" x 8\" x 4\" or One Size)",
      });
    }
  }

  // 3. Certifications / Safety
  if (!specs.certifications) {
    const matched = SPEC_PATTERNS.certifications.filter(c => combinedText.includes(c));
    if (matched.length > 0) {
      specs.certifications = matched.map(c => c.toUpperCase()).join(", ");
    } else {
      missing.push({
        key: "certifications",
        label: "Certifications / Eco Standards",
        question: "Does this product have any safety, organic, or eco-certifications? (e.g. FSC, OEKO-TEX, Food-Safe, or None)",
      });
    }
  }

  // 4. Brand / Maker
  if (!specs.brand) {
    if (specs.brand) {
      // already set
    } else {
      missing.push({
        key: "brand",
        label: "Brand or Maker Name",
        question: "What is your store, brand, or studio name for this listing? (e.g. Studio Craft, or leave as Independent Maker)",
      });
    }
  }

  return { specs, missing };
}

function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("mug") || lower.includes("coffee") || lower.includes("tea") || lower.includes("plate") || lower.includes("kitchen") || lower.includes("fork") || lower.includes("knife") || lower.includes("pan") || lower.includes("cup")) {
    return "Kitchen & Dining";
  }
  if (lower.includes("desk") || lower.includes("stand") || lower.includes("laptop") || lower.includes("pen") || lower.includes("office") || lower.includes("notebook") || lower.includes("workspace")) {
    return "Workspace & Office";
  }
  if (lower.includes("shirt") || lower.includes("dress") || lower.includes("hoodie") || lower.includes("jacket") || lower.includes("pants") || lower.includes("apparel") || lower.includes("linen") || lower.includes("silk")) {
    return "Apparel & Fashion";
  }
  if (lower.includes("bag") || lower.includes("tote") || lower.includes("wallet") || lower.includes("backpack") || lower.includes("purse") || lower.includes("leather") || lower.includes("belt")) {
    return "Bags & Accessories";
  }
  if (lower.includes("candle") || lower.includes("scent") || lower.includes("decor") || lower.includes("cushion") || lower.includes("rug") || lower.includes("vase") || lower.includes("lamp") || lower.includes("home")) {
    return "Home & Living";
  }
  if (lower.includes("serum") || lower.includes("cream") || lower.includes("soap") || lower.includes("lotion") || lower.includes("skincare") || lower.includes("balm")) {
    return "Beauty & Wellness";
  }
  return "General Goods & Lifestyle";
}

export function generateOfflineCatalogCopy(req: AIGenerationRequest): AIGenerationResponse {
  const { name, price, currency, knownDetails, confirmedSpecs } = req;
  const { specs, missing } = detectProvidedAndMissingSpecs(name, knownDetails, confirmedSpecs);

  const cleanName = name.trim();
  const category = inferCategory(`${name} ${knownDetails}`);

  // Build clean title without hallucinated specs
  const title = `Artisanal ${cleanName} - Premium Everyday Quality`;

  // Short description focusing only on known details
  const detailsSnippet = knownDetails.trim() 
    ? `Featuring ${knownDetails.toLowerCase().replace(/\.$/, "")}.`
    : "Carefully designed for effortless daily use and lasting quality.";
  
  const shortDescription = `Discover the ${cleanName}. ${detailsSnippet} Designed with attention to detail for the modern home and lifestyle.`;

  // Bullet points built strictly from known details
  const detailBullets = knownDetails
    .split(/[,;\n•]+/)
    .map(s => s.trim())
    .filter(s => s.length > 2)
    .slice(0, 4)
    .map(bullet => `• ${bullet.charAt(0).toUpperCase() + bullet.slice(1)}`)
    .join("\n");

  const fallbackBullets = "• Thoughtfully engineered for durability and daily comfort\n• Designed with minimal, timeless aesthetics to suit any setting\n• Fast shipping with eco-friendly protective packaging";

  const detailedDescription = `Experience quality and thoughtful design with the ${cleanName}.\n\nEvery piece is curated to deliver both functional reliability and a refined aesthetic. Whether you are treating yourself or selecting a timeless gift, this listing brings everyday convenience without compromising on style.\n\nKey Highlights:\n${detailBullets || fallbackBullets}\n\nNote on specifications: Full confirmed materials and dimensions can be reviewed in the product specification summary above.`;

  // Tags
  const baseWords = cleanName.split(/\s+/).map(w => w.replace(/[^\w]/g, "")).filter(w => w.length > 2);
  const detailWords = knownDetails.split(/[\s,]+/).map(w => w.replace(/[^\w]/g, "")).filter(w => w.length > 3).slice(0, 4);
  const tags = Array.from(new Set([
    ...baseWords,
    category.split("&")[0].trim(),
    ...detailWords,
    "Handmade",
    "SmallBusiness",
    "ShopSmall"
  ])).slice(0, 8);

  // SEO Meta description (150-155 characters max)
  const seoMetaDescription = `Shop the ${cleanName} for ${currency} ${price}. ${knownDetails ? knownDetails.slice(0, 75).trim() + "..." : "Quality crafted with everyday durability."} Fast dispatch & secure checkout.`.slice(0, 158);

  // Instagram Caption
  const instagramCaption = `Introducing the ${cleanName} ✨🛍️\n\n${shortDescription}\n\nPrice: ${currency} ${price}\nAvailable now in limited quantities for our online community!\n\n👇 Tap the link in bio to shop now & elevate your everyday collection.\n\n${tags.map(t => `#${t.replace(/\s+/g, "")}`).join(" ")} #SmallBusinessLove #CuratedFinds`;

  return {
    title,
    shortDescription,
    detailedDescription,
    category,
    tags,
    seoMetaDescription,
    instagramCaption,
    specifications: specs,
    missingSpecs: missing,
    source: "offline_engine",
  };
}

export async function generateGeminiCatalogCopy(req: AIGenerationRequest, apiKey: string): Promise<AIGenerationResponse> {
  const { name, price, currency, knownDetails, confirmedSpecs } = req;

  const prompt = `
You are the expert catalog copywriter for "CatalogAI", an AI platform built for small online businesses.
Your task is to write high-converting, polished e-commerce product copy based STRICTLY on the user's provided input.

USER INPUT:
Product Name: "${name}"
Price: ${price} ${currency}
Known Details Provided by User: "${knownDetails}"
Already Confirmed Specs: ${JSON.stringify(confirmedSpecs || {})}

CRITICAL ANTI-HALLUCINATION GUARDRAILS:
1. DO NOT invent, assume, or fabricate product specifications that were not explicitly provided in the input above.
2. In particular, DO NOT invent:
   - Material (e.g., do not say "100% genuine Italian leather" or "solid oak" unless the user explicitly stated it).
   - Dimensions or sizing (do not make up length, width, weight, or capacity).
   - Certifications (do not invent "CE certified", "GOTS Organic", "FDA approved", or "FSC").
   - Brand name (do not invent a brand name unless given).
3. If any of these 4 specifications (material, dimensions, certifications, brand) are missing from the user's input and not confirmed, you MUST list them in the "missingSpecs" array with a clear question asking the user to confirm them.
4. If a specification WAS provided or confirmed, include it accurately in the "specifications" object.

Return ONLY a valid JSON object with the following structure (no markdown fences, no explanatory text):
{
  "title": "A compelling, high-converting product title (50-80 chars) based solely on verified details",
  "shortDescription": "1-2 punchy, engaging sentences summarizing the product for listing cards",
  "detailedDescription": "A well-structured marketing description with a narrative paragraph followed by bullet points for key highlights",
  "category": "Suggested store category (e.g. Kitchen & Dining, Apparel & Fashion, Home & Living, Workspace & Office, etc.)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
  "seoMetaDescription": "Concise SEO snippet under 155 characters with call to action and keywords",
  "instagramCaption": "Engaging social post with relevant emojis, hooks, price callout, call-to-action (link in bio), and 5-8 relevant hashtags",
  "specifications": {
    "material": "verified material or undefined",
    "dimensions": "verified dimensions or undefined",
    "certifications": "verified certifications or undefined",
    "brand": "verified brand or undefined"
  },
  "missingSpecs": [
    {
      "key": "material | dimensions | certifications | brand",
      "label": "Human readable name",
      "question": "Specific question asking user to confirm or provide this missing specification"
    }
  ]
}
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("No text returned by Gemini");
  }

  // Parse JSON
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    title: parsed.title || `${name} - Handcrafted Quality`,
    shortDescription: parsed.shortDescription || "",
    detailedDescription: parsed.detailedDescription || "",
    category: parsed.category || "General Goods",
    tags: Array.isArray(parsed.tags) ? parsed.tags : ["Product", "SmallBusiness"],
    seoMetaDescription: parsed.seoMetaDescription || "",
    instagramCaption: parsed.instagramCaption || "",
    specifications: parsed.specifications || {},
    missingSpecs: Array.isArray(parsed.missingSpecs) ? parsed.missingSpecs : [],
    source: "gemini",
  };
}
