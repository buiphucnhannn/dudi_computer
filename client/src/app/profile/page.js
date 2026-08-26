"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Edit3,
  Loader2,
  CheckCircle2,
  Shield,
  LayoutDashboard,
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { isValidVietnamesePhone, normalizeVietnamesePhone } from "@/lib/validation";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  logoutUser,
  setCredentials,
} from "@/redux/slices/authSlice";
import { resetCartOnLogout } from "@/redux/slices/cartSlice";
import { useToast } from "@/components/common/ToastContext";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [mounted, setMounted] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Check if this Google account has not set a password yet
  const isGoogleWithoutPassword =
    user?.authType === "google" && !user?.isPasswordSet && !user?.hasPassword;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchLiveProfile = async () => {
      try {
        const res = await authAPI.getProfile();
        const liveUser = res.data?.data;
        if (liveUser) {
          dispatch(setCredentials({ user: liveUser }));
        }
      } catch (err) {
        // Fallback silently if offline or token expired
      }
    };

    if (isAuthenticated) {
      fetchLiveProfile();
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (user?.phone) {
      setNewPhone(user.phone);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logoutUser());
      dispatch(resetCartOnLogout());
      showToast({
        title: "Đã đăng xuất",
        message: "Bạn đã đăng xuất tài khoản thành công!",
        type: "info",
      });
      router.push("/login");
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập số điện thoại.",
        type: "warning",
      });
      return;
    }

    if (!isValidVietnamesePhone(newPhone)) {
      showToast({
        title: "Số điện thoại không hợp lệ",
        message:
          "Vui lòng nhập đúng 10 số di động Việt Nam (các đầu số 03, 05, 07, 08, 09).",
        type: "warning",
      });
      return;
    }

    setSavingPhone(true);
    try {
      const normalized = normalizeVietnamesePhone(newPhone);
      const res = await authAPI.updateProfile({
        phone: normalized,
      });
      const updatedUser = res.data?.data;
      dispatch(setCredentials({ user: updatedUser }));
      setIsEditingPhone(false);
      showToast({
        title: "Cập nhật thành công!",
        message: "Số điện thoại của bạn đã được cập nhật.",
        type: "success",
      });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Không thể cập nhật số điện thoại.";
      showToast({
        title: "Cập nhật thất bại",
        message: msg,
        type: "error",
      });
    } finally {
      setSavingPhone(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordForm.newPassword) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập mật khẩu mới!",
        type: "error",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast({
        title: "Mật khẩu quá ngắn",
        message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
        type: "error",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast({
        title: "Mật khẩu không khớp",
        message: "Xác nhận mật khẩu mới không trùng khớp. Vui lòng kiểm tra lại!",
        type: "error",
      });
      return;
    }

    if (!isGoogleWithoutPassword && !passwordForm.currentPassword) {
      showToast({
        title: "Thiếu mật khẩu hiện tại",
        message: "Vui lòng nhập mật khẩu hiện tại để xác nhận đổi mật khẩu!",
        type: "error",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authAPI.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      const updatedUser = res.data?.data;
      if (updatedUser) {
        dispatch(setCredentials({ user: updatedUser }));
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast({
        title: isGoogleWithoutPassword ? "Thiết lập mật khẩu thành công!" : "Đổi mật khẩu thành công!",
        message: isGoogleWithoutPassword
          ? "Đã liên kết mật khẩu vào tài khoản Google. Bây giờ bạn có thể đăng nhập bằng cả 2 cách!"
          : "Mật khẩu tài khoản của bạn đã được cập nhật thành công.",
        type: "success",
      });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Không thể cập nhật mật khẩu. Vui lòng kiểm tra lại!";
      showToast({
        title: "Thao tác thất bại",
        message: msg,
        type: "error",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-280px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#eb1c24]" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-280px)] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1040px] mx-auto">
        {/* Page Title */}
        <div className="border-b border-gray-200/80 pb-3 mb-8">
          <h1 className="text-2xl sm:text-[28px] font-black text-gray-900 tracking-tight inline-block relative after:content-[''] after:absolute after:bottom-[-13px] after:left-0 after:w-full after:h-1 after:bg-[#eb1c24]">
            HỒ SƠ CỦA TÔI
          </h1>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-7 items-start">
          {/* Left Column: Sidebar Card with hover gradient effect */}
          <div className="w-full lg:w-[260px] shrink-0 bg-white border border-gray-100/80 shadow-xs rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-gradient-to-b hover:from-[#ff6b6b]/75 hover:via-[#ff8a80]/45 hover:to-[#fff5f5] hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10 group">
            {/* User Icon Circle (No Photo Avatar) */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#eb1c24] to-[#ff5252] text-white flex items-center justify-center shadow-lg shadow-red-500/25 mb-3.5 group-hover:scale-105 transition-transform duration-300">
              <User className="w-9 h-9 text-white stroke-[2.2]" />
            </div>

            {/* Name */}
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {user?.name || "Khách hàng"}
            </h2>

            {/* Email */}
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-medium truncate max-w-full">
              {user?.email}
            </p>

            {/* Role Badge */}
            <div className="mt-2.5 px-3.5 py-1 bg-red-50 text-[#eb1c24] border border-red-100/70 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>{user?.role === "admin" ? "QUẢN TRỊ VIÊN" : "KHÁCH HÀNG"}</span>
            </div>

            {/* Actions inside Sidebar (No redundant black button) */}
            <div className="w-full mt-6 space-y-2.5">
              {(user?.role === "admin" || user?.role?.toLowerCase() === "admin" || user?.isAdmin) && (
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="w-full bg-gradient-to-r from-red-600 via-[#eb1c24] to-[#c9121a] hover:brightness-110 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/25 transition-all cursor-pointer text-center group/adm"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 group-hover/adm:scale-110 transition-transform" />
                  <span>Vào Trang Quản Trị</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-gray-50/80 hover:bg-red-50 text-gray-700 hover:text-red-600 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-gray-100/80 hover:border-red-100 transition-all cursor-pointer shadow-2xs text-center"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Right Column: Account Details & Change Password */}
          <div className="flex-1 w-full space-y-6">
            {/* Card 1: Account Details */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100/80 p-6 sm:p-7 space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <User className="w-5 h-5 text-[#eb1c24]" />
                <span>Chi tiết tài khoản</span>
              </h2>

              {/* Grid 2 Cols: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Họ và tên */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>HỌ VÀ TÊN</span>
                  </label>
                  <div className="w-full bg-[#f8f9fa] border border-gray-100/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-800">
                    {user?.name || "Chưa cập nhật"}
                  </div>
                </div>

                {/* Địa chỉ email */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>ĐỊA CHỈ EMAIL</span>
                  </label>
                  <div className="w-full bg-[#f8f9fa] border border-gray-100/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-gray-800 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>SỐ ĐIỆN THOẠI</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    className="text-xs text-[#eb1c24] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingPhone ? "Hủy" : "Thay đổi"}</span>
                  </button>
                </div>

                {isEditingPhone ? (
                  <form onSubmit={handleUpdatePhone} className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại của bạn"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-500/15 transition-all"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={savingPhone}
                      className="bg-[#eb1c24] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
                    >
                      {savingPhone ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{savingPhone ? "Đang lưu..." : "Lưu"}</span>
                    </button>
                  </form>
                ) : (
                  <div className="w-full bg-[#f8f9fa] border border-gray-100/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm">
                    {user?.phone ? (
                      <span className="font-bold text-gray-800">{user.phone}</span>
                    ) : (
                      <span className="text-gray-400 italic">
                        Chưa cập nhật số điện thoại
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Change / Set Password (Bảo mật tài khoản & Đổi mật khẩu) */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100/80 p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#eb1c24]" />
                  <span>
                    {isGoogleWithoutPassword
                      ? "Thiết lập mật khẩu đăng nhập"
                      : "Đổi mật khẩu tài khoản"}
                  </span>
                </h2>
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  Tối thiểu 6 ký tự
                </span>
              </div>

              {isGoogleWithoutPassword && (
                <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-xs text-red-900 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-red-950">
                      Tài khoản liên kết Google OAuth
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      Bạn đang đăng nhập trực tiếp qua tài khoản Google ({user?.email}). Khi tạo mật khẩu tại đây, bạn sẽ có thể đăng nhập linh hoạt bằng cả 2 hình thức: <strong>Đăng nhập với Google</strong> hoặc <strong>Nhập Email & Mật khẩu</strong>.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Mật khẩu hiện tại (Chỉ hiển thị khi tài khoản đã có mật khẩu) */}
                {!isGoogleWithoutPassword && (
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>MẬT KHẨU HIỆN TẠI</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full bg-[#f8f9fa] focus:bg-white border border-gray-200 focus:border-[#eb1c24] rounded-xl px-4 py-2.5 pr-11 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid 2 Cols: Mật khẩu mới & Xác nhận mật khẩu mới */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mật khẩu mới */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                      <span>MẬT KHẨU MỚI</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        placeholder="Nhập mật khẩu mới (>= 6 ký tự)"
                        className="w-full bg-[#f8f9fa] focus:bg-white border border-gray-200 focus:border-[#eb1c24] rounded-xl px-4 py-2.5 pr-11 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nhập lại mật khẩu mới */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>XÁC NHẬN MẬT KHẨU MỚI</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full bg-[#f8f9fa] focus:bg-white border border-gray-200 focus:border-[#eb1c24] rounded-xl px-4 py-2.5 pr-11 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={savingPassword || (!passwordForm.newPassword && !passwordForm.confirmPassword)}
                    className="flex items-center gap-2 bg-[#eb1c24] hover:bg-[#c9121a] disabled:bg-slate-300 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer disabled:cursor-not-allowed active:scale-98"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>
                          {isGoogleWithoutPassword
                            ? "Thiết lập & Lưu mật khẩu"
                            : "Lưu mật khẩu mới"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
