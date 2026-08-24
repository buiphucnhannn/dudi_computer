"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import {
  Search,
  Bell,
  User,
  X,
  Check,
  ShoppingCart,
  AlertTriangle,
  Settings,
  LogOut,
  Store,
  ArrowLeft,
} from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Đơn hàng mới #ORD-0921",
      desc: "Khách hàng Nguyễn Văn A vừa đặt mua MacBook Pro M3 Max",
      time: "5 phút trước",
      type: "order",
      unread: true,
    },
    {
      id: 2,
      title: "Cảnh báo tồn kho",
      desc: "Card màn hình ASUS ROG RTX 4090 chỉ còn 2 sản phẩm",
      time: "25 phút trước",
      type: "warning",
      unread: true,
    },
    {
      id: 3,
      title: "Thanh toán thành công",
      desc: "Đơn hàng #ORD-0920 đã thanh toán 54.000.000₫ qua VNPay",
      time: "1 giờ trước",
      type: "order",
      unread: true,
    },
  ]);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  return (
    <header className="fixed left-[280px] right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Search Bar */}
      <div className="relative flex w-96 items-center rounded-xl bg-slate-100 px-3.5 py-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-300 border border-transparent">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
          className="ml-2.5 w-full border-none bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-0"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
              showNotifications
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Thông báo"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Thông báo mới
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-red-50 text-red-600 text-[10.5px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                      {unreadCount} chưa đọc
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="h-3 w-3" />
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition ${
                      n.unread ? "bg-slate-50/80 font-medium" : "opacity-80"
                    } hover:bg-slate-100 cursor-pointer`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        n.type === "warning"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {n.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {n.desc}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Back to Store Button on Header */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-[#eb1c24] text-xs font-bold transition-all shadow-2xs"
          title="Về trang bán hàng"
        >
          <Store className="h-4 w-4 text-[#eb1c24]" />
          <span>Về Cửa Hàng</span>
        </Link>

        {/* Profile Card & Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 border-l border-slate-200 pl-4 transition hover:opacity-80 cursor-pointer"
          >
            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || "Quản trị viên"}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {user?.email || "admin@dudisoftware.com"}
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">
                  {user?.name || "Quản trị viên"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || "admin@dudisoftware.com"}
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-[#eb1c24] transition"
                >
                  <Store className="h-4 w-4 text-[#eb1c24]" />
                  <span>Về trang bán hàng</span>
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>Cài đặt hệ thống</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    dispatch(logoutUser());
                    router.push("/login");
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}