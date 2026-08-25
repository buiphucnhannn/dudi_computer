"use client";

import React, { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Package,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  ChevronRight,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  Filter,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";
import { formatVND, formatDate } from "@/lib/utils";
import OrderTimeline, { getStatusBadge } from "@/components/orders/OrderTimeline";
import OrderDetailModal from "@/components/orders/OrderDetailModal";

const STATUS_TABS = [
  { id: "all", label: "Tất cả", icon: Package },
  { id: "processing", label: "Đang xử lý", icon: Clock },
  { id: "confirmed", label: "Đã xác nhận", icon: CheckCircle2 },
  { id: "shipping", label: "Đang giao", icon: Truck },
  { id: "completed", label: "Đã giao", icon: PackageCheck },
  { id: "cancelled", label: "Đã hủy", icon: XCircle },
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get("code") || "";

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialCode);
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Fetch user orders from database
  const fetchOrders = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const res = await orderAPI.getMyOrders({
          userId: user?._id || user?.id,
          phone: user?.phone,
          email: user?.email,
          status: activeTab !== "all" ? activeTab : undefined,
        });

        const list = res.data?.data?.orders || [];
        setOrders(list);

        // If initialCode is provided in URL, auto-select it
        if (initialCode && !selectedOrder) {
          const match = list.find(
            (o) => o.orderCode?.toLowerCase() === initialCode.toLowerCase()
          );
          if (match) {
            setSelectedOrder(match);
            setIsDetailOpen(true);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách đơn hàng:", err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    },
    [user, activeTab, initialCode]
  );

  useEffect(() => {
    fetchOrders(false);

    // Auto-polling update every 15s
    const timer = setInterval(() => {
      fetchOrders(true);
    }, 15000);

    return () => clearInterval(timer);
  }, [fetchOrders]);

  // Handle direct single order lookup (useful for guests or specific codes)
  const handleQuickLookup = async (e) => {
    e?.preventDefault();
    if (!lookupQuery.trim()) {
      showToast({
        title: "Vui lòng nhập thông tin",
        message: "Hãy nhập Mã đơn hàng hoặc Số điện thoại để tra cứu!",
        type: "warning",
      });
      return;
    }

    setLookupLoading(true);
    try {
      const res = await orderAPI.getByCode(lookupQuery.trim());
      const orderData = res.data?.data;
      if (orderData) {
        setSelectedOrder(orderData);
        setIsDetailOpen(true);
        // Add to view list if not already present
        setOrders((prev) => {
          if (prev.some((o) => o._id === orderData._id)) return prev;
          return [orderData, ...prev];
        });
        showToast({
          title: "Tìm thấy đơn hàng",
          message: `Đơn hàng #${orderData.orderCode} đã được tìm thấy!`,
          type: "success",
        });
      }
    } catch (err) {
      showToast({
        title: "Không tìm thấy",
        message: "Không tìm thấy đơn hàng tương ứng với mã hoặc số điện thoại này.",
        type: "error",
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter orders by search
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeTab !== "all") {
      if (activeTab === "processing") {
        result = result.filter(
          (o) => o.orderStatus === "processing" || o.orderStatus === "pending"
        );
      } else {
        result = result.filter((o) => o.orderStatus === activeTab);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderCode?.toLowerCase().includes(q) ||
          o.customerInfo?.phone?.includes(q) ||
          o.customerInfo?.fullName?.toLowerCase().includes(q) ||
          o.items?.some((item) => item.name?.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { all: orders.length };
    orders.forEach((o) => {
      const s =
        o.orderStatus === "pending" ? "processing" : o.orderStatus || "processing";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-red-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#eb1c24] mb-1.5">
                <PackageCheck className="w-4 h-4" />
                <span>Quản lý & Theo dõi hành trình</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Theo Dõi Đơn Hàng
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Cập nhật lộ trình chuẩn bị linh kiện, kiểm tra kỹ thuật và tiến độ giao hàng
                theo thời gian thực.
              </p>
            </div>

            {/* Quick Lookup Form */}
            <form
              onSubmit={handleQuickLookup}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10 transition shadow-2xs max-w-md w-full"
            >
              <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="Tra cứu nhanh: Mã đơn (ZC-...) hoặc SĐT..."
                className="w-full bg-transparent border-none text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none px-2"
              />
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-4 py-2 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white text-xs font-bold transition shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {lookupLoading ? "Đang tìm..." : "Tra cứu"}
              </button>
            </form>
          </div>
        </div>

        {/* Status Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id] || 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#eb1c24] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive
                          ? "bg-white text-[#eb1c24]"
                          : "bg-slate-200/70 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* In-List Search Bar */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-1 max-w-md rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-1.5 focus-within:bg-white focus-within:border-red-400 transition">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc theo tên sản phẩm, mã đơn..."
                className="w-full bg-transparent border-none text-xs text-slate-800 placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => fetchOrders(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Làm mới danh sách"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Order Cards List */}
        {loading ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
            <RefreshCw className="w-8 h-8 text-[#eb1c24] animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#eb1c24] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Chưa có đơn hàng nào phù hợp
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `Không tìm thấy kết quả phù hợp với "${searchQuery}". Hãy thử tìm bằng từ khóa khác!`
                  : "Bạn chưa có đơn hàng nào ở trạng thái này. Khám phá các sản phẩm công nghệ hot tại DUDI SOFTWARE ngay!"}
              </p>
            </div>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Mua sắm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.orderStatus);

              return (
                <div
                  key={order._id || order.orderCode}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailOpen(true);
                  }}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all duration-200 p-5 sm:p-6 cursor-pointer space-y-4 group"
                >
                  {/* Order Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-red-50 group-hover:text-[#eb1c24] transition-colors">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 tracking-tight">
                            #{order.orderCode}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyCode(order.orderCode, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Sao chép mã đơn"
                          >
                            {copiedCode === order.orderCode ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[11.5px] text-slate-400">
                          Ngày đặt: {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusBadge.dotColor}`} />
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Compact Step Timeline */}
                  <div className="py-1">
                    <OrderTimeline
                      status={order.orderStatus}
                      timeline={order.timeline}
                      isCompact={true}
                    />
                  </div>

                  {/* Order Items Preview */}
                  <div className="rounded-2xl bg-slate-50/80 p-3 sm:p-4 border border-slate-200/60 divide-y divide-slate-100">
                    {order.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={it.thumbnail || "/images/dudi/dudisoftware1.png"}
                            alt={it.name}
                            className="w-11 h-11 rounded-lg object-contain bg-white border border-slate-200 shrink-0 p-0.5"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {it.name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              SL: <span className="font-semibold text-slate-700">x{it.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-800 shrink-0">
                          {formatVND(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Total & Details Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Tổng tiền ({order.items?.length || 0} món):</span>
                      <span className="text-base font-black text-[#eb1c24]">
                        {formatVND(order.finalAmount || order.totalAmount || 0)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#eb1c24] text-white text-xs font-bold transition shadow-xs cursor-pointer group-hover:bg-[#eb1c24]"
                    >
                      <span>Xem chi tiết & Lịch sử</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Chi tiết đơn hàng & Lịch sử trạng thái */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#eb1c24] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OrderTrackingContent />
    </Suspense>
  );
}
