"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X
} from "lucide-react";
import { Product, AIGenerationResponse } from "@/types/product";

interface ProductFormProps {
  onGenerated: (generatedProduct: Product) => void;
  onNotify?: (msg: string, type: "success" | "error" | "info") => void;
}

const SAMPLE_IMAGES = [
  {
    label: "Ceramic Mug",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    suggestedName: "Artisanal Speckled Ceramic Mug",
    suggestedPrice: 34,
    suggestedDetails: "Hand-thrown stoneware, matte speckled glaze, 12oz capacity, ergonomic looped handle.",
  },
  {
    label: "Desk Riser",
    url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    suggestedName: "Solid Walnut Laptop Stand",
    suggestedPrice: 65,
    suggestedDetails: "American black walnut, 15 degree ergonomic angle, cork anti-scratch base pads, passive cooling cutout.",
  },
  {
    label: "Canvas Tote",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    suggestedName: "Heavyweight Waxed Field Tote",
    suggestedPrice: 85,
    suggestedDetails: "18oz waxed cotton duck, bridle leather straps, brass rivets, 3 interior organizing pockets.",
  },
  {
    label: "Soy Candle",
    url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    suggestedName: "Amber & Cedarwood Soy Candle",
    suggestedPrice: 24,
    suggestedDetails: "100% soy wax, cotton wick, notes of cedarwood and blood orange, 50-hour clean burn in amber jar.",
  }
];

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "INR", "CHF"];

export const ProductForm: React.FC<ProductFormProps> = ({ onGenerated, onNotify }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [knownDetails, setKnownDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingSteps = [
    "Reading product details & context...",
    "Drafting compelling title & SEO meta...",
    "Checking specifications against anti-hallucination guardrails...",
  ];

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit. Please select a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplySample = (sample: typeof SAMPLE_IMAGES[0]) => {
    setImageUrl(sample.url);
    setName(sample.suggestedName);
    setPrice(String(sample.suggestedPrice));
    setKnownDetails(sample.suggestedDetails);
    setErrorMsg(null);
    onNotify?.(`Loaded sample: ${sample.label}`, "info");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter a product name");
      return;
    }

    setIsGenerating(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: parseFloat(price) || 0,
          currency,
          knownDetails: knownDetails.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data: AIGenerationResponse = await response.json();

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: name.trim(),
        price: parseFloat(price) || 0,
        currency,
        knownDetails: knownDetails.trim(),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        title: data.title,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        category: data.category,
        tags: data.tags,
        seoMetaDescription: data.seoMetaDescription,
        instagramCaption: data.instagramCaption,
        specifications: data.specifications || {},
        missingSpecs: data.missingSpecs || [],
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      clearInterval(stepInterval);
      setIsGenerating(false);
      onGenerated(newProduct);
      onNotify?.("AI generated listing content successfully!", "success");
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error("AI Generation Error", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate AI listing. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-purple-50/30 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Create New Product Listing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide your raw product information and let CatalogAI structure compelling copy.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
          Guardrails Active
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleGenerate} className="p-6 space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to Generate</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Section 1: Product Image Upload & Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
            1. Product Image
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="md:col-span-2 border-2 border-dashed border-slate-200 hover:border-violet-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-violet-50/20 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 group-hover:text-violet-600 group-hover:scale-105 transition-all mb-2.5">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Click to upload product photo or drag & drop
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>

            {/* Preview Box */}
            <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50 flex flex-col items-center justify-center relative min-h-[140px]">
              {imageUrl ? (
                <div className="relative w-full h-full min-h-[130px] rounded-xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover object-center rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 py-4">
                  <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                  <span className="text-[11px]">Image preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Preset Samples */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px]">Or try a demo sample:</span>
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleApplySample(sample)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-800 font-medium text-[11px] transition-colors"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Core Details (Name, Price, Currency) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              2. Product Name <span className="text-violet-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Handcrafted Stoneware Coffee Dripper"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-900 transition-colors shadow-sm"
            />
          </div>

          {/* Price & Currency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Price & Currency
            </label>
            <div className="flex rounded-xl shadow-sm">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-2.5 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.00"
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Known Details & Specs */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              3. Known Specifications & Details
            </label>
            <span className="text-[11px] text-slate-400">Raw features, materials, origin</span>
          </div>
          <textarea
            rows={4}
            value={knownDetails}
            onChange={(e) => setKnownDetails(e.target.value)}
            placeholder="e.g., Hand-thrown stoneware ceramic with ribbed interior spiral, 12oz capacity, matte speckled glaze, heat resistant..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-900 leading-relaxed shadow-sm transition-colors"
          />
        </div>

        {/* Anti-Hallucination Policy Callout */}
        <div className="p-3.5 rounded-xl bg-violet-50/80 border border-violet-100 flex items-start gap-3 text-xs text-violet-900">
          <ShieldCheck className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-violet-950">Specification Guardrail Guarantee</p>
            <p className="text-violet-800 text-[11px] leading-relaxed">
              CatalogAI <strong>will not hallucinate</strong> unverified specifications like materials, dimensions, certifications, or brand.
              If any critical specifications are missing, you will be asked to confirm them before saving.
            </p>
          </div>
        </div>

        {/* Submit Button & Progress State */}
        <div className="pt-2">
          {isGenerating ? (
            <div className="p-4 rounded-xl border border-violet-200 bg-violet-50/50 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-violet-600 animate-spin flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm">
                    {loadingSteps[loadingStep]}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Applying marketing tone, SEO formulas, and verifying specifications...
                  </p>
                </div>
              </div>
              <div className="w-full bg-violet-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-violet-600 h-full transition-all duration-700"
                  style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              Generate Product Listing with AI
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
