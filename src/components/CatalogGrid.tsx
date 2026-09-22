"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  PackageOpen,
  Sparkles,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { downloadProductsCsv } from "@/lib/exportCsv";

interface CatalogGridProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  onDownloadCard: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddNew: () => void;
  onLoadDemoData: () => void;
  onNotify?: (msg: string, type: "success" | "error" | "info") => void;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  products,
  onEditProduct,
  onDownloadCard,
  onDeleteProduct,
  onAddNew,
  onLoadDemoData,
  onNotify,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "name_asc">("newest");
  const [filterType, setFilterType] = useState<"all" | "custom" | "demo">("all");

  // Derive unique categories from active products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (p.title || "").toLowerCase().includes(q);
          const matchName = (p.name || "").toLowerCase().includes(q);
          const matchCat = (p.category || "").toLowerCase().includes(q);
          const matchDesc = (p.shortDescription || "").toLowerCase().includes(q);
          const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchName && !matchCat && !matchDesc && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }

        // Demo vs Custom filter
        if (filterType === "demo" && !p.isDemo) return false;
        if (filterType === "custom" && p.isDemo) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "price_asc") {
          return a.price - b.price;
        }
        if (sortBy === "price_desc") {
          return b.price - a.price;
        }
        if (sortBy === "name_asc") {
          return (a.title || a.name).localeCompare(b.title || b.name);
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, filterType, sortBy]);

  const handleExportCsv = () => {
    if (filteredProducts.length === 0) {
      onNotify?.("No products available to export.", "error");
      return;
    }
    const success = downloadProductsCsv(filteredProducts);
    if (success) {
      onNotify?.(`Exported ${filteredProducts.length} product(s) to CSV!`, "success");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setFilterType("all");
    setSortBy("newest");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your AI-crafted listings, export e-commerce data, and download marketing cards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={products.length === 0}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-violet-600" />
            <span>Export CSV ({filteredProducts.length})</span>
          </button>

          <button
            onClick={onAddNew}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-violet-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, tag, or description..."
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 font-medium cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Demo Filter Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-slate-800 font-medium cursor-pointer"
              >
                <option value="all">Show All Items ({products.length})</option>
                <option value="custom">Only My Items ({products.filter((p) => !p.isDemo).length})</option>
                <option value="demo">Demo Data Only ({products.filter((p) => p.isDemo).length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-violet-600" />
            Categories:
          </span>
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-white text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Grid Area */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDownloadCard={onDownloadCard}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        /* Empty State when filters yield zero results */
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn&apos;t find any products matching your search query or selected filters.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Clear Filters & Search
          </button>
        </div>
      ) : (
        /* Empty State when total catalog is empty */
        <div className="p-14 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
            <PackageOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">Your Catalog is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Get started by uploading a product photo and letting CatalogAI generate your title, descriptions, SEO, and social assets.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onAddNew}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-500/25 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create First Product
            </button>
            <button
              onClick={onLoadDemoData}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              Load Demo Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
