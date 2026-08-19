import { userRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class AuthService {
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

    const token = user.generateAccessToken();
    const createdUser = await userRepository.findByIdWithoutPassword(user._id);

    return { user: createdUser, token };
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

    const token = user.generateAccessToken();
    const loggedInUser = await userRepository.findByIdWithoutPassword(user._id);

    return { user: loggedInUser, token };
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
