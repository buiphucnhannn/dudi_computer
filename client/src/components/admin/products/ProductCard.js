"use client";

import Link from "next/link";
import { Star, Pencil, Trash2, Plus, Minus, ExternalLink } from "lucide-react";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onStockChange,
}) {
  const isOutOfStock = product.stock === 0;

  const formattedPrice =
    typeof product.price === "number"
      ? `${product.price.toLocaleString("vi-VN")}₫`
      : product.price;

  const formattedOldPrice =
    typeof product.oldPrice === "number"
      ? `${product.oldPrice.toLocaleString("vi-VN")}₫`
      : product.oldPrice;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all hover:shadow-md hover:border-slate-300 ${
        isOutOfStock ? "opacity-80 saturate-75" : ""
      }`}
    >
      {/* Badges */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
        {product.badge && (
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
              product.badge === "HẾT HÀNG"
                ? "bg-slate-200 text-slate-700"
                : product.badge === "MỚI"
                ? "bg-slate-900 text-white"
                : "bg-red-600 text-white shadow-2xs"
            }`}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 p-4 border-b border-slate-100">
        <img
          src={product.image || product.thumbnail}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Quick View Button */}
        {product.slug && (
          <Link
            href={`/product-detail?slug=${product.slug}`}
            target="_blank"
            className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow-xs backdrop-blur-xs opacity-0 group-hover:opacity-100 transition hover:bg-slate-900 hover:text-white"
            title="Xem trên trang bán hàng"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & SKU */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <span className="truncate text-[10px] font-black uppercase tracking-wider text-slate-400">
            {product.brand || "DUDI"} • {product.sku}
          </span>

          {product.rating && (
            <div className="flex shrink-0 items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="h-3 w-3 fill-amber-400" />
              <span className="text-[10px] font-bold text-amber-800">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="mb-3 line-clamp-2 text-xs font-bold leading-snug text-slate-900 transition-colors group-hover:text-red-600">
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* Price */}
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-red-600">
              {formattedPrice}
            </span>

            {formattedOldPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formattedOldPrice}
              </span>
            )}
          </div>

          {/* Bottom Stock & Actions */}
          <div className="flex items-center justify-between border-t border-slate-150 pt-3">
            <div className="flex items-center gap-1.5">
              <StockBadge stock={product.stock} />

              {/* Quick stock +/- */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => onStockChange?.(product.id, Math.max(0, product.stock - 1))}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-white transition cursor-pointer"
                  title="Giảm 1 tồn kho"
                >
                  <Minus className="h-2.5 w-2.5" />
                </button>
                <button
                  onClick={() => onStockChange?.(product.id, product.stock + 1)}
                  className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-white transition cursor-pointer"
                  title="Tăng 1 tồn kho"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                title="Chỉnh sửa sản phẩm"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onDelete(product)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
                title="Xóa sản phẩm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-[10.5px] font-bold text-red-600 border border-red-100">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Tồn: 0
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-[10.5px] font-bold text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Tồn: {stock}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Tồn: {stock}
    </div>
  );
}