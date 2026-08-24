"use client";

import { useState } from "react";
import { ChevronDown, Globe, DollarSign, Clock } from "lucide-react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    language: "vi",
    currency: "vnd",
    timezone: "hcm",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section
      id="system"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-4">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
          Cài đặt hệ thống
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Định dạng hiển thị, ngôn ngữ giao diện, tiền tệ và múi giờ máy chủ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>Ngôn ngữ hiển thị</span>
          </label>

          <div className="relative">
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full appearance-none bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
            >
              <option value="vi">Tiếng Việt (Mặc định)</option>
              <option value="en">English (US)</option>
            </select>

            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
          </div>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            <span>Đơn vị tiền tệ</span>
          </label>

          <div className="relative">
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full appearance-none bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
            >
              <option value="vnd">VND (₫) - Việt Nam Đồng</option>
              <option value="usd">USD ($) - US Dollar</option>
            </select>

            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Múi giờ</span>
          </label>

          <div className="relative">
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full appearance-none bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
            >
              <option value="hcm">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
              <option value="utc">(GMT+00:00) UTC Universal Standard Time</option>
            </select>

            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}