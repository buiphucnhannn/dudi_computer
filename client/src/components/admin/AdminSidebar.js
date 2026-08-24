"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Store,
} from "lucide-react";

const menuItems = [
  {
    label: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Thống kê",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-slate-200 bg-white shadow-xs">
      {/* Logo & Brand */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <img
            src="/images/dudi/dudisoftware4.png"
            alt="DUDI software"
            className="h-10 w-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="border-l border-slate-200 pl-3">
            <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>Admin Portal</span>
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-[#eb1c24] text-[9px] font-extrabold">PRO</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              DUDI SOFTWARE
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-red-50/80 text-[#eb1c24] border border-red-200/80 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#eb1c24]" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-4 rounded-full bg-[#eb1c24]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* View Store Client Link (Mở trực tiếp trên trang hiện tại) */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:bg-red-50 hover:border-red-200 hover:text-[#eb1c24] active:scale-98"
        >
          <Store className="h-4 w-4 text-slate-500 group-hover:text-[#eb1c24]" />
          <span>Về trang bán hàng</span>
        </Link>
      </div>
    </aside>
  );
}