import mongoose from "mongoose";
import { orderRepository } from "../repositories/index.js";
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

  async createOrder(orderData) {
    const {
      customerName,
      fullName,
      phone,
      email,
      address,
      note,
      items,
      totalAmount,
      price,
      product,
      paymentMethod,
      orderStatus,
      status,
    } = orderData;

    const finalCustomerName = customerName || fullName;
    if (!finalCustomerName || !phone) {
      throw new ApiError(400, "Vui lòng nhập tên khách hàng và số điện thoại");
    }

    const calculatedTotal = Number(totalAmount || price || 0);

    // Normalize payment method to enum ["cod", "banking", "installment", "momo", "vnpay"]
    let normalizedPayment = "cod";
    if (paymentMethod) {
      const pm = String(paymentMethod).toLowerCase();
      if (pm.includes("bank") || pm.includes("chuyển khoản") || pm.includes("chuyen khoan")) {
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

    // Normalize order status to enum ["pending", "confirmed", "processing", "shipping", "completed", "cancelled"]
    let normalizedStatus = "processing";
    const st = String(status || orderStatus || "").toLowerCase();
    if (st.includes("ship") || st.includes("giao")) {
      normalizedStatus = "shipping";
    } else if (st.includes("complete") || st.includes("hoàn thành") || st.includes("hoan thanh")) {
      normalizedStatus = "completed";
    } else if (st.includes("cancel") || st.includes("hủy") || st.includes("huy")) {
      normalizedStatus = "cancelled";
    } else if (st.includes("pending") || st.includes("chờ") || st.includes("cho")) {
      normalizedStatus = "pending";
    } else if (st.includes("confirm") || st.includes("xác nhận") || st.includes("xac nhan")) {
      normalizedStatus = "confirmed";
    }

    // Format items
    const rawItems = items && Array.isArray(items) && items.length > 0
      ? items
      : [
          {
            name: product || "Sản phẩm linh kiện máy tính",
            price: calculatedTotal,
            quantity: 1,
          },
        ];

    const formattedItems = rawItems.map((item) => {
      const isValId = item.product && mongoose.Types.ObjectId.isValid(String(item.product));
      return {
        name: item.name || "Sản phẩm đặt hàng",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        thumbnail: item.thumbnail || item.image || "",
        product: isValId ? item.product : undefined,
      };
    });

    const finalSum = calculatedTotal > 0
      ? calculatedTotal
      : formattedItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `ZC-${dateStr}-${randomSuffix}`;

    const newOrderData = {
      orderCode,
      customerInfo: {
        fullName: finalCustomerName,
        phone,
        email: email || "",
        address: address || "Giao hàng tận nơi",
        note: note || "",
      },
      items: formattedItems,
      totalAmount: finalSum,
      shippingFee: 0,
      discountAmount: 0,
      finalAmount: finalSum,
      paymentMethod: normalizedPayment,
      orderStatus: normalizedStatus,
      timeline: [
        {
          status: normalizedStatus,
          note: "Đơn hàng được khởi tạo thành công",
          updatedAt: new Date(),
        },
      ],
    };

    return await orderRepository.create(newOrderData);
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

    return await order.save();
  }

  async deleteOrder(id) {
    if (!id) throw new ApiError(400, "ID đơn hàng không hợp lệ");
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Không tìm thấy đơn hàng");
    return await orderRepository.deleteById(id);
  }
}

export const orderService = new OrderService();
