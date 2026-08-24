"use client";

import { PackageOpen, Pencil, Trash2 } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  viewMode,
  onEdit,
  onDelete,
}) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3.5">
          <PackageOpen className="h-8 w-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy sản phẩm
        </h3>

        <p className="mt-1 max-w-sm text-xs text-slate-500 font-medium">
          Hãy thử thay đổi hoặc xóa các tiêu chí bộ lọc để tìm thấy nhiều sản phẩm hơn.
        </p>
      </div>
    );
  }

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
              className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:shadow-md"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-20 rounded-xl object-contain bg-slate-50 p-2 shrink-0 border border-slate-100"
              />

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {product.sku}
                </div>

                <h3 className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                  {product.name}
                </h3>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-base font-black text-red-600">
                    {formattedPrice}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • Tồn kho: <strong className="text-slate-800">{product.stock}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}