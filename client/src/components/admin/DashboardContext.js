"use client";

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { productAPI, orderAPI } from "@/lib/api";
import {
  mapBackendOrderToMaster,
  normalizeOrderStatus,
  formatOrderInitials,
} from "./orders/orderStore";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [revenuePeriod, setRevenuePeriod] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);

  // Dedicated function to fetch fresh orders and products directly from Database
  const fetchDashboardData = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) {
      setIsLoading(true);
    }

    try {
      // 1. Fetch products from DB
      const resProducts = await productAPI.getAll({ limit: 100 });
      const items = resProducts.data?.data?.products || resProducts.data?.products;
      if (items && Array.isArray(items)) {
        const mappedStock = items.map((p, idx) => ({
          id: p._id || idx + 1,
          _id: p._id,
          name: p.name,
          stock: typeof p.stock === "number" ? p.stock : 0,
          sku: p.sku || `SKU-${100 + idx}`,
          price: p.price || 0,
        }));
        setStockItems(mappedStock);
      }

      // 2. Fetch orders from DB
      const resOrders = await orderAPI.getAll({ limit: 100 });
      const orderDocs = resOrders.data?.data?.orders || resOrders.data?.orders;
      if (orderDocs && Array.isArray(orderDocs)) {
        const backendMapped = orderDocs.map((o, idx) => mapBackendOrderToMaster(o, idx));
        setOrders(backendMapped);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Dashboard từ Database:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load from Database
  useEffect(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // 1. Calculated Metrics & Dynamic Chart Datasets based on live orders
  const { metrics, chartDatasets } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    const validOrders = orders.filter((o) => o.status !== "cancelled");

    // Today metrics
    const todayOrders = orders.filter((o) => o.isToday);
    const todayOrdersCount = todayOrders.length;
    const todayRevenue = todayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.price) || Number(o.total) || 0), 0);

    // Yesterday revenue for comparison
    const yesterdayRevenue = orders
      .filter((o) => {
        const d = new Date(o.rawCreatedAt || o.createdAt);
        return !isNaN(d) && d >= startOfYesterday && d < startOfToday && o.status !== "cancelled";
      })
      .reduce((sum, o) => sum + (Number(o.price) || Number(o.total) || 0), 0);

    let growthDiff = 0;
    if (yesterdayRevenue > 0) {
      growthDiff = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    } else if (todayRevenue > 0) {
      growthDiff = 100;
    }
    const revenueGrowth = `${growthDiff >= 0 ? "+" : ""}${growthDiff.toFixed(1)}%`;

    const lowStockCount = stockItems.filter((item) => item.stock <= 3).length;

    // Helper to generate SVG points
    const buildSvgPoints = (dataList) => {
      const maxVal = Math.max(...dataList.map((r) => r.val), 1000000);
      const minVal = Math.min(...dataList.map((r) => r.val), 0);
      const range = maxVal - minVal || 1;

      const points = dataList.map((item, idx) => {
        const cx = (idx / (dataList.length - 1 || 1)) * 100;
        const cy = 85 - ((item.val - minVal) / range) * 65;
        return {
          day: item.day,
          date: item.date || item.day,
          value: `${item.val.toLocaleString("vi-VN")}₫`,
          val: item.val,
          orders: item.ordersCount || 0,
          cx: Number(cx.toFixed(1)),
          cy: Number(cy.toFixed(1)),
        };
      });

      const polyPoints = points.map((p) => `${p.cx},${p.cy}`).join(" ");
      const polyFill = `${polyPoints} 100,100 0,100`;
      const total = dataList.reduce((sum, r) => sum + r.val, 0);

      return { points, polyPoints, polyFill, total };
    };

    // 1. Build real 7-day dataset (Day by day)
    const daysOfWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const raw7d = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0);
      const nextD = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1, 0, 0, 0);

      const dayOrders = validOrders.filter((o) => {
        const orderDate = new Date(o.rawCreatedAt || o.createdAt);
        return !isNaN(orderDate) && orderDate >= d && orderDate < nextD;
      });

      const dayVal = dayOrders.reduce((sum, o) => sum + (Number(o.price) || Number(o.total) || 0), 0);
      const dayName = i === 0 ? "Hôm nay" : daysOfWeek[d.getDay()];

      raw7d.push({
        day: dayName,
        date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        val: dayVal,
        ordersCount: dayOrders.length,
      });
    }

    const { points: points7d, polyPoints: polyPoints7d, polyFill: polyFill7d, total: total7d } = buildSvgPoints(raw7d);

    // 2. Build real 30-day dataset (Week by week)
    const raw30d = [];
    for (let w = 3; w >= 0; w--) {
      const startWeek = new Date(now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000);
      const endWeek = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);

      const weekOrders = validOrders.filter((o) => {
        const orderDate = new Date(o.rawCreatedAt || o.createdAt);
        return !isNaN(orderDate) && orderDate >= startWeek && orderDate < endWeek;
      });

      const weekVal = weekOrders.reduce((sum, o) => sum + (Number(o.price) || Number(o.total) || 0), 0);

      raw30d.push({
        day: `Tuần ${4 - w}`,
        val: weekVal,
        ordersCount: weekOrders.length,
      });
    }

    const { points: points30d, polyPoints: polyPoints30d, polyFill: polyFill30d, total: total30d } = buildSvgPoints(raw30d);

    // 3. Build real monthly dataset (6 months)
    const rawMonth = [];
    for (let m = 5; m >= 0; m--) {
      const startMonth = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const endMonth = new Date(now.getFullYear(), now.getMonth() - m + 1, 1);

      const monthOrders = validOrders.filter((o) => {
        const orderDate = new Date(o.rawCreatedAt || o.createdAt);
        return !isNaN(orderDate) && orderDate >= startMonth && orderDate < endMonth;
      });

      const monthVal = monthOrders.reduce((sum, o) => sum + (Number(o.price) || Number(o.total) || 0), 0);

      rawMonth.push({
        day: `Tháng ${startMonth.getMonth() + 1}`,
        val: monthVal,
        ordersCount: monthOrders.length,
      });
    }

    const { points: pointsMonth, polyPoints: polyPointsMonth, polyFill: polyFillMonth, total: totalMonth } = buildSvgPoints(rawMonth);

    // Calculate trend for 30d (comparing second half with first half)
    const firstHalf30d = raw30d.slice(0, 2).reduce((s, r) => s + r.val, 0);
    const secondHalf30d = raw30d.slice(2).reduce((s, r) => s + r.val, 0);
    let trend30dVal = 0;
    if (firstHalf30d > 0) {
      trend30dVal = ((secondHalf30d - firstHalf30d) / firstHalf30d) * 100;
    } else if (secondHalf30d > 0) {
      trend30dVal = 100;
    }
    const trend30d = `${trend30dVal >= 0 ? "+" : ""}${trend30dVal.toFixed(1)}%`;

    return {
      metrics: {
        todayRevenueFormatted: `${todayRevenue.toLocaleString("vi-VN")}₫`,
        todayOrdersCount,
        lowStockCount,
        revenueGrowth,
      },
      chartDatasets: {
        "7d": {
          trend: revenueGrowth,
          total: `${total7d.toLocaleString("vi-VN")}₫`,
          labels: raw7d.map((r) => r.day),
          points: points7d,
          polyPoints: polyPoints7d,
          polyFill: polyFill7d,
        },
        "30d": {
          trend: trend30d,
          total: `${total30d.toLocaleString("vi-VN")}₫`,
          labels: raw30d.map((r) => r.day),
          points: points30d,
          polyPoints: polyPoints30d,
          polyFill: polyFill30d,
        },
        "month": {
          trend: revenueGrowth,
          total: `${totalMonth.toLocaleString("vi-VN")}₫`,
          labels: rawMonth.map((r) => r.day),
          points: pointsMonth,
          polyPoints: polyPointsMonth,
          polyFill: polyFillMonth,
        },
      },
    };
  }, [orders, stockItems]);

  // 2. Status Counts summary
  const statusCounts = useMemo(() => {
    return {
      processing: orders.filter((o) => o.status === "processing").length,
      shipping: orders.filter((o) => o.status === "shipping").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      all: orders.length,
    };
  }, [orders]);

  // 3. Filtered Orders List
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // 4. FLOW: Tạo đơn → Lưu Database thành công → Fetch lại data Database → Cập nhật state
  const createOrder = async (orderData) => {
    const items = orderData.items && orderData.items.length > 0
      ? orderData.items
      : [
        {
          name: orderData.product || "Sản phẩm đặt hàng",
          price: orderData.totalAmount || orderData.price || 18590000,
          quantity: 1,
        },
      ];

    const totalAmount = orderData.totalAmount || orderData.price || items.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      // 1. Lưu vào Database
      const res = await orderAPI.create({
        customerName: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        product: orderData.product || items[0]?.name,
        items,
        totalAmount,
        paymentMethod: orderData.paymentMethod || "cod",
      });

      const created = res.data?.data;
      triggerToast(`Đã lưu đơn hàng #${created?.orderCode || "mới"} !`);

      // 2. Fetch lại data mới nhất từ Database
      await fetchDashboardData(false);
      return created;
    } catch (e) {
      console.error("Lỗi khi tạo đơn hàng trong Database:", e);
      triggerToast("Không thể lưu đơn hàng vào Database!");
    }
  };

  // 5. FLOW: Cập nhật trạng thái → API cập nhật Database thành công → Fetch lại data Database → Cập nhật state
  const updateOrderStatus = async (orderId, newStatus) => {
    const normalizedStatus = normalizeOrderStatus(newStatus);
    const targetOrder = orders.find((o) => o.id === orderId || o._id === orderId);

    try {
      if (targetOrder?._id) {
        // 1. Cập nhật Database
        await orderAPI.updateStatus(targetOrder._id, normalizedStatus);
      }

      // 2. Fetch lại data mới nhất từ Database
      await fetchDashboardData(false);

      const statusLabels = {
        processing: "Chờ xử lý",
        shipping: "Đang giao hàng",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
      };

      triggerToast(`Đã lưu trạng thái đơn hàng #${orderId} sang: ${statusLabels[normalizedStatus] || normalizedStatus}!`);
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái trong Database:", e);
      triggerToast("Không thể cập nhật trạng thái trên Database!");
    }
  };

  // 6. FLOW: Nhập kho → API cập nhật Database thành công → Fetch lại data Database → Cập nhật state
  const restockProduct = async (skuOrId, amount = 10) => {
    const targetItem = stockItems.find((i) => i.id === skuOrId || i.sku === skuOrId);
    const currentStock = targetItem ? targetItem.stock : 0;
    const updatedStock = currentStock + Number(amount);
    const targetDbId = targetItem?._id || targetItem?.id;

    try {
      if (typeof targetDbId === "string" && targetDbId.length === 24) {
        // 1. Cập nhật Database
        await productAPI.updateStock(targetDbId, updatedStock);
      }

      // 2. Fetch lại data mới nhất từ Database
      await fetchDashboardData(false);
      triggerToast(`Đã lưu +${amount} tồn kho cho ${targetItem?.name || "sản phẩm"}!`);
    } catch (e) {
      console.error("Lỗi cập nhật tồn kho trong Database:", e);
      triggerToast("Không thể cập nhật tồn kho trên Database!");
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        orders,
        stockItems,
        metrics,
        chartDatasets,
        statusCounts,
        statusFilter,
        setStatusFilter,
        filteredOrders,
        createOrder,
        updateOrderStatus,
        restockProduct,
        toastMessage,
        triggerToast,
        revenuePeriod,
        setRevenuePeriod,
        isLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
