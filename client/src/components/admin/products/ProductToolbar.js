"use client";

import { LayoutGrid, List } from "lucide-react";

export default function ProductToolbar({
  total,
  currentPage,
  pageSize,
  sort,
  setSort,
  viewMode,
  setViewMode,
}) {
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs md:flex-row md:items-center md:justify-between">
      {/* Result */}
      <div className="text-xs text-slate-500 font-medium">
        Hiển thị{" "}
        <strong className="text-slate-900 font-bold">
          {start}-{end}
        </strong>{" "}
        của{" "}
        <strong className="text-slate-900 font-bold">
          {total}
        </strong>{" "}
        sản phẩm
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500 font-medium">
          Sắp xếp theo:
        </span>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
        >
          <option value="price-desc">Giá từ cao đến thấp</option>
          <option value="price-asc">Giá từ thấp đến cao</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="newest">Mới nhất</option>
        </select>

        {/* View mode */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center justify-center rounded-lg p-1.5 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center justify-center rounded-lg p-1.5 transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Dạng danh sách"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}