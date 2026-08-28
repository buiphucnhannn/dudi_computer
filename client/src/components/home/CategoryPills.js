"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { categoryAPI } from "@/lib/api";

const BG_COLORS = [
  "bg-pink-100/90",
  "bg-blue-100/90",
  "bg-green-100/90",
  "bg-purple-100/90",
  "bg-orange-100/90",
  "bg-teal-100/90",
  "bg-cyan-100/90",
  "bg-red-100/90",
  "bg-indigo-100/90",
  "bg-amber-100/90",
];

const DEFAULT_CATEGORY_ICONS = {
  laptop: "https://zcomputer.vn/categories/icon1.png",
  pc: "https://zcomputer.vn/categories/icon2.png",
  chuot: "https://zcomputer.vn/categories/icon3.png",
  "ban-phim": "https://zcomputer.vn/categories/icon4.png",
  "man-hinh": "https://zcomputer.vn/categories/icon5.png",
  "case-vo-may-tinh": "https://zcomputer.vn/categories/icon6.png",
  "cpu-bo-vi-xu-ly": "https://zcomputer.vn/categories/icon7.png",
  "psu-nguon-may-tinh": "https://zcomputer.vn/categories/icon8.png",
  "mainboard-bo-mach-chu": "https://zcomputer.vn/categories/icon9.png",
  "o-cung-hdd-ssd": "https://zcomputer.vn/categories/icon10.png",
  "ram-bo-nho-trong": "https://zcomputer.vn/categories/icon11.png",
  "tan-nhiet-cooling": "https://cdn-icons-png.flaticon.com/512/912/912316.png",
  "vga-card-man-hinh": "https://cdn-icons-png.flaticon.com/512/912/912300.png",
};

// Khi chưa mở rộng: 7 danh mục đầu tiên
const UNEXPANDED_ITEMS = [
  { name: "Laptop", slug: "laptop", icon: "https://zcomputer.vn/categories/icon1.png", bgColor: "bg-pink-100/90" },
  { name: "PC", slug: "pc", icon: "https://zcomputer.vn/categories/icon2.png", bgColor: "bg-blue-100/90" },
  { name: "Chuột", slug: "chuot", icon: "https://zcomputer.vn/categories/icon3.png", bgColor: "bg-green-100/90" },
  { name: "Bàn phím", slug: "ban-phim", icon: "https://zcomputer.vn/categories/icon4.png", bgColor: "bg-purple-100/90" },
  { name: "Màn hình máy tính", slug: "man-hinh", icon: "https://zcomputer.vn/categories/icon5.png", bgColor: "bg-orange-100/90" },
  { name: "CASE - Vỏ máy tính", slug: "case-vo-may-tinh", icon: "https://zcomputer.vn/categories/icon6.png", bgColor: "bg-teal-100/90" },
  { name: "CPU - Bộ vi xử lý", slug: "cpu-bo-vi-xu-ly", icon: "https://zcomputer.vn/categories/icon7.png", bgColor: "bg-cyan-100/90" },
];

// Khi mở rộng: HÀNG 1 gồm ĐÚNG 10 DANH MỤC
const EXPANDED_ROW_1 = [
  { name: "Laptop", slug: "laptop", icon: "https://zcomputer.vn/categories/icon1.png", bgColor: "bg-pink-100/90" },
  { name: "PC", slug: "pc", icon: "https://zcomputer.vn/categories/icon2.png", bgColor: "bg-blue-100/90" },
  { name: "Chuột", slug: "chuot", icon: "https://zcomputer.vn/categories/icon3.png", bgColor: "bg-green-100/90" },
  { name: "Bàn phím", slug: "ban-phim", icon: "https://zcomputer.vn/categories/icon4.png", bgColor: "bg-purple-100/90" },
  { name: "Màn hình máy tính", slug: "man-hinh", icon: "https://zcomputer.vn/categories/icon5.png", bgColor: "bg-orange-100/90" },
  { name: "CASE - Vỏ máy tính", slug: "case-vo-may-tinh", icon: "https://zcomputer.vn/categories/icon6.png", bgColor: "bg-teal-100/90" },
  { name: "CPU - Bộ vi xử lý", slug: "cpu-bo-vi-xu-ly", icon: "https://zcomputer.vn/categories/icon7.png", bgColor: "bg-cyan-100/90" },
  { name: "PSU - Nguồn máy tính", slug: "psu-nguon-may-tinh", icon: "https://zcomputer.vn/categories/icon8.png", bgColor: "bg-red-100/90" },
  { name: "Mainboard - Bo mạch chủ", slug: "mainboard-bo-mach-chu", icon: "https://zcomputer.vn/categories/icon9.png", bgColor: "bg-cyan-100/90" },
  { name: "Ổ cứng HDD - SSD", slug: "o-cung-hdd-ssd", icon: "https://zcomputer.vn/categories/icon10.png", bgColor: "bg-teal-100/90" },
];

// Khi mở rộng: HÀNG 2 gồm 3 DANH MỤC (RAM, Tản nhiệt, VGA) nằm ở cột 4, 5, 6 và Nút Thu Gọn ở cột 7
const EXPANDED_ROW_2 = [
  { name: "RAM - Bộ nhớ trong", slug: "ram-bo-nho-trong", icon: "https://zcomputer.vn/categories/icon11.png", bgColor: "bg-green-100/90" },
  { name: "Tản nhiệt Cooling", slug: "tan-nhiet-cooling", icon: "https://cdn-icons-png.flaticon.com/512/912/912316.png", bgColor: "bg-blue-100/90" },
  { name: "VGA - Card màn hình", slug: "vga-card-man-hinh", icon: "https://cdn-icons-png.flaticon.com/512/912/912300.png", bgColor: "bg-teal-100/90" },
];

export default function CategoryPills({ activeCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          setDbCategories(list);
        }
      })
      .catch(() => {});
  }, []);

  const { unexpandedList, expandedRow1, expandedRow2 } = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return {
        unexpandedList: UNEXPANDED_ITEMS,
        expandedRow1: EXPANDED_ROW_1,
        expandedRow2: EXPANDED_ROW_2,
      };
    }

    const activeList = dbCategories
      .filter((c) => c.isActive !== false)
      .map((c, idx) => ({
        name: c.name,
        slug: c.slug,
        icon:
          c.image ||
          c.icon ||
          DEFAULT_CATEGORY_ICONS[c.slug] ||
          DEFAULT_CATEGORY_ICONS[c.pcPartType] ||
          "https://zcomputer.vn/categories/icon1.png",
        bgColor: BG_COLORS[idx % BG_COLORS.length],
      }));

    return {
      unexpandedList: activeList.slice(0, 7),
      expandedRow1: activeList.slice(0, 10),
      expandedRow2: activeList.slice(10, 13),
    };
  }, [dbCategories]);

  return (
    <div className="w-full py-1 select-none transition-all duration-300">
      {/* ================= 1. TRẠNG THÁI CHƯA MỞ RỘNG (7 Danh Mục + Nút Xem Thêm) ================= */}
      {!isExpanded && (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-4 items-start justify-items-center animate-fadeIn">
          {unexpandedList.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/product?category=${c.slug}`}
                onClick={() => onSelectCategory && onSelectCategory(c.slug)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer w-full max-w-[95px] focus:outline-none transition-transform active:scale-95"
              >
                <div
                  className={`w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] md:w-[60px] md:h-[60px] rounded-full ${c.bgColor} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 overflow-hidden p-2 sm:p-2.5 shadow-2xs ${
                    isActive ? "ring-2.5 ring-[#eb1c24] scale-105" : ""
                  }`}
                >
                  <Image
                    src={c.icon}
                    alt={c.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11.5px] sm:text-[12px] md:text-[12.5px] text-gray-800 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[30px] flex items-center justify-center">
                  {c.name}
                </span>
              </Link>
            );
          })}

          {/* Nút Xem Thêm */}
          <button
            onClick={() => setIsExpanded(true)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer w-full max-w-[95px] focus:outline-none transition-transform active:scale-95"
          >
            <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] md:w-[60px] md:h-[60px] rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 shadow-2xs border border-gray-200">
              <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#eb1c24] transition-colors" />
            </div>
            <span className="text-[11.5px] sm:text-[12px] md:text-[12.5px] text-gray-800 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[30px] flex items-center justify-center">
              Xem thêm
            </span>
          </button>
        </div>
      )}

      {/* ================= 2. TRẠNG THÁI ĐÃ MỞ RỘNG (HÀNG 1: 10 CỘT, HÀNG 2: 3 MỤC + NÚT THU GỌN Ở CỘT 4-7) ================= */}
      {isExpanded && (
        <div className="space-y-5 sm:space-y-6 animate-fadeIn">
          {/* HÀNG 1: ĐỦ 10 DANH MỤC TRÊN 1 DÒNG DUY NHẤT */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-4 items-start justify-items-center">
            {expandedRow1.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/product?category=${c.slug}`}
                  onClick={() => onSelectCategory && onSelectCategory(c.slug)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer w-full max-w-[88px] focus:outline-none transition-transform active:scale-95"
                >
                  <div
                    className={`w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] md:w-[56px] md:h-[56px] rounded-full ${c.bgColor} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 overflow-hidden p-2 sm:p-2 shadow-2xs ${
                      isActive ? "ring-2.5 ring-[#eb1c24] scale-105" : ""
                    }`}
                  >
                    <Image
                      src={c.icon}
                      alt={c.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] sm:text-[11.5px] md:text-[12px] text-gray-800 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[28px] flex items-center justify-center">
                    {c.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* HÀNG 2: 3 DANH MỤC (RAM, Tản nhiệt, VGA) + NÚT THU GỌN */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-x-1 sm:gap-x-2 md:gap-x-3 gap-y-4 items-start justify-items-center">
            {/* 3 Cột đầu để trống trên Desktop để bắt đầu từ Cột 4 (dưới Bàn phím) */}
            <div className="hidden md:block w-full max-w-[88px]"></div>
            <div className="hidden md:block w-full max-w-[88px]"></div>
            <div className="hidden md:block w-full max-w-[88px]"></div>

            {/* Cột 4: RAM | Cột 5: Tản nhiệt | Cột 6: VGA */}
            {expandedRow2.map((c) => {
              const isActive = activeCategory === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/product?category=${c.slug}`}
                  onClick={() => onSelectCategory && onSelectCategory(c.slug)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer w-full max-w-[88px] focus:outline-none transition-transform active:scale-95"
                >
                  <div
                    className={`w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] md:w-[56px] md:h-[56px] rounded-full ${c.bgColor} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 overflow-hidden p-2 sm:p-2 shadow-2xs ${
                      isActive ? "ring-2.5 ring-[#eb1c24] scale-105" : ""
                    }`}
                  >
                    <Image
                      src={c.icon}
                      alt={c.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] sm:text-[11.5px] md:text-[12px] text-gray-800 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[28px] flex items-center justify-center">
                    {c.name}
                  </span>
                </Link>
              );
            })}

            {/* Cột 7: Nút Thu Gọn (dưới CPU) */}
            <button
              onClick={() => setIsExpanded(false)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer w-full max-w-[88px] focus:outline-none transition-transform active:scale-95"
            >
              <div className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] md:w-[56px] md:h-[56px] rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 shadow-2xs border border-gray-200">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[11px] sm:text-[11.5px] md:text-[12px] text-gray-800 text-center font-bold leading-tight min-h-[28px] flex items-center justify-center">
                Thu gọn
              </span>
            </button>

            {/* 3 Cột cuối để trống */}
            <div className="hidden md:block w-full max-w-[88px]"></div>
            <div className="hidden md:block w-full max-w-[88px]"></div>
            <div className="hidden md:block w-full max-w-[88px]"></div>
          </div>
        </div>
      )}
    </div>
  );
}
