import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ và tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [
        function () {
          return this.authType === "local";
        },
        "Vui lòng nhập mật khẩu",
      ],
      minlength: [6, "Mật khẩu phải từ 6 ký tự trở lên"],
    },
    authType: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "admin_super",
        "admin_sales",
        "admin_content",
        "admin_customer",
      ],
      default: "user",
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "pending", "banned"],
      default: "pending",
    },
    isPasswordSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// So sánh password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Tạo JWT Access Token (Thời hạn ngắn: 15 phút)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

// Tạo JWT Refresh Token (Thời hạn dài: 7 ngày)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

export const User = mongoose.model("User", userSchema);
