"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, Check, Plus, CheckCircle2, HelpCircle } from "lucide-react";
import { MissingSpecItem, ProductSpecifications } from "@/types/product";

interface SpecificationCheckerProps {
  specifications: ProductSpecifications;
  missingSpecs: MissingSpecItem[];
  onUpdateSpecifications: (updatedSpecs: ProductSpecifications, remainingMissing: MissingSpecItem[]) => void;
}

export const SpecificationChecker: React.FC<SpecificationCheckerProps> = ({
  specifications,
  missingSpecs,
  onUpdateSpecifications,
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(true);

  const handleInputChange = (key: string, val: string) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleConfirm = (key: string) => {
    const val = (inputs[key] || "").trim();
    if (!val) return;

    const updatedSpecs = {
      ...specifications,
      [key]: val,
    };
    const remainingMissing = missingSpecs.filter((m) => m.key !== key);
    onUpdateSpecifications(updatedSpecs, remainingMissing);

    // clear input
    setInputs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSkip = (key: string) => {
    const updatedSpecs = {
      ...specifications,
      [key]: "Not Specified / N/A",
    };
    const remainingMissing = missingSpecs.filter((m) => m.key !== key);
    onUpdateSpecifications(updatedSpecs, remainingMissing);
  };

  const verifiedKeys = Object.entries(specifications).filter(
    ([, val]) => val && val.trim() && val !== "Not Specified / N/A"
  );

  return (
    <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/40 to-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                Specification Guardrail & Accuracy Review
              </h3>
              {missingSpecs.length === 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Fully Confirmed
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {missingSpecs.length} Missing Detail{missingSpecs.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              CatalogAI strictly does not invent materials, dimensions, certifications, or brands to protect your customer trust.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-violet-600 hover:text-violet-700 px-2 py-1 rounded-md hover:bg-violet-50 transition-colors"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {expanded && (
        <div className="space-y-4 pt-1">
          {/* Missing Specifications prompts */}
          {missingSpecs.length > 0 && (
            <div className="space-y-3 bg-white p-4 rounded-xl border border-amber-200/70 shadow-sm">
              <div className="flex items-center gap-2 text-amber-800 font-medium text-xs sm:text-sm">
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Please confirm or provide the missing product specifications:</span>
              </div>

              <div className="space-y-3">
                {missingSpecs.map((item) => (
                  <div
                    key={item.key}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-semibold text-slate-800">{item.label}</span>
                      <span className="text-[11px] text-slate-500">{item.question}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={inputs[item.key] || ""}
                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                        placeholder={`Enter ${item.label.toLowerCase()} (e.g. 100% Linen, 12x8x4 in)`}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleConfirm(item.key);
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirm(item.key)}
                          disabled={!inputs[item.key]?.trim()}
                          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSkip(item.key)}
                          className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                        >
                          Not Applicable
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmed / Verified Specifications list */}
          {verifiedKeys.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Product Specifications</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {verifiedKeys.map(([k, val]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs shadow-2xl-sm"
                  >
                    <span className="capitalize font-medium text-slate-500">{k}:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]" title={val}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
