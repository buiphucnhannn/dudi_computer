"use client";

import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Flame,
  BarChart3,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Store,
  FolderTree,
  Compass,
  Boxes,
  Tag,
  LineChart,
} from "lucide-react";
import { DashboardProvider } from "@/components/admin/DashboardContext";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import RevenueChart from "@/components/admin/RevenueChart";
import RecentOrders from "@/components/admin/RecentOrders";
import OrderStatusSummary from "@/components/admin/OrderStatusSummary";

export default function SalesDashboard() {
  const navigationItems = [
    {
      title: "Quản lý sản phẩm",
      description: "Thêm mới, sửa thông tin, cập nhật kho hàng & giá bán",
      href: "/admin/products",
      icon: Package,
      badge: "Kho Hàng",
      color: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Danh mục sản phẩm",
      description: "Tổ chức cây phân loại laptop, linh kiện & phụ kiện",
      href: "/admin/categories",
      icon: FolderTree,
      badge: "Phân Loại",
      color: "from-indigo-600 to-violet-600",
      bgLight: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Quản lý đơn hàng",
      description: "Xử lý đơn mới, cập nhật trạng thái vận chuyển & giao hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: "Đơn Mua",
      color: "from-sky-600 to-cyan-600",
      bgLight: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
      title: "Khuyến mãi sản phẩm",
      description: "Cấu hình Flash Sale giờ vàng & giảm giá hot",
      href: "/admin/promotions",
      icon: Flame,
      badge: "Flash Sale",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Báo cáo thống kê",
      description: "Phân tích doanh thu chuyên sâu & top sản phẩm bán chạy",
      href: "/admin/statistics",
      icon: BarChart3,
      badge: "Báo Cáo",
      color: "from-emerald-600 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <DashboardProvider>
      <div className="flex w-full flex-col gap-6 animate-smooth-fade">
        {/* Sales Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                <span>Cổng Quản Trị Bán Hàng & Thương Mại</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                Bảng Điều Khiển Thương Mại
              </h1>
              <p className="text-blue-100/90 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                Theo dõi biến động doanh thu thời gian thực, xử lý đơn hàng mới, quản lý sản phẩm và cấu hình chiến dịch Flash Sale.
              </p>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm Sản Phẩm</span>
              </Link>

              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Xem Đơn Hàng</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sales Module Navigation Hub */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Điều Hướng Chức Năng Bán Hàng
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Truy cập nhanh các phân hệ nghiệp vụ thuộc quyền quản lý
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
              5 Phân Hệ Khả Dụng
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 active:scale-98"
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
                      <h4 className="text-xs sm:text-[13px] font-black text-slate-900 group-hover:text-blue-600 transition truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-blue-600">
                    <span>Mở phân hệ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Metrics Cards & Quick Stats */}
        <DashboardMetrics />

        {/* Chart + Recent Orders */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <RevenueChart />
          <RecentOrders />
        </section>

        {/* Order Status Summary */}
        <OrderStatusSummary />
      </div>
    </DashboardProvider>
  );
}
