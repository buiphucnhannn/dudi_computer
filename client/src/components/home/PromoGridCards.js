"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";

const DEFAULT_PROMO_CARDS = [
  {
    title: "Back to school",
    link: "/back-to-school",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241558898-515012004.webp",
  },
  {
    title: "Thu cũ đổi mới",
    link: "/trade-in",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241574331-418008867.webp",
  },
  {
    title: "Giới thiệu bạn bè",
    link: "/referral",
    imageUrl: "https://zcomputer.vn/uploads/image-1783241586922-863037014.webp",
  },
];

export default function PromoGridCards() {
  const [promoCards, setPromoCards] = useState(DEFAULT_PROMO_CARDS);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerAPI.getByPosition("promo_grid");
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPromoCards(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi tải banner promo_grid:", err);
      }
    };
    loadBanners();
  }, []);

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
          <svg
            className="w-4 h-4 text-[#1877F2] fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Nhắn tin Fanpage</span>
        </a>
      </div>

      {/* Cột phải: Các Banner Khuyến mãi được chia đều cột với aspect ratio 3/2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 items-stretch">
        {promoCards.map((card, idx) => {
          const isHidden = card.isActive === false || card.isDefaultFallback;
          if (isHidden) {
            return (
              <Link
                key={card._id || idx}
                href="/product"
                className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-all hover:scale-[1.01] block bg-gradient-to-br from-[#18191c] via-[#0f1115] to-[#1e0f11] aspect-[3/2] w-full border border-red-900/30 p-4 sm:p-5 flex flex-col justify-between relative group select-none"
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2.5 z-10">
                  <img
                    src="/images/dudi/dudisoftware4.png"
                    alt="DUDI SOFTWARE Logo"
                    className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-md rounded-xl"
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

          if (card.link && card.link.trim()) {
            return (
              <Link
                key={card._id || idx}
                href={card.link.trim()}
                className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 aspect-[3/2] w-full cursor-pointer"
              >
                <img
                  src={card.imageUrl}
                  alt={card.title || `Khuyến mãi ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src = "/banner.webp";
                  }}
                />
              </Link>
            );
          }

          return (
            <div
              key={card._id || idx}
              className="rounded-2xl overflow-hidden shadow-xs block bg-gray-100 aspect-[3/2] w-full cursor-default select-none"
            >
              <img
                src={card.imageUrl}
                alt={card.title || `Khuyến mãi ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = "/banner.webp";
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
