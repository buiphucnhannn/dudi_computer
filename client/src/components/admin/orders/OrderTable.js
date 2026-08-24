"use client";

import { PackageOpen, Eye } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderTable({ orders, onSelectOrder, isLoading }) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/90 border-b border-slate-200">
            <th className="py-3.5 px-4 w-28 text-center text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
              Mã đơn
            </th>

            <th className="py-3.5 px-6 min-w-[240px] text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap text-left">
              Khách hàng
            </th>

            <th className="py-3.5 px-4 w-44 text-center text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
              Ngày đặt
            </th>

            <th className="py-3.5 px-4 w-44 text-center text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
              Tổng tiền
            </th>

            <th className="py-3.5 px-4 w-40 text-center text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
              Trạng thái
            </th>

            <th className="py-3.5 px-4 w-28 text-center text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-150 text-sm text-slate-600">
          {isLoading ? (
            // Skeleton Loader Rows
            [1, 2, 3, 4, 5].map((idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="h-6 w-20 rounded-md bg-slate-200 mx-auto" />
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 rounded bg-slate-200" />
                      <div className="h-2.5 w-20 rounded bg-slate-150" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="h-3.5 w-24 rounded bg-slate-200 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="h-4 w-24 rounded bg-slate-200 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="h-6 w-24 rounded-md bg-slate-200 mx-auto" />
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="h-8 w-8 rounded-lg bg-slate-200 mx-auto" />
                </td>
              </tr>
            ))
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-16 text-center text-sm text-slate-400 whitespace-nowrap">
                <div className="flex flex-col items-center justify-center gap-2">
                  <PackageOpen className="h-10 w-10 text-slate-300" />
                  <p className="font-semibold text-slate-600">Không tìm thấy đơn hàng nào</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onSelectOrder?.(order)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Order ID */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <span className="font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block font-mono">
                    #{order.id}
                  </span>
                </td>

                {/* Customer */}
                <td className="py-4 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                      {order.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition-colors whitespace-nowrap">
                        {order.customerName || order.customer}
                      </div>

                      <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                        {order.phone}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-center text-xs text-slate-500 font-medium whitespace-nowrap">
                  {order.createdAt || order.time}
                </td>

                {/* Total */}
                <td className="py-4 px-4 text-center text-sm font-black text-slate-900 whitespace-nowrap">
                  {typeof (order.total || order.price) === "number"
                    ? `${(order.total || order.price).toLocaleString("vi-VN")}₫`
                    : (order.total || order.price)}
                </td>

                {/* Status */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="flex justify-center">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder?.(order);
                    }}
                    className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Chi tiết đơn"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}