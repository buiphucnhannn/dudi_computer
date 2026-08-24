"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { statisticAPI } from "@/lib/api";

const CIRCUMFERENCE = 251.327; // 2 * PI * 40

export default function SalesRatioChart() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRatio = async () => {
      try {
        const res = await statisticAPI.getSalesRatio();
        if (res.data?.data && isMounted) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải tỷ lệ bán hàng:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRatio();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex items-center justify-center min-h-[380px]">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  // Calculate SVG stroke dashes for each slice
  let accumulatedPercent = 0;
  const slices = categories.map((cat) => {
    const sliceLength = (cat.value / 100) * CIRCUMFERENCE;
    const strokeDasharray = `${sliceLength.toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * CIRCUMFERENCE);
    accumulatedPercent += cat.value;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset: strokeDashoffset.toFixed(1),
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Tỷ lệ bán hàng
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Theo nhóm danh mục sản phẩm trong DB
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
            className="w-40 h-40 -rotate-90 drop-shadow-xs"
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

            {/* Dynamic Slices */}
            {slices.map((slice) => (
              <circle
                key={slice.label}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={slice.stroke || "#0f172a"}
                strokeWidth="14"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            ))}
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
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">
              Chưa có dữ liệu phân loại
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.label}
                className="flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${category.dot}`} />
                  <span className="text-slate-700 truncate">{category.label}</span>
                </div>

                <span className="font-black text-slate-900 shrink-0">
                  {category.value}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}