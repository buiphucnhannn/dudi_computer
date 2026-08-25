"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";

export default function PromotionPopup() {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkPopup = async () => {
      try {
        const res = await bannerAPI.getByPosition("popup");
        const activeBanners = res.data?.data;
        if (Array.isArray(activeBanners) && activeBanners.length > 0) {
          const first = activeBanners[0];
          if (first && first.isActive !== false && isMounted) {
            setPopupData(first);
            setTimeout(() => setOpen(true), 300);
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra popup:", err);
      }
    };
    checkPopup();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!open || !popupData || !popupData.imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[760px] sm:max-w-[800px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -right-2.5 -top-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-[#dc2626] shadow-xl border border-red-100 transition hover:bg-[#dc2626] hover:text-white cursor-pointer"
          aria-label="Đóng popup"
        >
          ×
        </button>

        {/* Banner Content */}
        {popupData.link && popupData.link.trim() ? (
          <Link
            href={popupData.link.trim()}
            onClick={() => setOpen(false)}
            className="block overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] cursor-pointer bg-slate-900 border border-white/10"
          >
            <img
              src={popupData.imageUrl}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              className="block h-auto max-h-[85vh] w-full object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.src = "/back-to-school-popup.webp";
              }}
            />
          </Link>
        ) : (
          <div className="block overflow-hidden rounded-2xl shadow-2xl bg-slate-900 border border-white/10 select-none">
            <img
              src={popupData.imageUrl}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              className="block h-auto max-h-[85vh] w-full object-contain mx-auto"
              onError={(e) => {
                e.currentTarget.src = "/back-to-school-popup.webp";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}