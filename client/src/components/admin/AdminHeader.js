"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  X,
  Check,
  ShoppingCart,
  ShoppingBag,
  AlertTriangle,
  Settings,
  LogOut,
  ExternalLink,
  Package,
  Truck,
  MessageCircle,
  Clock,
  CheckCheck,
} from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

function formatTimeAgo(dateString) {
  if (!dateString) return "Vừa xong";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

export default function AdminHeader({ onToggleSidebar }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Fetch real notifications from Database
  const fetchNotifications = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoadingNotifs(true);
    try {
      const res = await notificationAPI.getAll({ limit: 30 });
      const data = res.data?.data;
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(Number(data.unreadCount) || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    } finally {
      if (!isBackground) setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Polling định kỳ 10 giây để nhận thông báo mới realtime
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationAPI.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Lỗi khi đánh dấu đã đọc:", err);
      }
    }

    setShowNotifications(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "order":
        return {
          icon: ShoppingBag,
          color: "bg-blue-50 text-blue-600 border-blue-200",
        };
      case "order_status":
        return {
          icon: Truck,
          color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
      case "product":
        return {
          icon: Package,
          color: "bg-purple-50 text-purple-600 border-purple-200",
        };
      case "contact":
        return {
          icon: MessageCircle,
          color: "bg-indigo-50 text-indigo-600 border-indigo-200",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "bg-amber-50 text-amber-600 border-amber-200",
        };
      default:
        return {
          icon: Bell,
          color: "bg-slate-50 text-slate-600 border-slate-200",
        };
    }
  };

  return (
    <header className="fixed left-0 lg:left-[280px] right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger button + Search Bar */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
          title="Mở menu quản trị"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop / Tablet Search Bar */}
        <div className="relative hidden sm:flex w-64 md:w-80 lg:w-96 items-center rounded-xl bg-slate-100 px-3.5 py-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-300 border border-transparent">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm sản phẩm, đơn hàng..."
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
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="flex sm:hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
          title="Tìm kiếm"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications(true);
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
              showNotifications
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Thông báo hệ thống"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white ring-2 ring-white animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Body */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Đọc tất cả</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto space-y-1.5 divide-y divide-slate-100 pr-0.5">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">Chưa có thông báo nào</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const { icon: IconComponent, color } = getNotifIcon(n.type);
                    const isUnread = !n.isRead;

                    return (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition cursor-pointer pt-3 ${
                          isUnread
                            ? "bg-slate-50/90 font-medium hover:bg-slate-100/90 border border-slate-200/50 shadow-2xs"
                            : "opacity-75 hover:opacity-100 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p
                              className={`text-xs leading-snug truncate ${
                                isUnread ? "font-bold text-slate-900" : "text-slate-700 font-medium"
                              }`}
                            >
                              {n.title}
                            </p>
                            {isUnread && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 font-normal">
                            {n.message}
                          </p>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card & Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 sm:gap-3 sm:border-l sm:border-slate-200 sm:pl-4 transition hover:opacity-80 cursor-pointer"
          >
            <div className="hidden text-right md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Quản trị viên
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                admin@dudi.vn
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <User className="h-4 w-4" />
            </div>
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">
                  DUDI Master Admin
                </div>
                <div className="text-[11px] text-slate-400">
                  admin@dudi.vn
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/admin/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>Cài đặt hệ thống</span>
                </Link>

                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  <ExternalLink className="h-4 w-4 text-slate-500" />
                  <span>Xem trang chủ shop</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    showToast({
                      title: "Đã đăng xuất",
                      message: "Bạn đã đăng xuất khỏi phiên làm việc quản trị!",
                      type: "info",
                    });
                    setShowUserMenu(false);
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

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-16 z-20 flex items-center bg-white px-4 py-2.5 border-b border-slate-200 shadow-md sm:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex-1 flex items-center rounded-xl bg-slate-100 px-3 py-1.5">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="ml-2 w-full bg-transparent text-xs outline-none"
            />
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="ml-2 p-1 text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
}