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
    level: {
      type: String,
      default: "Chuyên viên",
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
    skills: {
      type: [String],
      default: [],
    },
    workingHours: {
      type: String,
      default: "8h30 - 17h30 (Thứ 2 - Thứ 6)",
      trim: true,
    },
    contactEmail: {
      type: String,
      default: "tuyendung@dudisoftware.com",
      trim: true,
    },
    contactPhone: {
      type: String,
      default: "0909 163 821",
      trim: true,
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
    isHot: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual("isExpired").get(function () {
  return this.deadline && new Date() > this.deadline;
});

export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
