"use client";

import { useState } from "react";
import StatisticsHeader from "@/components/admin/statistics/StatisticsHeader";
import StatisticsKpiCards from "@/components/admin/statistics/StatisticsKpiCards";
import RevenueChart from "@/components/admin/statistics/RevenueChart";
import SalesRatioChart from "@/components/admin/statistics/SalesRatioChart";
import TopProductsTable from "@/components/admin/statistics/TopProductsTable";
import { statisticAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function StatisticsPage() {
  const [currentPeriod, setCurrentPeriod] = useState("month");
  const { showToast } = useToast();

  const handleExportReport = async () => {
    try {
      showToast("Đang kết xuất dữ liệu và khởi tạo file báo cáo...");

      const [chartRes, prodRes] = await Promise.all([
        statisticAPI.getRevenueChart("month"),
        statisticAPI.getTopProducts({ limit: 50 }),
      ]);

      const monthlyList = chartRes.data?.data?.monthlyData || [];
      const topProductsList = prodRes.data?.data || [];

      const csvRows = [
        ["BÁO CÁO DOANH THU & HIỆU SUẤT KINH DOANH DUDI SOFTWARE"],
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
      showToast("Đã xuất và tải xuống file báo cáo thống kê kinh doanh CSV thành công!");
    } catch (err) {
      console.error("Lỗi xuất file báo cáo:", err);
      showToast("Không thể xuất file báo cáo do sự cố kết nối dữ liệu. Vui lòng thử lại sau.", "error");
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 sm:gap-8">
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