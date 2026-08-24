import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";

class StatisticService {
  /**
   * Get high-level dashboard KPIs and summary metrics
   */
  async getDashboardSummary() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    // Total orders & revenue
    const allOrders = await Order.find().lean();
    const totalOrders = allOrders.length;

    const completedOrders = allOrders.filter((o) => o.orderStatus === "completed");
    const cancelledOrders = allOrders.filter((o) => o.orderStatus === "cancelled");
    const validOrders = allOrders.filter((o) => o.orderStatus !== "cancelled");

    const totalRevenue = validOrders.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

    // Today's orders & revenue
    const todayOrders = allOrders.filter((o) => new Date(o.createdAt) >= startOfToday);
    const todayOrdersCount = todayOrders.length;
    const todayRevenue = todayOrders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

    // Yesterday's revenue for growth calculation
    const yesterdayOrders = allOrders.filter(
      (o) => new Date(o.createdAt) >= startOfYesterday && new Date(o.createdAt) < startOfToday
    );
    const yesterdayRevenue = yesterdayOrders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

    let todayGrowth = 0;
    if (yesterdayRevenue > 0) {
      todayGrowth = Number((((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1));
    } else if (todayRevenue > 0) {
      todayGrowth = 100;
    }

    // Customer count
    const registeredUsersCount = await User.countDocuments({ role: "user" });
    const distinctCustomerPhones = new Set(allOrders.map((o) => o.customerInfo?.phone).filter(Boolean)).size;
    const totalCustomers = Math.max(registeredUsersCount, distinctCustomerPhones, 1);

    // Low stock products (stock <= 3)
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 3 } });

    // Cancel rate
    const cancelRate = totalOrders > 0 ? Number(((cancelledOrders.length / totalOrders) * 100).toFixed(1)) : 0;

    // Status counts
    const statusCounts = {
      processing: allOrders.filter((o) => ["processing", "pending", "confirmed"].includes(o.orderStatus)).length,
      shipping: allOrders.filter((o) => o.orderStatus === "shipping").length,
      completed: completedOrders.length,
      cancelled: cancelledOrders.length,
      all: totalOrders,
    };

    return {
      totalRevenue,
      todayRevenue,
      todayOrdersCount,
      totalOrders,
      totalCustomers,
      lowStockCount,
      cancelRate,
      todayGrowth: `${todayGrowth >= 0 ? "+" : ""}${todayGrowth}%`,
      statusCounts,
    };
  }

  /**
   * Get revenue chart data by timeframe (7d, 30d, month, year)
   */
  async getRevenueChart(period = "7d") {
    const allOrders = await Order.find({ orderStatus: { $ne: "cancelled" } })
      .sort({ createdAt: 1 })
      .lean();

    const now = new Date();

    if (period === "7d") {
      const daysOfWeek = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
      const dailyData = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const nextD = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

        const ordersInDay = allOrders.filter(
          (o) => new Date(o.createdAt) >= d && new Date(o.createdAt) < nextD
        );
        const dayRevenue = ordersInDay.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

        const dayName = i === 0 ? "Hôm nay" : daysOfWeek[d.getDay()];

        dailyData.push({
          day: dayName,
          date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
          val: dayRevenue,
          orders: ordersInDay.length,
        });
      }

      const total7d = dailyData.reduce((sum, d) => sum + d.val, 0);
      const maxVal = Math.max(...dailyData.map((d) => d.val), 1000000);
      const minVal = Math.min(...dailyData.map((d) => d.val), 0);
      const range = maxVal - minVal || 1;

      const points = dailyData.map((item, idx) => {
        const cx = (idx / (dailyData.length - 1 || 1)) * 100;
        const cy = 85 - ((item.val - minVal) / range) * 65;
        return {
          day: item.day,
          date: item.date,
          value: `${item.val.toLocaleString("vi-VN")}₫`,
          val: item.val,
          orders: item.orders,
          cx: Number(cx.toFixed(1)),
          cy: Number(cy.toFixed(1)),
        };
      });

      const polyPoints = points.map((p) => `${p.cx},${p.cy}`).join(" ");
      const polyFill = `${polyPoints} 100,100 0,100`;

      return {
        period: "7d",
        total: total7d,
        totalFormatted: `${total7d.toLocaleString("vi-VN")}₫`,
        labels: dailyData.map((d) => d.day),
        points,
        polyPoints,
        polyFill,
        raw: dailyData,
      };
    }

    if (period === "30d") {
      const weeklyData = [];
      for (let w = 3; w >= 0; w--) {
        const startWeek = new Date(now.getTime() - (w + 1) * 7 * 24 * 60 * 60 * 1000);
        const endWeek = new Date(now.getTime() - w * 7 * 24 * 60 * 60 * 1000);

        const ordersInWeek = allOrders.filter(
          (o) => new Date(o.createdAt) >= startWeek && new Date(o.createdAt) < endWeek
        );
        const weekRevenue = ordersInWeek.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);

        weeklyData.push({
          day: `Tuần ${4 - w}`,
          val: weekRevenue,
          orders: ordersInWeek.length,
        });
      }

      const total30d = weeklyData.reduce((sum, d) => sum + d.val, 0);
      const maxVal = Math.max(...weeklyData.map((d) => d.val), 1000000);
      const minVal = Math.min(...weeklyData.map((d) => d.val), 0);
      const range = maxVal - minVal || 1;

      const points = weeklyData.map((item, idx) => {
        const cx = (idx / (weeklyData.length - 1 || 1)) * 100;
        const cy = 85 - ((item.val - minVal) / range) * 65;
        return {
          day: item.day,
          value: `${item.val.toLocaleString("vi-VN")}₫`,
          val: item.val,
          orders: item.orders,
          cx: Number(cx.toFixed(1)),
          cy: Number(cy.toFixed(1)),
        };
      });

      const polyPoints = points.map((p) => `${p.cx},${p.cy}`).join(" ");
      const polyFill = `${polyPoints} 100,100 0,100`;

      return {
        period: "30d",
        total: total30d,
        totalFormatted: `${total30d.toLocaleString("vi-VN")}₫`,
        labels: weeklyData.map((d) => d.day),
        points,
        polyPoints,
        polyFill,
        raw: weeklyData,
      };
    }

    // Default: monthly data for the last 6 months
    const monthlyList = [];
    for (let m = 5; m >= 0; m--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - m + 1, 1);

      const ordersInMonth = allOrders.filter(
        (o) => new Date(o.createdAt) >= monthDate && new Date(o.createdAt) < nextMonthDate
      );

      const rev = ordersInMonth.reduce((sum, o) => sum + (o.finalAmount || o.totalAmount || 0), 0);
      const orderCount = ordersInMonth.length;
      // Estimated 20% gross profit margin
      const profit = Math.round(rev * 0.2);

      monthlyList.push({
        month: `Tháng ${monthDate.getMonth() + 1}`,
        revenue: rev,
        orders: orderCount,
        profit,
        rawDate: monthDate,
      });
    }

    // Compute month-over-month growth
    const monthlyData = monthlyList.map((item, idx, arr) => {
      let growth = "+0.0%";
      if (idx > 0) {
        const prevRev = arr[idx - 1].revenue;
        if (prevRev > 0) {
          const diff = ((item.revenue - prevRev) / prevRev) * 100;
          growth = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
        } else if (item.revenue > 0) {
          growth = "+100%";
        }
      }
      return {
        month: item.month,
        revenue: item.revenue,
        orders: item.orders,
        profit: item.profit,
        growth,
      };
    });

    const totalRev = monthlyData.reduce((s, m) => s + m.revenue, 0);
    const totalOrders = monthlyData.reduce((s, m) => s + m.orders, 0);

    return {
      period: "month",
      monthlyData,
      totalRevenue: totalRev,
      totalOrders,
    };
  }

  /**
   * Get category sales breakdown ratio
   */
  async getSalesRatio() {
    const allOrders = await Order.find({ orderStatus: { $ne: "cancelled" } }).lean();
    const categories = await Category.find().lean();
    const products = await Product.find().lean();

    const productMap = new Map(products.map((p) => [String(p._id), p]));
    const categoryRevenueMap = new Map();

    // Sum revenue per category from order items
    let hasOrderItems = false;
    for (const order of allOrders) {
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          hasOrderItems = true;
          const itemAmount = (item.price || 0) * (item.quantity || 1);
          let catName = "Linh kiện & Phụ kiện";

          if (item.product && productMap.has(String(item.product))) {
            const p = productMap.get(String(item.product));
            catName = p.categoryName || catName;
          } else if (item.name) {
            const lower = item.name.toLowerCase();
            if (lower.includes("vga") || lower.includes("card") || lower.includes("rtx")) catName = "Card Màn Hình (VGA)";
            else if (lower.includes("cpu") || lower.includes("intel") || lower.includes("ryzen")) catName = "Vi xử lý (CPU)";
            else if (lower.includes("laptop") || lower.includes("macbook")) catName = "Laptop Gaming";
            else if (lower.includes("mainboard") || lower.includes("bo mạch")) catName = "Mainboard - Bo mạch chủ";
            else if (lower.includes("ram") || lower.includes("bộ nhớ")) catName = "RAM - Bộ nhớ trong";
            else if (lower.includes("màn hình")) catName = "Màn hình máy tính";
          }

          categoryRevenueMap.set(catName, (categoryRevenueMap.get(catName) || 0) + itemAmount);
        }
      }
    }

    // If no order items yet, fallback to product count / stock distribution in database
    if (!hasOrderItems || categoryRevenueMap.size === 0) {
      for (const p of products) {
        const catName = p.categoryName || "Khác";
        const val = (p.price || 1000000) * (p.stock || 1);
        categoryRevenueMap.set(catName, (categoryRevenueMap.get(catName) || 0) + val);
      }
    }

    const total = Array.from(categoryRevenueMap.values()).reduce((sum, v) => sum + v, 0) || 1;

    const sorted = Array.from(categoryRevenueMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const colors = [
      { color: "text-slate-900", dot: "bg-slate-900", stroke: "#0f172a" },
      { color: "text-[#DC2626]", dot: "bg-red-600", stroke: "#dc2626" },
      { color: "text-blue-600", dot: "bg-blue-600", stroke: "#2563eb" },
      { color: "text-amber-600", dot: "bg-amber-600", stroke: "#d97706" },
      { color: "text-slate-400", dot: "bg-slate-400", stroke: "#94a3b8" },
    ];

    const result = sorted.map(([label, rev], idx) => {
      const percent = Math.max(1, Math.round((rev / total) * 100));
      const style = colors[idx % colors.length];
      return {
        label,
        value: percent,
        revenue: rev,
        ...style,
      };
    });

    // Normalize so sum is 100%
    const currentSum = result.reduce((s, r) => s + r.value, 0);
    if (result.length > 0 && currentSum !== 100) {
      result[0].value += 100 - currentSum;
    }

    return result;
  }

  /**
   * Get top selling products aggregated from orders and product inventory
   */
  async getTopProducts(limit = 10) {
    const products = await Product.find().lean();
    const allOrders = await Order.find({ orderStatus: { $ne: "cancelled" } }).lean();

    // Map sales count and revenue from orders
    const salesMap = new Map();

    for (const order of allOrders) {
      if (Array.isArray(order.items)) {
        for (const it of order.items) {
          const key = it.product ? String(it.product) : it.name;
          const current = salesMap.get(key) || { sold: 0, revenue: 0 };
          current.sold += it.quantity || 1;
          current.revenue += (it.price || 0) * (it.quantity || 1);
          salesMap.set(key, current);
        }
      }
    }

    const mappedProducts = products.map((p) => {
      const orderSales = salesMap.get(String(p._id)) || salesMap.get(p.name) || { sold: 0, revenue: 0 };
      const sold = p.soldCount || orderSales.sold || 0;
      const revenue = orderSales.revenue || sold * (p.price || 0);
      const progress = Math.min(100, Math.round((sold / Math.max(sold + (p.stock || 0), 1)) * 100));

      return {
        id: p._id,
        name: p.name,
        slug: p.slug,
        category: p.categoryName || "Linh kiện",
        categoryKey: p.categorySlug || "other",
        code: p.sku || `SKU-${String(p._id).slice(-4).toUpperCase()}`,
        price: p.price,
        priceFormatted: `${(p.price || 0).toLocaleString("vi-VN")}₫`,
        progress: progress || (sold > 0 ? 80 : 20),
        sold,
        stock: p.stock ?? 0,
        revenue,
        rating: p.ratings?.average || 5.0,
        image: p.thumbnail || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
      };
    });

    // Sort by sold descending, then revenue descending
    mappedProducts.sort((a, b) => {
      if (b.sold !== a.sold) return b.sold - a.sold;
      return b.revenue - a.revenue;
    });

    return mappedProducts.slice(0, Number(limit));
  }
}

export const statisticService = new StatisticService();
