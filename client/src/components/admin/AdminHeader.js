"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Bell,
  User,
  X,
  Check,
  CheckCheck,
  ShoppingCart,
  ShoppingBag,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Package,
  Truck,
  MessageCircle,
  Clock,
  Briefcase,
  LayoutDashboard,
} from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";
import { selectCurrentUser, selectRoleInfo, logoutUser } from "@/redux/slices/authSlice";
import { formatDate } from "@/lib/utils";

function formatTimeAgo(dateString) {
  if (!dateString) return "";
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
  return formatDate(date);
}

export default function AdminHeader({ onToggleSidebar }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const roleInfo = useSelector(selectRoleInfo);
  const { showToast } = useToast();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Fetch real notifications from Database
  const fetchNotifications = useCallback(async (isBackground = false) => {
    try {
      const res = await notificationAPI.getAll({ limit: 30 });
      const data = res.data?.data;
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(Number(data.unreadCount) || 0);
      }
    } catch (error) {
      if (!isBackground) {
        console.error("Lỗi khi tải thông báo:", error);
      }
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

  // Đánh dấu 1 thông báo đã đọc
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationAPI.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error(e);
      }
    }

    if (notif.link) {
      setShowNotifications(false);
      router.push(notif.link);
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast({
        title: "Đã đọc tất cả",
        message: "Toàn bộ thông báo hệ thống đã được đánh dấu là đã đọc!",
        type: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "order":
        return {
          icon: ShoppingBag,
          color: "text-blue-600 bg-blue-50 border-blue-100",
        };
      case "low_stock":
        return {
          icon: AlertTriangle,
          color: "text-amber-600 bg-amber-50 border-amber-100",
        };
      case "review":
        return {
          icon: MessageCircle,
          color: "text-purple-600 bg-purple-50 border-purple-100",
        };
      case "application":
      case "contact":
        return {
          icon: Briefcase,
          color: "text-indigo-600 bg-indigo-50 border-indigo-100",
        };
      case "system":
        return {
          icon: Package,
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        };
      default:
        return {
          icon: Bell,
          color: "text-slate-600 bg-slate-50 border-slate-100",
        };
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 shadow-2xs">
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications(true);
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${showNotifications
              ? "bg-[#eb1c24] text-white shadow-xs"
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
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition cursor-pointer pt-3 ${isUnread
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
                              className={`text-xs leading-snug truncate ${isUnread ? "font-bold text-slate-900" : "text-slate-700 font-medium"
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

        {/* Profile Card & Dropdown (Đồng bộ chuẩn hover và cấu trúc với Header chính) */}
        <div
          className="relative group/user py-1"
          ref={userRef}
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 transition-all cursor-pointer shadow-xs min-w-[220px] max-w-[280px]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eb1c24] text-white shadow-xs font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4 text-white" />}
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-[11px] text-slate-500 font-bold block leading-tight truncate">
                {roleInfo?.shortLabel || roleInfo?.label || "Quản trị viên"}
              </span>
              <span className="text-[13.5px] font-black text-slate-900 leading-tight block truncate">
                {user?.name || "Admin DUDI Software"}
              </span>
            </div>
          </Link>

          {/* User Menu Dropdown */}
          <div
            className={`absolute right-0 top-full pt-1.5 w-[230px] z-50 transition-all duration-150 ${showUserMenu
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-1 pointer-events-none"
              }`}
          >
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-gray-100 p-1.5 overflow-hidden w-full space-y-0.5">
              <Link
                href="/"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-[#eb1c24] hover:bg-red-50/60 rounded-xl transition-all"
              >
                <ExternalLink className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="whitespace-nowrap">Về trang bán hàng</span>
              </Link>

              <Link
                href="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold text-gray-700 hover:text-[#eb1c24] hover:bg-gray-50 rounded-xl transition-all"
              >
                <User className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="whitespace-nowrap">Hồ sơ cá nhân</span>
              </Link>


              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    showToast({
                      title: "Đã đăng xuất",
                      message: "Bạn đã đăng xuất khỏi phiên làm việc quản trị!",
                      type: "info",
                    });
                    setShowUserMenu(false);
                    dispatch(logoutUser());
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13.5px] font-semibold text-red-600 hover:bg-red-50/70 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}