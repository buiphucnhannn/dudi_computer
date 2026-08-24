import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";
import { Product } from "./models/Product.js";
import { Order } from "./models/Order.js";
import { User } from "./models/User.js";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const CUSTOMERS = [
  {
    name: "Bùi Phúc Nhân",
    phone: "0908123456",
    email: "phucnhan.bui@gmail.com",
    address: "128 Nguyễn Trãi, Phường 3, Quận 5, TP. Hồ Chí Minh",
  },
  {
    name: "Nguyễn Hoàng Long",
    phone: "0912345678",
    email: "hoanglong.tech@gmail.com",
    address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  },
  {
    name: "Trần Thị Mai Hương",
    phone: "0987654321",
    email: "maihuong.tran@gmail.com",
    address: "234 Hoàng Diệu, Phường 8, Quận 4, TP. Hồ Chí Minh",
  },
  {
    name: "Lê Quốc Bảo",
    phone: "0934567890",
    email: "quocbao.gaming@gmail.com",
    address: "56 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội",
  },
  {
    name: "Phạm Minh Tuấn",
    phone: "0978112233",
    email: "tuan.pham@company.vn",
    address: "78 Nguyễn Huệ, Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng",
  },
  {
    name: "Đặng Thu Thảo",
    phone: "0965889900",
    email: "thuthao.dang@gmail.com",
    address: "12 Phan Đăng Lưu, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh",
  },
  {
    name: "Võ Hoàng Nam",
    phone: "0888999111",
    email: "hoangnam.vo@gmail.com",
    address: "89 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa",
  },
  {
    name: "Hoàng Kim Chi",
    phone: "0945667788",
    email: "kimchi.hoang@gmail.com",
    address: "15 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  },
];

const PAYMENT_METHODS = ["banking", "cod", "vnpay", "momo", "installment"];
const STATUSES = ["completed", "completed", "completed", "shipping", "processing", "cancelled"];

async function seedRealData() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "zcomputer_clone",
    });
    console.log("Connected to MongoDB successfully!");

    // 1. Fetch available products
    const products = await Product.find().limit(30);
    if (products.length === 0) {
      console.log("No products found in DB! Please make sure products exist.");
      process.exit(1);
    }
    console.log(`Found ${products.length} products to create orders from.`);

    // 2. Create customer users if not existing
    console.log("Checking customer users...");
    for (const cust of CUSTOMERS) {
      const existing = await User.findOne({ email: cust.email });
      if (!existing) {
        await User.create({
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
          address: cust.address,
          password: "password123",
          role: "user",
          status: "active",
        });
        console.log(`Created user: ${cust.name} (${cust.email})`);
      }
    }

    // 3. Clear existing orders to avoid duplicates and build clean realistic timeline
    const currentOrderCount = await Order.countDocuments();
    console.log(`Current orders in database: ${currentOrderCount}`);

    // If there are already orders, we can either append or seed a fresh comprehensive set
    // Let's create realistic orders over the past 6 months + 30 days + 7 days + today
    const ordersToInsert = [];
    const now = new Date();

    // Helper to generate a date relative to now
    function getDateDaysAgo(daysAgo, hour = 14, min = 30) {
      const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      d.setHours(hour, min, Math.floor(Math.random() * 59));
      return d;
    }

    function getDateMonthsAgo(monthsAgo, dayOfMonth = 15, hour = 10) {
      const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, dayOfMonth, hour, Math.floor(Math.random() * 59));
      return d;
    }

    // A. Historic Orders across past 5 months (for monthly revenue chart)
    for (let m = 5; m >= 1; m--) {
      // 4-8 orders per month
      const countInMonth = Math.floor(5 + Math.random() * 4);
      for (let i = 0; i < countInMonth; i++) {
        const cust = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const prod1 = products[Math.floor(Math.random() * products.length)];
        const prod2 = Math.random() > 0.6 ? products[Math.floor(Math.random() * products.length)] : null;

        const qty1 = Math.floor(1 + Math.random() * 2);
        const items = [
          {
            product: prod1._id,
            name: prod1.name,
            slug: prod1.slug,
            price: prod1.price,
            quantity: qty1,
            thumbnail: prod1.thumbnail || (prod1.images && prod1.images[0]) || "",
          },
        ];

        if (prod2 && String(prod2._id) !== String(prod1._id)) {
          items.push({
            product: prod2._id,
            name: prod2.name,
            slug: prod2.slug,
            price: prod2.price,
            quantity: 1,
            thumbnail: prod2.thumbnail || (prod2.images && prod2.images[0]) || "",
          });
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const dayOfMonth = Math.min(28, Math.floor(2 + i * 4));
        const orderDate = getDateMonthsAgo(m, dayOfMonth, Math.floor(9 + Math.random() * 10));

        const orderCode = `ZC-${orderDate.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

        ordersToInsert.push({
          orderCode,
          customerInfo: {
            fullName: cust.name,
            phone: cust.phone,
            email: cust.email,
            address: cust.address,
            note: "Giao hàng giờ hành chính",
          },
          items,
          totalAmount,
          shippingFee: 0,
          discountAmount: 0,
          finalAmount: totalAmount,
          paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
          paymentStatus: "paid",
          orderStatus: "completed",
          createdAt: orderDate,
          updatedAt: orderDate,
          timeline: [
            {
              status: "processing",
              note: "Đơn hàng đã được tiếp nhận và xử lý",
              updatedAt: orderDate,
            },
            {
              status: "shipping",
              note: "Bàn giao đơn vị vận chuyển Viettel Post",
              updatedAt: new Date(orderDate.getTime() + 4 * 3600 * 1000),
            },
            {
              status: "completed",
              note: "Giao hàng thành công tới khách hàng",
              updatedAt: new Date(orderDate.getTime() + 28 * 3600 * 1000),
            },
          ],
        });
      }
    }

    // B. Orders in the last 7 days (for daily revenue & dashboard)
    for (let day = 6; day >= 1; day--) {
      const countInDay = Math.floor(2 + Math.random() * 3);
      for (let i = 0; i < countInDay; i++) {
        const cust = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const prod = products[Math.floor(Math.random() * products.length)];
        const qty = 1;

        const items = [
          {
            product: prod._id,
            name: prod.name,
            slug: prod.slug,
            price: prod.price,
            quantity: qty,
            thumbnail: prod.thumbnail || (prod.images && prod.images[0]) || "",
          },
        ];

        const totalAmount = prod.price * qty;
        const orderDate = getDateDaysAgo(day, 8 + i * 3, Math.floor(Math.random() * 50));
        const status = day === 1 ? "shipping" : "completed";

        const orderCode = `ZC-${orderDate.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

        ordersToInsert.push({
          orderCode,
          customerInfo: {
            fullName: cust.name,
            phone: cust.phone,
            email: cust.email,
            address: cust.address,
            note: "Khách gọi trước khi giao",
          },
          items,
          totalAmount,
          shippingFee: 0,
          discountAmount: 0,
          finalAmount: totalAmount,
          paymentMethod: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
          paymentStatus: status === "completed" ? "paid" : "pending",
          orderStatus: status,
          createdAt: orderDate,
          updatedAt: orderDate,
          timeline: [
            {
              status: "processing",
              note: "Đơn hàng đã được xác nhận",
              updatedAt: orderDate,
            },
            {
              status: status,
              note: status === "completed" ? "Giao hàng thành công" : "Đang trung chuyển",
              updatedAt: new Date(orderDate.getTime() + 12 * 3600 * 1000),
            },
          ],
        });
      }
    }

    // C. Orders TODAY (Live real-time dashboard data)
    const todayOrdersData = [
      {
        cust: CUSTOMERS[0],
        prodIndex: 0,
        status: "processing",
        payment: "banking",
        hour: 9,
        min: 15,
        note: "Khách chuyển khoản VietQR, cần kiểm tra nhanh linh kiện",
      },
      {
        cust: CUSTOMERS[1],
        prodIndex: 1 % products.length,
        status: "shipping",
        payment: "vnpay",
        hour: 10,
        min: 45,
        note: "Đã đóng gói chống sốc kỹ, đang bàn giao shipper",
      },
      {
        cust: CUSTOMERS[2],
        prodIndex: 2 % products.length,
        status: "processing",
        payment: "cod",
        hour: 11,
        min: 30,
        note: "Giao giờ hành chính chiều nay",
      },
      {
        cust: CUSTOMERS[3],
        prodIndex: 3 % products.length,
        status: "completed",
        payment: "banking",
        hour: 8,
        min: 20,
        note: "Khách nhận máy trực tiếp tại cửa hàng ZComputer",
      },
    ];

    for (const item of todayOrdersData) {
      const prod = products[item.prodIndex];
      const items = [
        {
          product: prod._id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          quantity: 1,
          thumbnail: prod.thumbnail || (prod.images && prod.images[0]) || "",
        },
      ];

      const totalAmount = prod.price;
      const orderDate = new Date();
      orderDate.setHours(item.hour, item.min, 0);

      const orderCode = `ZC-${orderDate.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

      ordersToInsert.push({
        orderCode,
        customerInfo: {
          fullName: item.cust.name,
          phone: item.cust.phone,
          email: item.cust.email,
          address: item.cust.address,
          note: item.note,
        },
        items,
        totalAmount,
        shippingFee: 0,
        discountAmount: 0,
        finalAmount: totalAmount,
        paymentMethod: item.payment,
        paymentStatus: item.status === "completed" || item.payment === "banking" ? "paid" : "pending",
        orderStatus: item.status,
        createdAt: orderDate,
        updatedAt: orderDate,
        timeline: [
          {
            status: item.status,
            note: item.note,
            updatedAt: orderDate,
          },
        ],
      });
    }

    console.log(`Inserting ${ordersToInsert.length} realistic orders into MongoDB...`);
    await Order.insertMany(ordersToInsert);
    console.log("Inserted orders successfully!");

    // 4. Update Product sales & stock numbers
    console.log("Updating product soldCount and stock...");
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const sold = Math.floor(10 + Math.random() * 60);
      const stock = i < 3 ? Math.floor(1 + Math.random() * 3) : Math.floor(5 + Math.random() * 25);
      await Product.findByIdAndUpdate(p._id, {
        soldCount: sold,
        stock: stock,
      });
    }
    console.log("Updated products stock and soldCount successfully!");

    console.log("=== SEEDING COMPLETED SUCCESSFULLY ===");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding real data:", error);
    process.exit(1);
  }
}

seedRealData();
