import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { Otp } from "../models/Otp.js";
import { mailService } from "./mailService.js";

class AuthService {
  // Helper tạo cả Access Token và Refresh Token, đồng thời lưu Refresh Token vào Database
  async generateAccessAndRefreshTokens(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "Người dùng không tồn tại");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }

  async register({ name, email, password, phone }) {
    if (!name || !email || !password) {
      throw new ApiError(400, "Vui lòng điền đầy đủ họ tên, email và mật khẩu");
    }

    const existedUser = await userRepository.findByEmail(email);
    if (existedUser) {
      throw new ApiError(409, "Email này đã được đăng ký tài khoản");
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      phone,
    });

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user._id);
    const createdUser = await userRepository.findByIdWithoutPassword(user._id);

    return { user: createdUser, accessToken, refreshToken };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, "Vui lòng nhập email và mật khẩu");
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "Tài khoản không tồn tại");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Mật khẩu không chính xác");
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await userRepository.findByIdWithoutPassword(user._id);

    return { user: loggedInUser, accessToken, refreshToken };
  }

  async loginWithGoogle({ credential }) {
    if (!credential) {
      throw new ApiError(400, "Thiếu Google credential token");
    }

    try {
      // Xác thực token với Google OAuth endpoint
      const googleRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
      );
      const payload = await googleRes.json();

      if (!googleRes.ok || !payload.email) {
        throw new ApiError(400, "Xác thực Google ID Token không hợp lệ hoặc đã hết hạn");
      }

      const email = payload.email.toLowerCase().trim();
      let user = await userRepository.findByEmail(email);

      if (!user) {
        // Tạo tài khoản mới từ thông tin Google
        const randomPassword =
          Math.random().toString(36).slice(-8) + "Zc#9" + Date.now().toString().slice(-4);

        user = await userRepository.create({
          name: payload.name || email.split("@")[0],
          email: email,
          password: randomPassword,
          avatar:
            payload.picture ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          authType: "google",
          googleId: payload.sub,
        });
      } else {
        // Nếu user đã tồn tại, cập nhật googleId nếu chưa có
        if (!user.googleId) {
          user.googleId = payload.sub;
          if (payload.picture && user.avatar?.includes("unsplash")) {
            user.avatar = payload.picture;
          }
          await user.save({ validateBeforeSave: false });
        }
      }

      const { accessToken, refreshToken } =
        await this.generateAccessAndRefreshTokens(user._id);
      const loggedInUser = await userRepository.findByIdWithoutPassword(user._id);

      return { user: loggedInUser, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, error?.message || "Lỗi xác thực tài khoản Google");
    }
  }

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Không tìm thấy Refresh Token");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "Refresh Token không hợp lệ");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token đã hết hạn hoặc đã được sử dụng");
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateAccessAndRefreshTokens(user._id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || "Refresh Token không hợp lệ");
    }
  }

  async logout(userId) {
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            refreshToken: null,
          },
        },
        { new: true }
      );
    }
    return true;
  }

  async getProfile(userId) {
    const user = await userRepository.findByIdWithoutPassword(userId);
    if (!user) {
      throw new ApiError(404, "Không tìm thấy thông tin người dùng");
    }
    return user;
  }

  async updateProfile(userId, { name, phone, address }) {
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (address !== undefined) updateData.address = address.trim();

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }

    return user;
  }

  async sendPasswordResetOtp(email) {
    if (!email || !email.trim()) {
      throw new ApiError(400, "Vui lòng nhập địa chỉ email của bạn");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new ApiError(404, "Không tìm thấy tài khoản với email này");
    }

    // Kiểm tra cooldown chống spam gửi lại (tối thiểu 60s)
    const existingOtp = await Otp.findOne({
      email: normalizedEmail,
      type: "FORGOT_PASSWORD",
    });

    if (existingOtp) {
      const timeDiff =
        (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
      if (timeDiff < 60) {
        throw new ApiError(
          429,
          `Vui lòng đợi ${Math.ceil(60 - timeDiff)} giây trước khi yêu cầu mã OTP mới.`
        );
      }
      await Otp.deleteMany({ email: normalizedEmail, type: "FORGOT_PASSWORD" });
    }

    // Sinh mã ngẫu nhiên 6 chữ số
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu vào MongoDB với thời hạn 10 phút (TTL)
    await Otp.create({
      email: normalizedEmail,
      otp: otp,
      type: "FORGOT_PASSWORD",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    });

    // Gửi email qua Resend
    await mailService.sendPasswordResetOtp({
      toEmail: normalizedEmail,
      userName: user.name,
      otp: otp,
    });

    return {
      message: "Mã xác nhận OTP đã được gửi đến email của bạn.",
      email: normalizedEmail,
    };
  }

  async resetPasswordWithOtp({ email, otp, newPassword }) {
    if (!email || !otp || !newPassword) {
      throw new ApiError(
        400,
        "Vui lòng nhập đầy đủ email, mã OTP và mật khẩu mới"
      );
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "Mật khẩu mới phải chứa ít nhất 6 ký tự");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      type: "FORGOT_PASSWORD",
    });

    if (!otpRecord) {
      throw new ApiError(
        400,
        "Mã OTP không tồn tại hoặc đã hết hạn (10 phút). Vui lòng yêu cầu mã mới."
      );
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(
        400,
        "Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng yêu cầu gửi lại mã mới."
      );
    }

    if (otpRecord.otp.trim() !== otp.toString().trim()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new ApiError(
        400,
        `Mã OTP không chính xác. Bạn còn ${5 - otpRecord.attempts} lần thử.`
      );
    }

    // Tìm user và đổi mật khẩu
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "Không tìm thấy tài khoản người dùng");
    }

    user.password = newPassword; // Pre-save hook của Mongoose sẽ tự hash bcrypt
    user.refreshToken = null; // Xóa session cũ
    await user.save();

    // Xóa mã OTP đã sử dụng
    await Otp.deleteMany({ email: normalizedEmail });

    return {
      message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.",
    };
  }
}

export const authService = new AuthService();
