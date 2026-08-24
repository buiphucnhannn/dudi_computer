"use client";

import Link from "next/link";
import { Clock, Truck, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const statuses = [
  {
    count: 12,
    title: "Chờ xác nhận",
    description: "Cần xử lý ngay",
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    statusFilter: "processing",
  },
  {
    count: 45,
    title: "Đang giao hàng",
    description: "Đã bàn giao vận chuyển",
    icon: Truck,
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    statusFilter: "shipping",
  },
  {
    count: 128,
    title: "Hoàn thành",
    description: "Trong tháng này",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    statusFilter: "completed",
  },
  {
    count: 3,
    title: "Đã hủy / Hoàn trả",
    description: "Cần kiểm tra lý do",
    icon: XCircle,
    iconColor: "text-red-600 bg-red-50 border-red-200",
    statusFilter: "cancelled",
  },
];

export default function OrderStatusSummary() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900">
          Trạng thái đơn hàng tổng hợp
        </h2>

        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <span>Quản lý tất cả đơn hàng</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => (
          <StatusCard key={status.title} {...status} />
        ))}
      </div>
    </section>
  );
}

function StatusCard({ count, title, description, icon: Icon, iconColor }) {
  return (
    <Link
      href="/admin/orders"
      className="group flex items-center gap-4 rounded-xl border border-slate-150 bg-slate-50/80 p-4 transition-all duration-200 hover:bg-slate-100/90 hover:border-slate-300 hover:shadow-xs cursor-pointer active:scale-98"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105 ${iconColor}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-700 truncate group-hover:text-slate-900 transition">
            {title}
          </div>
          <span className="text-lg font-black text-slate-900">{count}</span>
        </div>

        <div className="mt-0.5 text-xs text-slate-500 font-medium group-hover:text-slate-600">
          {description} &rarr;
        </div>
      </div>
    </Link>
  );
}