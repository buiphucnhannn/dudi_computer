"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Ban,
  ShieldCheck,
  Search,
  ArrowRight,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  UserCheck,
  Lock,
  Compass,
  UserX,
  UserCog,
  History,
} from "lucide-react";
import { userAPI, orderAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    googleCount: 0,
  });

  const navigationItems = [
    {
      title: "Hồ sơ khách hàng",
      description: "Xem toàn bộ danh sách, tra cứu số điện thoại & địa chỉ",
      href: "/admin/users",
      icon: Users,
      badge: "Hồ Sơ",
      bgLight: "bg-emerald-50 text-emerald-600 border-emerald-100",
      colorText: "text-emerald-600",
    },
    {
      title: "Khách hàng hoạt động",
      description: "Kiểm tra danh sách tài khoản hợp lệ sẵn sàng mua sắm",
      href: "/admin/users",
      icon: CheckCircle2,
      badge: "Active",
      bgLight: "bg-blue-50 text-blue-600 border-blue-100",
      colorText: "text-blue-600",
    },
    {
      title: "Kiểm soát & Khóa vi phạm",
      description: "Quản lý các tài khoản bị khóa tạm thời hoặc vĩnh viễn",
      href: "/admin/users",
      icon: Ban,
      badge: "Khóa TK",
      bgLight: "bg-red-50 text-red-600 border-red-100",
      colorText: "text-red-600",
    },
    {
      title: "Tài khoản Google OAuth",
      description: "Theo dõi khách hàng liên kết đăng nhập qua Google",
      href: "/admin/users",
      icon: ShieldCheck,
      badge: "OAuth",
      bgLight: "bg-amber-50 text-amber-600 border-amber-100",
      colorText: "text-amber-600",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statRes = await userAPI.getStats();
      if (statRes.data?.data) {
        setStats(statRes.data.data);
      }

      // 2. Fetch Customers
      const custRes = await userAPI.getCustomers({ limit: 6 });
      const items = custRes.data?.data?.items || custRes.data?.data || [];
      if (Array.isArray(items)) {
        setCustomers(items);
      }

      // 3. Fetch Recent Orders for Customer Activity
      const orderRes = await orderAPI.getAll({ limit: 5 });
      const orders = orderRes.data?.data?.orders || orderRes.data?.orders || [];
      if (Array.isArray(orders)) {
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Customer Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 animate-smooth-fade">
      {/* Customer Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Cổng Quản Trị Khách Hàng & Người Dùng</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              Bảng Điều Khiển Khách Hàng
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Theo dõi tình hình tăng trưởng người dùng, quản lý danh sách tài khoản khách hàng, kiểm soát trạng thái hoạt động và tra cứu lịch sử mua sắm.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98"
            >
              <Users className="w-4 h-4" />
              <span>Quản Lý Khách Hàng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Module Navigation Hub */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Điều Hướng Phân Hệ Khách Hàng
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Truy cập các tính năng quản lý hồ sơ, kiểm soát tài khoản và tra cứu
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
            4 Phân Hệ Khả Dụng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200 active:scale-98"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${item.bgLight} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-600 shadow-2xs">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className={`mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold ${item.colorText}`}>
                  <span>Mở phân hệ</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng khách hàng */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng Khách Hàng
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats.total || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Toàn bộ hồ sơ trên hệ thống
          </div>
        </div>

        {/* Card 2: Đang hoạt động */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang Hoạt Động
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">
            {stats.active || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Tài khoản đủ điều kiện mua hàng
          </div>
        </div>

        {/* Card 3: Bị khóa */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-red-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bị Hạn Chế / Khóa
            </span>
            <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
              <Ban className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
            {stats.banned || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Vi phạm quy định hoặc tạm khóa
          </div>
        </div>

        {/* Card 4: Google OAuth */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Google OAuth
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats.googleCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Liên kết bảo mật qua Google
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Customers */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Khách Hàng Mới Tham Gia
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Những tài khoản khách hàng vừa đăng ký gần đây
                  </p>
                </div>
              </div>

              <Link
                href="/admin/users"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                Đang tải danh sách người dùng...
              </div>
            ) : customers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Chưa có tài khoản khách hàng nào.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customers.map((c, idx) => (
                  <div
                    key={c._id || idx}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/80 rounded-2xl px-2 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-emerald-600 transition truncate max-w-[180px] sm:max-w-xs">
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-slate-400">
                          <span className="truncate max-w-[150px]">{c.email}</span>
                          <span>•</span>
                          <span>{formatDate(c.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {c.status === "banned" ? (
                        <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                          Bị khóa
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                          Hoạt động
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/users"
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Users className="w-4 h-4" />
              <span>Đi Đến Quản Lý Khách Hàng</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Customer Order Activity */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Khách Hàng Mua Sắm Gần Đây
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Các khách hàng vừa thực hiện đơn hàng mới
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Đang tải hoạt động mua hàng...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Chưa có hoạt động mua sắm nào.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentOrders.map((ord, idx) => (
                  <div
                    key={ord._id || idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate">
                        {ord.customer?.name || ord.shippingAddress?.fullName || "Khách mua hàng"}
                      </h4>
                      <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                        Đơn #{ord._id?.slice(-6)} • {formatDate(ord.createdAt)}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-emerald-600 text-xs sm:text-sm">
                        {(ord.totalAmount || ord.total || 0).toLocaleString("vi-VN")}đ
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/users"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Tra Cứu Hồ Sơ & Lịch Sử Đơn Hàng</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
