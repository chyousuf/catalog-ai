"use client";

import React from "react";
import {
  Sparkles,
  Package,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Download,
  Plus,
  Layers,
  RotateCcw
} from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface DashboardProps {
  products: Product[];
  onNavigateTab: (tab: "dashboard" | "create" | "catalog") => void;
  onEditProduct: (product: Product) => void;
  onDownloadCard: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onLoadDemoData: () => void;
  onOpenConfig: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  onNavigateTab,
  onEditProduct,
  onDownloadCard,
  onDeleteProduct,
  onLoadDemoData,
  onOpenConfig,
}) => {
  // Compute metrics
  const totalProducts = products.length;
  const demoCount = products.filter((p) => p.isDemo).length;
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const recentProducts = products.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-violet-800 to-purple-950 text-white p-8 sm:p-10 shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-violet-200">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>CatalogAI for Small Online Businesses</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Turn Raw Photos Into High-Converting Product Listings.
          </h1>

          <p className="text-sm sm:text-base text-violet-100/80 leading-relaxed">
            Generate compelling titles, structured descriptions, SEO meta tags, and Instagram captions in seconds.
            Built with strict anti-hallucination guardrails that protect your brand.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab("create")}
              className="px-5 py-3 rounded-xl bg-white text-violet-950 font-bold text-xs sm:text-sm hover:bg-violet-50 transition-all shadow-lg flex items-center gap-2 transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-violet-700" />
              Create Product Listing
            </button>

            <button
              onClick={() => onNavigateTab("catalog")}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Browse Catalog ({totalProducts})
            </button>
          </div>
        </div>
      </div>

      {/* Demo Data Banner if demo items exist */}
      {demoCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 font-bold">
              !
            </div>
            <div>
              <p className="font-bold text-amber-950">
                Demo Data Active ({demoCount} Sample Products Loaded)
              </p>
              <p className="text-xs text-amber-800">
                Sample products are pre-loaded to demonstrate features. Each demo item is clearly tagged with a &quot;Demo Data&quot; badge.
              </p>
            </div>
          </div>
          <button
            onClick={onLoadDemoData}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 font-semibold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            Reset Demo Data
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Items</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalProducts}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {demoCount} demo, {totalProducts - demoCount} custom
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Estimated Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Value</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Across all inventory listings</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Active Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{categoriesCount}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Categorized automatically</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Guardrail Policy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guardrails</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">100% Safe</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">No hallucinated specs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Feature Highlights & Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div
          onClick={() => onNavigateTab("create")}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-violet-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Create & Generate Listing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload product images and basic details. Our AI generates titles, descriptions, categories, search tags, SEO snippets, and Instagram copy.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 group-hover:text-violet-700">
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigateTab("catalog")}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-violet-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">E-Commerce CSV Export</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instantly export your verified product listings to standard CSV files compatible with Shopify, WooCommerce, and spreadsheets.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 group-hover:text-violet-700">
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={onOpenConfig}
          className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-violet-300 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Server AI Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              API keys stay safe on your server. Learn how to configure your Gemini API key in .env.local or use the built-in offline engine.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-violet-600 group-hover:text-violet-700">
            <span>Configure AI Server</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Catalog Listings</h2>
            <p className="text-xs text-slate-500">Your latest created and edited products</p>
          </div>
          <button
            onClick={() => onNavigateTab("catalog")}
            className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>View All ({totalProducts})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={onEditProduct}
                onDownloadCard={onDownloadCard}
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">No products saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
