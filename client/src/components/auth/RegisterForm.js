"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authAPI } from "@/lib/api";
import { setCredentials, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { syncWishlistWithCloud } from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập họ và tên của bạn.",
        type: "error",
      });
      return;
    }

    if (!email) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email của bạn.",
        type: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      showToast({
        title: "Email không hợp lệ",
        message: "Vui lòng nhập đúng định dạng email (VD: name@example.com).",
        type: "error",
      });
      return;
    }

    if (!password) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng tạo mật khẩu.",
        type: "error",
      });
      return;
    }

    if (password.length < 6) {
      showToast({
        title: "Mật khẩu quá ngắn",
        message: "Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo an toàn.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        title: "Mật khẩu không khớp",
        message: "Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.register({
        name,
        email,
        password,
      });

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      // Tự động merge Wishlist lên Cloud
      dispatch(syncWishlistWithCloud());

      showToast({
        title: "Đăng ký thành công!",
        message: `Chào mừng ${user?.name || name} đã gia nhập cộng đồng ZCOMPUTER!`,
        type: "success",
        duration: 5000,
      });

      // Tự động chuyển hướng về trang chủ
      router.push("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Đăng ký không thành công. Email có thể đã được sử dụng.";
      showToast({
        title: "Đăng ký thất bại",
        message: errorMsg,
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              placeholder="VD: Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Tạo mật khẩu"
                value={formData.password}
                onChange={handleChange}
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
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <span>Đăng ký</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
