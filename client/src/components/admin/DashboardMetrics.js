"use client";

import { useState, useEffect } from "react";
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
  Layers,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";
import CreateOrderModal from "./orders/CreateOrderModal";

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
    sku: "",
    quantity: 10,
    supplier: "Kho DUDI Logistics",
  });

  // Tự động set sản phẩm mặc định khi mở modal hoặc khi stockItems tải xong
  useEffect(() => {
    if (stockItems && stockItems.length > 0) {
      setInventoryForm((prev) => {
        if (!prev.sku || !stockItems.some((i) => (i._id || i.sku || i.id) === prev.sku)) {
          return {
            ...prev,
            sku: stockItems[0]._id || stockItems[0].sku || stockItems[0].id,
          };
        }
        return prev;
      });
    }
  }, [stockItems]);

  const lowStockList = stockItems.filter((i) => i.stock <= 3);

  const handleOrderSubmit = async (orderData) => {
    await createOrder(orderData);
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!inventoryForm.sku) return;
    await restockProduct(inventoryForm.sku, inventoryForm.quantity);
    setShowInventoryModal(false);
  };

  // Sản phẩm hiện đang được chọn trong dropdown nhập kho
  const selectedProduct = stockItems.find(
    (i) => (i._id || i.sku || i.id) === inventoryForm.sku
  );

  return (
    <section className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-300 border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Doanh thu hôm nay */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Doanh thu hôm nay
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="my-3">
            <span className="text-2xl font-black text-slate-900">
              {metrics?.todayRevenue || metrics?.todayRevenueFormatted || "0₫"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {metrics?.revenueGrowth || "+0%"}
            </span>
            <span className="text-slate-400 font-medium">so với hôm qua</span>
          </div>
        </div>

        {/* Metric 2: Đơn hàng mới */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Đơn hàng hôm nay
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>

          <div className="my-3">
            <span className="text-2xl font-black text-slate-900">
              {metrics?.todayOrders ?? metrics?.todayOrdersCount ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">
              Đang chờ xử lý:{" "}
              <strong className="text-slate-800 font-bold">
                {metrics?.pendingOrders ?? metrics?.pendingOrdersCount ?? 0} đơn
              </strong>
            </span>
          </div>
        </div>

        {/* Metric 3: Cảnh báo tồn kho */}
        <div
          onClick={() => setShowLowStockModal(true)}
          className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-red-600 transition">
              Cảnh báo hết hàng
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="my-3">
            <span className="text-2xl font-black text-slate-900">
              {metrics?.lowStockItems ?? metrics?.lowStockCount ?? lowStockList.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold group-hover:underline">
            <span>Xem chi tiết danh sách ({lowStockList.length}) &rarr;</span>
          </div>
        </div>

        {/* Metric 4: Thao tác nhanh */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Thao tác nhanh
            </span>
          </div>

          <button
            onClick={() => setShowOrderModal(true)}
            className="mb-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" />
            <span className="whitespace-nowrap">Tạo đơn hàng mới</span>
          </button>

          <button
            onClick={() => setShowInventoryModal(true)}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-100 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <PackagePlus className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Nhập kho nhanh</span>
          </button>
        </div>
      </div>

      {/* Modal 1: Tạo đơn mới (Admin manual form) */}
      <CreateOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmitOrder={handleOrderSubmit}
      />

      {/* Modal 2: Nhập kho nhanh (Sử dụng Data thật từ Database) */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowInventoryModal(false)}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-white rounded-xl">
                  <PackagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nhập kho hàng nhanh
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Cập nhật số lượng tồn kho trực tiếp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInventoryModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <span>Chọn sản phẩm</span>
                </label>
                <select
                  value={inventoryForm.sku}
                  onChange={(e) =>
                    setInventoryForm({ ...inventoryForm, sku: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  {stockItems.length === 0 ? (
                    <option value="">Đang tải danh sách sản phẩm...</option>
                  ) : (
                    stockItems.map((item) => (
                      <option
                        key={item._id || item.sku || item.id}
                        value={item._id || item.sku || item.id}
                      >
                        {item.name} (SKU: {item.sku}) — Tồn: {item.stock} cái
                      </option>
                    ))
                  )}
                </select>

                {/* Selected Product Live Preview */}
                {selectedProduct && (
                  <div className="mt-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedProduct.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Mã SKU: <strong className="text-slate-800">{selectedProduct.sku}</strong>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-500">Tồn hiện tại</div>
                      <div className="text-sm font-black text-slate-900">
                        {selectedProduct.stock} cái
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
                    Số lượng nhập thêm (+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inventoryForm.quantity}
                    onChange={(e) =>
                      setInventoryForm({
                        ...inventoryForm,
                        quantity: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  {selectedProduct && (
                    <span className="text-[10.5px] text-slate-500 font-medium mt-1 block">
                      Tồn sau nhập: <strong className="text-emerald-600 font-bold">{selectedProduct.stock + inventoryForm.quantity} cái</strong>
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1.5 block">
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
                    placeholder="Ví dụ: ASUS Việt Nam"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
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
                  disabled={!selectedProduct}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowLowStockModal(false)}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
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
                    key={item.id || item._id}
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
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border ${item.stock === 0
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                      >
                        Tồn kho: {item.stock}
                      </span>

                      <button
                        onClick={() => restockProduct(item._id || item.id || item.sku, 10)}
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