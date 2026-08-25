"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Download, Check } from "lucide-react";

export default function StatisticsHeader({ currentPeriod, onPeriodChange, onExport }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const periods = [
    { key: "month", label: "Tháng này (Tháng 10/2025)" },
    { key: "quarter", label: "Quý này (Quý 4/2025)" },
    { key: "year", label: "Năm nay (Năm 2025)" },
    { key: "all", label: "Toàn bộ thời gian" },
  ];

  const currentLabel = periods.find((p) => p.key === currentPeriod)?.label || "Tháng này";

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
          Báo cáo & Thống kê
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Tổng quan hiệu suất kinh doanh, doanh thu theo tháng và bảng xếp hạng sản phẩm bán chạy.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 relative">
        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>{currentLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {periods.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      onPeriodChange?.(p.key);
                      setShowDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition text-left cursor-pointer ${
                      currentPeriod === p.key
                        ? "bg-[#eb1c24] text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{p.label}</span>
                    {currentPeriod === p.key && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export Report */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
        >
          <Download className="h-4 w-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
}