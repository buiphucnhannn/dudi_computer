import { notificationService } from "../services/notificationService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const recipientRole = req.user?.role === "admin" ? req.query.recipientRole : "user";

    const data = await notificationService.getNotifications({
      ...req.query,
      userId: req.user?.role === "admin" ? req.query.userId : userId,
      recipientRole: req.user?.role === "admin" ? req.query.recipientRole : recipientRole,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy danh sách thông báo thành công"));
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user?.role === "admin" ? null : req.user?._id || req.query.userId;
    const data = await notificationService.getUnreadCount(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy số lượng thông báo chưa đọc thành công"));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    return res
      .status(200)
      .json(new ApiResponse(200, notification, "Đã đánh dấu thông báo là đã đọc"));
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.role === "admin" ? null : req.user?._id;
    const result = await notificationService.markAllAsRead(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Đã đánh dấu tất cả thông báo là đã đọc"));
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id);
    return res
      .status(200)
      .json(new ApiResponse(200, { id }, "Đã xóa thông báo thành công"));
  } catch (error) {
    next(error);
  }
};
