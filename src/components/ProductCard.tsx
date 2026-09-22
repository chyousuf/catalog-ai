"use client";

import React from "react";
import { Image as ImageIcon, Download, Trash2, Edit3, Tag } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDownloadCard: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDownloadCard,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Card Image Container */}
      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.title || product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-10 h-10 stroke-1 mb-1" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Demo Badge */}
        {product.isDemo && (
          <div className="absolute top-3 left-3 bg-amber-500/95 text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md tracking-wide">
            Demo Data
          </div>
        )}

        {/* Price Pill */}
        <div className="absolute top-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-md border border-white/10">
          {product.currency} {Number(product.price).toFixed(2)}
        </div>

        {/* Category Pill Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 text-slate-800 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-sm flex items-center gap-1">
          <Tag className="w-3 h-3 text-violet-600" />
          {product.category}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-violet-700 transition-colors">
            {product.title || product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-medium">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onDownloadCard(product)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Download Social Marketing Card as Image"
          >
            <Download className="w-3.5 h-3.5 text-violet-600" />
            <span>Card Image</span>
          </button>

          <button
            onClick={() => onEdit(product)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-700 transition-colors shadow-sm"
            title="Edit Listing & AI Copy"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (confirm(`Delete listing "${product.name}"?`)) {
                onDelete(product.id);
              }
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shadow-sm"
            title="Delete Listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
