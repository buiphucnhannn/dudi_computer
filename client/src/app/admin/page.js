"use client";

import { DashboardProvider } from "@/components/admin/DashboardContext";
import DashboardMetrics from "@/components/admin/DashboardMetrics";
import RevenueChart from "@/components/admin/RevenueChart";
import RecentOrders from "@/components/admin/RecentOrders";
import OrderStatusSummary from "@/components/admin/OrderStatusSummary";

export default function AdminDashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex w-full flex-col gap-6 px-3.5 sm:px-6 py-5 sm:py-8 max-w-[1600px] mx-auto">
        {/* Metrics & Quick Actions */}
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