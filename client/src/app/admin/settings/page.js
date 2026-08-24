"use client";

import AccountSettings from "@/components/admin/settings/AccountSettings";
import SystemSettings from "@/components/admin/settings/SystemSettings";
import NotificationSettings from "@/components/admin/settings/NotificationSettings";
import SecuritySettings from "@/components/admin/settings/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full px-6 py-8 gap-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
          Cài đặt hệ thống
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Quản lý tài khoản quản trị, thiết lập hệ thống, thông báo và bảo mật.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        <AccountSettings />
        <SystemSettings />
        <NotificationSettings />
        <SecuritySettings />
      </div>
    </div>
  );
}