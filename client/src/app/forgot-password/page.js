"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Nhập Email, 2: Nhập OTP & Đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý gửi mã OTP (Bước 1)
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email đã đăng ký của bạn.",
        type: "error",
      });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast({
        title: "Email không hợp lệ",
        message: "Vui lòng nhập đúng định dạng email (VD: name@example.com).",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email: cleanEmail });
      showToast({
        title: "Đã gửi mã OTP!",
        message:
          res.data?.message ||
          "Vui lòng kiểm tra hòm thư của bạn để lấy mã OTP xác nhận (10 phút).",
        type: "success",
        duration: 6000,
      });
      setStep(2);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Không thể gửi mã OTP. Vui lòng kiểm tra lại email.";
      showToast({
        title: "Gửi OTP thất bại",
        message: msg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đặt lại mật khẩu với OTP (Bước 2)
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      showToast({
        title: "Mã OTP không hợp lệ",
        message: "Vui lòng nhập chính xác mã OTP gồm 6 chữ số.",
        type: "error",
      });
      return;
    }

    if (!newPassword) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập mật khẩu mới.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        title: "Mật khẩu quá ngắn",
        message: "Mật khẩu mới phải chứa ít nhất 6 ký tự.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast({
        title: "Mật khẩu không khớp",
        message: "Mật khẩu xác nhận không trùng khớp với mật khẩu mới.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        newPassword,
      });

      showToast({
        title: "Đổi mật khẩu thành công!",
        message:
          res.data?.message ||
          "Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập với mật khẩu mới.",
        type: "success",
        duration: 5000,
      });

      router.push("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP.";
      showToast({
        title: "Lỗi khôi phục mật khẩu",
        message: msg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-280px)] pt-6 sm:pt-8 pb-16 flex justify-center px-4">
      <div className="max-w-[450px] w-full bg-white rounded-lg shadow-xs border border-gray-100/90 p-6 sm:p-8 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] sm:text-[32px] font-black text-gray-900 tracking-tight leading-tight">
            Khôi phục mật khẩu
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
            {step === 1
              ? "Nhập email của bạn để nhận mã OTP"
              : "Nhập mã OTP và mật khẩu mới"}
          </p>
        </div>

        {/* STEP 1: Form Nhập Email */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                Email đã đăng ký
              </label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi mã OTP...</span>
                </>
              ) : (
                <span>Gửi mã OTP</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-500 hover:text-[#dc2626] transition-colors"
              >
                Trở lại trang đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          /* STEP 2: Form Nhập OTP & Đặt Lại Mật Khẩu */
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                Mã OTP (6 số)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-sm sm:text-base text-gray-900 font-mono tracking-widest text-center placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all font-bold"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
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
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-white border border-gray-300 rounded-md pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đặt lại mật khẩu...</span>
                </>
              ) : (
                <span>Đặt lại mật khẩu</span>
              )}
            </button>

            <div className="space-y-2 text-center pt-2">
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-gray-500 hover:text-[#dc2626] transition-colors cursor-pointer"
                >
                  Quay lại bước nhập Email
                </button>
              </div>
              <div>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-500 hover:text-[#dc2626] transition-colors"
                >
                  Trở lại trang đăng nhập
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
