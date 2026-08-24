"use client";

import { useState } from "react";
import { Bell, Mail, Monitor, ShoppingBag } from "lucide-react";

const initialNotifications = [
  {
    id: "email",
    title: "Email thông báo",
    description: "Nhận báo cáo tổng kết doanh số hàng ngày qua email.",
    icon: Mail,
    enabled: true,
  },
  {
    id: "desktop",
    title: "Thông báo trên Desktop",
    description: "Hiển thị thông báo popup đẩy khi có đơn hàng hoặc liên hệ mới.",
    icon: Monitor,
    enabled: true,
  },
  {
    id: "orders",
    title: "Cập nhật trạng thái đơn hàng",
    description: "Nhận cảnh báo ngay lập tức khi đơn hàng chuyển sang trạng thái mới.",
    icon: ShoppingBag,
    enabled: false,
  },
];

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <section
      id="notifications"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-4">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
          Cài đặt thông báo
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Quản lý các kênh nhận thông báo và cảnh báo từ hệ thống.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col divide-y divide-slate-100">
        {notifications.map((notification) => {
          const Icon = notification.icon;

          return (
            <div
              key={notification.id}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">
                    {notification.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {notification.description}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleNotification(notification.id)}
                aria-pressed={notification.enabled}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  notification.enabled ? "bg-red-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    notification.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}