"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Minus,
  Plus,
  PackagePlus,
  X,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";
import CreateOrderModal, { CATALOG_PRODUCTS } from "./orders/CreateOrderModal";

export default function DashboardMetrics() {
  const {
    metrics,
    stockItems,
    createOrder,
    restockProduct,
    toastMessage,
  } = useDashboard();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);

  const [inventoryForm, setInventoryForm] = useState({
    sku: "ROG-STRIX-4090",
    quantity: 5,
    supplier: "ASUS Việt Nam",
  });

  const lowStockList = stockItems.filter((i) => i.stock <= 3);

  const handleOrderSubmit = async (orderData) => {
    await createOrder(orderData);
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    restockProduct(inventoryForm.sku, inventoryForm.quantity);
    setShowInventoryModal(false);
  };

  return (
    <section className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-300 border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Metric 1: Revenue */}
        <div className="group relative flex h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Doanh thu hôm nay
              </h3>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                {metrics.todayRevenueFormatted}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200 transition-transform group-hover:scale-110">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            <span>{metrics.revenueGrowth} so với hôm qua</span>
          </div>
        </div>

        {/* Metric 2: New Orders */}
        <Link
          href="/admin/orders"
          className="group relative flex h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md cursor-pointer"
        >
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                Đơn hàng hôm nay
              </h3>
              <div className="text-2xl font-black tracking-tight text-slate-900">
                {metrics.todayOrdersCount}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200 transition-transform group-hover:scale-110">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-slate-500 group-hover:text-red-600 transition">
            <Minus className="h-4 w-4" />
            <span>Xem quản lý đơn hàng &rarr;</span>
          </div>
        </Link>

        {/* Metric 3: Low stock */}
        <div
          onClick={() => setShowLowStockModal(true)}
          className="group relative flex h-[140px] flex-col justify-between overflow-hidden rounded-2xl border border-red-100 bg-red-50/30 p-5 shadow-xs transition hover:shadow-md cursor-pointer hover:border-red-300"
        >
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-red-600">
                Sắp hết hàng
              </h3>
              <div className="text-2xl font-black tracking-tight text-red-600">
                {metrics.lowStockCount}
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200 transition-transform group-hover:scale-110">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-red-600 group-hover:underline">
            <span>Bấm để xem danh sách ({lowStockList.length}) &rarr;</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex h-[140px] flex-col justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Tạo đơn mới</span>
          </button>

          <button
            onClick={() => setShowInventoryModal(true)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-2xs transition hover:bg-slate-100 cursor-pointer active:scale-98"
          >
            <PackagePlus className="h-4 w-4" />
            <span>Nhập kho nhanh</span>
          </button>
        </div>
      </div>

      {/* Modal 1: Tạo đơn mới (Admin manual form) */}
      <CreateOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmitOrder={handleOrderSubmit}
      />

      {/* Modal 2: Nhập kho nhanh */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <PackagePlus className="h-5 w-5 text-slate-900" />
                <h3 className="text-base font-bold text-slate-900">
                  Nhập kho hàng nhanh
                </h3>
              </div>
              <button
                onClick={() => setShowInventoryModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Chọn sản phẩm cần nhập
                </label>
                <select
                  value={inventoryForm.sku}
                  onChange={(e) =>
                    setInventoryForm({ ...inventoryForm, sku: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  {CATALOG_PRODUCTS.map((item) => (
                    <option key={item.sku} value={item.sku}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Số lượng nhập thêm
                </label>
                <input
                  type="number"
                  min="1"
                  value={inventoryForm.quantity}
                  onChange={(e) =>
                    setInventoryForm({
                      ...inventoryForm,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Nhà cung cấp / Đối tác
                </label>
                <input
                  type="text"
                  value={inventoryForm.supplier}
                  onChange={(e) =>
                    setInventoryForm({
                      ...inventoryForm,
                      supplier: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => setShowInventoryModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 cursor-pointer"
                >
                  Xác nhận nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Danh sách sắp hết hàng */}
      {showLowStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Cảnh báo sản phẩm sắp hết hàng ({lowStockList.length})
                </h3>
              </div>
              <button
                onClick={() => setShowLowStockModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {lowStockList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  Hiện tại không có sản phẩm nào sắp hết hàng!
                </div>
              ) : (
                lowStockList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Mã SKU: {item.sku}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                          item.stock === 0
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        Tồn kho: {item.stock}
                      </span>

                      <button
                        onClick={() => restockProduct(item.id, 10)}
                        className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Package className="h-3.5 w-3.5" />
                        <span>+10 Nhập nhanh</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-150 mt-4">
              <span className="text-xs text-slate-500 font-medium">
                Quản lý kho hàng chi tiết tại trang Sản phẩm
              </span>
              <Link
                href="/admin/products"
                onClick={() => setShowLowStockModal(false)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Đến trang Sản phẩm &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}