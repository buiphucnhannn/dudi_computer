"use client";

import { Download, Plus } from "lucide-react";

export default function ProductPageHeader({ onAddProduct, onExport }) {
  return (
    <div className="relative z-10 mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="mb-1 text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
          Quản lý sản phẩm
        </h1>

        <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
          Quản lý kho hàng, cập nhật thông tin và theo dõi tình trạng tồn kho của các sản phẩm hiện có tại DUDI SOFTWARE.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Xuất dữ liệu</span>
        </button>

        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-slate-800 cursor-pointer active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>
    </div>
  );
}