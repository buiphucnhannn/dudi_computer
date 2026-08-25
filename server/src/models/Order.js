import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        required: [true, "Họ và tên người nhận là bắt buộc"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Số điện thoại người nhận là bắt buộc"],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: "",
      },
      address: {
        type: String,
        required: [true, "Địa chỉ nhận hàng là bắt buộc"],
        trim: true,
        default: "Giao hàng tận nơi",
      },
      province: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      note: {
        type: String,
        default: "",
      },
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Đơn hàng phải có ít nhất 1 sản phẩm"],
      validate: [(v) => Array.isArray(v) && v.length > 0, "Đơn hàng không được rỗng"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "banking", "installment"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",     // Chờ xác nhận
        "confirmed",   // Đã xác nhận
        "processing",  // Đang chuẩn bị hàng / ráp máy
        "shipping",    // Đang giao hàng
        "completed",   // Hoàn thành
        "cancelled",   // Đã hủy
      ],
      default: "processing",
      index: true,
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Tự động sinh mã đơn hàng nếu chưa có
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.orderCode = `ZC-${dateStr}-${randomSuffix}`;
  }
  if (!this.timeline || this.timeline.length === 0) {
    this.timeline = [
      {
        status: this.orderStatus || "processing",
        note: "Đơn hàng được khởi tạo thành công",
        updatedAt: new Date(),
      },
    ];
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);
