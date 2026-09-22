"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Tag,
  FileText,
  Bookmark,
  Share2,
  RefreshCw,
  Plus,
  X,
  Globe,
  Sliders
} from "lucide-react";
import { Product, ProductSpecifications, MissingSpecItem } from "@/types/product";
import { SpecificationChecker } from "./SpecificationChecker";

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


interface AIPanelProps {
  productData: Product;
  onChange: (updated: Product) => void;
  onSaveToCatalog: () => void;
  onOpenCardDownload: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  onNotify?: (msg: string, type: "success" | "error" | "info") => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  productData,
  onChange,
  onSaveToCatalog,
  onOpenCardDownload,
  onRegenerate,
  isRegenerating = false,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<"core" | "descriptions" | "seo_social">("core");
  const [newTagInput, setNewTagInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onNotify?.(`Copied ${fieldName} to clipboard!`, "info");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFieldChange = <K extends keyof Product>(field: K, val: Product[K]) => {
    onChange({
      ...productData,
      [field]: val,
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, "");
    if (!trimmed) return;
    if (!productData.tags.includes(trimmed)) {
      handleFieldChange("tags", [...productData.tags, trimmed]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleFieldChange(
      "tags",
      productData.tags.filter((t) => t !== tagToRemove)
    );
  };

  const handleUpdateSpecs = (updatedSpecs: ProductSpecifications, remainingMissing: MissingSpecItem[]) => {
    onChange({
      ...productData,
      specifications: updatedSpecs,
      missingSpecs: remainingMissing,
    });
    onNotify?.("Specifications updated!", "success");
  };

  const copyAllListing = () => {
    const fullSummary = `
PRODUCT TITLE:
${productData.title}

CATEGORY:
${productData.category}

PRICE:
${productData.currency} ${productData.price}

SHORT DESCRIPTION:
${productData.shortDescription}

DETAILED DESCRIPTION:
${productData.detailedDescription}

TAGS:
${productData.tags.join(", ")}

SEO META DESCRIPTION:
${productData.seoMetaDescription}

INSTAGRAM CAPTION:
${productData.instagramCaption}

VERIFIED SPECIFICATIONS:
${Object.entries(productData.specifications || {})
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}
    `.trim();

    copyToClipboard(fullSummary, "Full Listing");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50/50 via-white to-purple-50/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Editable AI Generated Content</h2>
            <p className="text-xs text-slate-500">Fine-tune your generated copy, tags, and marketing channels</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-violet-600 ${isRegenerating ? "animate-spin" : ""}`} />
            Regenerate
          </button>
          <button
            type="button"
            onClick={copyAllListing}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copiedField === "Full Listing" ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copy All
          </button>
        </div>
      </div>

      {/* Specification Guardrails Section */}
      <div className="px-6 pt-5 pb-2">
        <SpecificationChecker
          specifications={productData.specifications}
          missingSpecs={productData.missingSpecs}
          onUpdateSpecifications={handleUpdateSpecs}
        />
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-100 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("core")}
          className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "core"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Title & Tags
        </button>
        <button
          onClick={() => setActiveTab("descriptions")}
          className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "descriptions"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Descriptions & Story
        </button>
        <button
          onClick={() => setActiveTab("seo_social")}
          className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === "seo_social"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          SEO & Social Preview
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto max-h-[600px] space-y-6">
        {/* TAB 1: Core Fields (Title, Category, Tags) */}
        {activeTab === "core" && (
          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span>Compelling Product Title</span>
                  <span className="text-slate-400 font-normal">({productData.title.length} chars)</span>
                </label>
                <button
                  onClick={() => copyToClipboard(productData.title, "Title")}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  {copiedField === "Title" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <input
                type="text"
                value={productData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-medium text-slate-900 transition-colors shadow-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">Suggested Category</label>
                <span className="text-[11px] text-slate-400">E-Commerce Department</span>
              </div>
              <input
                type="text"
                value={productData.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 transition-colors shadow-sm"
              />
            </div>

            {/* Search Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-violet-600" />
                  Search Tags & Keywords ({productData.tags.length})
                </label>
                <span className="text-[11px] text-slate-400">Press Enter or click + to add</span>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[50px] items-center">
                {productData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-800 border border-slate-200/80 shadow-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Add Tag Input */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag..."
                    className="w-24 px-2.5 py-1 text-xs bg-white border border-dashed border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-600 text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="p-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Descriptions */}
        {activeTab === "descriptions" && (
          <div className="space-y-5">
            {/* Short Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">Short Description (Summary)</label>
                <button
                  onClick={() => copyToClipboard(productData.shortDescription, "Short Description")}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  {copiedField === "Short Description" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <textarea
                rows={3}
                value={productData.shortDescription}
                onChange={(e) => handleFieldChange("shortDescription", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 leading-relaxed shadow-sm transition-colors"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800">Detailed Description & Story</label>
                <button
                  onClick={() => copyToClipboard(productData.detailedDescription, "Detailed Description")}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  {copiedField === "Detailed Description" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <textarea
                rows={8}
                value={productData.detailedDescription}
                onChange={(e) => handleFieldChange("detailedDescription", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 leading-relaxed font-mono shadow-sm transition-colors"
              />
            </div>
          </div>
        )}

        {/* TAB 3: SEO & Social */}
        {activeTab === "seo_social" && (
          <div className="space-y-6">
            {/* SEO Meta Description with Google SERP Preview */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-violet-600" />
                  SEO Meta Description
                  <span
                    className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                      productData.seoMetaDescription.length > 160
                        ? "bg-rose-100 text-rose-700 font-bold"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {productData.seoMetaDescription.length} / 160 chars
                  </span>
                </label>
                <button
                  onClick={() => copyToClipboard(productData.seoMetaDescription, "SEO Meta")}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  {copiedField === "SEO Meta" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>

              {/* SERP Preview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1">
                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <span>https://yourshop.com/products/</span>
                  <span className="text-slate-700 font-semibold">{productData.name.toLowerCase().replace(/\s+/g, "-")}</span>
                </div>
                <div className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-1">
                  {productData.title}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {productData.seoMetaDescription || "No meta description provided."}
                </div>
              </div>

              <textarea
                rows={3}
                value={productData.seoMetaDescription}
                onChange={(e) => handleFieldChange("seoMetaDescription", e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 leading-relaxed shadow-sm transition-colors"
                placeholder="Write your Google search snippet..."
              />
            </div>

            {/* Instagram Caption & Feed Preview */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-violet-600" />
                  Instagram Caption & Hashtags
                </label>
                <button
                  onClick={() => copyToClipboard(productData.instagramCaption, "Instagram Caption")}
                  className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 text-[11px]"
                >
                  {copiedField === "Instagram Caption" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  Copy Caption
                </button>
              </div>

              {/* Mock IG Post Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[10px] text-violet-700">
                      C
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">yourstore_official</span>
                  <span className="text-[10px] text-slate-400">• Just now</span>
                </div>
                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto bg-white p-3 rounded-lg border border-slate-200">
                  {productData.instagramCaption}
                </div>
              </div>

              <textarea
                rows={5}
                value={productData.instagramCaption}
                onChange={(e) => handleFieldChange("instagramCaption", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 leading-relaxed shadow-sm transition-colors"
                placeholder="Write your Instagram post caption with hashtags..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenCardDownload}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Share2 className="w-4 h-4 text-violet-600" />
          Download Social Card
        </button>

        <button
          type="button"
          onClick={onSaveToCatalog}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-violet-500/25 transition-all transform active:scale-95"
        >
          <Bookmark className="w-4 h-4" />
          Save to Product Catalog
        </button>
      </div>
    </div>
  );
};
