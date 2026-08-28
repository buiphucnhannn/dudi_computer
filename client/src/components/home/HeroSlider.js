import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";
import { handleImageError, BANNER_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { optimizeImageUrl } from "@/lib/imageOptimizer";

const DEFAULT_BANNERS = [
  { imageUrl: "https://zcomputer.vn/uploads/image-1784730915598-869631355.webp", link: "/product" },
  { imageUrl: "https://zcomputer.vn/uploads/image-1784727646608-314735893.webp", link: "/product" },
  { imageUrl: "https://zcomputer.vn/uploads/image-1784723786956-517954066.webp", link: "/installment-guide" },
  { imageUrl: "https://zcomputer.vn/uploads/image-1785249221437-528368707.webp", link: "/product" },
  { imageUrl: "https://zcomputer.vn/uploads/image-1784731172192-558618536.webp", link: "/product" },
  { imageUrl: "https://zcomputer.vn/uploads/image-1784727158263-712835383.webp", link: "/warranty-policy" },
];

export default function HeroSlider() {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  // Fetch dynamic banners from backend API
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerAPI.getByPosition("hero_slider");
        if (res.data && Array.isArray(res.data.data)) {
          if (res.data.data.length > 0) {
            setBanners(res.data.data);
          } else {
            // Khi toàn bộ slide bị ẩn, hiển thị 1 slide thương hiệu DUDI SOFTWARE
            setBanners([
              {
                _id: "default_dudi_brand",
                title: "DUDI SOFTWARE - PC & Laptop Gaming",
                link: "/product",
                isHidden: true,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải banner slider:", err);
      }
    };
    loadBanners();
  }, []);

  const totalBanners = banners.length || DEFAULT_BANNERS.length;

  // Tự động chuyển slide sau 4s với hiệu ứng mờ dần xuất hiện (Cross-fade)
  useEffect(() => {
    if (isHovered || isDragging || totalBanners <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalBanners);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, totalBanners]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? totalBanners - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % totalBanners);
  };

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Pointer drag/swipe for both mouse and touch
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    hasMovedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 8) {
      hasMovedRef.current = true;
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - startXRef.current;
    if (diff < -35) {
      nextSlide();
    } else if (diff > 35) {
      prevSlide();
    }
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleSlideClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          setIsDragging(false);
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative rounded-2xl overflow-hidden shadow-xs bg-[#050505] aspect-[2/1] w-full h-full group select-none cursor-grab active:cursor-grabbing touch-pan-y"
    >
      {/* Khung chứa các slide cố định 100% không xê dịch, chuyển đổi bằng hiệu ứng Fade 1500ms mượt mà */}
      <div className="relative w-full h-full">
        {banners.map((item, idx) => {
          const isActive = idx === current;
          const isDefault = item.isDefaultFallback || item.isActive === false;
          const imgSrc = optimizeImageUrl(item.imageUrl || "/images/dudi/dudi_showroom_hero.webp");
          const link = item.link || "/tat-ca-san-pham";

          return (
            <div
              key={item._id || idx}
              className={`absolute inset-0 w-full h-full flex items-center justify-center bg-[#07080a] transition-opacity duration-[1500ms] ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {isDefault ? (
                <Link
                  href="/tat-ca-san-pham"
                  onClick={handleSlideClick}
                  draggable={false}
                  className="w-full h-full bg-gradient-to-r from-[#0a0a0c] via-[#14161d] to-[#0a0a0c] flex items-center justify-center relative overflow-hidden group select-none px-6 py-4"
                >
                  {/* Background showroom image with dark glass overlay */}
                  <img
                    src="/images/dudi/dudi_showroom_hero.webp"
                    alt="DUDI SOFTWARE Showroom"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-35 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    onError={(e) => handleImageError(e, BANNER_FALLBACK_IMAGE)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/70 to-transparent pointer-events-none" />

                  {/* Glowing red accent */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Brand Content Box */}
                  <div className="flex flex-col items-center text-center z-10 space-y-2.5 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/dudi/dudisoftware4.webp"
                        alt="DUDI SOFTWARE Logo"
                        className="w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-md rounded-2xl"
                        onError={handleImageError}
                      />
                      <div className="text-left">
                        <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-none">
                          DUDI SOFTWARE
                        </h2>
                        <span className="text-[10px] sm:text-xs text-red-400 font-extrabold tracking-wider uppercase block mt-1">
                          PC GAMING • LAPTOP • LINH KIỆN CHÍNH HÃNG
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto leading-relaxed text-center">
                      Hệ thống phân phối thiết bị tin học, linh kiện PC & Laptop chính hãng
                    </p>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-black/60 text-slate-200 text-[11px] font-bold border border-white/10 backdrop-blur-xs">
                        🛡️ 100% Chính Hãng
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/60 text-slate-200 text-[11px] font-bold border border-white/10 backdrop-blur-xs">
                        ⚡ Bảo Hành Siêu Tốc
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/60 text-slate-200 text-[11px] font-bold border border-white/10 backdrop-blur-xs">
                        💰 Trả Góp 0%
                      </span>
                    </div>

                    <div className="pt-1.5">
                      <span className="inline-flex items-center gap-2 bg-[#eb1c24] hover:bg-[#d6131b] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all group-hover:scale-105">
                        <span>Khám phá sản phẩm ngay</span>
                        <span>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ) : item.link && item.link.trim() ? (
                <Link
                  href={item.link.trim()}
                  onClick={handleSlideClick}
                  draggable={false}
                  className="block w-full h-full cursor-pointer"
                >
                  <img
                    src={imgSrc || BANNER_FALLBACK_IMAGE}
                    alt={item.title || `DUDI SOFTWARE Banner ${idx + 1}`}
                    className={`w-full h-full object-cover object-center select-none pointer-events-none transition-transform ease-out ${
                      isHovered && isActive ? "scale-105 duration-[6000ms]" : "scale-100 duration-[3000ms]"
                    }`}
                    onError={(e) => handleImageError(e, BANNER_FALLBACK_IMAGE)}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    draggable={false}
                  />
                </Link>
              ) : (
                <div className="block w-full h-full cursor-default select-none">
                  <img
                    src={imgSrc || BANNER_FALLBACK_IMAGE}
                    alt={item.title || `DUDI SOFTWARE Banner ${idx + 1}`}
                    className={`w-full h-full object-cover object-center select-none pointer-events-none transition-transform ease-out ${
                      isHovered && isActive ? "scale-105 duration-[6000ms]" : "scale-100 duration-[3000ms]"
                    }`}
                    onError={(e) => handleImageError(e, BANNER_FALLBACK_IMAGE)}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    draggable={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination dots (Màu xám/trắng siêu nhạt nhòa tinh tế) */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-auto">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(idx);
            }}
            className={`h-2 rounded-full transition-all duration-700 cursor-pointer ${
              idx === current
                ? "w-6 bg-white/40 shadow-none"
                : "w-2 bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
