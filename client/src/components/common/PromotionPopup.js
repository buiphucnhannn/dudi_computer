"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";

import Image from "next/image";

export default function PromotionPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  useEffect(() => {
    // CHỈ hiển thị popup quảng cáo khi ở Trang chủ (pathname === "/")
    if (pathname !== "/") return;

    let isMounted = true;
    const checkPopup = async () => {
      try {
        const res = await bannerAPI.getByPosition("popup");
        const activeBanners = res.data?.data;
        if (Array.isArray(activeBanners) && activeBanners.length > 0) {
          const first = activeBanners[0];
          if (first && first.isActive !== false && isMounted) {
            setPopupData(first);
            setTimeout(() => setOpen(true), 600);
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
  }, [pathname]);

  if (pathname !== "/" || !open || !popupData || !popupData.imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[92vw] sm:max-w-[700px] max-h-[85vh] mx-auto flex items-center justify-center rounded-2xl overflow-visible"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute -right-3 -top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-[#dc2626] shadow-2xl border border-red-100 transition-all hover:bg-[#dc2626] hover:text-white hover:scale-110 cursor-pointer"
          aria-label="Đóng popup"
        >
          ×
        </button>

        {/* Banner Content với kích thước cố định ngăn chặn Layout Shift (CLS) */}
        {popupData.link && popupData.link.trim() ? (
          <Link
            href={popupData.link.trim()}
            onClick={() => setOpen(false)}
            className="relative block w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] cursor-pointer bg-slate-900"
          >
            <Image
              src={popupData.imageUrl}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              fill
              sizes="(max-width: 768px) 92vw, 700px"
              className="object-contain rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/back-to-school-popup.webp";
              }}
            />
          </Link>
        ) : (
          <div className="relative block w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl select-none bg-slate-900">
            <Image
              src={popupData.imageUrl}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              fill
              sizes="(max-width: 768px) 92vw, 700px"
              className="object-contain rounded-2xl"
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