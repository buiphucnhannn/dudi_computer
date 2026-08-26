"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Eye,
  ShieldCheck,
  Scale,
  Heart,
  Cpu,
  Layers,
  HardDrive,
  CircuitBoard,
  Monitor,
  Maximize2,
  Zap,
  Sparkles,
  Wifi,
  Clock,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { addToCart, addToCartAsync, removeFromCartAsync, selectCartItems } from "@/redux/slices/cartSlice";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { useCompare } from "@/components/common/CompareContext";
import { useToast } from "@/components/common/ToastContext";
import { getProductCardBadges } from "@/lib/specParser";
import { getProductDiscountInfo, getProductImage } from "@/lib/productHelpers";

export default function ProductCard({ product }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { addToCompare, isComparing } = useCompare();
  const { showToast } = useToast();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) return null;

  const isCart = cartItems.some((i) => (i._id || i.id || i.slug) === (product._id || product.id || product.slug));
  const isComp = isComparing(product.slug || product._id || product.id);

  const {
    price,
    originalPrice,
    discountPercent,
    hasDiscount,
    isFlashSale,
    showHotSaleBadge,
  } = getProductDiscountInfo(product);

  const thumbnail = getProductImage(product);

  const detailHref = `/product-detail?slug=${encodeURIComponent(
    product.slug || product._id,
  )}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${product.name}" vào giỏ hàng thành công!`,
      type: "success",
    });
  };

  const handleToggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = product._id || product.id || product.slug;
    if (isCart) {
      dispatch(removeFromCartAsync(prodId));
      showToast({
        title: "Đã xóa khỏi giỏ",
        message: `Đã bỏ "${product.name}" khỏi giỏ hàng`,
        type: "info",
      });
    } else {
      dispatch(addToCartAsync({ product, quantity: 1 }));
      showToast({
        title: "Đã thêm vào giỏ hàng",
        message: `Đã thêm "${product.name}" vào giỏ hàng thành công!`,
        type: "success",
      });
    }
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const handleOpenDetail = () => {
    router.push(detailHref);
  };

  // Tính ước tính trả góp (khoảng 10-12% giá trị sản phẩm / tháng)
  const installmentEst = Math.round(price / 12);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleOpenDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenDetail();
        }
      }}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-red-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative cursor-pointer"
    >
      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute top-2.5 left-2.5 z-20 bg-gradient-to-r from-[#eb1c24] to-[#ff4757] text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
          -{discountPercent}%
        </span>
      )}

      {/* Brand tag & Action buttons */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
        <button
          onClick={handleToggleCompare}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            isComp
              ? "bg-[#eb1c24] text-white shadow-sm scale-105"
              : "bg-white/90 hover:bg-white text-slate-600 hover:text-[#eb1c24] hover:scale-105 border border-slate-100"
          }`}
          title="So sánh sản phẩm"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        {mounted && !isAdmin && (
          <button
            onClick={handleToggleCart}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isCart
                ? "bg-[#eb1c24] text-white shadow-sm scale-105"
                : "bg-white/90 hover:bg-white text-slate-600 hover:text-[#eb1c24] hover:scale-105 border border-slate-100"
            }`}
            title={isCart ? "Đã có trong giỏ hàng (Bấm để xóa)" : "Thêm vào giỏ hàng"}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Image container */}
      <div className="block relative aspect-square w-full p-3 sm:p-4 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 overflow-hidden border-b border-slate-100">
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
            }}
          />
        </div>
        {/* Watermark */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none opacity-85 z-20">
          <span className="inline-block bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8.5px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
            DUDI SOFTWARE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Warranty tag */}
          <div className="text-[10.5px] text-slate-500 mb-1.5 flex items-center gap-1 font-medium truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{product.warranty || "Bảo hành 3 - 12 Tháng"}</span>
          </div>

          {/* Product Name */}
          <h3
            className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-[#eb1c24] transition-colors line-clamp-2 min-h-[34px] sm:min-h-[38px] leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* 4 Specs Chips Grid */}
          {(() => {
            const badges = getProductCardBadges(product);

            const renderIcon = (iconName) => {
              const props = { className: "w-3.5 h-3.5 text-slate-400 shrink-0" };
              switch (iconName) {
                case "Cpu": return <Cpu {...props} />;
                case "Layers": return <Layers {...props} />;
                case "HardDrive": return <HardDrive {...props} />;
                case "CircuitBoard": return <CircuitBoard {...props} />;
                case "Monitor": return <Monitor {...props} />;
                case "Maximize2": return <Maximize2 {...props} />;
                case "Zap": return <Zap {...props} />;
                case "Sparkles": return <Sparkles {...props} />;
                case "ShieldCheck": return <ShieldCheck {...props} />;
                case "Wifi": return <Wifi {...props} />;
                case "Clock": return <Clock {...props} />;
                default: return <Sparkles {...props} />;
              }
            };

            return (
              <div className="bg-slate-50/80 rounded-xl p-1.5 sm:p-2 grid grid-cols-2 gap-1 sm:gap-1.5 text-[9.5px] sm:text-[10px] text-slate-600 mb-2 border border-slate-100 min-h-[52px] sm:min-h-[56px]">
                {badges.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-1 truncate" title={b.title || b.label}>
                    {renderIcon(b.icon)}
                    <span className="truncate font-medium text-slate-700">{b.label}</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Price & Actions */}
        <div className="mt-1.5 sm:mt-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-1">
            <span className="text-sm sm:text-base font-black text-[#eb1c24]">
              {formatVND(price)}
            </span>
            {hasDiscount && (
              <span className="text-[10.5px] sm:text-[11px] text-slate-400 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10px] font-bold text-[#eb1c24] bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Trả góp estimate */}
          {product.price > 3000000 && (
            <div className="text-[9.5px] sm:text-[10px] text-slate-500 mb-2 font-medium truncate">
              Trả góp chỉ từ{" "}
              <span className="text-slate-800 font-bold">
                {formatVND(installmentEst)}/tháng
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleOpenDetail}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-2 rounded-xl text-[10.5px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem chi tiết</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-[#eb1c24] text-[#eb1c24] hover:text-white border border-red-200/80 hover:border-[#eb1c24] py-1.5 px-2 rounded-xl text-[10.5px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs active:scale-98"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">Thêm vào giỏ</span>
                </button>
                <span
                  className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
                  title="Xem chi tiết"
                >
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
