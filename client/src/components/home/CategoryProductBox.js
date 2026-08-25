"use client";

import { useState, useEffect, useMemo } from "react";
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
  Flame,
  Monitor,
  Maximize2,
  Zap,
  Sparkles,
  ShieldCheck,
  Wifi,
  Clock,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import {
  getProductDiscountInfo,
  sortProductsByPriority,
  getProductImage,
} from "@/lib/productHelpers";
import { getProductCardBadges } from "@/lib/specParser";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { useCompare } from "@/components/common/CompareContext";
import { useToast } from "@/components/common/ToastContext";
import OrderCheckoutModal from "@/components/cart/OrderCheckoutModal";

export default function CategoryProductBox({
  title,
  mainSlug,
  icon: Icon,
  banner,
  tabs = [],
  products = [],
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.slug || "all");
  const [buyModalItem, setBuyModalItem] = useState(null);
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { addToCompare, isComparing } = useCompare();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleFavorite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isFav = cartItems.some((i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug));
    const prodId = item._id || item.id || item.slug;
    if (isFav) {
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
    setBuyModalItem(item);
  };

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeTab !== "all" && tabs.length > 0) {
      list = products.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const cat = (p.categoryName || "").toLowerCase();
        const catSlug = (p.categorySlug || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();

        // 1. Laptop tabs
        if (activeTab === "laptop-gaming" || activeTab === "gaming") {
          return (
            catSlug.includes("gaming") ||
            name.includes("gaming") ||
            name.includes("legion") ||
            name.includes("tuf") ||
            name.includes("rog") ||
            name.includes("predator") ||
            name.includes("nitro") ||
            name.includes("loq") ||
            name.includes("victus")
          );
        }
        if (activeTab === "laptop-van-phong" || activeTab === "van-phong") {
          return (
            catSlug.includes("van-phong") ||
            name.includes("văn phòng") ||
            name.includes("thinkpad") ||
            name.includes("latitude") ||
            name.includes("zenbook") ||
            name.includes("vivobook") ||
            name.includes("inspiron") ||
            name.includes("pavilion") ||
            name.includes("vostro")
          );
        }
        if (activeTab === "macbook") {
          return (
            catSlug === "macbook" ||
            name.includes("macbook") ||
            brand.includes("apple")
          );
        }

        // 2. PC tabs
        if (activeTab === "pc-gaming") {
          return (
            catSlug === "pc-gaming" ||
            name.includes("gaming") ||
            name.includes("rtx") ||
            name.includes("gtx") ||
            name.includes("rx ")
          );
        }
        if (activeTab === "pc-do-hoa") {
          return (
            catSlug === "pc-do-hoa" ||
            name.includes("i7") ||
            name.includes("i9") ||
            name.includes("ryzen 9") ||
            name.includes("workstation") ||
            name.includes("32gb")
          );
        }
        if (activeTab === "pc-van-phong") {
          return (
            catSlug === "pc-van-phong" ||
            name.includes("văn phòng") ||
            name.includes("i3") ||
            name.includes("i5") ||
            name.includes("vostro") ||
            name.includes("h610")
          );
        }

        // 3. Monitor tabs
        if (activeTab === "24-inch" || activeTab === "24inch") {
          return name.includes("24 inch") || name.includes("24inch") || name.includes("23.8") || name.includes('24"');
        }
        if (activeTab === "27-inch" || activeTab === "27inch") {
          return name.includes("27 inch") || name.includes("27inch") || name.includes('27"');
        }
        if (activeTab === "32-inch" || activeTab === "32inch") {
          return name.includes("32 inch") || name.includes("32inch") || name.includes('32"');
        }

        // 4. PSU tabs
        if (activeTab === "850w") return name.includes("850w") || name.includes("850");
        if (activeTab === "750w") return name.includes("750w") || name.includes("750");
        if (activeTab === "650w") return name.includes("650w") || name.includes("650");

        // 5. Mainboard tabs
        if (activeTab === "b760") return name.includes("b760");
        if (activeTab === "z790") return name.includes("z790");
        if (activeTab === "b650") return name.includes("b650");

        return catSlug.includes(activeTab) || cat.includes(activeTab) || name.includes(activeTab);
      });
    }

    // Sắp xếp ưu tiên: Flash Sale / Hot Sale / Giảm giá nhiều nhất -> Mới nhất -> Nhiều lượt xem
    return sortProductsByPriority(list).slice(0, 4);
  }, [activeTab, tabs.length, products]);

  const renderSpecIcon = (iconName) => {
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
    <section className="bg-white p-5 sm:p-7 md:p-8 rounded-[2.5rem] border-[3px] md:border-4 border-[#eb1c24] shadow-md space-y-5 mb-10 sm:mb-14 md:mb-16">
      {/* Box Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
            {title}
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#eb1c24] rounded-full mt-1.5 shadow-xs"></div>
        </div>

        {/* Filter Pills */}
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
          {filteredProducts.map((item, index) => {
            const {
              price,
              originalPrice,
              discountPercent,
              hasDiscount,
              isFlashSale,
              showHotSaleBadge,
            } = getProductDiscountInfo(item);

            const imgSrc = getProductImage(item);
            const isFav = cartItems.some(
              (i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug)
            );
            const isComp = isComparing(item.slug || item._id || item.id);
            const detailHref = `/product-detail?slug=${encodeURIComponent(
              item.slug || item._id || item.id,
            )}`;

            return (
              <div
                key={item._id || item.id || index}
                className="bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group/card relative"
              >
                {/* Product Image Box */}
                <Link
                  href={detailHref}
                  className="block relative aspect-square w-full rounded-xl overflow-hidden border-2 border-red-500 mb-3 bg-white group/img p-2"
                >
                  {/* Tag Giảm giá góc trên bên trái (Chỉ hiện khi có giảm giá thật) */}
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 z-20 bg-[#eb1c24] text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
                      Giảm {discountPercent}%
                    </div>
                  )}

                  {/* Hot Sale / Flash Sale Tag góc trên bên phải */}
                  {showHotSaleBadge && (
                    <div className="absolute top-2 right-2 z-20 bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>{isFlashSale ? "FLASH SALE" : "HOT SALE"}</span>
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

                  {/* Watermark góc dưới bên trái */}
                  <div className="absolute bottom-1 left-2 pointer-events-none opacity-85 z-20">
                    <span className="text-[9px] font-black text-[#eb1c24] tracking-tight uppercase">
                      DUDI SOFTWARE
                    </span>
                  </div>

                  {/* Center Hover Pill */}
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover/img:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                    <span className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover:scale-100 group-hover/img:scale-100 transition-all duration-300 whitespace-nowrap">
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#eb1c24]" />
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCompare(item);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isComp ? "text-[#eb1c24]" : "hover:text-gray-700"
                      }`}
                      title="So sánh"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    {mounted && !isAdmin && (
                      <button
                        onClick={(e) => handleToggleFavorite(e, item)}
                        className={`cursor-pointer transition-colors ${
                          isFav ? "text-red-500" : "hover:text-red-500"
                        }`}
                        title={isFav ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <Link
                  href={detailHref}
                  className="font-bold text-xs sm:text-[13px] text-gray-900 hover:text-[#eb1c24] group-hover:text-[#eb1c24] line-clamp-2 min-h-[36px] leading-snug mb-2 transition-colors"
                  title={item.name}
                >
                  {item.name}
                </Link>

                {/* Price Box */}
                <div className="mb-2.5">
                  {hasDiscount && (
                    <div className="text-xs text-gray-400 line-through">
                      {formatVND(originalPrice)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-black text-[#eb1c24]">
                      {formatVND(price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] font-black text-[#eb1c24] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Specs 2x2 Grid trích xuất thật từ tiêu đề & thông số Database */}
                {(() => {
                  const badges = getProductCardBadges(item);
                  return (
                    <div className="bg-gray-50 rounded-xl p-2 grid grid-cols-2 gap-1.5 text-[9.5px] sm:text-[10px] text-gray-600 mb-3 border border-gray-100 min-h-[50px]">
                      {badges.map((b, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 truncate"
                          title={b.title || b.label}
                        >
                          {renderSpecIcon(b.icon)}
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
                    <span>{item.views || 48} lượt xem</span>
                  </span>
                  {isAdmin ? (
                    <Link
                      href={detailHref}
                      className="text-slate-800 font-bold hover:underline"
                    >
                      Chi tiết →
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => handleBuyNow(e, item)}
                      className="text-[#eb1c24] font-bold hover:underline cursor-pointer"
                    >
                      + Mua ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Buy Checkout Modal */}
      <OrderCheckoutModal
        isOpen={!!buyModalItem}
        onClose={() => setBuyModalItem(null)}
        product={buyModalItem}
        quantity={1}
      />
    </section>
  );
}
