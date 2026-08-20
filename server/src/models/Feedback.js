import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ và tên là bắt buộc"],
      trim: true,
      maxlength: [100, "Họ và tên không được vượt quá 100 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Địa chỉ email là bắt buộc"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Địa chỉ email không hợp lệ",
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Nội dung góp ý là bắt buộc"],
      trim: true,
      maxlength: [2000, "Nội dung góp ý không được vượt quá 2000 ký tự"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
