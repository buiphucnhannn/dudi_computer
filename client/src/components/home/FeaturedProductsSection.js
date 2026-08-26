"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Scale,
  ShoppingCart,
  Cpu,
  Layers,
  HardDrive,
  CircuitBoard,
  Sparkles,
  Flame,
  Monitor,
  Maximize2,
  Zap,
  ShieldCheck,
  Wifi,
  Clock,
} from "lucide-react";
import { formatVND, smoothScrollBy } from "@/lib/utils";
import {
  getProductDiscountInfo,
  sortProductsByBestSeller,
  getProductImage,
  isProductMatchingCategory,
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

export default function FeaturedProductsSection({ products = [], categories = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [buyModalItem, setBuyModalItem] = useState(null);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const { addToCompare, isComparing } = useCompare();
  const { showToast } = useToast();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return [
        { id: "all", name: "Tất cả" },
        { id: "laptop", name: "Laptop" },
        { id: "pc", name: "Máy Tính Để Bàn (PC)" },
        { id: "linh-kien-pc", name: "Linh Kiện Máy Tính" },
        { id: "man-hinh", name: "Màn hình máy tính" },
        { id: "phu-kien-gear", name: "Phụ Kiện Gear" },
      ];
    }
    const rootCategories = categories.filter((c) => !c.parent);
    return [
      { id: "all", name: "Tất cả" },
      ...rootCategories.map((c) => ({
        id: c.slug,
        name: c.name,
      })),
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (activeTab === "all") return true;
      return isProductMatchingCategory(p, activeTab, categories);
    });

    // Sắp xếp theo Bán chạy nhất (Most sold) -> Max 8 sản phẩm
    return sortProductsByBestSeller(list).slice(0, 8);
  }, [activeTab, products, categories]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const getSingleCardStep = () => {
    if (!sliderRef.current) return 300;
    const firstCard = sliderRef.current.querySelector(":scope > div");
    if (!firstCard) return 300;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 16;
    return cardWidth + gap;
  };

  const scrollLeft = () => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.querySelector(":scope > div");
    if (!firstCard) return;
    const step = firstCard.getBoundingClientRect().width + 16;
    sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!sliderRef.current) return;
    const firstCard = sliderRef.current.querySelector(":scope > div");
    if (!firstCard) return;
    const step = firstCard.getBoundingClientRect().width + 16;
    sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
  };

  const handleToggleCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof item.stock === "number" && item.stock <= 0) {
      showToast({
        title: "Sản phẩm đã hết hàng",
        message: `Sản phẩm "${item.name}" hiện đã hết hàng trong kho.`,
        type: "warning",
      });
      return;
    }
    dispatch(addToCartAsync({ product: item, quantity: 1 }));
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${item.name}" vào giỏ hàng (+1)!`,
      type: "success",
    });
  };

  const handleBuyNow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof item.stock === "number" && item.stock <= 0) {
      showToast({
        title: "Sản phẩm đã hết hàng",
        message: `Sản phẩm "${item.name}" hiện đã hết hàng trong kho.`,
        type: "warning",
      });
      return;
    }
    setBuyModalItem(item);
  };

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
    <section className="bg-gradient-to-b from-amber-100/70 via-amber-50/50 to-yellow-100/60 rounded-[2.5rem] p-4 sm:p-7 md:p-9 border-[3px] md:border-4 border-amber-300 shadow-xl relative overflow-hidden mb-10 sm:mb-14 md:mb-16">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-yellow-400/40 rounded-full blur-[80px] pointer-events-none hidden md:block" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/30 rounded-full blur-[80px] pointer-events-none hidden md:block" />

      <div className="flex flex-col items-center justify-center mb-6 gap-3 relative z-10 w-full text-center">
        <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 uppercase tracking-tight relative inline-block drop-shadow-md py-2 leading-tight">
          SẢN PHẨM NỔI BẬT
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-7 relative z-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${isActive
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40 scale-105"
                : "bg-white/90 text-orange-950 hover:bg-white border border-orange-200/80 shadow-2xs"
                }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="relative group/slider mt-2">
        <button
          onClick={scrollLeft}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white border border-yellow-200 rounded-full shadow-lg flex items-center justify-center text-yellow-600 hover:text-orange-500 hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none cursor-pointer"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 py-2 px-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {filteredProducts.map((item) => {
            const {
              price,
              originalPrice,
              discountPercent,
              hasDiscount,
              isFlashSale,
              showHotSaleBadge,
            } = getProductDiscountInfo(item);

            const isOutOfStock = typeof item.stock === "number" && item.stock <= 0;
            const imgSrc = getProductImage(item);
            const isFav = cartItems.some(
              (i) => (i._id || i.id) === (item._id || item.id)
            );
            const isComp = isComparing(item.slug || item._id || item.id);
            const detailHref = `/product-detail?slug=${encodeURIComponent(
              item.slug || item._id || item.id
            )}`;

            return (
              <div
                key={`featured-${item._id || item.id}`}
                className="w-[82%] min-w-[82%] max-w-[82%] sm:w-[calc((100%-16px)/2)] sm:min-w-[calc((100%-16px)/2)] sm:max-w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)] lg:min-w-[calc((100%-48px)/4)] lg:max-w-[calc((100%-48px)/4)] shrink-0 snap-start bg-white rounded-2xl p-3 sm:p-3.5 border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group/card relative"
              >
                <div>
                  <Link
                    href={detailHref}
                    className="block relative aspect-square w-full rounded-xl overflow-hidden border border-slate-100 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 mb-3 group/img p-3.5 flex items-center justify-center"
                  >
                    {isOutOfStock ? (
                      <div className="absolute top-2 left-2 z-20 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm border border-slate-700">
                        Hết hàng
                      </div>
                    ) : (
                      hasDiscount && (
                        <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-[#eb1c24] to-[#ff4757] text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                          Giảm {discountPercent}%
                        </div>
                      )
                    )}

                    {showHotSaleBadge && (
                      <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>{isFlashSale ? "FLASH SALE" : "HOT SALE"}</span>
                      </div>
                    )}

                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover/img:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
                      }}
                    />

                    <div className="absolute bottom-1.5 left-2 pointer-events-none opacity-85 z-20">
                      <span className="inline-block bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8.5px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
                        DUDI SOFTWARE
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/card:opacity-100 group-hover/img:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                      <span className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover/card:scale-100 transition-all duration-300 whitespace-nowrap">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#eb1c24]" />
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                      {item.brand || "ZCOMPUTER"}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCompare(item);
                        }}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${isComp
                          ? "text-[#eb1c24] bg-red-50"
                          : "hover:text-[#eb1c24] hover:bg-gray-100"
                          }`}
                        title="So sánh sản phẩm"
                      >
                        <Scale className="w-4 h-4" />
                      </button>

                      {mounted && !isAdmin && !isOutOfStock && (
                        <button
                          onClick={(e) => handleToggleCart(e, item)}
                          className={`p-1.5 rounded-full transition-all cursor-pointer ${isFav
                              ? "text-[#eb1c24] bg-red-50"
                              : "hover:text-[#eb1c24] hover:bg-gray-100"
                            }`}
                          title={isFav ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <Link
                    href={detailHref}
                    className="font-bold text-xs sm:text-[13px] text-gray-900 hover:text-[#eb1c24] group-hover/card:text-[#eb1c24] line-clamp-2 min-h-[36px] leading-snug mb-2 transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                  <div className="mb-3">
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
                </div>

                {(() => {
                  const badges = getProductCardBadges(item);
                  return (
                    <div className="bg-gray-50 rounded-xl p-2 grid grid-cols-2 gap-1.5 text-[9.5px] sm:text-[10px] text-gray-600 mb-2 border border-gray-100 min-h-[50px]">
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

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 68} lượt xem</span>
                  </span>
                  {isOutOfStock ? (
                    <span className="text-slate-400 font-semibold">Tạm hết hàng</span>
                  ) : (
                    <button
                      type="button"
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

        <button
          onClick={scrollRight}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white border border-yellow-200 rounded-full shadow-lg flex items-center justify-center text-yellow-600 hover:text-orange-500 hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none cursor-pointer"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <OrderCheckoutModal
        isOpen={!!buyModalItem}
        onClose={() => setBuyModalItem(null)}
        product={buyModalItem}
        quantity={1}
      />
    </section>
  );
}
