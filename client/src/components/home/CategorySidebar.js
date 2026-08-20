"use client";

import Link from "next/link";
import {
  Laptop,
  Monitor,
  Mouse,
  Keyboard,
  Server,
  Cpu,
  Zap,
  CircuitBoard,
  HardDrive,
  MemoryStick,
  Fan,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function CategorySidebar() {
  const categories = [
    {
      name: "Laptop Cũ",
      slug: "laptop-cu",
      icon: Laptop,
      hasSub: true,
      subGroups: [
        {
          title: "Laptop Gaming",
          slug: "laptop-gaming",
          items: [
            "Laptop Dell",
            "Laptop Lenovo",
            "Laptop Asus",
            "Laptop Acer",
            "Laptop MSI",
            "Laptop HP",
            "Laptop Gigabyte",
            "Laptop Razer",
          ],
        },
        {
          title: "Laptop Văn phòng",
          slug: "laptop-van-phong",
          items: [
            "Laptop Dell",
            "Laptop Lenovo",
            "Laptop HP",
            "Laptop Acer",
            "Laptop Asus",
            "Laptop MSI",
            "Laptop LG",
            "Laptop Surface",
          ],
        },
      ],
    },
    {
      name: "PC Cũ",
      slug: "pc-cu",
      icon: Monitor,
      hasSub: false,
    },
    {
      name: "Chuột",
      slug: "chuot",
      icon: Mouse,
      hasSub: false,
    },
    {
      name: "Bàn phím",
      slug: "ban-phim",
      icon: Keyboard,
      hasSub: false,
    },
    {
      name: "Màn Hình",
      slug: "man-hinh",
      icon: Monitor,
      hasSub: true,
      subGroups: [
        {
          title: "Kích Thước Màn Hình",
          slug: "man-hinh",
          items: [
            "Màn hình 22 inch",
            "Màn hình 24 inch",
            "Màn hình 27 inch",
            "Màn hình 32 inch",
            "Màn hình cong",
            "Màn hình Gaming",
          ],
        },
      ],
    },
    {
      name: "CASE - Vỏ máy tính",
      slug: "case-vo-may-tinh",
      icon: Server,
      hasSub: false,
    },
    {
      name: "CPU - Bộ vi xử lý",
      slug: "cpu-bo-vi-xu-ly",
      icon: Cpu,
      hasSub: false,
    },
    {
      name: "PSU - Nguồn máy tính",
      slug: "psu-nguon-may-tinh",
      icon: Zap,
      hasSub: true,
      subGroups: [
        {
          title: "Công Suất Nguồn",
          slug: "psu-nguon-may-tinh",
          items: [
            "Nguồn 450W - 550W",
            "Nguồn 600W - 750W",
            "Nguồn 850W - 1000W",
            "Nguồn 80 Plus Bronze",
            "Nguồn 80 Plus Gold",
          ],
        },
      ],
    },
    {
      name: "Mainboard - Bo mạch chủ",
      slug: "mainboard-bo-mach-chu",
      icon: CircuitBoard,
      hasSub: false,
    },
    {
      name: "Ổ cứng HDD - SSD",
      slug: "o-cung-hdd-ssd",
      icon: HardDrive,
      hasSub: false,
    },
    {
      name: "RAM - Bộ nhớ trong",
      slug: "ram-bo-nho-trong",
      icon: MemoryStick,
      hasSub: false,
    },
    {
      name: "Tản nhiệt Cooling",
      slug: "tan-nhiet-cooling",
      icon: Fan,
      hasSub: false,
    },
    {
      name: "VGA - Card màn hình",
      slug: "vga-card-man-hinh",
      icon: Sparkles,
      hasSub: false,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col w-full relative z-30 h-[536px]">
      <div className="relative bg-white shadow-xs border border-t-0 border-gray-200/90 py-1 w-full h-full flex flex-col justify-between rounded-b-2xl">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.slug} className="group static flex-1 flex flex-col justify-center" tabIndex={0}>
              <div className="px-2 py-0.5 h-full flex items-center">
                <Link
                  href={`/product?category=${cat.slug}`}
                  className="flex w-full items-center justify-between px-3 py-1.5 transition-all duration-200 rounded-lg text-gray-700 hover:bg-[#eb1c24] hover:text-white group-hover:bg-[#eb1c24] group-hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    <span className="text-[13px] font-bold group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  {cat.hasSub && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </Link>
              </div>

              {/* Flyout Submenu - Dính liền ngay bên cạnh dòng danh mục đang rê chuột */}
              {cat.hasSub && cat.subGroups && (
                <div
                  className={`opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-full top-0 ${
                    cat.subGroups.length > 1 ? "w-[520px]" : "w-[280px]"
                  } bg-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] border border-gray-200/90 z-50 rounded-2xl transition-all duration-200 p-4 sm:p-5 flex items-start gap-6 ml-0.5`}
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-4 w-full items-start">
                    {cat.subGroups.map((group) => (
                      <div key={group.title} className="flex flex-col min-w-[200px] flex-1">
                        <Link
                          href={`/product?category=${group.slug}`}
                          className="font-bold text-gray-900 mb-2.5 hover:text-[#eb1c24] transition-colors text-[13px] border-b pb-1.5 border-red-100 uppercase"
                        >
                          {group.title}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {group.items.map((brand) => (
                            <Link
                              key={brand}
                              href={`/product?search=${encodeURIComponent(brand)}`}
                              className="group/link text-xs font-semibold text-gray-600 hover:text-[#eb1c24] hover:bg-red-50 hover:translate-x-1 px-2.5 py-1 rounded-md transition-all flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover/link:bg-[#eb1c24] transition-all shrink-0"></span>
                              {brand}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
