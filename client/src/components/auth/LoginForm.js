"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { setCredentials, selectIsAuthenticated, selectCurrentUser } from "@/redux/slices/authSlice";
import { syncCartWithCloud } from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  // Modes: 'login' | 'otp'
  const [mode, setMode] = useState("login");
  const [loginError, setLoginError] = useState(() => {
    return searchParams?.get("banned") === "true"
      ? "Tài khoản của bạn đã bị khóa bởi Quản trị viên. Vui lòng liên hệ ban quản trị để biết thêm chi tiết."
      : "";
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP States for unactivated (pending) accounts
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [otpExpiresCountdown, setOtpExpiresCountdown] = useState(600);
  const otpInputRefs = useRef([]);
  const gsiInitializedRef = useRef(false);

  // Khởi tạo thông tin ghi nhớ đăng nhập từ localStorage nếu có
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isRemember = localStorage.getItem("dudi_remember_login") === "true";
      const savedEmail = localStorage.getItem("dudi_remembered_email") || "";
      if (isRemember && savedEmail) {
        setFormData((prev) => ({
          ...prev,
          email: savedEmail,
          rememberMe: true,
        }));
      }
    }
  }, []);

  // Kiểm tra thông báo tài khoản bị khóa hoặc lỗi từ URL/session
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    const isBannedParam = searchParams?.get("banned") === "true";
    const bannedNotice =
      typeof window !== "undefined"
        ? sessionStorage.getItem("banned_notice")
        : null;

    const rawMsg =
      errorParam ||
      bannedNotice ||
      (isBannedParam ? "Tài khoản của bạn đã bị khóa bởi Quản trị viên." : null);

    if (rawMsg) {
      setLoginError(rawMsg);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("banned_notice");
      }
    }
  }, [searchParams]);

  // Nếu đã đăng nhập và hợp lệ: Chuyển hướng theo redirect hoặc vai trò
  useEffect(() => {
    if (isAuthenticated && user && user.status !== "banned") {
      let redirectUrl = searchParams?.get("redirect") || searchParams?.get("callbackUrl");
      if (redirectUrl && (redirectUrl.startsWith("/login") || redirectUrl.startsWith("/dang-nhap"))) {
        redirectUrl = null;
      }

      if (
        user.role === "admin" ||
        user.role === "admin_super" ||
        user.role === "admin_sales" ||
        user.role === "admin_content"
      ) {
        if (redirectUrl && redirectUrl.startsWith("/admin")) {
          router.push(redirectUrl);
        } else {
          router.push("/admin");
        }
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router, searchParams]);

  // Cooldown timers for OTP
  useEffect(() => {
    let timer;
    if (mode === "otp" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, resendCooldown]);

  useEffect(() => {
    let timer;
    if (mode === "otp" && otpExpiresCountdown > 0) {
      timer = setInterval(() => {
        setOtpExpiresCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, otpExpiresCountdown]);

  useEffect(() => {
    if (mode === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 200);
    }
  }, [mode]);

  // Khởi tạo Google Identity Services SDK
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    let isMounted = true;

    const setupGoogle = () => {
      if (!isMounted || !window.google?.accounts?.id) return;

      try {
        if (typeof window !== "undefined") {
          window._gsiCallback = handleGoogleCallback;
          if (!window._gsiInitialized) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: (res) => {
                if (window._gsiCallback) window._gsiCallback(res);
              },
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            window._gsiInitialized = true;
          }
        }

        const btnContainer = document.getElementById("google-btn-container");
        if (btnContainer && isMounted) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            type: "standard",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: 320,
          });
        }
      } catch (err) {
        console.warn("GSI init warning:", err);
      }
    };

    if (window.google?.accounts?.id) {
      setupGoogle();
    } else {
      const existingScript = document.getElementById("google-client-script");
      if (existingScript) {
        existingScript.addEventListener("load", setupGoogle);
      } else {
        const script = document.createElement("script");
        script.id = "google-client-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) setupGoogle();
        };
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSuccessfulLoginRedirect = (loggedInUser) => {
    let redirectUrl = searchParams?.get("redirect") || searchParams?.get("callbackUrl");
    if (redirectUrl && (redirectUrl.startsWith("/login") || redirectUrl.startsWith("/dang-nhap"))) {
      redirectUrl = null;
    }

    if (
      loggedInUser?.role === "admin" ||
      loggedInUser?.role === "admin_super" ||
      loggedInUser?.role === "admin_sales" ||
      loggedInUser?.role === "admin_content"
    ) {
      if (redirectUrl && redirectUrl.startsWith("/admin")) {
        router.push(redirectUrl);
      } else {
        router.push("/admin");
      }
    } else if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push("/");
    }
  };

  const handleGoogleCallback = async (response) => {
    if (!response?.credential) return;
    setGoogleLoading(true);
    setLoginError("");

    try {
      const res = await authAPI.googleLogin({
        credential: response.credential,
      });

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      dispatch(syncCartWithCloud());

      showToast({
        title: "Đăng nhập thành công!",
        message:
          user?.role === "admin"
            ? `Chào mừng Quản trị viên ${user?.name || "Admin"}, chúc bạn làm việc hiệu quả!`
            : `Xin chào ${user?.name || "quý khách"}, chúc bạn mua sắm vui vẻ!`,
        type: "success",
      });

      handleSuccessfulLoginRedirect(user);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Đăng nhập bằng tài khoản Google không thành công. Vui lòng thử lại.";
      setLoginError(msg);
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
    setLoginError("");
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // XỬ LÝ SUBMIT ĐĂNG NHẬP
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!formData.email.trim()) {
      setLoginError("Vui lòng nhập địa chỉ email.");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setLoginError("Vui lòng nhập đúng định dạng email (VD: name@example.com).");
      return;
    }

    if (!formData.password) {
      setLoginError("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      // Lưu hoặc xoá email theo trạng thái Ghi nhớ đăng nhập
      if (typeof window !== "undefined") {
        if (formData.rememberMe) {
          localStorage.setItem("dudi_remember_login", "true");
          localStorage.setItem("dudi_remembered_email", formData.email.trim());
        } else {
          localStorage.removeItem("dudi_remember_login");
          localStorage.removeItem("dudi_remembered_email");
        }
      }

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      dispatch(syncCartWithCloud());

      showToast({
        title: "Đăng nhập thành công!",
        message:
          user?.role === "admin"
            ? `Chào mừng Quản trị viên ${user?.name || "Admin"}, chúc bạn làm việc hiệu quả!`
            : `Xin chào ${user?.name || "quý khách"}, chúc bạn mua sắm vui vẻ!`,
        type: "success",
      });

      handleSuccessfulLoginRedirect(user);
    } catch (error) {
      const errorData = error.response?.data?.data;
      const errorMsg =
        error.response?.data?.message ||
        "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";

      // KỊCH BẢN: TÀI KHOẢN CHƯA KÍCH HOẠT (STATUS PENDING)
      if (
        errorData?.requiresOtpVerification ||
        (error.response?.status === 403 && errorMsg.includes("kích hoạt"))
      ) {
        showToast({
          title: "Cần kích hoạt tài khoản",
          message:
            "Tài khoản của bạn chưa được kích hoạt. Một mã OTP mới đã được gửi về email của bạn.",
          type: "warning",
          duration: 6000,
        });

        // Chuyển sang màn hình nhập OTP kích hoạt
        setMode("otp");
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
        setResendCooldown(60);
        setOtpExpiresCountdown(600);
      } else {
        setLoginError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ NHẬP VÀ XÁC THỰC OTP KHI ĐĂNG NHẬP
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
        rememberMe: formData.rememberMe,
      });

      // Lưu hoặc xoá email theo trạng thái Ghi nhớ đăng nhập
      if (typeof window !== "undefined") {
        if (formData.rememberMe) {
          localStorage.setItem("dudi_remember_login", "true");
          localStorage.setItem("dudi_remembered_email", formData.email.trim());
        } else {
          localStorage.removeItem("dudi_remember_login");
          localStorage.removeItem("dudi_remembered_email");
        }
      }

      const user = res.data?.data?.user;
      dispatch(setCredentials({ user }));
      dispatch(syncCartWithCloud());

      showToast({
        title: "Kích hoạt tài khoản thành công!",
        message:
          user?.role === "admin"
            ? `Chào mừng Quản trị viên ${user?.name || "Admin"}, chúc bạn làm việc hiệu quả!`
            : `Xin chào ${user?.name || "quý khách"}, chúc bạn mua sắm vui vẻ!`,
        type: "success",
        duration: 5000,
      });

      handleSuccessfulLoginRedirect(user);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại.";
      setOtpError(errorMsg);
    } finally {
      setOtpLoading(false);
    }
  };

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
            CHẾ ĐỘ 1: ĐĂNG NHẬP BÌNH THƯỜNG
            ========================================== */}
        {mode === "login" && (
          <div>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="text-[26px] sm:text-[30px] font-black text-gray-900 tracking-tight leading-tight">
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

            {/* Thông báo lỗi đăng nhập ở TRÊN CÙNG của form */}
            {loginError && (
              <div
                className={`mb-5 p-4 rounded-2xl border text-xs sm:text-[13px] animate-fadeIn shadow-xs ${
                  loginError.toLowerCase().includes("khóa") ||
                  loginError.toLowerCase().includes("banned")
                    ? "bg-rose-50/90 border-rose-200 text-rose-800"
                    : "bg-red-50 border-red-200 text-[#dc2626]"
                }`}
              >
                {loginError.toLowerCase().includes("khóa") ||
                loginError.toLowerCase().includes("banned") ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-rose-900 text-sm mb-1">
                        Tài khoản tạm thời bị khóa
                      </h4>
                      <p className="text-rose-700/90 leading-relaxed text-xs sm:text-[13px]">
                        Tài khoản của bạn đã bị tạm khóa bởi Quản trị viên. Vui lòng liên hệ với ban Quản trị qua mục{" "}
                        <strong className="text-rose-950 font-bold">Chăm sóc khách hàng</strong>{" "}
                        <span className="text-slate-600 font-normal">(nút màu tím đầu tiên ở hàng icon bên phải)</span>{" "}
                        hoặc gọi Hotline để được hỗ trợ mở khóa.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#dc2626]" />
                    <span className="leading-snug">{loginError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Google Sign-In Button with Native User Click Overlay */}
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              disabled={googleLoading || loading}
              className="relative w-full h-[44px] rounded-xl overflow-hidden border border-gray-200/90 bg-white hover:bg-gray-50 transition-all flex items-center justify-center cursor-pointer shadow-2xs group active:scale-98"
            >
              <div className="absolute inset-0 flex items-center justify-center gap-2.5 text-gray-700 font-bold text-xs sm:text-sm pointer-events-none">
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
              </div>

              {/* Real Google Button overlaid with opacity-0 to guarantee native browser click */}
              <div
                id="google-btn-container"
                className="absolute inset-0 opacity-[0.001] cursor-pointer flex items-center justify-center overflow-hidden pointer-events-auto"
              />
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
                    className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-red-500/15 transition-all"
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
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer disabled:opacity-60 mt-5"
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
        )}

        {/* ==========================================
            CHẾ ĐỘ 2: XÁC THỰC OTP CHO TÀI KHOẢN PENDING
            ========================================== */}
        {mode === "otp" && (
          <div>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setLoginError("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#dc2626] transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại đăng nhập</span>
            </button>

            {/* OTP Header */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-xs border border-amber-200">
                <ShieldCheck className="w-7 h-7 text-[#dc2626]" />
              </div>
              <h2 className="text-[22px] sm:text-[24px] font-black text-gray-900 tracking-tight leading-tight">
                Kích hoạt tài khoản
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium leading-relaxed px-2">
                Tài khoản của bạn chưa được kích hoạt. Mã xác thực 6 số mới đã được gửi đến:
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

            {/* OTP Form */}
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

              {/* Expiration Countdown Info */}
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
                    <span>Đang kích hoạt & Đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kích hoạt & Đăng nhập ngay</span>
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
