"use client";

import { MoreHorizontal } from "lucide-react";

const revenueData = [
  { month: "T1", value: 40 },
  { month: "T2", value: 55 },
  { month: "T3", value: 35 },
  { month: "T4", value: 70 },
  { month: "T5", value: 60 },
  { month: "T6", value: 85 },
];

export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Doanh thu theo tháng
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Dữ liệu tổng hợp từ 6 tháng gần nhất
          </p>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="relative h-64 w-full">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="w-full border-t border-slate-100" />
          ))}
        </div>

        {/* Bars */}
        <div className="relative z-10 flex justify-between items-end h-full pt-4 pb-8">
          {revenueData.map((item, index) => {
            const active = index === revenueData.length - 1;

            return (
              <div
                key={item.month}
                className="relative flex flex-col justify-end items-center h-full w-full group"
              >
                <div
                  className={`w-10 rounded-t-xl transition-all duration-300 ${
                    active
                      ? "bg-slate-900 shadow-md"
                      : "bg-slate-200 group-hover:bg-slate-400"
                  }`}
                  style={{
                    height: `${item.value}%`,
                  }}
                />

                <span
                  className={`absolute -bottom-6 text-xs ${
                    active
                      ? "font-bold text-slate-900"
                      : "text-slate-400 font-medium"
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}