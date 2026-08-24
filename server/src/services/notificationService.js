import { notificationRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class NotificationService {
  /**
   * Tạo thông báo mới và lưu trực tiếp vào cơ sở dữ liệu
   */
  async createNotification(data) {
    const {
      title,
      message,
      type = "order",
      link = "/admin",
      entityId = null,
      entityType = null,
      metadata = {},
    } = data;

    if (!title || !message) {
      throw new ApiError(400, "Tiêu đề và nội dung thông báo là bắt buộc");
    }

    return await notificationRepository.create({
      title: title.trim(),
      message: message.trim(),
      type,
      link: link.trim(),
      entityId,
      entityType,
      isRead: false,
      metadata,
    });
  }

  /**
   * Lấy danh sách thông báo theo bộ lọc
   */
  async getNotifications(queryParams = {}) {
    const { isRead, type, page = 1, limit = 30 } = queryParams;
    return await notificationRepository.findWithFilters({ isRead, type, page, limit });
  }

  /**
   * Đếm số thông báo chưa đọc
   */
  async getUnreadCount() {
    const count = await notificationRepository.countUnread();
    return { unreadCount: count };
  }

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  async markAsRead(id) {
    if (!id) throw new ApiError(400, "ID thông báo không hợp lệ");
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new ApiError(404, "Không tìm thấy thông báo");

    notification.isRead = true;
    return await notification.save();
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead() {
    await notificationRepository.markAllAsRead();
    return { success: true, message: "Đã đánh dấu tất cả thông báo là đã đọc" };
  }

  /**
   * Xóa thông báo
   */
  async deleteNotification(id) {
    if (!id) throw new ApiError(400, "ID thông báo không hợp lệ");
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new ApiError(404, "Không tìm thấy thông báo");
    return await notificationRepository.deleteById(id);
  }
}

export const notificationService = new NotificationService();
