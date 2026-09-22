"use client";

import React, { useState } from "react";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Package,
  Download,
  Key,
  Menu,
  X,
  RotateCcw
} from "lucide-react";

interface NavbarProps {
  activeTab: "dashboard" | "create" | "catalog";
  onSelectTab: (tab: "dashboard" | "create" | "catalog") => void;
  productCount: number;
  onExportCsv: () => void;
  onOpenConfig: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  productCount,
  onExportCsv,
  onOpenConfig,
  onResetDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: "dashboard" | "create" | "catalog") => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleTabClick("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 text-white flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-violet-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 font-sans">
                Catalog<span className="text-violet-600">AI</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-violet-100 text-violet-800 border border-violet-200/60 uppercase">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
              Intelligent Product Cataloging
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "dashboard"
                ? "bg-violet-50 text-violet-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-violet-600" />
            Dashboard
          </button>

          <button
            onClick={() => handleTabClick("create")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "create"
                ? "bg-violet-50 text-violet-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <PlusCircle className="w-4 h-4 text-violet-600" />
            Create Listing
          </button>

          <button
            onClick={() => handleTabClick("catalog")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "catalog"
                ? "bg-violet-50 text-violet-700 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Package className="w-4 h-4 text-violet-600" />
            Catalog
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
              {productCount}
            </span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={onOpenConfig}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-violet-700 transition-colors shadow-sm"
            title="AI Config & Server Setup"
          >
            <Key className="w-4 h-4" />
          </button>

          <button
            onClick={onExportCsv}
            disabled={productCount === 0}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-violet-600" />
            Export CSV
          </button>

          <button
            onClick={() => handleTabClick("create")}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-violet-500/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Listing
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left ${
              activeTab === "dashboard" ? "bg-violet-50 text-violet-700 font-bold" : "text-slate-700"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-violet-600" />
            Dashboard
          </button>

          <button
            onClick={() => handleTabClick("create")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 text-left ${
              activeTab === "create" ? "bg-violet-50 text-violet-700 font-bold" : "text-slate-700"
            }`}
          >
            <PlusCircle className="w-4 h-4 text-violet-600" />
            Create Product Listing
          </button>

          <button
            onClick={() => handleTabClick("catalog")}
            className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between text-left ${
              activeTab === "catalog" ? "bg-violet-50 text-violet-700 font-bold" : "text-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-violet-600" />
              Product Catalog
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
              {productCount}
            </span>
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onExportCsv();
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-violet-600" />
              Export Catalog CSV
            </button>

            <button
              onClick={() => {
                onOpenConfig();
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4 text-violet-600" />
              AI Setup & Security
            </button>

            <button
              onClick={() => {
                onResetDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 rounded-xl text-amber-800 bg-amber-50 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Reset Demo Products
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
