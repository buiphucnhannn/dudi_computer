"use client";

import { useState, useEffect, useMemo } from "react";
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
  FolderTree,
} from "lucide-react";
import { categoryAPI } from "@/lib/api";

const STATIC_FALLBACK_CATEGORIES = [
  {
    name: "Laptop",
    slug: "laptop",
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
    name: "PC",
    slug: "pc",
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
    name: "Màn hình máy tính",
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
    hasSub: false,
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

const getSidebarCategoryIcon = (slug = "", name = "", part = "none") => {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (s.includes("laptop") || n.includes("laptop") || s.includes("macbook") || n.includes("macbook")) return Laptop;
  if ((s.includes("pc") || n.includes("pc") || n.includes("máy tính để bàn")) && !s.includes("linh-kien")) return Monitor;
  if (s.includes("man-hinh") || n.includes("màn hình") || part === "monitor") return Monitor;
  if (s.includes("cpu") || n.includes("cpu") || n.includes("vi xử lý") || part === "cpu") return Cpu;
  if (s.includes("vga") || n.includes("vga") || n.includes("card") || part === "vga") return Sparkles;
  if (s.includes("ram") || n.includes("ram") || part === "ram") return MemoryStick;
  if (s.includes("mainboard") || n.includes("bo mạch") || part === "mainboard") return CircuitBoard;
  if (s.includes("o-cung") || n.includes("ổ cứng") || s.includes("ssd") || s.includes("hdd") || part === "ssd" || part === "hdd") return HardDrive;
  if (s.includes("psu") || n.includes("nguồn") || part === "psu") return Zap;
  if (s.includes("case") || n.includes("vỏ máy") || part === "case") return Server;
  if (s.includes("tan-nhiet") || n.includes("tản nhiệt") || part === "cooler") return Fan;
  if (s.includes("chuot") || n.includes("chuột")) return Mouse;
  if (s.includes("ban-phim") || n.includes("bàn phím")) return Keyboard;
  return FolderTree;
};

export default function CategorySidebar() {
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

  const categories = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return STATIC_FALLBACK_CATEGORIES;
    }

    const activeCats = dbCategories.filter((c) => c.isActive !== false);
    const roots = activeCats.filter((c) => !c.parent || c.parent === null);
    const children = activeCats.filter((c) => !!c.parent);

    return roots.map((root) => {
      const myChildren = children.filter(
        (c) => (c.parent?._id || c.parent || "").toString() === root._id.toString()
      );

      const Icon = getSidebarCategoryIcon(root.slug, root.name, root.pcPartType);

      if (myChildren.length === 0) {
        return {
          name: root.name,
          slug: root.slug,
          icon: Icon,
          hasSub: false,
        };
      }

      return {
        name: root.name,
        slug: root.slug,
        icon: Icon,
        hasSub: true,
        subGroups: [
          {
            title: `Danh mục ${root.name}`,
            slug: root.slug,
            items: myChildren.map((ch) => ({
              name: ch.name,
              slug: ch.slug,
            })),
          },
        ],
      };
    });
  }, [dbCategories]);

  return (
    <div className="hidden lg:flex flex-col w-full relative z-30 h-full">
      <div className="relative bg-white shadow-xs border border-t-0 border-gray-200/90 py-1 w-full h-full flex flex-col justify-between rounded-b-2xl">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.slug} className="group relative flex-1 flex flex-col justify-center min-h-0" tabIndex={0}>
              <div className="px-2 py-0.5 h-full flex items-center">
                <Link
                  href={`/tat-ca-san-pham?category=${cat.slug}`}
                  className="flex w-full items-center justify-between px-2.5 xl:px-3 py-1.5 transition-all duration-200 rounded-lg text-gray-700 hover:bg-[#eb1c24] hover:text-white group-hover:bg-[#eb1c24] group-hover:text-white"
                >
                  <div className="flex items-center gap-2 xl:gap-2.5">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
                    <span className="text-[12.5px] xl:text-[13.5px] font-bold group-hover:text-white transition-colors truncate">
                      {cat.name}
                    </span>
                  </div>
                  {cat.hasSub && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors shrink-0" />
                  )}
                </Link>
              </div>

              {/* Flyout Submenu - Dính liền ngay cạnh dòng danh mục đang rê chuột */}
              {cat.hasSub && cat.subGroups && (
                <div
                  className={`opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-full top-0 ${
                    cat.subGroups.length > 1 ? "w-[520px]" : "w-[280px]"
                  } bg-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] border border-gray-200/90 z-50 rounded-2xl transition-all duration-200 p-4 sm:p-5 flex items-start gap-6 ml-1`}
                >
                  <div className="flex flex-wrap gap-x-6 gap-y-4 w-full items-start">
                    {cat.subGroups.map((group) => (
                      <div key={group.title} className="flex flex-col min-w-[200px] flex-1">
                        <Link
                          href={`/tat-ca-san-pham?category=${cat.slug}`}
                          className="font-bold text-gray-900 mb-2.5 hover:text-[#eb1c24] transition-colors text-[13px] border-b pb-1.5 border-red-100 uppercase"
                        >
                          {group.title}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {group.items.map((item, idx) => {
                            const subName = typeof item === "object" ? item.name : item;
                            const subSlug = typeof item === "object" ? item.slug : null;
                            const cleanKeyword = subName
                              .replace(/^Màn\s+hình\s+/i, "")
                              .replace(/^Laptop\s+/i, "")
                              .replace(/^Nguồn\s+/i, "")
                              .trim();
                            const targetUrl = subSlug
                              ? `/tat-ca-san-pham?category=${subSlug}`
                              : `/tat-ca-san-pham?category=${cat.slug}&search=${encodeURIComponent(cleanKeyword || subName)}`;

                            return (
                              <Link
                                key={subSlug || subName || idx}
                                href={targetUrl}
                                className="group/link text-xs font-semibold text-gray-600 hover:text-[#eb1c24] hover:bg-red-50 hover:translate-x-1 px-2.5 py-1 rounded-md transition-all flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover/link:bg-[#eb1c24] transition-all shrink-0"></span>
                                {subName}
                              </Link>
                            );
                          })}
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
