"use client";

import { PieChart, MoreHorizontal } from "lucide-react";

const categories = [
  {
    label: "Card Màn Hình (VGA)",
    value: 45,
    color: "text-slate-900",
    dot: "bg-slate-900",
  },
  {
    label: "Vi xử lý (CPU)",
    value: 30,
    color: "text-[#DC2626]",
    dot: "bg-red-600",
  },
  {
    label: "Mainboard & Linh kiện",
    value: 25,
    color: "text-slate-400",
    dot: "bg-slate-400",
  },
];

export default function SalesRatioChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Tỷ lệ bán hàng
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Theo nhóm danh mục linh kiện
          </p>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Donut Chart */}
        <div className="relative">
          <svg
            className="w-40 h-40 -rotate-90 drop-shadow-sm"
            viewBox="0 0 100 100"
          >
            {/* Background */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="14"
            />

            {/* VGA */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#0f172a"
              strokeWidth="14"
              strokeDasharray="113.1 251.2"
              strokeDashoffset="0"
            />

            {/* CPU */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#dc2626"
              strokeWidth="14"
              strokeDasharray="75.4 251.2"
              strokeDashoffset="-113.1"
            />

            {/* Mainboard */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#94a3b8"
              strokeWidth="14"
              strokeDasharray="62.8 251.2"
              strokeDashoffset="-188.5"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900">100%</span>
            <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">
              Tổng quan
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full mt-6 space-y-2.5">
          {categories.map((category) => (
            <div
              key={category.label}
              className="flex items-center justify-between text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${category.dot}`} />
                <span className="text-slate-700">{category.label}</span>
              </div>

              <span className="font-black text-slate-900">
                {category.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}