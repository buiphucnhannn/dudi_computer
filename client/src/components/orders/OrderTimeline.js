"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  AlertCircle,
} from "lucide-react";

/**
 * Standard Order Flow:
 * processing (Đang xử lý) -> confirmed (Đã xác nhận) -> shipping (Đang giao) -> completed (Đã giao hàng)
 * Special case: cancelled (Đã hủy)
 */
const STATUS_STEPS = [
  {
    key: "processing",
    label: "Đang xử lý",
    desc: "Đang chuẩn bị hàng",
    icon: Clock,
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
    desc: "Đã kiểm tra linh kiện",
    icon: CheckCircle2,
  },
  {
    key: "shipping",
    label: "Đang giao hàng",
    desc: "Bàn giao đơn vị vận chuyển",
    icon: Truck,
  },
  {
    key: "completed",
    label: "Đã giao hàng",
    desc: "Giao hàng thành công",
    icon: PackageCheck,
  },
];

export function getStatusStepIndex(status) {
  switch (status) {
    case "pending":
    case "processing":
      return 0;
    case "confirmed":
      return 1;
    case "shipping":
      return 2;
    case "completed":
      return 3;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case "completed":
      return {
        label: "Đã hoàn thành",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        icon: PackageCheck,
      };
    case "shipping":
      return {
        label: "Đang giao hàng",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        dotColor: "bg-blue-500",
        icon: Truck,
      };
    case "confirmed":
      return {
        label: "Đã xác nhận",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        dotColor: "bg-indigo-500",
        icon: CheckCircle2,
      };
    case "processing":
    case "pending":
      return {
        label: "Đang xử lý",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        icon: Clock,
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        color: "bg-red-50 text-red-700 border-red-200",
        dotColor: "bg-red-500",
        icon: XCircle,
      };
    default:
      return {
        label: status || "Đang xử lý",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        dotColor: "bg-slate-500",
        icon: AlertCircle,
      };
  }
}

export default function OrderTimeline({ status, timeline = [], isCompact = false }) {
  const isCancelled = status === "cancelled";
  const currentIndex = getStatusStepIndex(status);

  if (isCancelled) {
    return (
      <div className="rounded-xl bg-red-50/80 border border-red-200/80 p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-black text-red-700 uppercase tracking-wide block">
            Đơn hàng đã bị hủy
          </span>
          <span className="text-[12px] text-red-600">
            {timeline[timeline.length - 1]?.note ||
              "Đơn hàng đã được hủy theo yêu cầu hoặc do hết hàng trong kho."}
          </span>
        </div>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="w-full">
        {/* Progress Bar Header */}
        <div className="relative flex items-center justify-between mb-2">
          {STATUS_STEPS.map((step, idx) => {
            const isFinished = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-[#eb1c24] text-white ring-4 ring-red-100 shadow-xs"
                      : isFinished
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[11px] mt-1 font-semibold text-center whitespace-nowrap ${
                    isCurrent
                      ? "text-[#eb1c24] font-black"
                      : isFinished
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

          {/* Background Connecting Line */}
          <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded Timeline
  return (
    <div className="w-full bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
      <div className="relative flex items-center justify-between">
        {STATUS_STEPS.map((step, idx) => {
          const isFinished = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center text-center z-10 flex-1 px-1"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-[#eb1c24] text-white ring-4 ring-red-500/20 shadow-md scale-105"
                    : isFinished
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-white text-slate-300 border border-slate-200"
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span
                className={`text-[12.5px] mt-2 block leading-tight ${
                  isCurrent
                    ? "font-black text-[#eb1c24]"
                    : isFinished
                    ? "font-bold text-slate-800"
                    : "font-medium text-slate-400"
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10.5px] text-slate-400 mt-0.5 hidden sm:block">
                {step.desc}
              </span>
            </div>
          );
        })}

        {/* Connecting Progress Track */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-slate-200 rounded-full -z-0">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (currentIndex / (STATUS_STEPS.length - 1)) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
