"use client";

import { orderAPI } from "@/lib/api";

export const ADMIN_ORDERS_STORAGE_KEY = "dudi_admin_master_orders_v4";

export const normalizeOrderStatus = (st) => {
  if (!st) return "processing";
  const s = String(st).toLowerCase().trim();
  if (s === "pending" || s === "confirmed" || s === "processing" || s === "cho_xu_ly") return "processing";
  if (s === "shipping" || s === "delivering" || s === "dang_giao") return "shipping";
  if (s === "completed" || s === "delivered" || s === "hoan_thanh") return "completed";
  if (s === "cancelled" || s === "canceled" || s === "da_huy") return "cancelled";
  return "processing";
};

export const formatOrderInitials = (name) => {
  if (!name || typeof name !== "string") return "KH";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const defaultMasterOrders = [
  {
    id: "ORD-9021",
    customerName: "Nguyễn Văn A",
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@gmail.com",
    address: "123 Cách Mạng Tháng 8, P.10, Q.3, TP.HCM",
    initials: "NA",
    createdAt: "24/10/2023 14:30",
    time: "10 phút trước",
    total: 35400000,
    price: 35400000,
    product: "Laptop Asus TUF Gaming A15 FA507NV",
    status: "processing",
    paymentMethod: "Chuyển khoản QR (VietQR)",
    note: "Giao giờ hành chính, gọi trước khi đến 15 phút.",
    isToday: true,
    items: [
      {
        id: 1,
        name: "Laptop Asus TUF Gaming A15 FA507NV (Ryzen 7 7735HS/16GB/RTX 4060/144Hz)",
        sku: "ASU-TUF-A15",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
        price: 24990000,
        quantity: 1,
      },
      {
        id: 2,
        name: "RAM Corsair Dominator Titanium 64GB (2x32GB) DDR5 6000MHz White RGB",
        sku: "CMP64GX5M2B",
        image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80",
        price: 9290000,
        quantity: 1,
      },
      {
        id: 3,
        name: "Ổ cứng SSD Kingston NV2 1TB PCIe 4.0 NVMe M.2",
        sku: "KNG-NV2-1TB",
        image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
        price: 1120000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-9020",
    customerName: "Trần Thị B",
    customer: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@gmail.com",
    address: "456 Nguyễn Thị Minh Khai, P.5, Q.1, TP.HCM",
    initials: "TB",
    createdAt: "24/10/2023 10:15",
    time: "45 phút trước",
    total: 13100000,
    price: 13100000,
    product: "CPU AMD Ryzen 7 7800X3D + Chuột Logitech G Pro X",
    status: "shipping",
    paymentMethod: "VNPay Online",
    note: "Hàng dễ vỡ, xin nhẹ tay.",
    isToday: true,
    items: [
      {
        id: 1,
        name: "CPU AMD Ryzen 7 7800X3D (8 nhân 16 luồng, 3D V-Cache 96MB)",
        sku: "AMD-7800X3D",
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
        price: 9900000,
        quantity: 1,
      },
      {
        id: 2,
        name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2",
        sku: "LOG-GPX-SL2",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        price: 3200000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-9019",
    customerName: "Lê Văn Minh",
    customer: "Lê Văn Minh",
    phone: "0912345678",
    email: "minhle99@gmail.com",
    address: "789 Lê Duẩn, P.Hải Châu 1, Q.Hải Châu, Đà Nẵng",
    initials: "LM",
    createdAt: "23/10/2023 16:45",
    time: "2 giờ trước",
    total: 8890000,
    price: 8890000,
    product: "Màn hình Samsung Odyssey G5 27 inch 2K 180Hz",
    status: "completed",
    paymentMethod: "COD (Thanh toán khi nhận)",
    note: "Giao tận nhà chung cư.",
    isToday: true,
    items: [
      {
        id: 1,
        name: "Màn hình Gaming Samsung Odyssey G5 G50D 27 inch 2K 180Hz Fast IPS",
        sku: "SAM-G5-G50D",
        image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
        price: 5690000,
        quantity: 1,
      },
      {
        id: 2,
        name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2",
        sku: "LOG-GPX-SL2",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        price: 3200000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-9018",
    customerName: "Phạm Thị Hoa",
    customer: "Phạm Thị Hoa",
    phone: "0933445566",
    email: "hoapham@gmail.com",
    address: "12 Hùng Vương, P.2, TP. Nha Trang, Khánh Hòa",
    initials: "PH",
    createdAt: "23/10/2023 09:20",
    time: "Hôm qua",
    total: 46490000,
    price: 46490000,
    product: "Mainboard MSI MEG Z790 GODLIKE + Core i9 14900K",
    status: "cancelled",
    paymentMethod: "Chuyển khoản VietQR",
    note: "Khách đổi sang cấu hình khác nên hủy đơn này.",
    isToday: false,
    items: [
      {
        id: 1,
        name: "Mainboard MSI MEG Z790 GODLIKE MAX",
        sku: "MEG-Z790-GL",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
        price: 31990000,
        quantity: 1,
      },
      {
        id: 2,
        name: "CPU Intel Core i9-14900K 24 nhân 32 luồng",
        sku: "BX8071514900K",
        image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
        price: 14500000,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-9017",
    customerName: "Hoàng Công Thành",
    customer: "Hoàng Công Thành",
    phone: "0888777666",
    email: "thanh.hoang@company.vn",
    address: "34 Phan Đăng Lưu, P.3, Q.Bình Thạnh, TP.HCM",
    initials: "HT",
    createdAt: "22/10/2023 18:05",
    time: "2 ngày trước",
    total: 119990000,
    price: 119990000,
    product: "Laptop MSI Titan GT77 HX 13VI (Core i9 / 64GB / RTX 4090)",
    status: "completed",
    paymentMethod: "Thẻ tín dụng Visa/Mastercard",
    note: "Xuất hóa đơn VAT cho công ty.",
    isToday: false,
    items: [
      {
        id: 1,
        name: "Laptop MSI Titan GT77 HX 13VI (Core i9 13980HX/64GB/RTX 4090 16GB/4K 144Hz)",
        sku: "LAPMSI-892",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
        price: 119990000,
        quantity: 1,
      },
    ],
  },
];

export const getMasterOrders = () => {
  if (typeof window === "undefined") return defaultMasterOrders;
  try {
    const saved = localStorage.getItem(ADMIN_ORDERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((o) => ({
          ...o,
          status: normalizeOrderStatus(o.status),
          customer: o.customer || o.customerName || "Khách hàng",
          customerName: o.customerName || o.customer || "Khách hàng",
          price: o.price || o.total || 0,
          total: o.total || o.price || 0,
          initials: o.initials || formatOrderInitials(o.customerName || o.customer),
        }));
      }
    }
  } catch (e) {
    console.error("Error reading master orders:", e);
  }
  return defaultMasterOrders;
};

export const saveMasterOrders = (orders) => {
  if (typeof window === "undefined") return;
  try {
    const normalized = orders.map((o) => ({
      ...o,
      status: normalizeOrderStatus(o.status),
      customer: o.customer || o.customerName || "Khách hàng",
      customerName: o.customerName || o.customer || "Khách hàng",
      price: o.price || o.total || 0,
      total: o.total || o.price || 0,
      initials: o.initials || formatOrderInitials(o.customerName || o.customer),
    }));
    localStorage.setItem(ADMIN_ORDERS_STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent("admin_orders_updated", { detail: normalized }));
  } catch (e) {
    console.error("Error saving master orders:", e);
  }
};

export const mapBackendOrderToMaster = (o, idx = 0) => {
  const customerName = o.customerInfo?.fullName || "Khách hàng";
  const total = o.finalAmount || o.totalAmount || (o.items && o.items[0]?.price) || 15000000;
  const items = Array.isArray(o.items) && o.items.length > 0
    ? o.items.map((it, itemIdx) => ({
        id: it._id || itemIdx + 1,
        name: it.name || "Sản phẩm linh kiện máy tính",
        sku: it.sku || `SKU-${100 + itemIdx}`,
        image: it.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
        price: it.price || total,
        quantity: it.quantity || 1,
      }))
    : [
        {
          id: 1,
          name: o.items?.[0]?.name || "Sản phẩm đặt hàng",
          sku: `SKU-${100 + idx}`,
          image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
          price: total,
          quantity: 1,
        },
      ];

  const firstItemName = items[0]?.name || "Sản phẩm đơn hàng";
  const productSummary = items.length > 1 ? `${firstItemName} (+${items.length - 1} sp khác)` : firstItemName;

  const orderDate = new Date(o.createdAt || Date.now());
  const now = new Date();
  const isToday = orderDate.toDateString() === now.toDateString();

  return {
    id: o.orderCode || o._id || `ORD-${9022 + idx}`,
    _id: o._id,
    customerName,
    customer: customerName,
    phone: o.customerInfo?.phone || "",
    email: o.customerInfo?.email || "",
    address: o.customerInfo?.address || "Giao hàng tận nơi",
    initials: formatOrderInitials(customerName),
    createdAt: orderDate.toLocaleString("vi-VN"),
    time: isToday ? "Hôm nay" : orderDate.toLocaleDateString("vi-VN"),
    total,
    price: total,
    product: productSummary,
    status: normalizeOrderStatus(o.orderStatus),
    paymentMethod: o.paymentMethod || "COD (Thanh toán khi nhận)",
    note: o.customerInfo?.note || "",
    items,
    isToday,
    rawCreatedAt: o.createdAt || new Date().toISOString(),
  };
};
