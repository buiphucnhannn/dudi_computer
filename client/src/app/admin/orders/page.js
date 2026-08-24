"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import OrderFilter from "@/components/admin/orders/OrderFilter";
import OrderTable from "@/components/admin/orders/OrderTable";
import OrderPagination from "@/components/admin/orders/OrderPagination";

const mockOrders = [
  {
    id: "ORD-9021",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    initials: "NA",
    createdAt: "24/10/2023 14:30",
    total: 35400000,
    status: "processing",
  },
  {
    id: "ORD-9020",
    customerName: "Trần Thị B",
    phone: "0987654321",
    initials: "TB",
    createdAt: "24/10/2023 10:15",
    total: 12500000,
    status: "shipping",
  },
  {
    id: "ORD-9019",
    customerName: "Lê Văn Minh",
    phone: "0912345678",
    initials: "LM",
    createdAt: "23/10/2023 16:45",
    total: 8900000,
    status: "completed",
  },
  {
    id: "ORD-9018",
    customerName: "Phạm Thị Hoa",
    phone: "0933445566",
    initials: "PH",
    createdAt: "23/10/2023 09:20",
    total: 45000000,
    status: "cancelled",
  },
  {
    id: "ORD-9017",
    customerName: "Hoàng Công Thành",
    phone: "0888777666",
    initials: "HT",
    createdAt: "22/10/2023 18:05",
    total: 112000000,
    status: "completed",
  },
];

export default function OrdersPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const search = keyword.toLowerCase().trim();

      const matchKeyword =
        !search ||
        order.id.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.phone.includes(search);

      const matchStatus = status === "all" || order.status === status;

      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

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
    alert(`Xem chi tiết đơn hàng #${order.id} của khách hàng ${order.customerName} (${order.total.toLocaleString("vi-VN")}₫)`);
  };

  return (
    <div className="flex flex-col w-full px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            Quản lý đơn hàng
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Theo dõi và cập nhật trạng thái các đơn đặt hàng trực tuyến của khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Đang xuất dữ liệu danh sách đơn hàng ra file Excel...")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Xuất dữ liệu</span>
          </button>

          <button
            onClick={() => alert("Chức năng tạo đơn hàng mới tại quầy hoặc trực tuyến!")}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Tạo đơn mới</span>
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

        <OrderTable
          orders={displayedOrders}
          onSelectOrder={handleSelectOrder}
        />

        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}