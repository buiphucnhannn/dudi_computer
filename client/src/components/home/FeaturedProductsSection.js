"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Eye } from "lucide-react";
import { formatVND } from "@/lib/utils";

export default function FeaturedProductsSection({ products = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const sliderRef = useRef(null);

  const tabs = [
    { id: "all", name: "Tất cả" },
    { id: "pc", name: "PC Cũ" },
    { id: "laptop", name: "Laptop Cũ" },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    const cat = (p.categoryName || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    if (activeTab === "pc") return cat.includes("pc") || name.includes("bộ máy") || name.includes("pc ");
    if (activeTab === "laptop") return cat.includes("laptop") || name.includes("laptop") || name.includes("macbook");
    return true;
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

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
    <section className="bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-yellow-100/60 rounded-[2.5rem] p-4 sm:p-7 md:p-9 border-[3px] md:border-4 border-amber-300 shadow-xl relative overflow-hidden mb-10 sm:mb-14 md:mb-16">
      {/* Background Glowing Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-yellow-400/40 rounded-full blur-[80px] pointer-events-none hidden md:block" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/30 rounded-full blur-[80px] pointer-events-none hidden md:block" />

      {/* Header with Fiery Gradient Title */}
      <div className="flex flex-col items-center justify-center mb-6 gap-3 relative z-10 w-full text-center">
        <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 uppercase tracking-tight relative inline-block drop-shadow-md py-2 leading-tight">
          SẢN PHẨM NỔI BẬT
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
        </h3>
      </div>

      {/* 3 Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-7 relative z-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105"
                  : "bg-white/90 text-orange-950 hover:bg-white border border-orange-200/80 shadow-2xs"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Slider Carousel Area */}
      <div className="relative group/slider mt-2">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white border border-yellow-200 rounded-full shadow-lg flex items-center justify-center text-yellow-600 hover:text-orange-500 hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none cursor-pointer"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Horizontal Smooth Scroll Track: exactly 4 cards fit on desktop (25% - gap) */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 py-2 px-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {filteredProducts.map((item) => {
            const discountPercent =
              item.discountPercent ||
              (item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 5);
            const originalPrice = item.originalPrice || Math.round(item.price * 1.05);
            const imgSrc = getProductImage(item);

            return (
              <div
                key={`featured-${item._id}`}
                className="w-[260px] sm:w-[280px] lg:w-[calc(25%-12px)] shrink-0 bg-white rounded-2xl border-2 border-red-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group/card relative"
              >
                {/* Top Left Discount Badge */}
                <div className="absolute top-0 left-0 z-40 pointer-events-none">
                  <div className="bg-[#eb1c24] text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-tl-[12px] rounded-br-[10px] whitespace-nowrap shadow-xs">
                    Giảm {discountPercent}%
                  </div>
                </div>

                {/* Top Right '🔥 HOT SALE' Badge */}
                <div className="absolute top-0 right-0 z-40 pointer-events-none">
                  <div className="bg-[#eb1c24] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-tr-[12px] rounded-bl-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    🔥 HOT SALE
                  </div>
                </div>

                {/* Product Image Area */}
                <Link
                  href={`/san-pham/${item.slug || item._id}`}
                  className="relative aspect-square w-full bg-white p-3 flex items-center justify-center overflow-hidden border-b border-gray-100 block cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-full h-full object-contain p-1 transition-transform duration-700 group-hover/card:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
                    }}
                  />

                  {/* Center Hover Pill - Chính giữa ảnh */}
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <div className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover/card:scale-100 transition-all duration-300 whitespace-nowrap">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>

                {/* Product Details Info */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1 bg-white justify-between">
                  <div>
                    {/* Brand */}
                    <div className="text-[10px] sm:text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                      {item.brand || "ZCOMPUTER"}
                    </div>

                    {/* Title */}
                    <Link
                      href={`/san-pham/${item.slug || item._id}`}
                      className="block hover:text-[#eb1c24] transition-colors"
                    >
                      <h4 className="text-gray-900 text-xs sm:text-[13px] font-bold leading-snug line-clamp-2 group-hover/card:text-[#eb1c24] transition-colors duration-300 min-h-[36px]">
                        {item.name}
                      </h4>
                    </Link>
                  </div>

                  {/* Price and Footer */}
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm sm:text-base font-black text-[#eb1c24] leading-none">
                        {formatVND(item.price)}
                      </span>
                      {discountPercent > 0 && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {formatVND(originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10.5px] text-gray-400">
                      <span className="text-emerald-600 font-bold">✓ Còn hàng</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{item.views || 48} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white border border-yellow-200 rounded-full shadow-lg flex items-center justify-center text-yellow-600 hover:text-orange-500 hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none cursor-pointer"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
