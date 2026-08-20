"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Scale,
  Heart,
  Eye,
  Cpu,
  HardDrive,
  CircuitBoard,
  Layers,
  ArrowRight,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";

export default function CategoryProductBox({
  title,
  mainSlug,
  tabs = [],
  products = [],
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.slug || "all");
  const dispatch = useDispatch();

  const filteredProducts = useMemo(() => {
    if (activeTab === "all" || tabs.length === 0) return products.slice(0, 4);
    return products
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();

        // 1. Laptop tabs
        if (activeTab === "van-phong") {
          return (
            name.includes("văn phòng") ||
            name.includes("thinkpad") ||
            name.includes("dell vostro") ||
            name.includes("latitude") ||
            name.includes("elitebook") ||
            name.includes("zenbook") ||
            name.includes("vivobook") ||
            name.includes("inspiron") ||
            name.includes("pavilion")
          );
        }
        if (activeTab === "gaming") {
          return (
            name.includes("gaming") ||
            name.includes("legion") ||
            name.includes("tuf") ||
            name.includes("rog") ||
            name.includes("omen") ||
            name.includes("victus") ||
            name.includes("predator") ||
            name.includes("nitro") ||
            name.includes("stealth") ||
            name.includes("alpha") ||
            name.includes("loq")
          );
        }
        if (activeTab === "macbook") {
          return (
            name.includes("macbook") ||
            brand.includes("apple") ||
            name.includes("apple")
          );
        }

        // 2. PC tabs
        if (activeTab === "pc-gaming") {
          return (
            name.includes("gaming") ||
            name.includes("rtx") ||
            name.includes("gtx") ||
            name.includes("rx ")
          );
        }
        if (activeTab === "pc-do-hoa") {
          return (
            name.includes("i7") ||
            name.includes("i9") ||
            name.includes("ryzen 9") ||
            name.includes("workstation") ||
            name.includes("32gb")
          );
        }
        if (activeTab === "pc-van-phong") {
          return (
            name.includes("i3") ||
            name.includes("i5") ||
            name.includes("vostro") ||
            name.includes("h610") ||
            name.includes("b760")
          );
        }

        // 3. Monitor tabs (24 inch, 27 inch, 32 inch, 22 inch)
        if (activeTab === "24-inch" || activeTab === "24inch") {
          return (
            name.includes("24") ||
            name.includes("23.8") ||
            name.includes("24.5")
          );
        }
        if (activeTab === "27-inch" || activeTab === "27inch") {
          return name.includes("27");
        }
        if (activeTab === "32-inch" || activeTab === "32inch") {
          return name.includes("32");
        }
        if (activeTab === "22-inch" || activeTab === "22inch") {
          return name.includes("22");
        }

        // 4. PSU tabs (850W, 750W, 700W, 650W)
        if (activeTab === "850w")
          return name.includes("850w") || name.includes("850");
        if (activeTab === "750w")
          return name.includes("750w") || name.includes("750");
        if (activeTab === "700w")
          return name.includes("700w") || name.includes("700");
        if (activeTab === "650w")
          return name.includes("650w") || name.includes("650");

        // 5. Mainboard tabs (B760, Z790, B650)
        if (activeTab === "b760") return name.includes("b760");
        if (activeTab === "z790") return name.includes("z790");
        if (activeTab === "b650") return name.includes("b650");

        return cat.includes(activeTab) || name.includes(activeTab);
      })
      .slice(0, 4);
  }, [activeTab, tabs.length, products]);

  const getProductImage = (item) => {
    if (item.thumbnail && item.thumbnail.startsWith("http"))
      return item.thumbnail;
    if (item.thumbnail) return `https://zcomputer.vn${item.thumbnail}`;
    if (item.images && item.images.length > 0) {
      if (item.images[0].startsWith("http")) return item.images[0];
      return `https://zcomputer.vn${item.images[0]}`;
    }
    if (item.image && item.image.startsWith("http")) return item.image;
    return "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
  };

  return (
    <section className="bg-white p-5 sm:p-7 md:p-8 rounded-[2.5rem] border-[3px] md:border-4 border-[#eb1c24] shadow-md space-y-5 mb-10 sm:mb-14 md:mb-16">
      {/* Box Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            {title}
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#eb1c24] rounded-full mt-1.5 shadow-xs"></div>
        </div>

        {/* Filter Pills (chỉ hiển thị nếu danh mục có tabs) */}
        {tabs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.slug;
              return (
                <button
                  key={tab.slug}
                  onClick={() => setActiveTab(tab.slug)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#eb1c24] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        <Link
          href={`/product?category=${mainSlug}`}
          className="text-xs font-bold text-[#eb1c24] hover:underline flex items-center gap-1 self-end lg:self-auto shrink-0"
        >
          <span>Xem tất cả</span> <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Products Grid or Empty Fallback */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm font-medium">
          Đang cập nhật thêm sản phẩm thuộc mục này...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4.5">
          {filteredProducts.map((item) => {
            const discountPercent =
              item.discountPercent ||
              (item.originalPrice > item.price
                ? Math.round(
                    ((item.originalPrice - item.price) / item.originalPrice) *
                      100,
                  )
                : 5);
            const originalPrice =
              item.originalPrice || Math.round(item.price * 1.05);
            const imgSrc = getProductImage(item);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:border-[#eb1c24] hover:shadow-[0_12px_28px_rgba(235,28,36,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative p-3"
              >
                {/* Product Image + 'Xem chi tiết ->' hover button */}
                <Link
                  href={`/product/${item.slug || item._id}`}
                  className="block relative aspect-square w-full rounded-xl overflow-hidden border-2 border-red-500 mb-3 bg-white group/img p-2"
                >
                  {/* Top Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-0 left-0 z-20 pointer-events-none">
                      <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded-tl-[10px] rounded-br-[8px] shadow-xs">
                        Giảm {discountPercent}%
                      </span>
                    </div>
                  )}

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

                  {/* Center Hover Pill - Chính giữa ảnh */}
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover/img:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <span className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover:scale-100 group-hover/img:scale-100 transition-all duration-300 whitespace-nowrap">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#eb1c24]" />
                    </span>
                  </div>

                  {/* Bottom Brand Mark */}
                  <div className="absolute bottom-1 left-2 opacity-80 pointer-events-none">
                    <span className="text-[9px] font-black text-[#eb1c24] tracking-tight">
                      ZCOMPUTER.VN
                    </span>
                  </div>
                </Link>

                {/* Brand & Action Icons */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                    {item.brand || "ZCOMPUTER"}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400">
                    <button
                      className="hover:text-gray-700 cursor-pointer transition-colors"
                      title="So sánh"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <button
                      className="hover:text-red-500 cursor-pointer transition-colors"
                      title="Yêu thích"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={`/product/${item.slug || item._id}`}
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

                {/* Specs 2x2 Grid */}
                <div className="bg-gray-50 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-[10px] text-gray-600 mb-3 border border-gray-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Cpu className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">Intel / AMD Ryzen</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">16GB / 32GB RAM</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <CircuitBoard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">GeForce RTX GPU</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <HardDrive className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">SSD NVMe Siêu Tốc</span>
                  </div>
                </div>

                {/* Views & Add button */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 48} lượt xem</span>
                  </span>
                  <button
                    onClick={() =>
                      dispatch(addToCart({ product: item, quantity: 1 }))
                    }
                    className="text-[#eb1c24] font-bold hover:underline cursor-pointer"
                  >
                    + Mua ngay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
