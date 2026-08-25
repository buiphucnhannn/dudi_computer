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

  // 3. Render List View as Table
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap text-left">Sản Phẩm</th>
                <th className="py-3.5 px-4 w-48 text-center whitespace-nowrap">Danh Mục</th>
                <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Giá Bán</th>
                <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Tồn Kho</th>
                <th className="py-3.5 px-4 w-36 text-center whitespace-nowrap">Trạng Thái</th>
                <th className="py-3.5 px-4 w-32 text-center whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs animate-smooth-fade">
              {products.map((product, idx) => {
                const formattedPrice =
                  typeof product.price === "number"
                    ? `${product.price.toLocaleString("vi-VN")}₫`
                    : product.price;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || product.thumbnail}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl object-contain bg-slate-50 p-1 shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 max-w-[280px]">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {product.brand || "DUDI"} • {product.sku}
                            </span>
                            {product.badge && (
                              <span className="bg-red-50 text-red-600 text-[9.5px] font-black px-1.5 py-0.2 rounded border border-red-100">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div
                            className="font-bold text-slate-900 group-hover:text-[#eb1c24] transition truncate text-xs sm:text-[13px] mt-0.5"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="font-black text-red-600 text-xs sm:text-sm">
                        {formattedPrice}
                      </div>
                      {product.oldPrice && (
                        <div className="text-[10.5px] text-slate-400 line-through">
                          {typeof product.oldPrice === "number"
                            ? `${product.oldPrice.toLocaleString("vi-VN")}₫`
                            : product.oldPrice}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">
                          {product.stock}
                        </span>
                        <div className="flex items-center gap-0.5 ml-1">
                          <button
                            onClick={() => onStockChange?.(product.id, Math.max(0, product.stock - 1))}
                            className="p-0.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                            title="Giảm 1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => onStockChange?.(product.id, product.stock + 1)}
                            className="p-0.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded transition cursor-pointer"
                            title="Tăng 1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-semibold">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10.5px] font-semibold">
                          Hết hàng
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {product.slug && (
                          <Link
                            href={`/product-detail?slug=${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Xem trên shop"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. Render Grid View
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-smooth-fade">
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