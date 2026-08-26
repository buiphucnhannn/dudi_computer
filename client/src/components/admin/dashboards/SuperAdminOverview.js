"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  LayoutDashboard,
  Store,
  Newspaper,
  Users,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Package,
  ShoppingCart,
  Briefcase,
  ShieldCheck,
  Compass,
} from "lucide-react";
import SalesDashboard from "./SalesDashboard";
import ContentDashboard from "./ContentDashboard";
import CustomerDashboard from "./CustomerDashboard";

export default function SuperAdminOverview() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: "Tổng quan toàn quyền",
      icon: Crown,
      color: "from-red-600 to-rose-700 text-red-600",
    },
    {
      id: "sales",
      label: "Thương mại & Bán hàng",
      icon: Store,
      color: "from-blue-600 to-indigo-700 text-blue-600",
    },
    {
      id: "content",
      label: "Nội dung & Tuyển dụng",
      icon: Newspaper,
      color: "from-purple-600 to-purple-800 text-purple-600",
    },
    {
      id: "customer",
      label: "Quản lý tài khoản",
      icon: Users,
      color: "from-emerald-600 to-teal-700 text-emerald-600",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 animate-smooth-fade">
      {/* Super Admin Control Switcher Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#eb1c24] flex items-center justify-center font-black shadow-xs shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>Cổng Quản Trị Tối Cao</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#eb1c24] text-[10px] font-extrabold">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Chuyển đổi linh hoạt giữa các góc nhìn Dashboard chuyên môn
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-white text-slate-900 shadow-xs scale-100 font-extrabold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.color.split(" ").pop() : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          <SalesDashboard />
        </div>
      )}

      {activeTab === "sales" && <SalesDashboard />}
      {activeTab === "content" && <ContentDashboard />}
      {activeTab === "customer" && <CustomerDashboard />}
    </div>
  );
}
