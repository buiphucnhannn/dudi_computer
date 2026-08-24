"use client";

import { useState } from "react";
import {
  X,
  Printer,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  Package,
  FileText,
  User,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) {
  if (!isOpen || !order) return null;

  // Mock list of items for this order if not explicitly passed
  const orderItems = order.items || [
    {
      id: 1,
      name: order.productName || "PC Gaming Z-Nova Core i5 13400F / RTX 4060 8GB / 16GB RAM",
      sku: "PCG-13400F-4060",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
      price: order.total ? Math.round(order.total * 0.85) : 18590000,
      quantity: 1,
    },
    {
      id: 2,
      name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2 Hero",
      sku: "LOG-GPX-SL2",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      price: order.total ? Math.round(order.total * 0.15) : 3200000,
      quantity: 1,
    },
  ];

  const subtotal = order.total || orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingFee = 0;
  const grandTotal = subtotal + shippingFee;

  const handlePrint = () => {
    window.print();
  };

  const statusOptions = [
    { key: "processing", label: "Chờ xử lý", color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300" },
    { key: "shipping", label: "Đang giao", color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" },
    { key: "completed", label: "Hoàn thành", color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300" },
    { key: "cancelled", label: "Đã hủy", color: "hover:bg-red-50 hover:text-red-700 hover:border-red-300" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-5 sm:px-6 py-4 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Đơn hàng #{order.id}
                </h3>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Ngày tạo: {order.createdAt || "24/10/2023 14:30"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="In hóa đơn đơn hàng"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>In hóa đơn</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Status Tracker Flow */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tiến trình xử lý đơn hàng
              </span>
              <span className="text-xs font-medium text-slate-600">
                Phương thức: <strong>Giao hàng tiêu chuẩn</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((st) => {
                const isActive = order.status === st.key;
                return (
                  <button
                    key={st.key}
                    onClick={() => onUpdateStatus?.(order.id, st.key)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : `bg-white text-slate-700 border-slate-200 ${st.color}`
                    }`}
                  >
                    {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="rounded-2xl border border-slate-200/80 p-4 space-y-3 bg-white shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Thông tin khách hàng
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Họ tên:</span>
                  <span className="font-bold text-slate-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Số điện thoại:</span>
                  <a
                    href={`tel:${order.phone}`}
                    className="font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{order.phone}</span>
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="font-medium text-slate-700">
                    {order.email || `${order.phone}@customer.dudi.vn`}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="rounded-2xl border border-slate-200/80 p-4 space-y-3 bg-white shadow-2xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Địa chỉ & Thanh toán
                </h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-slate-400 font-medium shrink-0">Địa chỉ:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {order.address || "123 Cách Mạng Tháng 8, Phường 10, Quận 3, TP. Hồ Chí Minh"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Thanh toán:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-slate-400" />
                    <span>{order.paymentMethod || "COD (Thanh toán khi nhận)"}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Ghi chú:</span>
                  <span className="font-medium text-slate-600 italic">
                    {order.note || "Giao hàng trong giờ hành chính, gọi trước khi đến"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Sản phẩm trong đơn hàng ({orderItems.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 gap-3 sm:gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {item.sku}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      {item.price.toLocaleString("vi-VN")}₫ &times; {item.quantity}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính:</span>
              <span className="font-semibold">{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600">Miễn phí giao hàng</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
              <span className="text-lg font-black text-red-600">
                {grandTotal.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-150 px-5 sm:px-6 py-3.5 bg-white">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Hệ thống quản trị DUDI SOFTWARE
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Đóng
            </button>

            <button
              onClick={() => {
                alert(`Đã gửi email cập nhật trạng thái đơn hàng #${order.id} tới khách hàng ${order.customerName}!`);
                onClose();
              }}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-xs transition cursor-pointer"
            >
              Gửi thông báo khách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
