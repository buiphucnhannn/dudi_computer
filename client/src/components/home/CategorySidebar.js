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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        const list = res.data?.data;
        if (Array.isArray(list)) {
          setDbCategories(list);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return [];
    }

    const activeCats = dbCategories.filter((c) => c.isActive !== false);
    const roots = activeCats.filter((c) => !c.parent || c.parent === null);
    const children = activeCats.filter((c) => !!c.parent);

    const items = [];

    // Chỉ hiển thị các Root Categories thực tế từ Database
    roots.forEach((root) => {
      const myChildren = children.filter(
        (c) => (c.parent?._id || c.parent || "").toString() === root._id.toString()
      );

      const Icon = getSidebarCategoryIcon(root.slug, root.name, root.pcPartType);

      items.push({
        name: root.name,
        slug: root.slug,
        icon: Icon,
        hasSub: myChildren.length > 0,
        subGroups:
          myChildren.length > 0
            ? [
                {
                  title: `Danh mục ${root.name}`,
                  slug: root.slug,
                  items: myChildren.map((ch) => ({
                    name: ch.name,
                    slug: ch.slug,
                  })),
                },
              ]
            : null,
      });
    });

    // Thêm các category con mồ côi nếu có
    children.forEach((ch) => {
      const pId = (ch.parent?._id || ch.parent || "").toString();
      const parentExists = roots.some((r) => r._id.toString() === pId);
      if (!parentExists) {
        items.push({
          name: ch.name,
          slug: ch.slug,
          icon: getSidebarCategoryIcon(ch.slug, ch.name, ch.pcPartType),
          hasSub: false,
        });
      }
    });

    return items;
  }, [dbCategories]);

  return (
    <div className="hidden lg:flex flex-col w-full relative z-30 h-full">
      <div className="relative bg-white shadow-xs border border-t-0 border-gray-200/90 py-2.5 px-2 w-full h-full flex flex-col rounded-b-2xl">
        {loading ? (
          // Skeleton loading mượt mà khi F5, không flash dữ liệu fix cứng cũ
          <div className="space-y-2 p-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-10 w-full bg-slate-100 rounded-xl animate-pulse flex items-center gap-3 px-3"
              >
                <div className="w-4 h-4 bg-slate-200 rounded-md" />
                <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400">
            Chưa có danh mục
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.slug} className="group relative flex flex-col justify-center" tabIndex={0}>
                  <div>
                    <Link
                      href={`/tat-ca-san-pham?category=${cat.slug}`}
                      className="flex w-full items-center justify-between px-3 py-2.5 transition-all duration-150 rounded-xl text-gray-700 hover:bg-[#eb1c24] hover:text-white group-hover:bg-[#eb1c24] group-hover:text-white"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-1">
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
                        <span className="text-[13px] font-bold group-hover:text-white transition-colors truncate">
                          {cat.name}
                        </span>
                      </div>
                      {cat.hasSub && (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors shrink-0" />
                      )}
                    </Link>
                  </div>

                  {/* Flyout Submenu */}
                  {cat.hasSub && cat.subGroups && (
                    <div
                      className={`opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-full top-0 ${
                        cat.subGroups[0]?.items?.length > 6 ? "w-[420px]" : "w-[260px]"
                      } bg-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] border border-gray-200/90 z-50 rounded-2xl transition-all duration-200 p-4 flex items-start gap-4 ml-1`}
                    >
                      <div className="w-full">
                        {cat.subGroups.map((group) => (
                          <div key={group.title} className="flex flex-col w-full">
                            <Link
                              href={`/tat-ca-san-pham?category=${cat.slug}`}
                              className="font-bold text-gray-900 mb-2.5 hover:text-[#eb1c24] transition-colors text-[13px] border-b pb-1.5 border-red-100 uppercase"
                            >
                              {group.title}
                            </Link>
                            <div className={`grid ${group.items.length > 6 ? "grid-cols-2" : "grid-cols-1"} gap-1`}>
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
                                    className="group/link text-xs font-semibold text-gray-600 hover:text-[#eb1c24] hover:bg-red-50 hover:translate-x-1 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover/link:bg-[#eb1c24] transition-all shrink-0"></span>
                                    <span className="truncate">{subName}</span>
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
        )}
      </div>
    </div>
  );
}
