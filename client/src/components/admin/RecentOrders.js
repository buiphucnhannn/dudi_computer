"use client";

import { useState } from "react";
import Link from "next/link";
import { Laptop, Cpu, Mouse, ChevronRight, X, Phone, User, Calendar, DollarSign, CheckCircle2 } from "lucide-react";

const initialOrders = [
  {
    id: "#ORD-0921",
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Cách Mạng Tháng 8, P.10, Q.3, TP.HCM",
    time: "10 phút trước",
    product: "MacBook Pro M3 Max 36GB/1TB",
    price: "82.500.000₫",
    status: "Chờ xử lý",
    icon: Laptop,
    iconBg: "bg-slate-100 text-slate-800",
    statusBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "#ORD-0920",
    customer: "Trần Thị B",
    phone: "0987654321",
    address: "456 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    time: "45 phút trước",
    product: "NVIDIA RTX 4090 24GB OC",
    price: "54.000.000₫",
    status: "Đã thanh toán",
    icon: Cpu,
    iconBg: "bg-blue-50 text-blue-700",
    statusBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "#ORD-0919",
    customer: "Lê Văn Minh",
    phone: "0912345678",
    address: "789 Lê Duẩn, Q.Hải Châu, Đà Nẵng",
    time: "2 giờ trước",
    product: "Logitech G Pro X Superlight 2",
    price: "3.200.000₫",
    status: "Đang giao",
    icon: Mouse,
    iconBg: "bg-purple-50 text-purple-700",
    statusBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export default function RecentOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              statusBg:
                newStatus === "Hoàn thành"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : newStatus === "Đang giao"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : newStatus === "Đã hủy"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-amber-50 text-amber-700 border-amber-200",
            }
          : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:w-1/3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-150 bg-white px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">
          Đơn hàng gần đây
        </h2>

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
        {orders.map((order) => {
          const Icon = order.icon;

          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="group flex cursor-pointer items-start gap-3.5 p-4 transition-colors hover:bg-slate-50 active:bg-slate-100"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${order.iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-start justify-between">
                  <span className="truncate text-xs font-bold text-slate-900 group-hover:text-red-600 transition">
                    {order.id} • {order.customer}
                  </span>

                  <span className="shrink-0 text-[11px] text-slate-400">
                    {order.time}
                  </span>
                </div>

                <div className="mb-1.5 truncate text-xs text-slate-500 font-medium">
                  {order.product}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    {order.price}
                  </span>

                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      order.statusBg || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
                  Đặt lúc {selectedOrder.time}
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
                  <span className="font-bold text-slate-900">{selectedOrder.customer}</span>
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
                  <span>{selectedOrder.product}</span>
                  <span className="text-red-600 font-black">{selectedOrder.price}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Cập nhật trạng thái xử lý:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Chờ xử lý", "Đã thanh toán", "Đang giao", "Hoàn thành"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        selectedOrder.status === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
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