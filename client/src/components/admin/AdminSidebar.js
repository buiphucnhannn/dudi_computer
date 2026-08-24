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
  X,
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

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Close Button for mobile */}
        <div className="flex items-center justify-between border-b border-slate-150 p-5">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJg90SQjFIlEd2xvqMrzbiRyGKa2AZ87VXJ5Du7OBzu0Zd3o6iw8tIIDFvm6sPFBFbCvYSGagYCpaKEHG9vFSqL38i91uQRRrCo9UTXewIm28quM39SSupX2lsB688GiJUDHxtlFJvMgaV1u7mcyn5gZfEYAgBelIa62J_3HCI6UUUGx5aI93X7AlUsiq0AU_jwFNmLrAPqjsutR0aDRkc9L4jBs1HZvr4UNvJPSC6hnuMmQTn4a9QrPQg3pHMeLRb_A"
              alt="DUDI software"
              className="h-9 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                Admin Portal
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                DUDI SOFTWARE
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-4 overflow-y-auto">
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
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? "text-red-500"
                      : "text-slate-400 group-hover:text-slate-900"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Store Client Link */}
        <div className="border-t border-slate-150 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
          >
            <Store className="h-4 w-4" />
            <span>Xem trang bán hàng</span>
          </Link>
        </div>
      </aside>
    </>
  );
}