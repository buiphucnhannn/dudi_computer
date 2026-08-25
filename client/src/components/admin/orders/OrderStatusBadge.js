"use client";

const statusConfig = {
  processing: {
    label: "Chờ xử lý",
    dot: "bg-amber-500",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Đã xác nhận",
    dot: "bg-indigo-500",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shipping: {
    label: "Đang giao",
    dot: "bg-blue-500",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Đã hoàn thành",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy",
    dot: "bg-red-500",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function OrderStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.processing;

  return (
    <span
      suppressHydrationWarning
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${config.className}`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span suppressHydrationWarning>{config.label}</span>
    </span>
  );
}