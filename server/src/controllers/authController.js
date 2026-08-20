import { authService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Cấu hình cookie HttpOnly an toàn chống XSS & CSRF
const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 15 * 60 * 1000, // 15 phút
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
});

export const registerUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    return res
      .status(201)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(
          201,
          { user },
          "Đăng ký tài khoản thành công"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(
          200,
          { user },
          "Đăng nhập thành công"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(incomingRefreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", newRefreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(
          200,
          {},
          "Cấp mới Access Token thành công"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    if (req.user?._id) {
      await authService.logout(req.user._id);
    }

    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
      .status(200)
      .clearCookie("accessToken", clearCookieOptions)
      .clearCookie("refreshToken", clearCookieOptions)
      .json(new ApiResponse(200, {}, "Đăng xuất thành công"));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
  } catch (error) {
    next(error);
  }
};
