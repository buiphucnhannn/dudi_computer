"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bannerAPI } from "@/lib/api";

export default function ProductBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const res = await bannerAPI.getByPosition("product_top");
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0 && list[0]?.isActive !== false) {
          setBanner(list[0]);
        } else {
          setBanner(null);
        }
      } catch (err) {
        console.error("Lỗi tải banner product_top:", err);
      }
    };
    loadBanner();
  }, []);

  if (!banner || !banner.imageUrl) {
    return null;
  }

  return (
    <section className="px-4 py-3 sm:py-4 lg:px-8 xl:px-10">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl shadow-xs border border-slate-200/80 bg-slate-900">
        <Link href={banner.link || "/product"} className="block w-full h-full">
          <img
            src={banner.imageUrl}
            alt={banner.title || "DUDI SOFTWARE"}
            className="block w-full h-[160px] sm:h-[220px] md:h-[260px] lg:h-[290px] object-cover object-center"
            onError={(e) => {
              e.currentTarget.src = "/banner.webp";
            }}
          />
        </Link>
      </div>
    </section>
  );
}
