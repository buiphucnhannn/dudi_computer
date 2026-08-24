"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Cpu,
  Mouse,
  ChevronRight,
  X,
  Phone,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";

export default function RecentOrders() {
  const { filteredOrders, updateOrderStatus, statusFilter } = useDashboard();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "completed":
        return { label: "Hoàn thành", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "shipping":
        return { label: "Đang giao", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "cancelled":
        return { label: "Đã hủy", bg: "bg-red-50 text-red-700 border-red-200" };
      case "processing":
      default:
        return { label: "Chờ xử lý", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  const getProductIcon = (name = "") => {
    const lower = String(name).toLowerCase();
    if (lower.includes("laptop") || lower.includes("macbook")) return Laptop;
    if (lower.includes("rtx") || lower.includes("cpu") || lower.includes("vga") || lower.includes("mainboard")) return Cpu;
    return Mouse;
  };

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:w-1/3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-150 bg-white px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Đơn hàng gần đây
          </h2>
        </div>

        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredOrders.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-xs text-slate-400 font-medium">
            Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const productName = order.product || order.items?.[0]?.name || "Sản phẩm đặt hàng";
            const Icon = getProductIcon(productName);
            const badge = getStatusBadgeStyle(order.status);
            const customerName = order.customer || order.customerName || "Khách hàng";
            const orderPrice = Number(order.price || order.total || 0);

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="group flex cursor-pointer items-start gap-3.5 p-4 transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-start justify-between gap-2">
                    <span className="truncate text-xs font-bold text-slate-900 group-hover:text-red-600 transition whitespace-nowrap">
                      {order.id} • {customerName}
                    </span>

                    <span className="shrink-0 text-[11px] text-slate-400 whitespace-nowrap">
                      {order.time || order.createdAt}
                    </span>
                  </div>

                  <div className="mb-1.5 truncate text-xs text-slate-500 font-medium whitespace-nowrap">
                    {productName}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900 whitespace-nowrap">
                      {orderPrice.toLocaleString("vi-VN")}₫
                    </span>

                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedOrder(null)}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Chi tiết đơn hàng {selectedOrder.id}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  Thời gian: {selectedOrder.time || selectedOrder.createdAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-150">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Khách hàng:</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrder.customer || selectedOrder.customerName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Số điện thoại:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.phone}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-slate-500 font-medium">Địa chỉ giao:</span>
                  <span className="font-medium text-slate-800 text-right">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-150 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{selectedOrder.product || selectedOrder.items?.[0]?.name}</span>
                  <span className="text-red-600 font-black">
                    {(Number(selectedOrder.price || selectedOrder.total || 0)).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Cập nhật trạng thái đơn hàng:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "processing", label: "Chờ xử lý" },
                    { key: "shipping", label: "Đang giao" },
                    { key: "completed", label: "Hoàn thành" },
                    { key: "cancelled", label: "Đã hủy" },
                  ].map((st) => (
                    <button
                      key={st.key}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st.key);
                        setSelectedOrder((prev) => ({ ...prev, status: st.key }));
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedOrder.status === st.key
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-150 mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}