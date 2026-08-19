"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { ShoppingCart, Eye, ShieldCheck } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { addToCart } from "@/redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  if (!product) return null;

  const thumbnail =
    product.thumbnail ||
    product.images?.[0] ||
    "https://zcomputer.vn/logo-main.png";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  // Tính ước tính trả góp (khoảng 10-12% giá trị sản phẩm / tháng)
  const installmentEst = Math.round(product.price / 12);

  return (
    <div className="bg-white rounded-xl border border-gray-150/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      {/* Discount badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-2 left-2 z-20 bg-[#dc2626] text-white text-[10.5px] font-black px-2 py-0.5 rounded shadow-sm">
          -{product.discountPercent}%
        </span>
      )}

      {/* Brand tag */}
      {product.brand && (
        <span className="absolute top-2 right-2 z-20 bg-gray-900/75 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          {product.brand}
        </span>
      )}

      {/* Image container */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="block relative aspect-square w-full p-3 bg-white overflow-hidden"
      >
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white border-t border-gray-50">
        <div>
          {/* Warranty tag */}
          <div className="text-[10px] text-gray-500 mb-1 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span>{product.warranty || "Bảo hành 3 - 12 Tháng"}</span>
          </div>

          {/* Product Name */}
          <Link
            href={`/san-pham/${product.slug}`}
            className="text-xs sm:text-[13px] font-bold text-gray-800 hover:text-[#dc2626] transition-colors line-clamp-2 min-h-[36px] sm:min-h-[38px] leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Actions */}
        <div className="mt-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm sm:text-[15px] font-black text-[#dc2626]">
              {formatVND(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Trả góp estimate */}
          {product.price > 3000000 && (
            <div className="text-[10px] text-gray-500 mb-2 font-medium">
              Trả góp chỉ từ <span className="text-gray-800 font-bold">{formatVND(installmentEst)}/tháng</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-[#dc2626] text-[#dc2626] hover:text-white border border-red-200/80 py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Thêm vào giỏ</span>
            </button>
            <Link
              href={`/san-pham/${product.slug}`}
              className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
