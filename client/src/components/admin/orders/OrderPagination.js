"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Gần đầu trang: 1, 2, 3, 4, 5, ..., trang cuối
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  // Gần cuối trang: 1, ..., n-4, n-3, n-2, n-1, n
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Ở giữa: 1, ..., p-1, p, p+1, ..., n
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default function OrderPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 0) return null;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-150">
      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
        Hiển thị <strong className="text-slate-800 font-bold">{start}-{end}</strong> của{" "}
        <strong className="text-slate-800 font-bold">{totalItems}</strong> đơn hàng
      </span>

      <div className="flex items-center gap-1">
        {/* Nút Về Trang Đầu */}
        {totalPages > 7 && (
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
            title="Trang đầu"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        {/* Nút Trang Trước */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Danh sách trang với dấu ... */}
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                isCurrent
                  ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20 font-black"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Nút Trang Sau */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Nút Tới Trang Cuối */}
        {totalPages > 7 && (
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
            title="Trang cuối"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}