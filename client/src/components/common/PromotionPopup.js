"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";

import { optimizeImageUrl } from "@/lib/imageOptimizer";

export default function PromotionPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            setOpen(true);
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

  if (!mounted || pathname !== "/" || !open || !popupData || !popupData.imageUrl) {
    return null;
  }

  const popupContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200"
      style={{ contain: "layout size style" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[92vw] sm:max-w-[720px] mx-auto flex items-center justify-center"
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

        {/* Banner Content */}
        {popupData.link && popupData.link.trim() ? (
          <Link
            href={popupData.link.trim()}
            onClick={() => setOpen(false)}
            className="block w-full overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] cursor-pointer aspect-[16/10]"
          >
            <img
              src={optimizeImageUrl(popupData.imageUrl, { width: 800 })}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              width={720}
              height={450}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/back-to-school-popup.webp";
              }}
            />
          </Link>
        ) : (
          <div className="block w-full overflow-hidden rounded-2xl shadow-2xl select-none aspect-[16/10]">
            <img
              src={optimizeImageUrl(popupData.imageUrl, { width: 800 })}
              alt={popupData.title || "Khuyến mãi DUDI SOFTWARE"}
              width={720}
              height={450}
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/back-to-school-popup.webp";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
}