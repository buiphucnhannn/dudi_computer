"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Zap,
  Flame,
  Scale,
  ShoppingCart,
  Eye,
  Cpu,
  HardDrive,
  CircuitBoard,
  Layers,
  ArrowRight,
  Monitor,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Wifi,
  Clock,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { getProductCardBadges } from "@/lib/specParser";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";
import { useCompare } from "@/components/common/CompareContext";

export default function FlashSaleSection({ products = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 7,
    minutes: 52,
    seconds: 40,
  });
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { addToCompare, isComparing } = useCompare();
  const cartItems = useSelector(selectCartItems) || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isCart = cartItems.some((i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug));
    const prodId = item._id || item.id || item.slug;
    if (isCart) {
      dispatch(removeFromCartAsync(prodId));
      showToast({
        title: "Đã xóa khỏi giỏ",
        message: `Đã bỏ "${item.name}" khỏi giỏ hàng`,
        type: "info",
      });
    } else {
      dispatch(addToCartAsync({ product: item, quantity: 1 }));
      showToast({
        title: "Đã thêm vào giỏ hàng",
        message: `Đã thêm "${item.name}" vào giỏ hàng thành công!`,
        type: "success",
      });
    }
  };

  const handleBuyNow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartAsync({ product: item, quantity: 1 }));
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${item.name}" vào giỏ hàng thành công!`,
      type: "success",
    });
  };

  // Lọc sản phẩm Flash Sale theo Tab đang chọn
  const flashSaleItems = useMemo(() => {
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const catSlug = (p.categorySlug || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();

        // 1. Tab PC Cũ: Chỉ lấy bộ máy PC, TUYỆT ĐỐI KHÔNG lấy Mainboard, Nguồn, VGA rời, Màn hình, Laptop
        if (activeTab === "pc") {
          if (
            name.startsWith("mainboard") ||
            name.startsWith("bo mạch") ||
            name.startsWith("nguồn") ||
            name.startsWith("card màn hình") ||
            name.startsWith("ram") ||
            name.startsWith("ssd") ||
            name.startsWith("màn hình") ||
            name.startsWith("laptop") ||
            name.startsWith("macbook") ||
            catSlug === "mainboard-bo-mach-chu" ||
            catSlug === "psu-nguon-may-tinh" ||
            catSlug === "vga-card-man-hinh" ||
            catSlug === "cpu-bo-vi-xu-ly" ||
            catSlug === "ram-bo-nho-trong" ||
            catSlug === "o-cung-hdd-ssd" ||
            catSlug === "man-hinh" ||
            catSlug.includes("laptop") ||
            catSlug === "macbook"
          ) {
            return false;
          }

          return (
            catSlug === "pc-cu" ||
            catSlug === "pc-gaming" ||
            catSlug === "pc-do-hoa" ||
            catSlug === "pc-van-phong" ||
            name.startsWith("bộ máy") ||
            name.startsWith("pc ") ||
            name.startsWith("máy tính để bàn") ||
            name.startsWith("máy tính aio")
          );
        }

        // 2. Tab Laptop Cũ: Chỉ lấy Laptop
        if (activeTab === "laptop") {
          if (
            name.startsWith("bộ máy") ||
            name.startsWith("pc ") ||
            name.startsWith("mainboard") ||
            name.startsWith("nguồn") ||
            name.startsWith("màn hình") ||
            catSlug.includes("pc-") ||
            catSlug === "mainboard-bo-mach-chu" ||
            catSlug === "psu-nguon-may-tinh" ||
            catSlug === "man-hinh"
          ) {
            return false;
          }

          return (
            catSlug.includes("laptop") ||
            catSlug === "macbook" ||
            cat.includes("laptop") ||
            name.startsWith("laptop") ||
            name.startsWith("macbook") ||
            name.includes("thinkpad") ||
            name.includes("legion") ||
            name.includes("zenbook") ||
            name.includes("surface") ||
            name.includes("latitude") ||
            name.includes("xps")
          );
        }

        return true;
      })
      .slice(0, 3);
  }, [activeTab, products]);

  const getProductImage = (item) => {
    if (item.thumbnail && item.thumbnail.startsWith("http")) return item.thumbnail;
    if (item.thumbnail) return `https://zcomputer.vn${item.thumbnail}`;
    if (item.images && item.images.length > 0) {
      if (item.images[0].startsWith("http")) return item.images[0];
      return `https://zcomputer.vn${item.images[0]}`;
    }
    if (item.image && item.image.startsWith("http")) return item.image;
    return "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch my-2">
      {/* Left Flash Sale Banner Card (Centered content & Vibrant bright red #eb1c24) */}
      <div className="bg-[#eb1c24] text-white p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-md w-full gap-5">
        <div>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              FLASH SALE
            </h2>
          </div>
          <p className="text-xs text-red-100 font-medium">
            Ưu đãi chớp nhoáng
            <br />
            Giá tốt mỗi ngày
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1.5 text-center w-full">
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">
              Ngày
            </span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">
              Giờ
            </span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">
              Phút
            </span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">
              Giây
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/tat-ca-san-pham?isFlashSale=true"
          className="w-full text-center bg-white hover:bg-red-50 text-[#eb1c24] font-black text-xs sm:text-sm py-3 rounded-xl transition-all shadow-sm uppercase tracking-wider block"
        >
          XEM TẤT CẢ
        </Link>
      </div>

      {/* Right Product Grid */}
      <div className="space-y-3">
        {/* Top Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "all" ? "bg-gray-800 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("pc")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "pc" ? "bg-gray-800 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            PC
          </button>
          <button
            onClick={() => setActiveTab("laptop")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "laptop" ? "bg-gray-800 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Laptop
          </button>
        </div>

        {/* Product Cards Row with gentle elevation & thin red border on hover */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {flashSaleItems.map((item) => {
            const discountPercent =
              item.discountPercent ||
              (item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 5);
            const originalPrice = item.originalPrice || Math.round(item.price * 1.08);
            const imgSrc = getProductImage(item);

            const isFav = cartItems.some((i) => i._id === item._id);
            const detailHref = `/product-detail?slug=${encodeURIComponent(
              item.slug || item._id,
            )}`;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 shadow-2xs hover:border-[#eb1c24] hover:shadow-[0_12px_28px_rgba(235,28,36,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative p-2.5 sm:p-3"
              >
                <Link
                  href={detailHref}
                  className="block relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-red-500/80 mb-3 bg-white group/img p-2"
                >
                  <div className="absolute top-0 left-0 z-20 pointer-events-none">
                    <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded-tl-[10px] rounded-br-[8px] shadow-xs">
                      Giảm {discountPercent}%
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 z-20 pointer-events-none">
                    <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded-tr-[10px] rounded-bl-[8px] flex items-center gap-1 shadow-xs">
                      🔥 HOT SALE
                    </span>
                  </div>

                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-full h-full object-contain p-1 group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
                    }}
                  />

                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover/img:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <span className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover:scale-100 group-hover/img:scale-100 transition-all duration-300 whitespace-nowrap">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#eb1c24]" />
                    </span>
                  </div>

                  <div className="absolute bottom-1 left-1.5 opacity-80 pointer-events-none">
                    <span className="text-[9px] font-black text-[#eb1c24] tracking-tight">
                      DUDI SOFTWARE
                    </span>
                  </div>
                </Link>

                {/* Brand & Actions */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                    {item.brand || "DUDI SOFTWARE"}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCompare(item);
                      }}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        isComparing(item.slug || item._id || item.id)
                          ? "text-[#eb1c24] bg-red-50"
                          : "hover:text-[#eb1c24] hover:bg-gray-100"
                      }`}
                      title="So sánh sản phẩm"
                    >
                      <Scale className="w-[18px] h-[18px]" />
                    </button>
                    <button
                      onClick={(e) => handleToggleCart(e, item)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer ${
                        cartItems.some((i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug))
                          ? "text-[#eb1c24] bg-red-50"
                          : "hover:text-[#eb1c24] hover:bg-gray-100"
                      }`}
                      title="Thêm vào giỏ hàng"
                    >
                      <ShoppingCart className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={detailHref}
                  className="font-bold text-xs sm:text-[13px] text-gray-800 hover:text-[#eb1c24] group-hover:text-[#eb1c24] line-clamp-2 min-h-[36px] leading-snug mb-2 transition-colors"
                  title={item.name}
                >
                  {item.name}
                </Link>

                {/* Price Box */}
                <div className="mb-3">
                  {originalPrice > item.price && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatVND(originalPrice)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-[#eb1c24]">
                      {formatVND(item.price)}
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-red-50 text-[#eb1c24] text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs 2x2 Box */}
                {(() => {
                  const badges = getProductCardBadges(item);

                  const renderIcon = (iconName) => {
                    const props = { className: "w-3.5 h-3.5 text-gray-400 shrink-0" };
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
                    <div className="bg-gray-50 rounded-xl p-2 grid grid-cols-2 gap-1.5 text-[10px] text-gray-600 mb-2.5 border border-gray-100 min-h-[58px]">
                      {badges.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-1 truncate" title={b.title || b.label}>
                          {renderIcon(b.icon)}
                          <span className="truncate font-medium">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Views & Add button */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 49} lượt xem</span>
                  </span>
                  <button
                    onClick={(e) => handleBuyNow(e, item)}
                    className="text-[#eb1c24] font-bold hover:underline cursor-pointer"
                  >
                    + Mua ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
