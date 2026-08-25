import rateLimit from "express-rate-limit";

// Helper hàm tạo middleware Rate Limit đồng nhất định dạng ApiResponse
const createLimiter = (options) => {
  return rateLimit({
    standardHeaders: true, // Trả về RateLimit-* headers chuẩn RFC
    legacyHeaders: false, // Tắt X-RateLimit-* cũ
    validate: { trustProxy: false, xForwardedForHeader: false },
    handler: (req, res) => {
      return res.status(429).json({
        success: false,
        statusCode: 429,
        message:
          options.message ||
          "Hệ thống phát hiện quá nhiều yêu cầu từ địa chỉ mạng của bạn. Vui lòng thử lại sau.",
        errors: [],
      });
    },
    ...options,
  });
};

/**
 * 1. Global Limiter: Chống DDoS và Web Scraping hàng loạt
 * Giới hạn: 10000 requests / 15 phút / IP
 */
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message:
    "Quá nhiều yêu cầu từ địa chỉ IP của bạn. Vui lòng thử lại sau 15 phút.",
});

/**
 * 2. Auth Login Limiter: Chống tấn công dò mật khẩu (Brute-force)
 * Giới hạn: 50 lần thử / 15 phút / IP
 */
export const authLoginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message:
    "Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút để bảo vệ tài khoản.",
});

/**
 * 3. Register Limiter: Chống tạo tài khoản bot hàng loạt
 * Giới hạn: 5 tài khoản / 1 giờ / IP
 */
export const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message:
    "Quá nhiều tài khoản được đăng ký từ địa chỉ IP này. Vui lòng thử lại sau 1 giờ.",
});

/**
 * 4. Forgot Password (OTP Request) Limiter: Chống Spam Email & Tiêu hao hạn mức Resend
 * Giới hạn: 5 lần gửi / 15 phút / IP
 */
export const forgotPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Bạn đã yêu cầu gửi mã OTP quá nhiều lần. Vui lòng kiểm tra hòm thư hoặc thử lại sau 15 phút.",
});

/**
 * 5. Reset Password (OTP Verify) Limiter: Chống Brute-force mã OTP
 * Giới hạn: 8 lần thử / 15 phút / IP
 */
export const resetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message:
    "Bạn đã thử đặt lại mật khẩu quá nhiều lần. Vui lòng thử lại sau 15 phút.",
});

/**
 * 6. Feedback / Review Limiter: Chống spam đánh giá và form liên hệ
 * Giới hạn: 5 lần gửi / 15 phút / IP
 */
export const feedbackLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Bạn đã gửi đánh giá quá thường xuyên. Vui lòng thử lại sau 15 phút.",
});
