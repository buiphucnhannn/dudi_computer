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
      match: [
        /^(0[3|5|7|8|9])[0-9]{8}$/,
        "Số điện thoại không hợp lệ (cần đúng 10 số đầu 03, 05, 07, 08, 09)",
      ],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Nội dung tin nhắn là bắt buộc"],
      trim: true,
      maxlength: [2000, "Nội dung tin nhắn không được vượt quá 2000 ký tự"],
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
