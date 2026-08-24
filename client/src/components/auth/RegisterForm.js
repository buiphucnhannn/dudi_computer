"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { setCredentials, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { syncCartWithCloud } from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Steps: 'form' | 'otp'
  const [step, setStep] = useState("form");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpExpiresCountdown, setOtpExpiresCountdown] = useState(600); // 10 phút = 600s
  const otpInputRefs = useRef([]);

  // Nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Timer cooldown cho Gửi lại mã OTP
  useEffect(() => {
    let timer;
    if (step === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Timer đếm ngược hết hạn OTP (10 phút)
  useEffect(() => {
    let timer;
    if (step === "otp" && otpExpiresCountdown > 0) {
      timer = setInterval(() => {
        setOtpExpiresCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpExpiresCountdown]);

  // Auto focus vào ô OTP đầu tiên khi chuyển sang bước OTP
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==========================================
  // XỬ LÝ SUBMIT BƯỚC 1: ĐĂNG KÝ FORM
  // ==========================================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      setFormError("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (!email) {
      setFormError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setFormError("Vui lòng nhập đúng định dạng email (VD: name@example.com).");
      return;
    }

    if (!password) {
      setFormError("Vui lòng tạo mật khẩu.");
      return;
    }

    if (password.length < 6) {
      setFormError("Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo an toàn.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.register({
        name,
        email,
        password,
      });

      const message =
        res.data?.message ||
        "Mã xác thực OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.";

      showToast({
        title: "Đã gửi mã xác thực!",
        message,
        type: "success",
        duration: 5000,
      });

      // Chuyển sang bước nhập mã OTP
      setStep("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setResendCooldown(60);
      setOtpExpiresCountdown(600);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Email đã được sử dụng hoặc đăng ký không thành công.";
      setFormError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ NHẬP 6 Ô OTP
  // ==========================================
  const handleOtpChange = (index, value) => {
    setOtpError("");
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    if (cleanValue.length > 1) {
      const pastedArray = cleanValue.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      pastedArray.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextFocusIndex = Math.min(pastedArray.length, 5);
      otpInputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanValue.slice(-1);
    setOtpDigits(newDigits);

    if (index < 5 && cleanValue) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    setOtpError("");
    const pastedData = e.clipboardData.getData("text/plain").trim().replace(/\D/g, "");
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    pastedData.slice(0, 6).split("").forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // ==========================================
  // XỬ LÝ XÁC THỰC OTP KÍCH HOẠT TÀI KHOẢN
  // ==========================================
  const handleVerifyOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    setOtpError("");

    const otpCode = otpDigits.join("").trim();
    if (otpCode.length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã OTP xác thực.");
      return;
    }

    setOtpLoading(true);

    try {
      const res = await authAPI.verifyRegistrationOtp({
        email: formData.email.trim(),
        otp: otpCode,
      });

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      dispatch(syncCartWithCloud());

      showToast({
        title: "Kích hoạt tài khoản thành công!",
        message: `Chào mừng ${user?.name || "bạn"} đã gia nhập DUDI SOFTWARE!`,
        type: "success",
        duration: 5000,
      });

      router.push("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.";
      setOtpError(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ GỬI LẠI MÃ OTP (RESEND)
  // ==========================================
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setOtpError("");
    try {
      const res = await authAPI.resendVerificationOtp({
        email: formData.email.trim(),
      });

      showToast({
        title: "Đã gửi lại mã OTP!",
        message:
          res.data?.message ||
          "Mã xác thực mới đã được gửi đến email của bạn.",
        type: "success",
      });

      setResendCooldown(60);
      setOtpExpiresCountdown(600);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Không thể gửi lại mã OTP. Vui lòng thử lại sau giây lát.";
      setOtpError(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-280px)] pt-6 sm:pt-8 pb-16 flex justify-center px-4">
      <div className="max-w-[460px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative transition-all">
        {/* ==========================================
            BƯỚC 1: FORM NHẬP THÔNG TIN ĐĂNG KÝ
            ========================================== */}
        {step === "form" && (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="text-[26px] sm:text-[30px] font-black text-gray-900 tracking-tight leading-tight">
                Tạo tài khoản mới
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-[#dc2626] font-bold hover:underline transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Thông báo lỗi ở TRÊN CÙNG của form */}
            {formError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-[#dc2626] rounded-xl text-xs sm:text-[13px] font-semibold flex items-center gap-2.5 animate-fadeIn shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#dc2626]" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn (để nhận mã OTP)"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                    aria-label="Ẩn hiện mật khẩu"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                    aria-label="Ẩn hiện mật khẩu xác nhận"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang gửi mã xác thực...</span>
                  </>
                ) : (
                  <span>Đăng ký tài khoản</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ==========================================
            BƯỚC 2: MÀN HÌNH NHẬP MÃ OTP KÍCH HOẠT
            ========================================== */}
        {step === "otp" && (
          <div>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setFormError("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#dc2626] transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại chỉnh sửa</span>
            </button>

            {/* OTP Header */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-red-50 text-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-xs border border-red-100">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-[22px] sm:text-[24px] font-black text-gray-900 tracking-tight leading-tight">
                Xác thực tài khoản
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium leading-relaxed px-2">
                Mã xác thực gồm 6 chữ số đã được gửi đến email:
                <br />
                <strong className="text-gray-900 font-bold break-all">
                  {formData.email}
                </strong>
              </p>
            </div>

            {/* Thông báo lỗi OTP ở TRÊN CÙNG */}
            {otpError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-[#dc2626] rounded-xl text-xs sm:text-[13px] font-semibold flex items-center gap-2.5 animate-fadeIn shadow-2xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#dc2626]" />
                <span className="leading-snug">{otpError}</span>
              </div>
            )}

            {/* OTP Inputs (6 Boxes) */}
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
              <div
                className="flex items-center justify-between gap-1.5 sm:gap-2.5 max-w-[340px] mx-auto w-full"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={otpLoading}
                    className={`w-9 h-11 sm:w-11 sm:h-13 md:w-12 md:h-14 text-center font-black text-lg sm:text-2xl rounded-lg sm:rounded-xl border-2 transition-all outline-none shrink ${
                      digit
                        ? "border-[#dc2626] bg-red-50/40 text-gray-900 shadow-xs"
                        : "border-gray-200 bg-white text-gray-900 focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/20"
                    }`}
                  />
                ))}
              </div>

              {/* Expiration Countdown & Cooldown Info */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-center space-y-1">
                <div className="text-xs text-gray-600 font-medium">
                  Mã OTP có hiệu lực trong:{" "}
                  <span className="font-extrabold text-[#dc2626]">
                    {formatTime(otpExpiresCountdown)}
                  </span>
                </div>
                {otpExpiresCountdown === 0 && (
                  <p className="text-[11px] text-red-600 font-semibold">
                    Mã OTP đã hết hạn. Vui lòng bấm &quot;Gửi lại mã&quot; bên dưới.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otpLoading || otpDigits.some((d) => !d)}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang kích hoạt tài khoản...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kích hoạt tài khoản</span>
                  </>
                )}
              </button>

              {/* Resend OTP Section */}
              <div className="text-center pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  Bạn không nhận được mã xác thực trong hộp thư (kể cả mục Spam)?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dc2626] hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${resendLoading ? "animate-spin" : ""}`}
                  />
                  <span>
                    {resendCooldown > 0
                      ? `Gửi lại mã sau (${resendCooldown}s)`
                      : "Gửi lại mã OTP mới"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
