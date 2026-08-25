"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Package,
  Calendar,
  Clock,
  ShieldCheck,
  Truck,
  ExternalLink,
} from "lucide-react";
import OrderTimeline, { getStatusBadge } from "./OrderTimeline";
import { formatVND, formatDate } from "@/lib/utils";

function formatDateTime(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${hours}:${mins} - ${day}/${month}/${year}`;
}

export default function OrderDetailModal({ order, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const statusBadge = getStatusBadge(order.orderStatus);
  const StatusIcon = statusBadge.icon;

  const handleCopyCode = () => {
    if (order.orderCode) {
      navigator.clipboard.writeText(order.orderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const paymentMethodMap = {
    cod: "Thanh toán khi nhận hàng (COD)",
    banking: "Chuyển khoản ngân hàng (VietQR)",
    installment: "Trả góp qua thẻ tín dụng / Công ty tài chính",
  };

  const paymentStatusMap = {
    pending: { label: "Chưa thanh toán", color: "bg-amber-50 text-amber-700 border-amber-200" },
    paid: { label: "Đã thanh toán", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    failed: { label: "Thanh toán thất bại", color: "bg-red-50 text-red-700 border-red-200" },
    refunded: { label: "Đã hoàn tiền", color: "bg-purple-50 text-purple-700 border-purple-200" },
  };

  const currentPayStatus =
    paymentStatusMap[order.paymentStatus] || paymentStatusMap.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#eb1c24] text-white flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Chi tiết đơn hàng #{order.orderCode}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                  title="Sao chép mã đơn"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Đặt lúc: {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusBadge.dotColor}`} />
              {statusBadge.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step Progress Tracker */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Tiến độ giao hàng
            </h4>
            <OrderTimeline status={order.orderStatus} timeline={order.timeline} />
          </div>

          {/* Recipient Information & Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recipient Card */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#eb1c24]" />
                <span>Thông tin nhận hàng</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm">
                  {order.customerInfo?.fullName || "Khách hàng"}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{order.customerInfo?.phone}</span>
                </div>
                {order.customerInfo?.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{order.customerInfo?.email}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-slate-600 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {order.customerInfo?.address}
                    {order.customerInfo?.district && `, ${order.customerInfo.district}`}
                    {order.customerInfo?.province && `, ${order.customerInfo.province}`}
                  </span>
                </div>
                {order.customerInfo?.note && (
                  <div className="flex items-start gap-2 text-slate-500 italic pt-1 border-t border-slate-200/50">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>&ldquo;{order.customerInfo.note}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Phương thức thanh toán</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900">
                  {paymentMethodMap[order.paymentMethod] || order.paymentMethod || "COD"}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Trạng thái thanh toán:</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${currentPayStatus.color}`}
                  >
                    {currentPayStatus.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1.5 rounded-xl text-[11.5px] font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Bảo hành chính hãng & Kiểm tra hàng trước khi nhận</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              Danh sách sản phẩm ({order.items?.length || 0})
            </h4>
            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.thumbnail || "/images/dudi/dudisoftware1.png"}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-200 shrink-0 p-1"
                    />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Số lượng: <span className="font-bold text-slate-800">x{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#eb1c24] block">
                      {formatVND(item.price * item.quantity)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatVND(item.price)} / món
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline History Log */}
          {Array.isArray(order.timeline) && order.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                Lịch sử thay đổi trạng thái ({order.timeline.length})
              </h4>
              <div className="rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4 space-y-3">
                {order.timeline.map((log, idx) => {
                  const logBadge = getStatusBadge(log.status);
                  const isLatest = idx === order.timeline.length - 1;

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-xs relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full absolute -left-0.5 top-1 ring-4 ring-white ${
                          isLatest ? "bg-[#eb1c24]" : "bg-slate-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${logBadge.color}`}
                          >
                            {logBadge.label}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(log.updatedAt)}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-slate-700 font-medium mt-1 text-[12px]">
                            {log.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính ({order.items?.length || 0} sản phẩm):</span>
              <span className="font-semibold text-slate-900">
                {formatVND(order.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600">Miễn phí</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Giảm giá:</span>
                <span className="font-semibold text-red-600">
                  -{formatVND(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black">
              <span className="text-slate-900">Tổng thanh toán:</span>
              <span className="text-lg text-[#eb1c24]">
                {formatVND(order.finalAmount || order.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <a
            href="tel:0909163821"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#eb1c24] transition"
          >
            <Phone className="w-4 h-4 text-[#eb1c24]" />
            <span>Hotline hỗ trợ: (+84) 909 163 821</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
