import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";

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

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Không tìm thấy Refresh Token");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET + "_refresh") || "refresh_secret"
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
}

export const authService = new AuthService();
