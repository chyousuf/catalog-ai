"use client";

import React, { useRef, useState } from "react";
import { X, Download, Sparkles, Image as ImageIcon, Tag } from "lucide-react";
import { Product } from "@/types/product";
import { toPng, toJpeg } from "html-to-image";

interface CardDownloadModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (msg: string, type: "success" | "error" | "info") => void;
}

export const CardDownloadModal: React.FC<CardDownloadModalProps> = ({
  product,
  isOpen,
  onClose,
  onNotify,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"square" | "story">("square");

  if (!isOpen || !product) return null;

  const handleDownload = async (format: "png" | "jpeg") => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      let dataUrl: string;
      const options = {
        quality: 0.95,
        pixelRatio: 2, // 2x high-resolution retina export
        cacheBust: true,
      };

      if (format === "png") {
        dataUrl = await toPng(cardRef.current, options);
      } else {
        dataUrl = await toJpeg(cardRef.current, options);
      }

      const link = document.createElement("a");
      const filename = `${(product.title || product.name).toLowerCase().replace(/[^a-z0-9]/g, "-")}-card.${format}`;
      link.download = filename;
      link.href = dataUrl;
      link.click();

      onNotify?.(`Product card downloaded successfully as ${format.toUpperCase()}!`, "success");
    } catch (err) {
      console.error("Failed to export card image", err);
      onNotify?.("Failed to generate image download. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const verifiedSpecs = Object.entries(product.specifications || {}).filter(
    ([, v]) => v && v.trim() && v !== "Not Specified / N/A"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Export Social & Marketing Card</h2>
              <p className="text-xs text-slate-500">Download high-res ready-to-share product graphics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="px-6 py-3 bg-violet-50/60 border-b border-violet-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Layout Format:</span>
            <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 shadow-sm">
              <button
                onClick={() => setAspectRatio("square")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  aspectRatio === "square"
                    ? "bg-violet-600 text-white font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Square (1:1 Feed)
              </button>
              <button
                onClick={() => setAspectRatio("story")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  aspectRatio === "story"
                    ? "bg-violet-600 text-white font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Portrait (4:5 Post)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload("png")}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-medium flex items-center gap-1.5 shadow-sm transition-all text-xs"
            >
              <Download className={`w-3.5 h-3.5 ${downloading ? "animate-bounce" : ""}`} />
              Download PNG
            </button>
            <button
              onClick={() => handleDownload("jpeg")}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-medium flex items-center gap-1.5 shadow-sm transition-all text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              JPEG
            </button>
          </div>
        </div>

        {/* Card Preview Container */}
        <div className="p-6 overflow-y-auto bg-slate-100/70 flex justify-center items-center">
          <div
            ref={cardRef}
            className={`bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex flex-col justify-between transition-all duration-200 ${
              aspectRatio === "square" ? "w-[440px] min-h-[440px]" : "w-[400px] min-h-[500px]"
            }`}
          >
            {/* Top Badge & Store Brand */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 font-mono">
                  {product.specifications?.brand || "CatalogAI Boutique"}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 font-semibold text-xs flex items-center gap-1">
                <Tag className="w-3 h-3 text-violet-600" />
                {product.category || "Curated Find"}
              </span>
            </div>

            {/* Product Image Frame */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-4 group shadow-sm flex items-center justify-center">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.title || product.name}
                  className="w-full h-56 object-cover object-center"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-52 flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                  <span className="text-xs">No image provided</span>
                </div>
              )}

              {/* Price Pill Overlay */}
              <div className="absolute top-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-sm shadow-md border border-white/20">
                {product.currency} {Number(product.price).toFixed(2)}
              </div>
            </div>

            {/* Title & Short Description */}
            <div className="space-y-2 mb-4">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                {product.title || product.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Verified Specifications Chips */}
            {verifiedSpecs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {verifiedSpecs.slice(0, 3).map(([key, val]) => (
                  <div
                    key={key}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-[11px] text-slate-700 flex items-center gap-1"
                  >
                    <span className="font-medium capitalize text-slate-500">{key}:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Card Footer Watermark */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1 text-violet-700 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Listing • Ready to Order</span>
              </div>
              <span className="font-mono text-slate-400">#CATALOGAI</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Rendered at 2x high resolution for Instagram, Shopify & Pinterest</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
