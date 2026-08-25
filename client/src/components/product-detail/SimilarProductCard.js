"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Cpu,
  MemoryStick,
  CircuitBoard,
  Sparkles,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";

const formatPrice = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
};

export default function SimilarProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);
  const { showToast } = useToast();

  const productId = product.id || product._id || product.slug;
  const isCart = cartItems.some(
    (item) => item.id === productId || item._id === productId || item.slug === product.slug
  );

  const href = `/product-detail?slug=${encodeURIComponent(
    product.slug || productId
  )}`;

  const handleToggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCart) {
      dispatch(removeFromCartAsync(productId));
      showToast({
        title: "Đã xóa",
        message: `Đã bỏ "${product.name}" khỏi giỏ hàng`,
        type: "info",
      });
    } else {
      dispatch(
        addToCartAsync({
          id: productId,
          name: product.name,
          price: product.price,
          originalPrice: product.oldPrice || product.originalPrice,
          image: product.image || product.thumbnail,
          slug: product.slug,
          quantity: 1,
        })
      );
      showToast({
        title: "Thành công",
        message: `Đã thêm "${product.name}" vào giỏ hàng`,
        type: "success",
      });
    }
  };

  const discount = product.discount || 0;

  return (
    <article
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl
        border bg-white transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        ${
          product.isHot
            ? "border-red-200/80 shadow-red-500/5 hover:border-red-400"
            : "border-slate-200/80 shadow-slate-900/5 hover:border-slate-300"
        }
      `}
    >
      {/* ── TOP BADGES & ACTIONS ── */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white p-4">
        <Link href={href} className="block w-full h-full">
          <img
            src={product.image || product.thumbnail}
            alt={product.name}
            className={`
              h-full w-full object-contain mix-blend-multiply
              transition-transform duration-500
              ${
                product.outOfStock
                  ? "grayscale opacity-60"
                  : "group-hover:scale-105"
              }
            `}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Cart Toggle Button (Ẩn đối với Admin) */}
        {!isAdmin && (
          <button
            type="button"
            aria-label="Thêm vào giỏ hàng"
            onClick={handleToggleCart}
            className={`
              absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center
              rounded-full bg-white/90 backdrop-blur-xs shadow-xs
              transition-all duration-200 hover:scale-110 cursor-pointer
              ${
                isCart
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-red-600"
              }
            `}
            title={isCart ? "Đã có trong giỏ hàng (Bấm để bỏ)" : "Thêm vào giỏ hàng"}
          >
            <ShoppingCart
              className={`w-4 h-4 transition-colors ${
                isCart ? "text-white" : ""
              }`}
            />
          </button>
        )}

        {/* Out of stock Overlay */}
        {product.outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
            <div className="rounded-lg border border-red-200 bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-red-600 shadow-md">
              Tạm Hết Hàng
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-red-600">
          {product.category || "PC & Laptop"}
        </div>

        {/* Product Name */}
        <Link href={href} className="block mb-3">
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-slate-800 transition-colors group-hover:text-red-600">
            {product.name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mb-3.5">
          {product.contactPrice ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Giá bán:
              </span>
              <span className="text-base font-extrabold text-red-600">
                {product.contactPrice}
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Specs Grid */}
        {product.specs && (
          <div
            className={`
              mb-4 grid grid-cols-2 gap-2
              rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs
              ${product.outOfStock ? "opacity-75" : ""}
            `}
          >
            {product.specs.cpu && (
              <SpecItem icon={Cpu} value={product.specs.cpu} />
            )}
            {product.specs.ram && (
              <SpecItem icon={MemoryStick} value={product.specs.ram} />
            )}
            {product.specs.motherboard && (
              <SpecItem icon={CircuitBoard} value={product.specs.motherboard} />
            )}
            {product.specs.gpu && (
              <SpecItem icon={Sparkles} value={product.specs.gpu} />
            )}
          </div>
        )}

        {/* Bottom Views & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{product.views || 10} lượt xem</span>
          </div>

          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>Chi tiết</span>
            <span className="font-sans">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function SpecItem({ icon: Icon, value }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 shrink-0 text-red-500/80" />
      <span className="truncate font-medium text-[11px] text-slate-700">
        {value}
      </span>
    </div>
  );
}