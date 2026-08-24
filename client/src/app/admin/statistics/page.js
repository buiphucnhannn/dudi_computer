"use client";

import StatisticsHeader from "@/components/admin/statistics/StatisticsHeader";
import StatisticsKpiCards from "@/components/admin/statistics/StatisticsKpiCards";
import RevenueChart from "@/components/admin/statistics/RevenueChart";
import SalesRatioChart from "@/components/admin/statistics/SalesRatioChart";
import TopProductsTable from "@/components/admin/statistics/TopProductsTable";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col w-full px-6 py-8 gap-8">
      {/* Header */}
      <StatisticsHeader />

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