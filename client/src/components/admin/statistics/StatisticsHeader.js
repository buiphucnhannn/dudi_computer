"use client";

import { Calendar, ChevronDown, Download } from "lucide-react";

export default function StatisticsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
          Báo cáo & Thống kê
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Tổng quan hiệu suất kinh doanh, doanh thu và tỷ lệ bán hàng chi tiết.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>Tháng này</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98">
          <Download className="h-4 w-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>
    </div>
  );
}