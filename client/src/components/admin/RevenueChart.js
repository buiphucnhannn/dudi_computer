"use client";

import { useState } from "react";
import { TrendingUp, BarChart2 } from "lucide-react";

const datasets = {
  "7d": {
    trend: "+18.4%",
    total: "215.800.000₫",
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    points: [
      { day: "Thứ 2", value: "24.500.000₫", percent: 70, cx: 0, cy: 70 },
      { day: "Thứ 3", value: "18.200.000₫", percent: 80, cx: 16.6, cy: 80 },
      { day: "Thứ 4", value: "35.000.000₫", percent: 50, cx: 33.3, cy: 50 },
      { day: "Thứ 5", value: "28.900.000₫", percent: 60, cx: 50, cy: 60 },
      { day: "Thứ 6", value: "48.200.000₫", percent: 30, cx: 66.6, cy: 30 },
      { day: "Thứ 7", value: "39.500.000₫", percent: 40, cx: 83.3, cy: 40 },
      { day: "Chủ Nhật", value: "58.000.000₫", percent: 15, cx: 100, cy: 15 },
    ],
    polyPoints: "0,70 16.6,80 33.3,50 50,60 66.6,30 83.3,40 100,15",
    polyFill: "0,70 16.6,80 33.3,50 50,60 66.6,30 83.3,40 100,15 100,100 0,100",
  },
  "30d": {
    trend: "+24.8%",
    total: "892.400.000₫",
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    points: [
      { day: "Tuần 1", value: "195.000.000₫", percent: 65, cx: 0, cy: 65 },
      { day: "Tuần 2", value: "240.000.000₫", percent: 45, cx: 33.3, cy: 45 },
      { day: "Tuần 3", value: "210.000.000₫", percent: 55, cx: 66.6, cy: 55 },
      { day: "Tuần 4", value: "310.000.000₫", percent: 20, cx: 100, cy: 20 },
    ],
    polyPoints: "0,65 33.3,45 66.6,55 100,20",
    polyFill: "0,65 33.3,45 66.6,55 100,20 100,100 0,100",
  },
};

export default function RevenueChart() {
  const [period, setPeriod] = useState("7d");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const currentData = datasets[period];

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:w-2/3">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Doanh thu gần đây
            </h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <TrendingUp className="h-3 w-3" />
              {currentData.trend}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tổng cộng: <strong className="text-slate-800 font-black">{currentData.total}</strong>
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setPeriod("7d");
              setHoveredPoint(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              period === "7d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            7 ngày
          </button>

          <button
            onClick={() => {
              setPeriod("30d");
              setHoveredPoint(null);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              period === "30d"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            30 ngày
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 pt-4">
        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-30 -top-2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs text-white shadow-xl pointer-events-none transform -translate-x-1/2 transition-all border border-slate-700"
            style={{ left: `${hoveredPoint.cx}%` }}
          >
            <div className="font-bold text-[11px] text-slate-300">
              {hoveredPoint.day}
            </div>
            <div className="font-black text-white text-xs">
              {hoveredPoint.value}
            </div>
          </div>
        )}

        <svg
          className="relative z-10 h-[240px] w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="gradientRevInteractive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            stroke="#f1f5f9"
            strokeDasharray="3 3"
            strokeWidth="0.8"
            x1="0"
            x2="100"
            y1="20"
            y2="20"
          />
          <line
            stroke="#f1f5f9"
            strokeDasharray="3 3"
            strokeWidth="0.8"
            x1="0"
            x2="100"
            y1="50"
            y2="50"
          />
          <line
            stroke="#f1f5f9"
            strokeDasharray="3 3"
            strokeWidth="0.8"
            x1="0"
            x2="100"
            y1="80"
            y2="80"
          />

          {/* Area fill */}
          <polygon
            points={currentData.polyFill}
            fill="url(#gradientRevInteractive)"
            className="transition-all duration-500 ease-out"
          />

          {/* Polyline */}
          <polyline
            fill="none"
            points={currentData.polyPoints}
            stroke="#dc2626"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            className="transition-all duration-500 ease-out"
          />

          {/* Data Points */}
          {currentData.points.map((p, idx) => (
            <circle
              key={`${p.day}-${idx}`}
              cx={p.cx}
              cy={p.cy}
              fill={hoveredPoint?.day === p.day ? "#dc2626" : "#ffffff"}
              stroke="#dc2626"
              strokeWidth={hoveredPoint?.day === p.day ? "3" : "1.8"}
              r={hoveredPoint?.day === p.day ? "4.5" : "2.8"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* X axis labels */}
        <div className="absolute bottom-0 left-0 flex w-full justify-between px-1 text-[11px] font-bold text-slate-400">
          {currentData.labels.map((lbl) => (
            <span key={lbl}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
}