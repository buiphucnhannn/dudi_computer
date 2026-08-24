"use client";

import Link from "next/link";
import { Clock, Truck, CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { useDashboard } from "./DashboardContext";

export default function OrderStatusSummary() {
  const { statusCounts, statusFilter, setStatusFilter } = useDashboard();

  const statuses = [
    {
      key: "processing",
      count: statusCounts.processing,
      title: "Chờ xác nhận",
      description: "Cần xử lý ngay",
      icon: Clock,
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      activeBg: "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50",
    },
    {
      key: "shipping",
      count: statusCounts.shipping,
      title: "Đang giao hàng",
      description: "Đã bàn giao vận chuyển",
      icon: Truck,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200",
      activeBg: "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50",
    },
    {
      key: "completed",
      count: statusCounts.completed,
      title: "Đã hoàn thành",
      description: "Đơn giao thành công",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      activeBg: "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50",
    },
    {
      key: "cancelled",
      count: statusCounts.cancelled,
      title: "Đã hủy / Hoàn trả",
      description: "Đơn bị hủy bỏ",
      icon: XCircle,
      iconColor: "text-red-600 bg-red-50 border-red-200",
      activeBg: "border-red-500 ring-2 ring-red-500/20 bg-red-50/50",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Trạng thái đơn hàng tổng hợp
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Bấm vào từng trạng thái để lọc nhanh danh sách đơn hàng gần đây bên trên
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Xem tất cả ({statusCounts.all})</span>
            </button>
          )}

          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition"
          >
            <span>Trang quản lý đơn</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => {
          const Icon = status.icon;
          const isActive = statusFilter === status.key;

          return (
            <div
              key={status.key}
              onClick={() =>
                setStatusFilter(isActive ? "all" : status.key)
              }
              className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer active:scale-98 ${
                isActive
                  ? status.activeBg
                  : "border-slate-150 bg-slate-50/80 hover:bg-slate-100/90 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${status.iconColor}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-700 truncate group-hover:text-slate-900 transition">
                    {status.title}
                  </div>
                  <span className="text-lg font-black text-slate-900">
                    {status.count}
                  </span>
                </div>

                <div className="mt-0.5 text-xs text-slate-500 font-medium group-hover:text-slate-600">
                  {status.description} &rarr;
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}