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

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (user.status === "active") {
        throw new ApiError(
          409,
          "Email này đã được đăng ký và kích hoạt tài khoản. Vui lòng đăng nhập."
        );
      }
      if (user.status === "banned") {
        throw new ApiError(403, "Tài khoản liên kết với email này đã bị khóa.");
      }

      // Trường hợp đăng ký mà chưa xác thực (pending), rồi đăng ký lại với mật khẩu mới:
      // Ghi đè mật khẩu mới và cập nhật thông tin
      user.name = name.trim();
      user.phone = phone ? phone.trim() : user.phone;
      user.password = password; // Pre-save hook của Mongoose sẽ tự hash mật khẩu mới
      user.status = "pending";
      await user.save();
    } else {
      // Tạo user mới với trạng thái pending
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone ? phone.trim() : "",
        status: "pending",
      });
    }

    // Xóa các mã OTP xác thực cũ
    await Otp.deleteMany({ email: normalizedEmail, type: "VERIFY_EMAIL" });

    // Sinh mã ngẫu nhiên 6 chữ số (không mã hóa)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP vào MongoDB với thời hạn 10 phút (TTL)
    await Otp.create({
      email: normalizedEmail,
      otp: otp,
      type: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    });

    // Gửi email mã OTP xác thực
    await mailService.sendVerificationOtp({
      toEmail: normalizedEmail,
      userName: user.name,
      otp: otp,
    });

    return {
      requiresOtp: true,
      email: normalizedEmail,
      message:
        "Mã OTP xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.",
    };
  }

  async verifyRegistrationOtp({ email, otp }) {
    if (!email || !otp) {
      throw new ApiError(400, "Vui lòng nhập đầy đủ email và mã OTP");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      type: "VERIFY_EMAIL",
    });

    if (!otpRecord) {
      throw new ApiError(
        400,
        "Mã OTP không tồn tại hoặc đã hết hạn (10 phút). Vui lòng yêu cầu gửi lại mã mới."
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

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "Không tìm thấy tài khoản người dùng để kích hoạt.");
    }

    // Kích hoạt tài khoản sang active
    user.status = "active";
    await user.save();

    // Xóa mã OTP đã sử dụng
    await Otp.deleteMany({ email: normalizedEmail, type: "VERIFY_EMAIL" });

    // Tự động đăng nhập
    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await userRepository.findByIdWithoutPassword(user._id);

    return {
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "Xác thực tài khoản thành công! Chào mừng bạn đến với DUDI SOFTWARE.",
    };
  }

  async resendVerificationOtp({ email }) {
    if (!email) {
      throw new ApiError(400, "Vui lòng cung cấp địa chỉ email");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "Không tìm thấy tài khoản với email này.");
    }

    if (user.status === "active") {
      throw new ApiError(
        400,
        "Tài khoản này đã được kích hoạt trước đó. Vui lòng đăng nhập."
      );
    }

    // Kiểm tra cooldown chống spam gửi lại (tối thiểu 60s)
    const existingOtp = await Otp.findOne({
      email: normalizedEmail,
      type: "VERIFY_EMAIL",
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
      await Otp.deleteMany({ email: normalizedEmail, type: "VERIFY_EMAIL" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    await Otp.create({
      email: normalizedEmail,
      otp: otp,
      type: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    });

    await mailService.sendVerificationOtp({
      toEmail: normalizedEmail,
      userName: user.name,
      otp: otp,
    });

    return {
      message: "Mã OTP xác thực mới đã được gửi đến email của bạn.",
      email: normalizedEmail,
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, "Vui lòng nhập email và mật khẩu");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "Tài khoản không tồn tại");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Mật khẩu không chính xác");
    }

    // KIỂM TRA TRẠNG THÁI STATUS CỦA USER:
    if (user.status === "pending") {
      // Tự động sinh và gửi OTP mới
      await Otp.deleteMany({ email: normalizedEmail, type: "VERIFY_EMAIL" });
      const otp = crypto.randomInt(100000, 999999).toString();
      await Otp.create({
        email: normalizedEmail,
        otp,
        type: "VERIFY_EMAIL",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      await mailService.sendVerificationOtp({
        toEmail: normalizedEmail,
        userName: user.name,
        otp,
      });

      // Trả về lỗi 403 kèm requiresOtpVerification: true
      const pendingError = new ApiError(
        403,
        "Tài khoản của bạn chưa được kích hoạt. Chúng tôi đã gửi một mã OTP mới về email của bạn, vui lòng xác thực để hoàn tất đăng nhập."
      );
      pendingError.data = {
        requiresOtpVerification: true,
        email: normalizedEmail,
      };
      throw pendingError;
    }

    if (user.status === "banned") {
      throw new ApiError(
        403,
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ."
      );
    }

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshTokens(user._id);
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
        throw new ApiError(
          400,
          "Xác thực Google ID Token không hợp lệ hoặc đã hết hạn"
        );
      }

      const email = payload.email.toLowerCase().trim();
      let user = await userRepository.findByEmail(email);

      if (!user) {
        // Tạo tài khoản mới từ thông tin Google
        const randomPassword =
          Math.random().toString(36).slice(-8) +
          "Zc#9" +
          Date.now().toString().slice(-4);

        user = await userRepository.create({
          name: payload.name || email.split("@")[0],
          email: email,
          password: randomPassword,
          avatar:
            payload.picture ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          authType: "google",
          googleId: payload.sub,
          status: "active", // Tài khoản Google luôn active
        });
      } else {
        // Nếu user đã tồn tại, đảm bảo status là active nếu đăng nhập Google
        let shouldSave = false;
        if (user.status === "pending") {
          user.status = "active";
          shouldSave = true;
        }
        if (!user.googleId) {
          user.googleId = payload.sub;
          shouldSave = true;
        }
        if (payload.picture && user.avatar?.includes("unsplash")) {
          user.avatar = payload.picture;
          shouldSave = true;
        }
        if (shouldSave) {
          await user.save({ validateBeforeSave: false });
        }
      }

      if (user.status === "banned") {
        throw new ApiError(403, "Tài khoản của bạn đã bị khóa.");
      }

      const { accessToken, refreshToken } =
        await this.generateAccessAndRefreshTokens(user._id);
      const loggedInUser = await userRepository.findByIdWithoutPassword(
        user._id
      );

      return { user: loggedInUser, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        error?.message || "Lỗi xác thực tài khoản Google"
      );
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

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(
          401,
          "Refresh Token đã hết hạn hoặc đã được sử dụng"
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateAccessAndRefreshTokens(user._id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new ApiError(401, error?.message || "Refresh Token không hợp lệ");
    }
  }

  async logout(userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findByIdWithoutPassword(userId);
    if (!user) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }
    return user;
  }

  async updateProfile(userId, { name, phone, address, avatar }) {
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await userRepository.updateById(userId, updateData);

    if (!updatedUser) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }

    return await userRepository.findByIdWithoutPassword(userId);
  }

  async sendPasswordResetOtp(email) {
    if (!email) {
      throw new ApiError(400, "Vui lòng cung cấp địa chỉ email");
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
