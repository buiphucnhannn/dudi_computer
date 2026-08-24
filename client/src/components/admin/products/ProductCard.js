"use client";

import { Star, Pencil, Trash2 } from "lucide-react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const isOutOfStock = product.stock === 0;

  // Format price if number
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
        isOutOfStock ? "opacity-75 saturate-50" : ""
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute right-3 top-3 z-10">
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
        </div>
      )}

      {/* Image */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* SKU + Rating */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <span className="truncate text-[10px] font-black uppercase tracking-wider text-slate-400">
            {product.sku}
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

          {/* Bottom */}
          <div className="flex items-center justify-between border-t border-slate-150 pt-3">
            <StockBadge stock={product.stock} />

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
                title="Chỉnh sửa"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onDelete(product)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-red-600 hover:text-white cursor-pointer"
                title="Xóa"
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
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      Tồn: {stock}
    </div>
  );
}