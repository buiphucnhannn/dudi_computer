"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { bannerAPI } from "@/lib/api";
import { handleImageError, BANNER_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { optimizeImageUrl } from "@/lib/imageOptimizer";

// Ảnh placeholder tĩnh — hiển thị NGAY LẬP TỨC trong khi đợi API
// Đây là LCP candidate: browser nhìn thấy ngay từ HTML đầu tiên, không cần đợi JS
const STATIC_PLACEHOLDERS = [
  { src: "/banners/promo_bts.webp", alt: "Khuyến mãi Back To School", link: "/back-to-school" },
  { src: "/banners/promo_referral.webp", alt: "Giới thiệu bạn bè nhận quà", link: "/referral" },
  { src: "/banners/promo_tradein.webp", alt: "Thu cũ đổi mới ưu đãi", link: "/trade-in" },
];

export default function PromoGridCards() {
  const [promoCards, setPromoCards] = useState(null); // null = chưa load xong (hiện placeholder)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerAPI.getByPosition("promo_grid");
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPromoCards(res.data.data);
        } else {
          setPromoCards([]); // API trả về rỗng → giữ placeholder
        }
      } catch (err) {
        setPromoCards([]); // Lỗi API → giữ placeholder
      }
    };
    loadBanners();
  }, []);

  // Render ngay placeholder trước khi API trả về (LCP image có thể discover ngay)
  const renderBannerCards = () => {
    // Chưa load xong → hiện ảnh tĩnh từ public/ để LCP discoverable ngay
    if (promoCards === null) {
      return STATIC_PLACEHOLDERS.map((p, idx) => (
        <Link
          key={idx}
          href={p.link}
          className="relative rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 aspect-[3/2] w-full cursor-pointer"
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority={idx === 0}
            fetchPriority={idx === 0 ? "high" : "auto"}
            loading={idx === 0 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </Link>
      ));
    }

    // API đã trả về rỗng hoặc lỗi → giữ ảnh placeholder tĩnh
    if (promoCards.length === 0) {
      return STATIC_PLACEHOLDERS.map((p, idx) => (
        <Link
          key={idx}
          href={p.link}
          className="relative rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 aspect-[3/2] w-full cursor-pointer"
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority={idx === 0}
            fetchPriority={idx === 0 ? "high" : "auto"}
            loading={idx === 0 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </Link>
      ));
    }

    // API trả về đủ dữ liệu → render banner thật từ DB
    return promoCards.map((card, idx) => {
      const isHidden = card.isActive === false || card.isDefaultFallback;
      if (isHidden) {
        return (
          <Link
            key={card._id || idx}
            href="/product"
            className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-all hover:scale-[1.01] block bg-gradient-to-br from-[#18191c] via-[#0f1115] to-[#1e0f11] aspect-[3/2] w-full border border-red-900/30 p-4 sm:p-5 flex flex-col justify-between relative group select-none"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2.5 z-10">
              <Image
                src="/images/dudi/dudisoftware4.webp"
                alt="DUDI SOFTWARE Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md rounded-xl"
                onError={handleImageError}
              />
              <div>
                <span className="text-[12px] font-black uppercase tracking-wider text-white block group-hover:text-red-400 transition-colors">
                  DUDI SOFTWARE
                </span>
                <span className="text-[10px] text-red-300/80 font-bold block">
                  PC GAMING • LAPTOP • GEAR
                </span>
              </div>
            </div>
            <div className="z-10">
              <div className="inline-block px-2 py-0.5 rounded-md bg-red-950/60 border border-red-800/40 text-red-300 text-[9.5px] font-bold mb-1">
                🌟 Ưu đãi đang cập nhật
              </div>
              <h4 className="text-xs sm:text-[13px] font-black text-white leading-snug">
                Khám phá toàn bộ sản phẩm chính hãng
              </h4>
            </div>
          </Link>
        );
      }

      const optimizedImg = optimizeImageUrl(card.imageUrl || BANNER_FALLBACK_IMAGE, { width: 640 });

      if (card.link && card.link.trim()) {
        return (
          <Link
            key={card._id || idx}
            href={card.link.trim()}
            className="relative rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 aspect-[3/2] w-full cursor-pointer"
          >
            <Image
              src={optimizedImg}
              alt={card.title || `Khuyến mãi ${idx + 1}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "auto"}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center"
              onError={(e) => handleImageError(e, BANNER_FALLBACK_IMAGE)}
            />
          </Link>
        );
      }

      return (
        <div
          key={card._id || idx}
          className="relative rounded-2xl overflow-hidden shadow-xs block bg-gray-100 aspect-[3/2] w-full cursor-default select-none"
        >
          <Image
            src={optimizedImg}
            alt={card.title || `Khuyến mãi ${idx + 1}`}
            fill
            priority={idx === 0}
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : "auto"}
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-center"
            onError={(e) => handleImageError(e, BANNER_FALLBACK_IMAGE)}
          />
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch">
      {/* Cột trái: Card Tư vấn BUILD PC GAMING */}
      <div className="bg-gradient-to-br from-[#eb1c24] to-[#b91c1c] text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col justify-between group h-full min-h-[140px]">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-red-100">
              Tư vấn miễn phí 24/7
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black leading-tight mb-2 text-white drop-shadow-xs">
            BUILD PC GAMING
            <br />
            <span className="text-yellow-300">NHẬN QUÀ KHỦNG</span>
          </h2>
        </div>
        <a
          href="https://www.facebook.com/dudi.websitechuyennghiep"
          target="_blank"
          rel="noreferrer"
          className="bg-white text-[#eb1c24] font-bold text-xs px-4 py-2 rounded-lg w-fit shadow-xs group-hover:bg-yellow-400 group-hover:text-red-900 transition-colors flex items-center gap-2 mt-2"
        >
          <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Nhắn tin Fanpage</span>
        </a>
      </div>

      {/* Cột phải: 3 Banner (hiện ngay ảnh tĩnh trước, thay bằng API data sau) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 items-stretch">
        {renderBannerCards()}
      </div>
    </div>
  );
}
