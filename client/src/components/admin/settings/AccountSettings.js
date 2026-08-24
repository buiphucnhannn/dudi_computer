"use client";

import { useState } from "react";
import { Camera, Save, User, Mail, Lock } from "lucide-react";
import { useToast } from "@/components/common/ToastContext";

export default function AccountSettings() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "Quản trị viên DUDI",
    email: "admin@dudi.vn",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast({
      title: "Cập nhật thành công",
      message: "Đã lưu thay đổi thông tin tài khoản quản trị viên!",
      type: "success",
    });
  };

  return (
    <section
      id="account"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-4">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
          Cài đặt tài khoản
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Cập nhật thông tin cá nhân, email và mật khẩu truy cập hệ thống.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xs group cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5NuDMDk8VutPquu_2tFdNj4C-NtPUm7V4iStuwffqZH2qI4zLUVqGqM6eesEzkW2X0zSrRA1KhqK0ELfS0pSqHlBQp72MxDC4QaxA1mwh5TObasLyURFBdyE6lv-IQl5JlZqzKOeKjfFzVpTcdtr7VPcTCSSPnUXLu6tZw7aVoxeVz7_JapWpWWN_wh6M1mDEvxfm7DOCLox5FftnyS0qJNrTvXZJIy7IVvMTaKC_lgIVTFCW-zvI"
                alt="Ảnh đại diện quản trị viên"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast({
                  title: "Ảnh đại diện",
                  message: "Tính năng tải lên ảnh đại diện tùy chỉnh đang được đồng bộ.",
                  type: "info",
                });
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
            >
              Đổi ảnh đại diện
            </button>
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
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Địa chỉ Email</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>

            {/* Password Fields */}
            <div className="md:col-span-2 flex flex-col gap-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Đổi mật khẩu</span>
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
                  placeholder="Mật khẩu mới"
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
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-98"
          >
            <Save className="h-4 w-4" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </form>
    </section>
  );
}