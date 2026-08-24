"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs"
        title="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from(
        { length: Math.min(totalPages, 5) },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentPage === page
              ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20 font-black"
              : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 5 && (
        <>
          <span className="px-2 text-slate-400 text-xs font-bold">...</span>

          <button
            onClick={() => setCurrentPage(totalPages)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs cursor-pointer"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((page) => page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs"
        title="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}