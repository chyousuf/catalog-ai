"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { ProductForm } from "@/components/ProductForm";
import { AIPanel } from "@/components/AIPanel";
import { CatalogGrid } from "@/components/CatalogGrid";
import { CardDownloadModal } from "@/components/CardDownloadModal";
import { ConfigModal } from "@/components/ConfigModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { Product, AIGenerationResponse } from "@/types/product";
import { DEMO_PRODUCTS } from "@/data/demoProducts";
import { downloadProductsCsv } from "@/lib/exportCsv";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "catalogai_products_v1";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "catalog">("dashboard");
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const [cardModalProduct, setCardModalProduct] = useState<Product | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize data from localStorage or demo products
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setMounted(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage", e);
    }
    // Default to demo products
    setProducts(DEMO_PRODUCTS);
    setMounted(true);
  }, []);

  // Sync to localStorage
  const saveProductsToStorage = (updated: Product[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  };

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Called when ProductForm finishes AI generation
  const handleProductGenerated = (newProduct: Product) => {
    setDraftProduct(newProduct);
  };

  // Called from AIPanel to save listing to catalog
  const handleSaveDraft = () => {
    if (!draftProduct) return;

    const existingIndex = products.findIndex((p) => p.id === draftProduct.id);
    let updatedProducts: Product[];

    if (existingIndex >= 0) {
      updatedProducts = [...products];
      updatedProducts[existingIndex] = {
        ...draftProduct,
        updatedAt: new Date().toISOString(),
      };
    } else {
      updatedProducts = [
        {
          ...draftProduct,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...products,
      ];
    }

    saveProductsToStorage(updatedProducts);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7c3aed", "#a78bfa", "#ddd6fe", "#10b981"],
      });
    } catch {
      // ignore
    }

    addToast(`"${draftProduct.title || draftProduct.name}" saved to catalog!`, "success");
    setDraftProduct(null);
    setActiveTab("catalog");
  };

  // Regenerate content for current draft
  const handleRegenerateDraft = async () => {
    if (!draftProduct) return;
    setIsRegenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draftProduct.name,
          price: draftProduct.price,
          currency: draftProduct.currency,
          knownDetails: draftProduct.knownDetails,
          confirmedSpecs: draftProduct.specifications,
        }),
      });

      if (!response.ok) {
        throw new Error("Regeneration failed");
      }

      const data: AIGenerationResponse = await response.json();

      setDraftProduct({
        ...draftProduct,
        title: data.title,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        category: data.category,
        tags: data.tags,
        seoMetaDescription: data.seoMetaDescription,
        instagramCaption: data.instagramCaption,
        specifications: {
          ...draftProduct.specifications,
          ...(data.specifications || {}),
        },
        missingSpecs: data.missingSpecs || [],
        updatedAt: new Date().toISOString(),
      });

      addToast("Listing copy refreshed by AI!", "success");
    } catch (e) {
      console.error(e);
      addToast("Failed to regenerate listing.", "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsToStorage(updated);
    addToast("Product removed from catalog.", "info");
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setDraftProduct(product);
    setActiveTab("create");
  };

  // Card download
  const handleOpenCardModal = (product: Product) => {
    setCardModalProduct(product);
    setIsCardModalOpen(true);
  };

  // Reset demo data
  const handleResetDemoData = () => {
    saveProductsToStorage(DEMO_PRODUCTS);
    addToast("Loaded 4 sample demo products!", "success");
  };

  // Export full catalog
  const handleExportAllCsv = () => {
    if (products.length === 0) {
      addToast("Your catalog is empty. Add products before exporting.", "error");
      return;
    }
    const ok = downloadProductsCsv(products);
    if (ok) {
      addToast(`Exported all ${products.length} products to CSV!`, "success");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Loading CatalogAI...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "create") {
            setDraftProduct(null);
          }
        }}
        productCount={products.length}
        onExportCsv={handleExportAllCsv}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onResetDemo={handleResetDemoData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <Dashboard
            products={products}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab !== "create") setDraftProduct(null);
            }}
            onEditProduct={handleEditProduct}
            onDownloadCard={handleOpenCardModal}
            onDeleteProduct={handleDeleteProduct}
            onLoadDemoData={handleResetDemoData}
            onOpenConfig={() => setIsConfigModalOpen(true)}
          />
        )}

        {/* TAB 2: CREATE / EDIT PRODUCT */}
        {activeTab === "create" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {draftProduct ? (
              /* Review & Edit AI Panel */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setDraftProduct(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Raw Input Form
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Listing Ready for Review
                  </div>
                </div>

                <AIPanel
                  productData={draftProduct}
                  onChange={(updated) => setDraftProduct(updated)}
                  onSaveToCatalog={handleSaveDraft}
                  onOpenCardDownload={() => handleOpenCardModal(draftProduct)}
                  onRegenerate={handleRegenerateDraft}
                  isRegenerating={isRegenerating}
                  onNotify={addToast}
                />
              </div>
            ) : (
              /* Input Form */
              <ProductForm
                onGenerated={handleProductGenerated}
                onNotify={addToast}
              />
            )}
          </div>
        )}

        {/* TAB 3: CATALOG GRID */}
        {activeTab === "catalog" && (
          <CatalogGrid
            products={products}
            onEditProduct={handleEditProduct}
            onDownloadCard={handleOpenCardModal}
            onDeleteProduct={handleDeleteProduct}
            onAddNew={() => {
              setDraftProduct(null);
              setActiveTab("create");
            }}
            onLoadDemoData={handleResetDemoData}
            onNotify={addToast}
          />
        )}
      </main>

      {/* Social Card Download Modal */}
      <CardDownloadModal
        product={cardModalProduct}
        isOpen={isCardModalOpen}
        onClose={() => {
          setIsCardModalOpen(false);
          setCardModalProduct(null);
        }}
        onNotify={addToast}
      />

      {/* Server Config & API Key Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
