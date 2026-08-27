import { authService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sessionManager } from "../utils/sessionManager.js";

// Cấu hình cookie HttpOnly an toàn chống XSS & CSRF
const getAccessCookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000, // 30 ngày nếu Remember Me, 2 giờ nếu không
});

const getRefreshCookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 ngày nếu Remember Me, 7 ngày nếu không
});

export const registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message));
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const rememberMe = Boolean(req.body?.rememberMe);
    const { user, accessToken, refreshToken, message } =
      await authService.verifyRegistrationOtp(req.body);

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions(rememberMe))
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions(rememberMe))
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken, rememberMe },
          message
        )
      );
  } catch (error) {
    next(error);
  }
};

export const resendVerificationOtp = async (req, res, next) => {
  try {
    const result = await authService.resendVerificationOtp(req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const rememberMe = Boolean(req.body?.rememberMe);
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions(rememberMe))
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions(rememberMe))
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken, rememberMe },
          "Đăng nhập thành công"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle(
      req.body
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, getAccessCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshCookieOptions())
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "Đăng nhập Google thành công"
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
    const user = await authService.getCurrentUser(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Cập nhật thông tin thành công"));
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.sendPasswordResetOtp(req.body?.email);
    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message));
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPasswordWithOtp(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message));
  } catch (error) {
    next(error);
  }
};

export const getSessionStream = async (req, res) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    });

    res.write(`data: ${JSON.stringify({ type: "CONNECTED", userId: req.user._id })}\n\n`);
    sessionManager.addSession(req.user._id, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Lỗi thiết lập phiên realtime" });
    }
  }
};
