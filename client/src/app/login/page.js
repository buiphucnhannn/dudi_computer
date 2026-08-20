"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import { authAPI } from "@/lib/api";
import { setCredentials, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { syncWishlistWithCloud } from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Load Google Identity Services SDK
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const loadGoogleScript = () => {
      if (document.getElementById("google-client-script")) return;
      const script = document.createElement("script");
      script.id = "google-client-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleCallback,
              use_fedcm_for_prompt: false,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            // Render nút Google ẩn để có thể kích hoạt popup an toàn
            const hiddenDiv = document.getElementById("google-btn-container");
            if (hiddenDiv) {
              window.google.accounts.id.renderButton(hiddenDiv, {
                theme: "outline",
                size: "large",
                width: 350,
              });
            }
          }
        } catch (err) {
          console.warn("GSI init warning:", err);
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.cancel();
        }
      } catch (_) {}
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    if (!response?.credential) return;
    setGoogleLoading(true);

    try {
      const res = await authAPI.googleLogin({
        credential: response.credential,
      });

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      // Tự động merge Wishlist lên Cloud
      dispatch(syncWishlistWithCloud());

      showToast({
        title: "Đăng nhập thành công!",
        message: `Chào mừng ${user?.name || "bạn"} đã quay trở lại ZCOMPUTER!`,
        type: "success",
      });

      router.push("/");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Đăng nhập bằng tài khoản Google không thành công. Vui lòng thử lại.";
      showToast({
        title: "Đăng nhập Google thất bại",
        message: msg,
        type: "error",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleLoginClick = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      showToast({
        title: "Chưa cấu hình Google Client ID",
        message: "Vui lòng thêm NEXT_PUBLIC_GOOGLE_CLIENT_ID vào file .env.local để đăng nhập Google!",
        type: "info",
      });
      return;
    }

    try {
      // Ưu tiên kích hoạt qua rendered button để tránh lỗi FedCM
      const btn = document
        .getElementById("google-btn-container")
        ?.querySelector("div[role=button]");
      if (btn) {
        btn.click();
      } else if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
    } catch (e) {
      console.warn("Google Sign-In prompt error:", e);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email.",
        type: "error",
      });
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      showToast({
        title: "Email không hợp lệ",
        message: "Vui lòng nhập đúng định dạng email (VD: name@example.com).",
        type: "error",
      });
      return;
    }

    if (!formData.password) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập mật khẩu.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      // Tự động merge Wishlist lên Cloud
      dispatch(syncWishlistWithCloud());

      showToast({
        title: "Đăng nhập thành công!",
        message: `Xin chào ${user?.name || "quý khách"}, chúc bạn mua sắm vui vẻ!`,
        type: "success",
      });

      router.push("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
      showToast({
        title: "Đăng nhập thất bại",
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
            Đăng nhập
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
            Hoặc{" "}
            <Link
              href="/register"
              className="text-[#dc2626] font-bold hover:underline transition-colors"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div id="google-btn-container" className="hidden"></div>
        <button
          type="button"
          onClick={handleGoogleLoginClick}
          disabled={googleLoading || loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold border border-gray-200/80 py-2.5 px-4 rounded-md flex items-center justify-center gap-2.5 transition-all duration-200 shadow-2xs hover:bg-gray-50/90 active:scale-98 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.7 0 3 .6 3.9 1.5l2.9-2.9C17 1.9 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
          )}
          <span>
            {googleLoading ? "Đang xác thực Google..." : "Đăng nhập bằng Google"}
          </span>
        </button>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-gray-400 font-medium">
            hoặc đăng nhập bằng email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || googleLoading}
                className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-[13px] font-bold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                disabled={loading || googleLoading}
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

          {/* Options: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#dc2626] focus:ring-red-500 accent-[#dc2626] cursor-pointer"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[#dc2626] hover:underline font-semibold cursor-pointer"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-md font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
