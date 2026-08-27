"use client";

import { useState } from "react";
import { Scale, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { getProductImage } from "@/lib/productHelpers";
import { handleImageError } from "@/lib/imageFallback";

const ProductComparisonBar = ({
  products = [],
  onRemove,
  onAddProduct,
  onClear,
  onCompare,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!products.length) {
    return null;
  }

  const formatPrice = (price) => {
    const value = Number(price || 0);
    return value > 0 ? `${value.toLocaleString("vi-VN")}₫` : "Liên hệ";
  };

  const getProductId = (product) => {
    return product?.slug || product?._id || product?.id;
  };

  // When collapsed, render floating trigger pill on mobile & desktop (bên trái để không đè lên các nút liên hệ)
  if (isCollapsed) {
    return (
      <div className="fixed bottom-6 left-4 sm:left-6 z-40">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2.5 rounded-full shadow-2xl font-bold text-xs sm:text-sm uppercase tracking-wider cursor-pointer border-2 border-white transition-all hover:scale-105"
        >
          <Scale className="w-4 h-4" />
          <span>So sánh ({products.length}/3)</span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <section className="fixed bottom-0 left-0 right-0 z-[90] px-2 sm:px-4 md:px-8">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-t-2xl border border-slate-200 border-b-0 bg-white p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] sm:p-4 md:p-5 animate-slideUp">
        {/* HEADER */}
        <div className="mb-2.5 sm:mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Scale className="h-5 w-5 shrink-0 text-red-600" />
            <h2 className="truncate text-xs sm:text-base font-bold uppercase text-red-600">
              So sánh sản phẩm
            </h2>
            <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[10px] sm:text-xs font-black text-white">
              {products.length}/3
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-slate-500 transition hover:text-slate-900 hover:underline cursor-pointer"
            >
              Xóa tất cả
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              aria-label="Thu gọn"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* PRODUCTS & ACTIONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-row gap-2 sm:gap-3 items-stretch">
          {products.map((product, pIdx) => {
            const productId = getProductId(product) || `comp-prod-${pIdx}`;
            const image = getProductImage(product);

            return (
              <div
                key={productId}
                className="relative flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50/70 p-2 sm:p-3"
              >
                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove?.(product);
                  }}
                  aria-label="Xóa sản phẩm"
                  className="absolute -right-1.5 -top-1.5 z-30 flex h-6 w-6 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md transition hover:scale-110 cursor-pointer active:scale-95 border-2 border-white"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="flex w-full items-center gap-2 sm:gap-3">
                  {/* IMAGE */}
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                    <img
                      src={image}
                      alt={product?.name || "Sản phẩm"}
                      className="h-full w-full object-contain mix-blend-multiply"
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {product?.name || "Tên sản phẩm"}
                    </h3>
                    <span className="mt-0.5 block text-xs sm:text-base font-bold text-red-600">
                      {formatPrice(product?.price)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ADD PRODUCT */}
          {products.length < 3 && (
            <button
              type="button"
              onClick={onAddProduct}
              className="flex min-h-[56px] sm:min-h-[70px] flex-1 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white transition hover:border-red-400 hover:bg-red-50/30 cursor-pointer p-2"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-500">
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-red-600">
                  <Plus size={14} />
                </div>
                <span className="truncate">Thêm thiết bị</span>
              </div>
            </button>
          )}

          {/* COMPARE BUTTON */}
          <button
            type="button"
            disabled={products.length < 2}
            onClick={onCompare}
            className={`col-span-2 md:col-span-1 flex min-h-[46px] sm:min-h-[70px] shrink-0 md:flex-col items-center justify-center gap-1.5 rounded-xl px-5 sm:px-7 text-white shadow-sm transition cursor-pointer ${
              products.length >= 2
                ? "bg-[#dc2626] hover:bg-[#b91c1c]"
                : "cursor-not-allowed bg-slate-300"
            }`}
          >
            <Scale className="w-4 h-4 sm:w-6 sm:h-6" />
            <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider">
              So sánh ngay
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductComparisonBar;