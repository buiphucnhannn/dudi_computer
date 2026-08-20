"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Zap, Flame, Scale, Heart, Eye, Cpu, HardDrive, CircuitBoard, Layers, ArrowRight } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function FlashSaleSection({ products = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 7, minutes: 52, seconds: 40 });
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const cartItems = useSelector(selectCartItems) || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleFavorite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isFav = cartItems.some((i) => i._id === item._id);
    if (isFav) {
      dispatch(removeFromCartAsync(item._id));
    } else {
      dispatch(addToCartAsync({ product: item, quantity: 1 }));
    }
  };

  const handleBuyNow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartAsync({ product: item, quantity: 1 }));
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${item.name}" vào danh sách chọn mua.`,
      type: "success",
    });
  };

  // Lọc sản phẩm Flash Sale theo Tab đang chọn
  const flashSaleItems = useMemo(() => {
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();

        if (activeTab === "pc") {
          return (
            cat.includes("pc") ||
            name.startsWith("bộ máy") ||
            name.startsWith("pc ") ||
            name.includes("b760m") ||
            name.includes("h610")
          );
        }

        if (activeTab === "laptop") {
          return (
            cat.includes("laptop") ||
            name.startsWith("laptop") ||
            name.startsWith("macbook") ||
            name.includes("thinkpad") ||
            name.includes("legion")
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
            <span className="text-[9px] font-bold text-gray-500 uppercase">Ngày</span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">Giờ</span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">Phút</span>
          </div>
          <span className="font-bold text-base text-white">:</span>
          <div className="flex-1 bg-white text-gray-900 rounded-xl p-2 shadow-xs">
            <span className="text-base sm:text-lg font-black block leading-none">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold text-gray-500 uppercase">Giây</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/san-pham?isFlashSale=true"
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
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#111827] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("pc")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pc"
                ? "bg-[#111827] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
            }`}
          >
            PC Cũ
          </button>
          <button
            onClick={() => setActiveTab("laptop")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "laptop"
                ? "bg-[#111827] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
            }`}
          >
            Laptop Cũ
          </button>
        </div>

        {/* Product Cards Row with gentle elevation & thin red border on hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {flashSaleItems.map((item, index) => {
            const discountPercent =
              item.discountPercent ||
              (item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 5);
            const originalPrice = item.originalPrice || Math.round(item.price * 1.08);
            const imgSrc = getProductImage(item);
            const isFav = cartItems.some((i) => i._id === item._id);

            return (
              <div
                key={item._id || index}
                className="bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group/card relative"
              >
                {/* Product Image */}
                <Link
                  href={`/san-pham/${item.slug || item._id}`}
                  className="block relative aspect-square w-full bg-white rounded-xl overflow-hidden mb-3 border border-gray-100 group/img cursor-pointer"
                >
                  {/* Tag Giảm giá góc trên bên trái */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-2 z-20 bg-[#eb1c24] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                      Giảm {discountPercent}%
                    </div>
                  )}

                  {/* Hot Sale Fire Tag góc trên bên phải */}
                  <div className="absolute top-2 right-2 z-20 bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>HOT SALE</span>
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
                </Link>

                {/* Brand & Actions */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                    {item.brand || "ZCOMPUTER"}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button className="hover:text-gray-700 cursor-pointer transition-colors" title="So sánh">
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleToggleFavorite(e, item)}
                      className={`p-0.5 transition-all duration-200 hover:scale-110 cursor-pointer ${
                        isFav ? "text-[#eb1c24]" : "text-gray-400 hover:text-[#eb1c24]"
                      }`}
                      title={isFav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFav ? "fill-[#eb1c24] text-[#eb1c24]" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={`/san-pham/${item.slug || item._id}`}
                  className="font-bold text-xs sm:text-[13px] text-gray-900 hover:text-[#eb1c24] group-hover:text-[#eb1c24] line-clamp-2 min-h-[36px] leading-snug mb-2 transition-colors"
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
                <div className="bg-gray-50 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-[10px] text-gray-600 mb-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 truncate" title="Intel Core i5 / i7">
                    <Cpu className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">Intel / AMD CPU</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate" title="RAM 16GB / 32GB">
                    <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">16GB / 32GB RAM</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate" title="Mainboard Pro">
                    <CircuitBoard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">Mainboard Pro</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate" title="VGA RTX Series">
                    <HardDrive className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">SSD NVMe Siêu Tốc</span>
                  </div>
                </div>

                {/* Views & Add button */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 49} lượt xem</span>
                  </span>
                  <button
                    onClick={(e) => handleBuyNow(e, item)}
                    className="text-[#eb1c24] font-bold hover:underline cursor-pointer transition-all active:scale-95"
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
