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
} from "lucide-react";
import { authAPI } from "@/lib/api";
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        message: "Vui lòng nhập số điện thoại hợp lệ.",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await authAPI.updateProfile({
        phone: newPhone.trim(),
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
      setSaving(false);
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

            {/* Navigation Tabs inside Sidebar - Căn giữa chuẩn xác */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                type="button"
                className="w-full bg-[#eb1c24] hover:bg-[#b91c1c] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all cursor-default text-center"
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Thông tin cá nhân</span>
              </button>

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

          {/* Right Column: Account Details */}
          <div className="flex-1 w-full bg-white rounded-2xl shadow-xs border border-gray-100/80 p-6 sm:p-7 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 pb-2 border-b border-gray-100">
              Chi tiết tài khoản
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
                    disabled={saving}
                    className="bg-[#eb1c24] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{saving ? "Đang lưu..." : "Lưu"}</span>
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
        </div>
      </div>
    </div>
  );
}
