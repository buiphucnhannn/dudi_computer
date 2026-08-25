"use client";

import { Search } from "lucide-react";

const statuses = [
  { value: "all", label: "Tất cả" },
  { value: "processing", label: "Đang xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function OrderFilter({ keyword, setKeyword, status, setStatus }) {
  return (
    <div className="p-5 bg-white flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-150">
      {/* Search Bar */}
      <div className="flex items-center gap-2.5 bg-slate-100 px-3.5 py-2 rounded-xl w-full md:w-96 border border-transparent focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 transition">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm theo mã đơn (#ORD), tên khách, số điện thoại..."
          className="bg-transparent border-none outline-none focus:ring-0 text-xs font-medium w-full placeholder:text-slate-400 text-slate-800"
        />
      </div>

      {/* Status Badges Filter */}
      <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1">
        {statuses.map((item) => (
          <button
            key={item.value}
            onClick={() => setStatus(item.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              status === item.value
                ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20 font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}