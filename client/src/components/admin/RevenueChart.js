"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDashboard } from "./DashboardContext";

/**
 * Generates a smooth Catmull-Rom / Cubic Bezier curve path for SVG
 */
function generateSmoothCurve(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].cx} ${points[0].cy}`;

  let d = `M ${points[0].cx} ${points[0].cy}`;
  const tension = 0.28;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? i + 1 : i + 2];

    const cp1x = p1.cx + (p2.cx - p0.cx) * tension;
    const cp1y = p1.cy + (p2.cy - p0.cy) * tension;
    const cp2x = p2.cx - (p3.cx - p1.cx) * tension;
    const cp2y = p2.cy - (p3.cy - p1.cy) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.cx.toFixed(1)} ${p2.cy.toFixed(1)}`;
  }
  return d;
}

export default function RevenueChart() {
  const { revenuePeriod, setRevenuePeriod, chartDatasets } = useDashboard();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const periodLabels = {
    "7d": "7 ngày gần nhất",
    "30d": "30 ngày gần nhất",
    "month": "6 tháng gần nhất",
  };

  const currentData = chartDatasets?.[revenuePeriod] || {
    trend: "+0.0%",
    total: "0₫",
    labels: [],
    points: [],
  };

  const points = currentData.points || [];
  const smoothCurvePath = generateSmoothCurve(points);
  const smoothFillPath = smoothCurvePath ? `${smoothCurvePath} L 100 100 L 0 100 Z` : "";
  const isPositive = !String(currentData.trend || "").startsWith("-");

  return (
    <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs lg:w-2/3">
      {/* Header */}
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Doanh thu thực tế
            </h2>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border transition-colors ${
                isPositive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {currentData.trend}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Tổng doanh thu ({periodLabels[revenuePeriod] || "Thời gian này"}):{" "}
            <strong className="text-slate-900 font-black">{currentData.total}</strong>
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto shrink-0">
          {[
            { key: "7d", label: "7 ngày" },
            { key: "30d", label: "30 ngày" },
            { key: "month", label: "6 tháng" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setRevenuePeriod(tab.key);
                setHoveredPoint(null);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                revenuePeriod === tab.key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 pt-4 select-none">
        {/* Tooltip on hover */}
        {hoveredPoint && (
          <div
            className="absolute z-30 -top-2 rounded-xl bg-slate-900/95 px-3.5 py-2 text-xs text-white shadow-2xl pointer-events-none transform -translate-x-1/2 transition-all border border-slate-700 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150"
            style={{ left: `${Math.max(10, Math.min(90, hoveredPoint.cx))}%` }}
          >
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span>{hoveredPoint.date ? `${hoveredPoint.day} (${hoveredPoint.date})` : hoveredPoint.day}</span>
            </div>
            <div className="font-black text-white text-xs sm:text-sm mt-0.5">
              {hoveredPoint.value}
            </div>
            {typeof hoveredPoint.orders === "number" && (
              <div className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                {hoveredPoint.orders} đơn hàng
              </div>
            )}
          </div>
        )}

        <svg
          className="relative z-10 h-[220px] sm:h-[240px] w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            {/* Smooth Soft Gradient Fill */}
            <linearGradient id="smoothAreaGradientMuted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Line Gradient */}
            <linearGradient id="thinLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Subtle Line Glow Filter */}
            <filter id="thinGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#dc2626" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Grid lines with ultra-thin dashed pattern */}
          <line stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20" />
          <line stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50" />
          <line stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="0.5" x1="0" x2="100" y1="80" y2="80" />

          {/* Hover Vertical Guide Line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.cx}
              x2={hoveredPoint.cx}
              y1="10"
              y2="90"
              stroke="#cbd5e1"
              strokeWidth="0.6"
              strokeDasharray="2 2"
            />
          )}

          {/* Smooth Curved Area Fill */}
          {smoothFillPath && (
            <path
              d={smoothFillPath}
              fill="url(#smoothAreaGradientMuted)"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Ultra-thin Crisp Bezier Spline Stroke */}
          {smoothCurvePath && (
            <path
              d={smoothCurvePath}
              fill="none"
              stroke="url(#thinLineGradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.3"
              filter="url(#thinGlow)"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Interactive Data Points with Fine Minimalist Circles */}
          {points.map((p, idx) => {
            const isHovered = hoveredPoint?.day === p.day;
            return (
              <g key={`${p.day}-${idx}`}>
                {/* Outer interactive hover touch target */}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r="7"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Outer Glow Halo on hover */}
                {isHovered && (
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r="4.5"
                    fill="#fee2e2"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Inner point marker - Thin and Elegant */}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  fill={isHovered ? "#dc2626" : "#ffffff"}
                  stroke="#dc2626"
                  strokeWidth={isHovered ? "1.6" : "1.1"}
                  r={isHovered ? "3.2" : "1.8"}
                  className="transition-all duration-200 pointer-events-none drop-shadow-2xs"
                />
              </g>
            );
          })}
        </svg>

        {/* X axis labels */}
        <div className="absolute bottom-0 left-0 flex w-full justify-between px-1 text-[10.5px] font-bold text-slate-400">
          {currentData.labels?.map((lbl) => (
            <span key={lbl}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
}