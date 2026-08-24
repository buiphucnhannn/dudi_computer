import mongoose from "mongoose";
import { orderRepository } from "../repositories/index.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

class OrderService {
  async getOrders(queryParams = {}) {
    const { search, status, page = 1, limit = 20 } = queryParams;
    return await orderRepository.findWithFilters({ search, status, page, limit });
  }

  async getOrderById(id) {
    if (!id) throw new ApiError(400, "ID đơn hàng không hợp lệ");
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Không tìm thấy đơn hàng");
    return order;
  }

  /**
   * Tạo đơn hàng chuẩn Enterprise:
   * 1. Kiểm tra thông tin người nhận
   * 2. Truy vấn Database lấy giá, tên, hình ảnh thực tế từ Product model
   * 3. Tính toán tổng tiền chính xác từ backend (chống gian lận)
   * 4. Cập nhật tồn kho (giảm stock) và tăng soldCount
   * 5. Khởi tạo orderStatus = "processing" (Đang xử lý)
   * 6. Lưu vào Database và trả về dữ liệu đơn hàng
   */
  async createOrder(orderData) {
    const {
      customerName,
      fullName,
      phone,
      email,
      address,
      province,
      district,
      note,
      items,
      totalAmount,
      price,
      product,
      paymentMethod,
      userId,
      user,
    } = orderData;

    const finalCustomerName = customerName || fullName;
    if (!finalCustomerName || !phone) {
      throw new ApiError(400, "Vui lòng nhập họ tên khách hàng và số điện thoại người nhận");
    }

    if (!address) {
      throw new ApiError(400, "Vui lòng nhập địa chỉ nhận hàng");
    }

    // Normalize payment method to enum ["cod", "banking", "installment", "momo", "vnpay"]
    let normalizedPayment = "cod";
    if (paymentMethod) {
      const pm = String(paymentMethod).toLowerCase();
      if (pm.includes("bank") || pm.includes("chuyển khoản") || pm.includes("chuyen khoan") || pm.includes("vietqr")) {
        normalizedPayment = "banking";
      } else if (pm.includes("momo")) {
        normalizedPayment = "momo";
      } else if (pm.includes("vnpay")) {
        normalizedPayment = "vnpay";
      } else if (pm.includes("tra gop") || pm.includes("trả góp") || pm.includes("installment")) {
        normalizedPayment = "installment";
      } else {
        normalizedPayment = "cod";
      }
    }

    // Process & Verify items directly from MongoDB Products
    const rawItems = items && Array.isArray(items) && items.length > 0
      ? items
      : [
          {
            name: product || "Sản phẩm đặt hàng",
            price: Number(totalAmount || price || 0),
            quantity: 1,
          },
        ];

    const formattedItems = [];

    for (const item of rawItems) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let targetProduct = null;

      // Tìm sản phẩm theo ObjectId, id hoặc slug
      const candidateId = item.product || item._id || item.id;
      if (candidateId && mongoose.Types.ObjectId.isValid(String(candidateId))) {
        targetProduct = await Product.findById(candidateId);
      }

      if (!targetProduct && item.slug) {
        targetProduct = await Product.findOne({ slug: item.slug });
      }

      if (!targetProduct && item.name) {
        targetProduct = await Product.findOne({ name: item.name });
      }

      if (targetProduct) {
        // Lấy giá bán thực tế từ Database (ưu tiên discountPrice nếu có giá trị)
        const livePrice = (targetProduct.discountPrice && targetProduct.discountPrice > 0)
          ? targetProduct.discountPrice
          : targetProduct.price;

        const liveThumbnail = targetProduct.thumbnail || (targetProduct.images && targetProduct.images[0]) || item.thumbnail || item.image || "";

        formattedItems.push({
          product: targetProduct._id,
          name: targetProduct.name,
          slug: targetProduct.slug,
          price: Number(livePrice || 0),
          quantity,
          thumbnail: liveThumbnail,
          specs: targetProduct.specs || {},
        });

        // Cập nhật giảm tồn kho và tăng số lượng bán
        targetProduct.stock = Math.max(0, (targetProduct.stock || 0) - quantity);
        targetProduct.soldCount = (targetProduct.soldCount || 0) + quantity;
        await targetProduct.save();
      } else {
        // Fallback nếu là sản phẩm tự cấu hình hoặc không tìm thấy
        formattedItems.push({
          name: item.name || "Sản phẩm đặt hàng",
          slug: item.slug || "",
          price: Number(item.price || 0),
          quantity,
          thumbnail: item.thumbnail || item.image || "",
          specs: item.specs || {},
        });
      }
    }

    if (formattedItems.length === 0) {
      throw new ApiError(400, "Đơn hàng phải có ít nhất 1 sản phẩm");
    }

    // Tính tổng tiền an toàn ở backend
    const calculatedSum = formattedItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `ZC-${dateStr}-${randomSuffix}`;

    const newOrderData = {
      orderCode,
      user: userId || user || null,
      customerInfo: {
        fullName: finalCustomerName.trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : "",
        address: String(address).trim(),
        province: province || "",
        district: district || "",
        note: note ? String(note).trim() : "",
      },
      items: formattedItems,
      totalAmount: calculatedSum,
      shippingFee: 0,
      discountAmount: 0,
      finalAmount: calculatedSum,
      paymentMethod: normalizedPayment,
      paymentStatus: normalizedPayment === "banking" || normalizedPayment === "vnpay" || normalizedPayment === "momo" ? "pending" : "pending",
      orderStatus: "processing", // Luôn bắt đầu bằng "processing" (Đang xử lý)
      timeline: [
        {
          status: "processing",
          note: "Đơn hàng được khởi tạo thành công - Đang chờ xử lý",
          updatedAt: new Date(),
        },
      ],
    };

    const createdOrder = await orderRepository.create(newOrderData);

    // Tự động tạo thông báo Admin cho đơn hàng mới
    try {
      const { notificationService } = await import("./notificationService.js");
      await notificationService.createNotification({
        title: `Đơn hàng mới #${createdOrder.orderCode}`,
        message: `Khách hàng ${finalCustomerName} (${phone}) vừa đặt đơn hàng trị giá ${new Intl.NumberFormat("vi-VN").format(calculatedSum)}₫`,
        type: "order",
        link: "/admin/orders",
        entityId: createdOrder._id,
        entityType: "Order",
        metadata: {
          orderCode: createdOrder.orderCode,
          customerName: finalCustomerName,
          phone,
          finalAmount: calculatedSum,
        },
      });
    } catch (notifErr) {
      console.error("Lỗi khi tạo notification cho đơn hàng mới:", notifErr);
    }

    return createdOrder;
  }

  async updateOrderStatus(id, status, note = "") {
    if (!id) throw new ApiError(400, "ID đơn hàng không hợp lệ");
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Không tìm thấy đơn hàng");

    const validStatuses = ["pending", "confirmed", "processing", "shipping", "completed", "cancelled"];
    let normalized = status;
    if (!validStatuses.includes(normalized)) {
      if (normalized === "chờ xử lý" || normalized === "cho xu ly") normalized = "processing";
      else if (normalized === "đang giao" || normalized === "dang giao") normalized = "shipping";
      else if (normalized === "đã hoàn thành" || normalized === "da hoan thanh") normalized = "completed";
      else if (normalized === "đã hủy" || normalized === "da huy") normalized = "cancelled";
      else normalized = "processing";
    }

    order.orderStatus = normalized;
    order.timeline.push({
      status: normalized,
      note: note || `Đơn hàng chuyển sang trạng thái: ${normalized}`,
      updatedAt: new Date(),
    });

    const updatedOrder = await order.save();

    // Tự động tạo thông báo Admin khi đơn hàng đổi trạng thái
    try {
      const { notificationService } = await import("./notificationService.js");
      const statusVNMap = {
        processing: "Đang xử lý",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao hàng",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
        pending: "Chờ thanh toán",
      };
      await notificationService.createNotification({
        title: `Đơn hàng #${order.orderCode} cập nhật trạng thái`,
        message: `Trạng thái chuyển sang: "${statusVNMap[normalized] || normalized}" - ${note || "Cập nhật thành công"}`,
        type: "order_status",
        link: "/admin/orders",
        entityId: order._id,
        entityType: "Order",
        metadata: {
          orderCode: order.orderCode,
          orderStatus: normalized,
        },
      });
    } catch (notifErr) {
      console.error("Lỗi khi tạo notification đổi trạng thái đơn hàng:", notifErr);
    }

    return updatedOrder;
  }

  async deleteOrder(id) {
    if (!id) throw new ApiError(400, "ID đơn hàng không hợp lệ");
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Không tìm thấy đơn hàng");
    return await orderRepository.deleteById(id);
  }
}

export const orderService = new OrderService();
