"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, ArrowLeft } from "lucide-react";

const ROW_1_CATEGORIES = [
  {
    name: "Laptop Cũ",
    slug: "laptop-cu",
    icon: "https://zcomputer.vn/categories/icon1.png",
    bgColor: "bg-pink-100",
  },
  {
    name: "PC Cũ",
    slug: "pc-cu",
    icon: "https://zcomputer.vn/categories/icon2.png",
    bgColor: "bg-blue-100",
  },
  {
    name: "Chuột",
    slug: "chuot",
    icon: "https://zcomputer.vn/categories/icon3.png",
    bgColor: "bg-green-100",
  },
  {
    name: "Bàn phím",
    slug: "ban-phim",
    icon: "https://zcomputer.vn/categories/icon4.png",
    bgColor: "bg-purple-100",
  },
  {
    name: "Màn Hình",
    slug: "man-hinh",
    icon: "https://zcomputer.vn/categories/icon5.png",
    bgColor: "bg-orange-100",
  },
  {
    name: "CASE - Vỏ máy tính",
    slug: "case-vo-may-tinh",
    icon: "https://zcomputer.vn/categories/icon6.png",
    bgColor: "bg-teal-100",
  },
  {
    name: "CPU - Bộ vi xử lý",
    slug: "cpu-bo-vi-xu-ly",
    icon: "https://zcomputer.vn/categories/icon7.png",
    bgColor: "bg-cyan-100",
  },
  {
    name: "PSU - Nguồn máy tính",
    slug: "psu-nguon-may-tinh",
    icon: "https://zcomputer.vn/categories/icon8.png",
    bgColor: "bg-red-100",
  },
];

const ROW_2_CATEGORIES = [
  {
    name: "Mainboard - Bo mạch chủ",
    slug: "mainboard-bo-mach-chu",
    icon: "https://zcomputer.vn/categories/icon9.png",
    bgColor: "bg-blue-100",
  },
  {
    name: "Ổ cứng HDD - SSD",
    slug: "o-cung-hdd-ssd",
    icon: "https://zcomputer.vn/categories/icon10.png",
    bgColor: "bg-teal-100",
  },
  {
    name: "RAM - Bộ nhớ trong",
    slug: "ram-bo-nho-trong",
    icon: "https://zcomputer.vn/categories/icon11.png",
    bgColor: "bg-green-100",
  },
  {
    name: "Tan nhiệt Cooling",
    slug: "tan-nhiet-cooling",
    icon: "https://cdn-icons-png.flaticon.com/512/912/912316.png",
    bgColor: "bg-blue-100",
  },
  {
    name: "VGA - Card màn hình",
    slug: "vga-card-man-hinh",
    icon: "https://cdn-icons-png.flaticon.com/512/912/912300.png",
    bgColor: "bg-green-100",
  },
];

export default function CategoryPills({ activeCategory, onSelectCategory }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4 py-2">
      {/* Row 1 */}
      <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 md:gap-x-8 gap-y-4 items-start">
        {/* Khi chưa mở rộng: 7 items đầu */}
        {(!isExpanded ? ROW_1_CATEGORIES.slice(0, 7) : ROW_1_CATEGORIES).map((c) => {
          const isActive = activeCategory === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => onSelectCategory(c.slug)}
              className="flex flex-col items-center gap-2 group cursor-pointer w-[76px] sm:w-[95px] md:w-[105px] focus:outline-none"
            >
              <div
                className={`w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full ${c.bgColor} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 overflow-hidden p-2.5 md:p-3 shadow-xs ${
                  isActive ? "ring-3 ring-[#eb1c24] scale-105" : ""
                }`}
              >
                <img
                  src={c.icon}
                  alt={c.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-2xs"
                  loading="lazy"
                />
              </div>
              <span className="text-[12px] md:text-[13.5px] text-gray-900 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[32px] flex items-center justify-center">
                {c.name}
              </span>
            </button>
          );
        })}

        {/* Nút Xem thêm khi chưa mở rộng */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex flex-col items-center gap-2 group cursor-pointer w-[76px] sm:w-[95px] md:w-[105px] focus:outline-none"
          >
            <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 shadow-xs border border-gray-200">
              <MoreHorizontal className="w-7 h-7 text-gray-600 group-hover:text-[#eb1c24] transition-colors" />
            </div>
            <span className="text-[12px] md:text-[13.5px] text-gray-900 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[32px] flex items-center justify-center">
              Xem thêm
            </span>
          </button>
        )}
      </div>

      {/* Row 2 (Hiển thị khi đã bấm Xem thêm - Căn giữa trung tâm chuẩn xác) */}
      {isExpanded && (
        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 md:gap-x-8 gap-y-4 items-start pt-1 animate-fadeIn">
          {ROW_2_CATEGORIES.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => onSelectCategory(c.slug)}
                className="flex flex-col items-center gap-2 group cursor-pointer w-[76px] sm:w-[95px] md:w-[105px] focus:outline-none"
              >
                <div
                  className={`w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full ${c.bgColor} flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 overflow-hidden p-2.5 md:p-3 shadow-xs ${
                    isActive ? "ring-3 ring-[#eb1c24] scale-105" : ""
                  }`}
                >
                  <img
                    src={c.icon}
                    alt={c.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-2xs"
                    loading="lazy"
                  />
                </div>
                <span className="text-[12px] md:text-[13.5px] text-gray-900 text-center font-bold leading-tight group-hover:text-[#eb1c24] transition-colors min-h-[32px] flex items-center justify-center">
                  {c.name}
                </span>
              </button>
            );
          })}

          {/* Nút Thu gọn viền đỏ */}
          <button
            onClick={() => setIsExpanded(false)}
            className="flex flex-col items-center gap-2 group cursor-pointer w-[76px] sm:w-[95px] md:w-[105px] focus:outline-none"
          >
            <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full bg-white border-2 border-red-500 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 shadow-xs">
              <ArrowLeft className="w-6 h-6 text-[#eb1c24] group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[12px] md:text-[13.5px] text-gray-900 text-center font-bold leading-tight text-[#eb1c24] min-h-[32px] flex items-center justify-center">
              Thu gọn
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
