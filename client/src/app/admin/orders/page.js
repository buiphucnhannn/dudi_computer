"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Download, Plus, CheckCircle2 } from "lucide-react";
import { orderAPI } from "@/lib/api";
import OrderFilter from "@/components/admin/orders/OrderFilter";
import OrderTable from "@/components/admin/orders/OrderTable";
import OrderPagination from "@/components/admin/orders/OrderPagination";
import OrderDetailModal from "@/components/admin/orders/OrderDetailModal";
import CreateOrderModal from "@/components/admin/orders/CreateOrderModal";
import {
  mapBackendOrderToMaster,
  normalizeOrderStatus,
  formatOrderInitials,
} from "@/components/admin/orders/orderStore";

export default function OrdersPage() {
  // Always start with empty list and loading state so stale data is NEVER rendered on reload
  const [ordersList, setOrdersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const pageSize = 5;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Dedicated function to fetch fresh orders directly from Database
  const fetchOrdersFromDatabase = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) {
      setIsLoading(true);
    }

    try {
      const res = await orderAPI.getAll({ limit: 200 });
      const items = res.data?.data?.orders || res.data?.orders;

      if (items && Array.isArray(items)) {
        const mapped = items.map((o, idx) => mapBackendOrderToMaster(o, idx));
        setOrdersList(mapped);
      }
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng từ Database:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Fetch on component mount
  useEffect(() => {
    fetchOrdersFromDatabase(true);
  }, [fetchOrdersFromDatabase]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const search = keyword.toLowerCase().trim();

      const matchKeyword =
        !search ||
        (order.id && order.id.toLowerCase().includes(search)) ||
        (order.customerName && order.customerName.toLowerCase().includes(search)) ||
        (order.customer && order.customer.toLowerCase().includes(search)) ||
        (order.phone && order.phone.includes(search));

      const matchStatus = status === "all" || order.status === status;

      return matchKeyword && matchStatus;
    });
  }, [ordersList, keyword, status]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  // FLOW: Cập nhật trạng thái → API cập nhật Database thành công → Fetch lại data mới nhất từ Database → Cập nhật state → Render UI
  const handleUpdateStatus = async (orderId, newStatus) => {
    const normalized = normalizeOrderStatus(newStatus);
    const targetOrder = ordersList.find((o) => o.id === orderId || o._id === orderId);

    try {
      if (targetOrder?._id) {
        // 1. Gửi cập nhật trạng thái vào Database
        await orderAPI.updateStatus(targetOrder._id, normalized);
      }

      // 2. Fetch lại danh sách đơn hàng mới nhất từ Database
      await fetchOrdersFromDatabase(false);

      const statusLabels = {
        processing: "Chờ xử lý",
        shipping: "Đang giao hàng",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
      };

      showToast(`Đã lưu trạng thái đơn hàng #${orderId} sang: ${statusLabels[normalized] || normalized}!`);

      // Cập nhật selectedOrder nếu modal chi tiết đang mở
      setSelectedOrder((prev) => (prev ? { ...prev, status: normalized } : null));
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng trong Database:", err);
      showToast("Không thể cập nhật trạng thái trên Database!");
    }
  };

  // FLOW: Tạo đơn mới → API lưu Database thành công → Fetch lại data mới nhất từ Database → Cập nhật state → Render UI
  const handleCreateOrderSubmit = async (orderData) => {
    const items = orderData.items && orderData.items.length > 0
      ? orderData.items
      : [
        {
          name: "Sản phẩm linh kiện máy tính",
          price: orderData.totalAmount || 18590000,
          quantity: 1,
        },
      ];

    const totalAmount = orderData.totalAmount || items.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      // 1. Gửi tạo đơn hàng vào Database
      const res = await orderAPI.create({
        customerName: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        product: items[0]?.name,
        items,
        totalAmount,
        paymentMethod: orderData.paymentMethod || "cod",
      });

      const created = res.data?.data;
      showToast(`Đã lưu đơn hàng #${created?.orderCode || "mới"} thành công!`);
      setShowCreateModal(false);

      // 2. Fetch lại toàn bộ danh sách đơn hàng mới nhất từ Database
      await fetchOrdersFromDatabase(false);
    } catch (e) {
      console.error("Lỗi khi tạo đơn hàng trong Database:", e);
      showToast("Không thể lưu đơn hàng vào Database. Vui lòng thử lại!");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã đơn", "Khách hàng", "Số điện thoại", "Ngày đặt", "Tổng tiền (VNĐ)", "Trạng thái", "Thanh toán"];
    const rows = ordersList.map((o) => [
      `"${o.id}"`,
      `"${o.customerName || o.customer}"`,
      `"${o.phone}"`,
      `"${o.createdAt || o.time}"`,
      o.total || o.price,
      `"${o.status}"`,
      `"${o.paymentMethod}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_don_hang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách đơn hàng thành file CSV!");
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-300 border border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
            Quản lý đơn hàng
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Theo dõi và cập nhật trạng thái các đơn đặt hàng trực tuyến của khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer whitespace-nowrap"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Xuất dữ liệu</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 stroke-[2.5] shrink-0" />
            <span className="whitespace-nowrap">Tạo đơn hàng mới</span>
          </button>
        </div>
      </div>

      {/* Order Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <OrderFilter
          keyword={keyword}
          setKeyword={handleKeywordChange}
          status={status}
          setStatus={handleStatusChange}
        />

        <div className="overflow-x-auto">
          <OrderTable
            orders={displayedOrders}
            isLoading={isLoading}
            onSelectOrder={handleSelectOrder}
          />
        </div>

        {!isLoading && filteredOrders.length > 0 && (
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Order Modal (Admin Manual Data Entry) */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmitOrder={handleCreateOrderSubmit}
      />
    </div>
  );
}