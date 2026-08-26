"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const productId = product.id || product._id || product.slug;
  const isCart = cartItems.some(
    (item) => item.id === productId || item._id === productId || item.slug === product.slug
  );

  const href = `/product-detail?slug=${encodeURIComponent(
    product.slug || productId
  )}`;

  const isOutOfStock = typeof product.stock === "number" ? product.stock <= 0 : Boolean(product.outOfStock);

  const handleToggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      showToast({
        title: "Sản phẩm đã hết hàng",
        message: `Sản phẩm "${product.name}" hiện đã hết hàng trong kho.`,
        type: "warning",
      });
      return;
    }

    dispatch(
      addToCartAsync({
        product: {
          _id: productId,
          id: productId,
          name: product.name,
          price: product.price,
          originalPrice: product.oldPrice || product.originalPrice,
          image: product.image || product.thumbnail,
          thumbnail: product.image || product.thumbnail,
          slug: product.slug,
          stock: product.stock,
        },
        quantity: 1,
      })
    );
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${product.name}" vào giỏ hàng (+1)!`,
      type: "success",
    });
  };

  const discount = product.discount || 0;

  return (
    <article
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl
        border bg-white transition-all duration-300
        hover:-translate-y-1.5 hover:shadow-xl
        ${product.isHot
          ? "border-red-300 shadow-red-500/5 hover:border-red-500"
          : "border-slate-200/90 shadow-xs hover:border-red-400/80"
        }
      `}
    >
      {/* ── TOP BADGES & ACTIONS ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 p-4 border-b border-slate-100 flex items-center justify-center">
        <Link href={href} className="block w-full h-full flex items-center justify-center">
          <img
            src={product.image || product.thumbnail}
            alt={product.name}
            className={`
              h-full w-full object-contain mix-blend-multiply
              transition-transform duration-500 ease-out
              ${product.outOfStock
                ? "grayscale opacity-60"
                : "group-hover:scale-108"
              }
            `}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Cart Toggle Button (Ẩn đối với Admin hoặc khi hết hàng) */}
        {mounted && !isAdmin && !isOutOfStock && (
          <button
            type="button"
            aria-label="Thêm vào giỏ hàng"
            onClick={handleToggleCart}
            className={`
              absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center
              rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-100
              transition-all duration-200 hover:scale-110 cursor-pointer
              ${isCart
                ? "bg-red-600 text-white shadow-sm border-red-600"
                : "text-slate-600 hover:text-red-600 hover:bg-red-50"
              }
            `}
            title={isCart ? "Đã có trong giỏ hàng (Bấm để bỏ)" : "Thêm vào giỏ hàng"}
          >
            <ShoppingCart
              className={`w-4 h-4 transition-colors ${isCart ? "text-white" : ""
                }`}
            />
          </button>
        )}

        {/* Watermark */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none opacity-85 z-20">
          <span className="inline-block bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8.5px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
            DUDI SOFTWARE
          </span>
        </div>

        {/* Out of stock Overlay */}
        {isOutOfStock && (
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