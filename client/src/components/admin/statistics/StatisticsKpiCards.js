"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { statisticAPI } from "@/lib/api";

function formatCompactMoney(amount = 0) {
  if (amount >= 1_000_000_000) {
    return `₫${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `₫${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `${amount.toLocaleString("vi-VN")}₫`;
}

export default function StatisticsKpiCards() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    cancelRate: 0,
    todayGrowth: "+0.0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchKPIs = async () => {
      try {
        const res = await statisticAPI.getSummary();
        if (res.data?.data && isMounted) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải KPIs thống kê:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchKPIs();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpis = [
    {
      title: "Tổng Doanh Thu",
      value: formatCompactMoney(data.totalRevenue),
      percent: data.todayGrowth || "+0.0%",
      icon: DollarSign,
      iconBg: "bg-slate-900 text-white",
      isPositive: !String(data.todayGrowth).startsWith("-"),
    },
    {
      title: "Tổng Đơn Hàng",
      value: data.totalOrders?.toLocaleString("vi-VN") || "0",
      percent: `${data.todayOrdersCount || 0} hôm nay`,
      icon: ShoppingCart,
      iconBg: "bg-red-50 text-red-600 border border-red-100",
      isPositive: true,
    },
    {
      title: "Khách Hàng",
      value: data.totalCustomers?.toLocaleString("vi-VN") || "0",
      percent: "Đã đăng ký / Mua",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      isPositive: true,
    },
    {
      title: "Tỷ Lệ Hủy Đơn",
      value: `${data.cancelRate || 0}%`,
      percent: data.cancelRate <= 5 ? "Tốt" : "Cần chú ý",
      icon: AlertCircle,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      isPositive: (data.cancelRate || 0) <= 5,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-center animate-pulse"
          >
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ))}
      </div>
    );
  }

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