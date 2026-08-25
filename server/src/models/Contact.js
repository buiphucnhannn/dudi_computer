import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ và tên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ và tên không được vượt quá 100 ký tự"],
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Nội dung tin nhắn / góp ý là bắt buộc"],
      trim: true,
      maxlength: [3000, "Nội dung không được vượt quá 3000 ký tự"],
    },
    type: {
      type: String,
      enum: ["contact", "feedback"],
      default: "contact",
    },
    subject: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes for fast searching and filtering in admin
contactSchema.index({ type: 1, status: 1, createdAt: -1 });
contactSchema.index({ fullName: "text", phone: "text", email: "text", message: "text" });

export const Contact = mongoose.model("Contact", contactSchema);
