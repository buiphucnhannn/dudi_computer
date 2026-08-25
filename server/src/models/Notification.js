import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề thông báo là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    message: {
      type: String,
      required: [true, "Nội dung thông báo là bắt buộc"],
      trim: true,
      maxlength: [1000, "Nội dung không được vượt quá 1000 ký tự"],
    },
    type: {
      type: String,
      enum: ["order", "order_status", "product", "contact", "warning", "system"],
      default: "order",
    },
    link: {
      type: String,
      default: "/admin",
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    entityType: {
      type: String,
      enum: ["Order", "Product", "Contact", "User", null],
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ["all", "admin", "user"],
      default: "admin",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index cho truy vấn sắp xếp theo thời gian và lọc theo isRead
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
