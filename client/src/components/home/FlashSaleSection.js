"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatVND } from "@/lib/utils";
import {
  getProductDiscountInfo,
  sortProductsByPriority,
  getProductImage,
} from "@/lib/productHelpers";
import { getProductCardBadges, detectProductType, PRODUCT_TYPES } from "@/lib/specParser";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";
import { useCompare } from "@/components/common/CompareContext";
import OrderCheckoutModal from "@/components/cart/OrderCheckoutModal";
import { promotionAPI, productAPI } from "@/lib/api";

export default function FlashSaleSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [buyModalItem, setBuyModalItem] = useState(null);
  const [flashSaleData, setFlashSaleData] = useState(null);
  const [fallbackProducts, setFallbackProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { addToCompare, isComparing } = useCompare();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const getScrollAmount = () => {
    if (!sliderRef.current) return 260;
    const firstCard = sliderRef.current.querySelector(":scope > div");
    if (!firstCard) return sliderRef.current.offsetWidth;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 12; // gap-3 = 12px
    const visibleWidth = sliderRef.current.clientWidth;
    const visibleCount = Math.max(1, Math.floor((visibleWidth + gap) / (cardWidth + gap)));
    return (cardWidth + gap) * visibleCount;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  // Fetch Flash Sale data từ API
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true);
        const response = await promotionAPI.getFlashSale();
        const data = response.data?.data;

        if (data && data.promotion && data.products && data.products.length > 0) {
          setFlashSaleData(data);
          calculateTimeLeft(data.promotion.endDate);
        } else {
          // Fallback: Lấy các sản phẩm có FlashSale / Giảm giá trong Database
          const prodRes = await productAPI.getAll({ limit: 12 });
          const prods = prodRes.data?.data?.products || prodRes.data?.data || [];
          const discounted = prods.filter(
            (p) => p.isFlashSale || p.discountPercent > 0 || p.originalPrice > p.price
          );
          setFallbackProducts(discounted.length > 0 ? discounted : prods.slice(0, 6));

          // Set fake / rolling 24h countdown if no active promotion object
          const midnight = new Date();
          midnight.setHours(23, 59, 59, 999);
          calculateTimeLeft(midnight);
        }
      } catch (error) {
        console.error("Lỗi khi tải Flash Sale:", error);
        setFlashSaleData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  // Hàm tính toán thời gian còn lại
  const calculateTimeLeft = (endDate) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance < 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  // Countdown timer thực tế
  useEffect(() => {
    const targetDate = flashSaleData?.promotion?.endDate || (() => {
      const d = new Date();
      d.setHours(23, 59, 59, 999);
      return d;
    })();

    const timer = setInterval(() => {
      calculateTimeLeft(targetDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleData]);

  const handleToggleCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const isCart = cartItems.some(
      (i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug)
    );
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
    setBuyModalItem(item);
  };

  // Lọc sản phẩm Flash Sale theo Tab và sắp xếp ưu tiên giảm giá nhiều nhất
  const flashSaleItems = useMemo(() => {
    const rawProducts = flashSaleData?.products || fallbackProducts;
    if (!rawProducts || rawProducts.length === 0) return [];

    const list = rawProducts.filter((p) => {
      const prodType = detectProductType(p);

      // Tab PC
      if (activeTab === "pc") {
        return prodType === PRODUCT_TYPES.PC;
      }

      // Tab Laptop
      if (activeTab === "laptop") {
        return prodType === PRODUCT_TYPES.LAPTOP;
      }

      // Tab Màn hình (đã tách riêng, không lẫn Card màn hình)
      if (activeTab === "monitor") {
        return prodType === PRODUCT_TYPES.MONITOR;
      }

      // Tab Linh kiện (Bao gồm VGA/Card màn hình, CPU, RAM, SSD, Mainboard, PSU, Case, Tản nhiệt - KHÔNG chứa PC bộ)
      if (activeTab === "components") {
        return (
          [
            PRODUCT_TYPES.CPU,
            PRODUCT_TYPES.VGA,
            PRODUCT_TYPES.RAM,
            PRODUCT_TYPES.SSD,
            PRODUCT_TYPES.MAINBOARD,
            PRODUCT_TYPES.PSU,
            PRODUCT_TYPES.CASE,
            PRODUCT_TYPES.COOLER,
          ].includes(prodType) && prodType !== PRODUCT_TYPES.PC
        );
      }

      // Tab Gear (Chuột, Bàn phím, Tai nghe, Phụ kiện)
      if (activeTab === "gear") {
        return [
          PRODUCT_TYPES.KEYBOARD,
          PRODUCT_TYPES.MOUSE,
          PRODUCT_TYPES.GEAR,
        ].includes(prodType);
      }

      return true;
    });

    // Sắp xếp: Ưu tiên giảm nhiều nhất trước và giảm dần (% giảm cao nhất, rồi số tiền giảm lớn nhất)
    list.sort((a, b) => {
      const getPercent = (item) => {
        if (item.discountPercent && Number(item.discountPercent) > 0) {
          return Number(item.discountPercent);
        }
        const orig = Number(item.originalPrice || 0);
        const cur = Number(item.price || 0);
        if (orig > cur && orig > 0) {
          return Math.round(((orig - cur) / orig) * 100);
        }
        return 0;
      };

      const getDiscountAmount = (item) => {
        const orig = Number(item.originalPrice || item.price || 0);
        const cur = Number(item.price || 0);
        return orig > cur ? orig - cur : 0;
      };

      const percentDiff = getPercent(b) - getPercent(a);
      if (percentDiff !== 0) return percentDiff;

      return getDiscountAmount(b) - getDiscountAmount(a);
    });

    return list.slice(0, 12);
  }, [activeTab, flashSaleData, fallbackProducts]);

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

  // Loading state
  if (loading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch my-2">
        <div className="bg-gray-100 animate-pulse rounded-2xl h-[280px]"></div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="bg-gray-100 animate-pulse rounded-lg h-8 w-20"></div>
            <div className="bg-gray-100 animate-pulse rounded-lg h-8 w-16"></div>
            <div className="bg-gray-100 animate-pulse rounded-lg h-8 w-20"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-[350px]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const promotion = flashSaleData?.promotion;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch my-2">
      {/* Left Flash Sale Banner Card */}
      <div className="bg-[#eb1c24] text-white p-5 rounded-2xl flex flex-col justify-center items-center text-center shadow-md w-full gap-5">
        <div>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white drop-shadow-xs">
              {promotion?.name || "FLASH SALE"}
            </h2>
          </div>
          <p className="text-xs font-semibold text-red-100 uppercase tracking-widest">
            {promotion?.description || "GIÁ CỰC SỐC MỖI NGÀY"}
          </p>
        </div>

        {/* Countdown Box */}
        <div className="w-full bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
          <div className="text-[11px] font-bold text-red-100 mb-2 uppercase tracking-wider flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Kết thúc sau</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-center">
            {timeLeft?.days > 0 && (
              <>
                <div className="bg-black/40 px-2 py-1.5 rounded-lg min-w-[36px] border border-white/10 shadow-xs">
                  <span className="text-sm font-black block leading-none text-yellow-300">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] text-gray-300 font-medium uppercase mt-0.5 block">
                    Ngày
                  </span>
                </div>
                <span className="font-bold text-yellow-300 text-xs">:</span>
              </>
            )}

            <div className="bg-black/40 px-2 py-1.5 rounded-lg min-w-[36px] border border-white/10 shadow-xs">
              <span className="text-sm font-black block leading-none text-yellow-300">
                {String(timeLeft?.hours || 0).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-300 font-medium uppercase mt-0.5 block">
                Giờ
              </span>
            </div>
            <span className="font-bold text-yellow-300 text-xs">:</span>

            <div className="bg-black/40 px-2 py-1.5 rounded-lg min-w-[36px] border border-white/10 shadow-xs">
              <span className="text-sm font-black block leading-none text-yellow-300">
                {String(timeLeft?.minutes || 0).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-300 font-medium uppercase mt-0.5 block">
                Phút
              </span>
            </div>
            <span className="font-bold text-yellow-300 text-xs">:</span>

            <div className="bg-black/40 px-2 py-1.5 rounded-lg min-w-[36px] border border-white/10 shadow-xs">
              <span className="text-sm font-black block leading-none text-yellow-300">
                {String(timeLeft?.seconds || 0).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-300 font-medium uppercase mt-0.5 block">
                Giây
              </span>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <Link
          href="/product?sort=discount_desc"
          className="bg-white text-[#eb1c24] hover:bg-yellow-300 hover:text-red-700 font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1.5 group cursor-pointer"
        >
          <span>Xem tất cả ưu đãi</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Right Product Grid */}
      <div className="space-y-3 min-w-0">
        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "all"
                ? "bg-[#eb1c24] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("pc")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "pc"
                ? "bg-[#eb1c24] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            PC
          </button>
          <button
            onClick={() => setActiveTab("laptop")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === "laptop"
                ? "bg-[#eb1c24] text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            Laptop
          </button>
        </div>

        {/* Product Cards Row Carousel */}
        {flashSaleItems.length === 0 ? (
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-12 text-gray-400 text-sm">
            Không có sản phẩm {activeTab !== "all" && activeTab.toUpperCase()} trong Flash Sale
          </div>
        ) : (
          <div className="relative group/slider">
            {/* Scroll Left Button */}
            <button
              onClick={scrollLeft}
              className="absolute -left-3.5 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#eb1c24] hover:border-[#eb1c24] hover:scale-110 z-30 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Product Slider Container (1 Row) */}
            <div
              ref={sliderRef}
              className="flex overflow-x-auto gap-3 py-1 px-0.5 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {flashSaleItems.map((item) => {
                const {
                  price,
                  originalPrice,
                  discountPercent,
                  hasDiscount,
                } = getProductDiscountInfo(item);

                const imgSrc = getProductImage(item);
                const isFav = cartItems.some(
                  (i) => (i._id || i.id || i.slug) === (item._id || item.id || item.slug)
                );
                const isComp = isComparing(item.slug || item._id || item.id);
                const detailHref = `/product-detail?slug=${encodeURIComponent(
                  item.slug || item._id || item.id
                )}`;

                return (
                  <div
                    key={item._id || item.id}
                    className="w-[82%] sm:w-[calc((100%-12px)/2)] lg:w-[calc((100%-24px)/3)] shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 shadow-2xs hover:border-[#eb1c24] hover:shadow-[0_12px_28px_rgba(235,28,36,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative p-2.5 sm:p-3"
                  >
                    <div>
                      <Link
                        href={detailHref}
                        className="block relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-red-500/80 mb-3 bg-white group/img p-2"
                      >
                        {/* Tag Giảm giá góc trên bên trái */}
                        {hasDiscount && (
                          <div className="absolute top-0 left-0 z-20 pointer-events-none">
                            <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded-tl-[10px] rounded-br-[8px] shadow-xs">
                              Giảm {discountPercent}%
                            </span>
                          </div>
                        )}

                        {/* Tag HOT SALE góc trên bên phải */}
                        <div className="absolute top-0 right-0 z-20 pointer-events-none">
                          <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2 py-0.5 rounded-tr-[10px] rounded-bl-[8px] flex items-center gap-1 shadow-xs">
                            🔥 FLASH SALE
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

                        {/* Center Hover Pill */}
                        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover/img:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                          <span className="bg-white/95 text-[#eb1c24] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-red-100 flex items-center gap-1.5 transform scale-90 group-hover:scale-100 group-hover/img:scale-100 transition-all duration-300 whitespace-nowrap">
                            <span>Xem chi tiết</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#eb1c24]" />
                          </span>
                        </div>

                        {/* Watermark */}
                        <div className="absolute bottom-1 left-1.5 opacity-80 pointer-events-none z-20">
                          <span className="text-[9px] font-black text-[#eb1c24] tracking-tight uppercase">
                            DUDI SOFTWARE
                          </span>
                        </div>
                      </Link>

                      {/* Brand & Actions */}
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
                            className={`p-1.5 rounded-full transition-all cursor-pointer ${
                              isComp
                                ? "text-[#eb1c24] bg-red-50"
                                : "hover:text-[#eb1c24] hover:bg-gray-100"
                            }`}
                            title="So sánh sản phẩm"
                          >
                            <Scale className="w-[18px] h-[18px]" />
                          </button>

                          {mounted && !isAdmin && (
                            <button
                              onClick={(e) => handleToggleCart(e, item)}
                              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                                isFav
                                  ? "text-[#eb1c24] bg-red-50"
                                  : "hover:text-[#eb1c24] hover:bg-gray-100"
                              }`}
                              title={isFav ? "Đã có trong giỏ hàng" : "Thêm vào giỏ hàng"}
                            >
                              <ShoppingCart className="w-[18px] h-[18px]" />
                            </button>
                          )}
                        </div>
                      </div>

                      <Link href={detailHref} className="block group-hover:text-[#eb1c24] transition-colors">
                        <h3
                          className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug min-h-[34px]"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                      </Link>

                      {/* Price Section */}
                      <div className="pt-1.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-[#eb1c24]">
                            {formatVND(price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through">
                              {formatVND(originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specs Badges from SpecParser */}
                    {(() => {
                      const badges = getProductCardBadges(item);
                      if (!badges || badges.length === 0) return null;
                      return (
                        <div className="bg-gray-50 rounded-lg p-1.5 grid grid-cols-2 gap-1 text-[9.5px] text-gray-600 my-2 border border-gray-100 min-h-[44px]">
                          {badges.slice(0, 4).map((badge, bIdx) => (
                            <div
                              key={bIdx}
                              className="flex items-center gap-1 truncate"
                              title={badge.title || badge.label}
                            >
                              {renderSpecIcon(badge.icon)}
                              <span className="truncate font-medium">{badge.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Views & Add button */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100 mt-2">
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

            {/* Scroll Right Button */}
            <button
              onClick={scrollRight}
              className="absolute -right-3.5 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-white hover:bg-[#eb1c24] hover:border-[#eb1c24] hover:scale-110 z-30 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 focus:outline-none cursor-pointer"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Direct Buy Checkout Modal */}
      <OrderCheckoutModal
        isOpen={!!buyModalItem}
        onClose={() => setBuyModalItem(null)}
        prefilledProduct={buyModalItem}
      />
    </section>
  );
}
