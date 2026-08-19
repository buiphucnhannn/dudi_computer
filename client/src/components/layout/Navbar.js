"use client";

import Link from "next/link";
import {
  Menu,
  Monitor,
  HardDrive,
  Cpu,
  Laptop,
  Headphones,
  Flame,
  Wrench,
} from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { name: "PC Gaming", href: "/san-pham?category=pc-gaming", icon: Monitor, hot: true },
    { name: "PC Đồ Họa - Workstation", href: "/san-pham?category=pc-do-hoa", icon: HardDrive },
    { name: "Linh Kiện Máy Tính", href: "/san-pham?category=linh-kien-pc", icon: Cpu },
    { name: "Laptop Gaming", href: "/san-pham?category=laptop", icon: Laptop },
    { name: "Màn Hình Máy Tính", href: "/san-pham?category=man-hinh", icon: Monitor },
    { name: "Gaming Gear", href: "/san-pham?category=gear", icon: Headphones },
    { name: "Xây Dựng Cấu Hình", href: "/build-pc", icon: Wrench, highlight: true },
    { name: "Khuyến Mãi Hot", href: "/san-pham?isFlashSale=true", icon: Flame, badge: "HOT" },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-xs hidden md:block">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* All Categories Dropdown Trigger */}
        <div className="relative group shrink-0">
          <button className="flex items-center gap-3 bg-[#e11b22] text-white px-5 py-3 font-bold text-sm tracking-wide hover:bg-[#b3141a] transition-colors rounded-t-sm">
            <Menu className="w-5 h-5" />
            <span>DANH MỤC SẢN PHẨM</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                  link.highlight
                    ? "text-[#e11b22] bg-red-50 hover:bg-red-100"
                    : "text-gray-700 hover:text-[#e11b22] hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${link.highlight ? "text-[#e11b22]" : "text-gray-500"}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-bounce">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
