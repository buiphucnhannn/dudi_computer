"use client";

import { useState } from "react";
import { ShieldCheck, Key } from "lucide-react";

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleConfigure = () => {
    alert("Chức năng cấu hình 2FA!");
  };

  return (
    <section
      id="security"
      className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-150 pb-4">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
          Bảo mật & Quyền riêng tư
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Tăng cường các lớp xác thực và quản lý phiên đăng nhập an toàn.
        </p>
      </div>

      {/* 2FA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center mt-0.5">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">
              Xác thực 2 yếu tố (2FA)
            </span>

            <span className="text-[11px] text-slate-500 font-medium mt-0.5">
              Thêm một lớp bảo mật phụ trợ khi đăng nhập (OTP qua email/ứng dụng authenticator).
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold mt-1.5 ${
                twoFactorEnabled ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  twoFactorEnabled ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {twoFactorEnabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfigure}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer shadow-2xs whitespace-nowrap self-start md:self-auto"
        >
          Cấu hình 2FA
        </button>
      </div>
    </section>
  );
}