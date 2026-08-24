"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const kpis = [
  {
    title: "Tổng Doanh Thu",
    value: "₫1.24B",
    percent: "+12.5%",
    icon: DollarSign,
    iconBg: "bg-slate-900 text-white",
    isPositive: true,
  },
  {
    title: "Đơn Hàng Mới",
    value: "342",
    percent: "+8.2%",
    icon: ShoppingCart,
    iconBg: "bg-red-50 text-red-600 border border-red-100",
    isPositive: true,
  },
  {
    title: "Khách Hàng Mới",
    value: "128",
    percent: "+5.1%",
    icon: Users,
    iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    isPositive: true,
  },
  {
    title: "Tỷ Lệ Hủy Đơn",
    value: "1.2%",
    percent: "-2.4%",
    icon: AlertCircle,
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    isPositive: false,
  },
];

export default function StatisticsKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <div
            key={kpi.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${kpi.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                  kpi.isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {kpi.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>{kpi.percent}</span>
              </span>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                {kpi.title}
              </p>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {kpi.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}