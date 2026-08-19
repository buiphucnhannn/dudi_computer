import { orderRepository, productRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class OrderService {
  async createOrder(userId, orderPayload) {
    const { customerInfo, items, totalAmount, paymentMethod, note } = orderPayload;

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      throw new ApiError(400, "Vui lòng nhập đầy đủ thông tin giao hàng (họ tên, số điện thoại, địa chỉ)");
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Giỏ hàng rỗng, không thể tạo đơn hàng");
    }

    // Nghiệp vụ: Kiểm tra từng sản phẩm và tính toán
    let calculatedTotal = 0;
    for (const item of items) {
      if (!item.product) {
        throw new ApiError(400, "Sản phẩm trong giỏ hàng không hợp lệ");
      }
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      calculatedTotal += price * quantity;
    }

    const order = await orderRepository.create({
      user: userId || null,
      customerInfo: {
        ...customerInfo,
        note: note || "",
      },
      items,
      totalAmount: totalAmount || calculatedTotal,
      paymentMethod: paymentMethod || "cod",
      status: "pending",
    });

    return order;
  }

  async getUserOrders(userId) {
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập để xem danh sách đơn hàng");
    }
    return await orderRepository.findByUserId(userId);
  }

  async getOrderDetail(orderId, userId) {
    const order = await orderRepository.findOrderDetail(orderId);
    if (!order) {
      throw new ApiError(404, "Không tìm thấy đơn hàng");
    }

    // Bảo mật: Kiểm tra xem đơn hàng có thuộc về user này không (nếu không phải admin)
    if (userId && order.user && order.user._id.toString() !== userId.toString()) {
      throw new ApiError(403, "Bạn không có quyền xem đơn hàng này");
    }

    return order;
  }
}

export const orderService = new OrderService();
