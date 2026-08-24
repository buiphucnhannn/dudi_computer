"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import StatisticsHeader from "@/components/admin/statistics/StatisticsHeader";
import StatisticsKpiCards from "@/components/admin/statistics/StatisticsKpiCards";
import RevenueChart from "@/components/admin/statistics/RevenueChart";
import SalesRatioChart from "@/components/admin/statistics/SalesRatioChart";
import TopProductsTable from "@/components/admin/statistics/TopProductsTable";
import { statisticAPI } from "@/lib/api";

export default function StatisticsPage() {
  const [currentPeriod, setCurrentPeriod] = useState("month");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleExportReport = async () => {
    try {
      showToast("Đang tạo file báo cáo...");

      const [chartRes, prodRes] = await Promise.all([
        statisticAPI.getRevenueChart("month"),
        statisticAPI.getTopProducts({ limit: 50 }),
      ]);

      const monthlyList = chartRes.data?.data?.monthlyData || [];
      const topProductsList = prodRes.data?.data || [];

      const csvRows = [
        ["BÁO CÁO DOANH THU & HIỆU SUẤT KINH DOANH ZCOMPUTER"],
        [`Thời gian xuất: ${new Date().toLocaleString("vi-VN")}`],
        [`Kỳ báo cáo: ${currentPeriod}`],
        [],
        ["THÁNG", "DOANH THU (VNĐ)", "SỐ ĐƠN HÀNG", "LỢI NHUẬN ƯỚC TÍNH (VNĐ)", "TĂNG TRƯỞNG"],
        ...monthlyList.map((m) => [
          m.month,
          m.revenue,
          m.orders,
          m.profit,
          m.growth,
        ]),
        [],
        ["TOP SẢN PHẨM BÁN CHẠY NHẤT"],
        ["MÃ SKU", "TÊN SẢN PHẨM", "DANH MỤC", "GIÁ BÁN (VNĐ)", "ĐÃ BÁN (CÁI)", "TỒN KHO", "TỔNG DOANH THU (VNĐ)"],
        ...topProductsList.map((p) => [
          p.code,
          p.name,
          p.category,
          p.price,
          p.sold,
          p.stock,
          p.revenue,
        ]),
      ];

      const csvContent = "\uFEFF" + csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `bao_cao_thong_ke_kinh_doanh_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Đã tải xuống file báo cáo thống kê kinh doanh CSV từ dữ liệu thật!");
    } catch (err) {
      console.error("Lỗi xuất file báo cáo:", err);
      showToast("Có lỗi xảy ra khi xuất file báo cáo!");
    }
  };

  return (
    <div className="flex flex-col w-full px-3.5 sm:px-6 py-5 sm:py-8 gap-6 sm:gap-8 max-w-[1600px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-300 border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <StatisticsHeader
        currentPeriod={currentPeriod}
        onPeriodChange={(p) => {
          setCurrentPeriod(p);
          showToast(`Đã chuyển kỳ thống kê sang: ${p}`);
        }}
        onExport={handleExportReport}
      />

      {/* KPI Cards */}
      <StatisticsKpiCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <SalesRatioChart />
      </div>

      {/* Top Products */}
      <TopProductsTable />
    </div>
  );
}