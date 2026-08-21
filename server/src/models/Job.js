import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề vị trí tuyển dụng là bắt buộc"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: [true, "Phòng ban / Bộ phận là bắt buộc"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Địa điểm làm việc là bắt buộc"],
      trim: true,
    },
    salary: {
      type: String,
      default: "Thỏa thuận",
      trim: true,
    },
    type: {
      type: String,
      default: "Toàn thời gian",
      trim: true,
    },
    experience: {
      type: String,
      default: "Không yêu cầu kinh nghiệm",
      trim: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      default: "",
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
