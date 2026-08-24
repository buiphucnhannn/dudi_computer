"use client";

import DashboardMetrics from "@/components/admin/DashboardMetrics";
import RevenueChart from "@/components/admin/RevenueChart";
import RecentOrders from "@/components/admin/RecentOrders";
import OrderStatusSummary from "@/components/admin/OrderStatusSummary";

export default function AdminDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 px-6 py-8">
      {/* Metrics & Quick Actions */}
      <DashboardMetrics />

      {/* Chart + Recent Orders */}
      <section className="flex flex-col gap-4 lg:flex-row">
        <RevenueChart />
        <RecentOrders />
      </section>

      {/* Order Status */}
      <OrderStatusSummary />
    </div>
  );
}