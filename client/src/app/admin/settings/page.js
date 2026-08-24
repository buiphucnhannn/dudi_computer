"use client";

import AccountSettings from "@/components/admin/settings/AccountSettings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
          Cài đặt hệ thống
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
          Quản lý tài khoản quản trị, thiết lập hệ thống, thông báo và bảo mật tại DUDI SOFTWARE.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        <AccountSettings />
      </div>
    </div>
  );
}