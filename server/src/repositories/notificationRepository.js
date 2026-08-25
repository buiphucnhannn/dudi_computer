import { BaseRepository } from "./baseRepository.js";
import { Notification } from "../models/Notification.js";

class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findWithFilters({ isRead, type, userId, recipientRole, page = 1, limit = 30 } = {}) {
    const query = {};
    if (typeof isRead === "boolean") {
      query.isRead = isRead;
    } else if (isRead === "true" || isRead === "false") {
      query.isRead = isRead === "true";
    }

    if (type) {
      query.type = type;
    }

    if (userId) {
      query.$or = [{ user: userId }, { recipientRole: "all" }, { recipientRole: "user" }];
    } else if (recipientRole) {
      query.recipientRole = recipientRole;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      this.model.countDocuments(query),
      this.model.countDocuments({ ...query, isRead: false }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async countUnread(userId = null) {
    const query = { isRead: false };
    if (userId) {
      query.$or = [{ user: userId }, { recipientRole: "all" }, { recipientRole: "user" }];
    }
    return await this.model.countDocuments(query);
  }

  async markAllAsRead(userId = null) {
    const query = { isRead: false };
    if (userId) {
      query.$or = [{ user: userId }, { recipientRole: "all" }, { recipientRole: "user" }];
    }
    return await this.model.updateMany(query, { $set: { isRead: true } });
  }
}

export const notificationRepository = new NotificationRepository();
