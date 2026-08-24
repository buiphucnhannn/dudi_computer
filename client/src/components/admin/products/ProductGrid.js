"use client";

import { PackageOpen, Pencil, Trash2, Plus, Minus, ExternalLink } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  viewMode,
  isLoading,
  onEdit,
  onDelete,
  onStockChange,
}) {
  // 1. Render Skeleton while fetching fresh API data
  if (isLoading) {
    if (viewMode === "list") {
      return (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs animate-pulse"
            >
              {/* Image skeleton */}
              <div className="h-20 w-20 rounded-xl bg-slate-200 shrink-0" />

              {/* Text lines skeleton */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-12 rounded bg-slate-200" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-36 rounded bg-slate-150" />
                </div>
              </div>

              {/* Stock controls skeleton */}
              <div className="h-8 w-28 rounded-xl bg-slate-150 shrink-0" />

              {/* Action buttons skeleton */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="h-8 w-8 rounded-xl bg-slate-200" />
                <div className="h-8 w-8 rounded-xl bg-slate-200" />
                <div className="h-8 w-8 rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="aspect-square w-full bg-slate-100 p-4 border-b border-slate-100 flex items-center justify-center">
              <div className="h-3/4 w-3/4 rounded-xl bg-slate-200/80" />
            </div>

            {/* Content Placeholder */}
            <div className="flex flex-1 flex-col p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-2.5 w-20 rounded bg-slate-200" />
                <div className="h-3 w-10 rounded bg-slate-200" />
              </div>

              <div className="space-y-1.5">
                <div className="h-3.5 w-full rounded bg-slate-200" />
                <div className="h-3.5 w-4/5 rounded bg-slate-200" />
              </div>

              <div className="mt-auto pt-2">
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="h-5 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-16 rounded bg-slate-150" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-150 pt-3">
                  <div className="h-6 w-20 rounded-md bg-slate-200" />
                  <div className="flex gap-1">
                    <div className="h-7 w-7 rounded-lg bg-slate-200" />
                    <div className="h-7 w-7 rounded-lg bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State (when finished loading but no items match filters)
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3.5">
          <PackageOpen className="h-8 w-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy sản phẩm phù hợp
        </h3>

        <p className="mt-1 max-w-sm text-xs text-slate-500 font-medium">
          Hãy thử xóa bớt tiêu chí lọc hoặc tìm kiếm với từ khóa khác.
        </p>
      </div>
    );
  }

  // 3. Render List View
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const formattedPrice =
            typeof product.price === "number"
              ? `${product.price.toLocaleString("vi-VN")}₫`
              : product.price;

          return (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md hover:border-slate-300"
            >
              <img
                src={product.image || product.thumbnail}
                alt={product.name}
                className="h-20 w-20 rounded-xl object-contain bg-slate-50 p-2 shrink-0 border border-slate-100"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {product.brand || "DUDI"} • {product.sku}
                  </span>
                  {product.badge && (
                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded border border-red-100">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                  {product.name}
                </h3>

                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-base font-black text-red-600">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Danh mục: <strong className="text-slate-800 font-bold">{product.category}</strong>
                  </span>
                </div>
              </div>

              {/* Stock controls */}
              <div className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  Tồn: {product.stock}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onStockChange?.(product.id, Math.max(0, product.stock - 1))}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                    title="Giảm 1"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onStockChange?.(product.id, product.stock + 1)}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                    title="Tăng 1"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {product.slug && (
                  <Link
                    href={`/product-detail?slug=${product.slug}`}
                    target="_blank"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                    title="Xem trên shop"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}

                <button
                  onClick={() => onEdit(product)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                  title="Chỉnh sửa"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onDelete(product)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 4. Render Grid View
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onStockChange={onStockChange}
        />
      ))}
    </div>
  );
}