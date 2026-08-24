"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Save, User, Mail, Phone, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { selectCurrentUser, setCredentials } from "@/redux/slices/authSlice";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function AccountSettings() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync form with current user from Redux and fresh API fetch
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: currentUser.name || currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      }));
    }

    const fetchLiveProfile = async () => {
      try {
        setLoading(true);
        const res = await authAPI.getProfile();
        const liveUser = res.data?.data;
        if (liveUser) {
          dispatch(setCredentials({ user: liveUser }));
          setForm((prev) => ({
            ...prev,
            name: liveUser.name || liveUser.fullName || "",
            email: liveUser.email || "",
            phone: liveUser.phone || "",
          }));
        }
      } catch (err) {
        // Fallback silently if using session/localStorage
      } finally {
        setLoading(false);
      }
    };

    fetchLiveProfile();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Họ và tên không được để trống!",
        type: "error",
      });
      return;
    }

    if (form.newPassword && form.newPassword.length < 6) {
      showToast({
        title: "Mật khẩu không hợp lệ",
        message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
        type: "error",
      });
      return;
    }

    if (form.newPassword && !form.currentPassword) {
      showToast({
        title: "Xác thực mật khẩu",
        message: "Vui lòng nhập mật khẩu hiện tại để xác nhận đổi mật khẩu mới!",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
      };

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const res = await authAPI.updateProfile(payload);
      const updated = res.data?.data;

      if (updated) {
        dispatch(setCredentials({ user: updated }));
      }

      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));

      showToast({
        title: "Cập nhật thành công",
        message: "Đã lưu thay đổi thông tin tài khoản quản trị viên!",
        type: "success",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật tài khoản:", err);
      const errMsg = err.response?.data?.message || "Không thể cập nhật thông tin tài khoản. Vui lòng thử lại!";
      showToast({
        title: "Cập nhật thất bại",
        message: errMsg,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const displayName = form.name || currentUser?.name || "Quản trị viên";
  const displayEmail = form.email || currentUser?.email || "admin@dudisoftware.com";
  const userRole = currentUser?.role === "admin" ? "Quản trị viên cấp cao (Admin)" : "Nhân viên quản trị";
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <section
      id="account"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Cài đặt tài khoản quản trị
          </h2>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            {userRole}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Cập nhật thông tin cá nhân của người đang đăng nhập hệ thống.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-[#eb1c24] border-2 border-red-200 shadow-md shadow-red-600/20 flex items-center justify-center text-white text-3xl font-black">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initialLetter}</span>
              )}
            </div>

            <span className="text-xs font-bold text-slate-700 text-center">
              {displayName}
            </span>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Họ và tên</span>
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>

            {/* Email (Read-only for security) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Địa chỉ Email (Đăng nhập)</span>
              </label>

              <input
                type="email"
                name="email"
                value={displayEmail}
                readOnly
                disabled
                className="w-full bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-not-allowed"
                title="Email đăng nhập cố định của hệ thống"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Số điện thoại liên hệ</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ví dụ: 0909163821"
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>

            {/* Password Fields */}
            <div className="md:col-span-2 flex flex-col gap-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Đổi mật khẩu tài khoản (Để trống nếu không muốn đổi)</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Mật khẩu hiện tại"
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                  className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-slate-150">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#eb1c24] hover:bg-[#d6131b] disabled:bg-slate-300 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}