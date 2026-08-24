"use client";

import { useState, useEffect } from "react";
import { BarChart3, Table as TableIcon, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { statisticAPI } from "@/lib/api";

export default function RevenueChart() {
  const [viewMode, setViewMode] = useState("chart"); // "chart" | "table"
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMonthlyRevenue = async () => {
      try {
        const res = await statisticAPI.getRevenueChart("month");
        if (res.data?.data?.monthlyData && isMounted) {
          const list = res.data.data.monthlyData;
          setMonthlyData(list);
          if (list.length > 0) {
            setSelectedMonth(list[list.length - 1]);
          }
        }
      } catch (err) {
        console.error("Lỗi tải biểu đồ doanh thu theo tháng:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMonthlyRevenue();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = monthlyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = monthlyData.reduce((sum, d) => sum + d.orders, 0);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1000000);

  const activeItem = hoveredMonth || selectedMonth || monthlyData[monthlyData.length - 1] || {
    month: "Tháng này",
    revenue: 0,
    orders: 0,
    growth: "+0.0%",
    profit: 0,
  };

  const latestGrowth = monthlyData[monthlyData.length - 1]?.growth || "+0.0%";
  const isPositiveGrowth = !latestGrowth.startsWith("-");

  if (loading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex items-center justify-center min-h-[380px]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Doanh thu theo tháng
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                isPositiveGrowth
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {isPositiveGrowth ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {latestGrowth}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tổng 6 tháng: <strong className="text-slate-900 font-black">{totalRevenue.toLocaleString("vi-VN")}₫</strong> • {totalOrders} đơn hàng
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("chart")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              viewMode === "chart"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Biểu đồ</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Bảng số liệu</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "chart" ? (
        <div className="space-y-4">
          {/* Highlight Card for selected/hovered month */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-lg font-bold">
                {activeItem.month}
              </div>
              <div>
                <span className="text-slate-400 font-medium">Doanh thu:</span>
                <div className="text-sm sm:text-base font-black text-slate-900">
                  {activeItem.revenue.toLocaleString("vi-VN")}₫
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-right">
              <div>
                <span className="text-slate-400 font-medium">Số đơn:</span>
                <div className="font-bold text-slate-900">{activeItem.orders} đơn</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Tăng trưởng:</span>
                <div className={`font-bold flex items-center justify-end gap-0.5 ${
                  String(activeItem.growth).startsWith("+") ? "text-emerald-600" : "text-red-600"
                }`}>
                  {String(activeItem.growth).startsWith("+") ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{activeItem.growth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative h-60 w-full pt-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="w-full border-t border-slate-100" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 flex justify-between items-end h-full pb-8 gap-2 sm:gap-4 px-2">
              {monthlyData.map((item) => {
                const heightPercent = maxRevenue > 0 ? Math.round((item.revenue / maxRevenue) * 100) : 10;
                const isSelected = selectedMonth?.month === item.month;

                return (
                  <div
                    key={item.month}
                    onClick={() => setSelectedMonth(item)}
                    onMouseEnter={() => setHoveredMonth(item)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="relative flex-1 flex flex-col justify-end items-center h-full group cursor-pointer"
                  >
                    {/* Tooltip on top of bar */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10.5px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none z-20 shadow-lg">
                      {item.revenue.toLocaleString("vi-VN")}₫ ({item.orders} đơn)
                    </div>

                    {/* The Bar */}
                    <div
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                        isSelected
                          ? "bg-slate-900 shadow-md ring-2 ring-slate-900/20"
                          : "bg-slate-200 group-hover:bg-red-600 group-hover:shadow-xs"
                      }`}
                      style={{
                        height: `${Math.max(12, heightPercent)}%`,
                      }}
                    />

                    {/* Month Label */}
                    <span
                      className={`absolute -bottom-6 text-xs transition-colors ${
                        isSelected
                          ? "font-black text-slate-900"
                          : "text-slate-400 font-medium group-hover:text-slate-700"
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Data Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 whitespace-nowrap">Tháng</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Doanh thu</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Số đơn</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Lợi nhuận ước tính</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {monthlyData.map((item) => (
                <tr
                  key={item.month}
                  onClick={() => setSelectedMonth(item)}
                  className={`transition hover:bg-slate-50 cursor-pointer ${
                    selectedMonth?.month === item.month ? "bg-slate-50 font-bold" : ""
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{item.month}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 whitespace-nowrap">
                    {item.revenue.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 whitespace-nowrap">{item.orders}</td>
                  <td className="py-3 px-4 text-right text-slate-600 whitespace-nowrap">
                    {item.profit.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        String(item.growth).startsWith("+") ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {item.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}