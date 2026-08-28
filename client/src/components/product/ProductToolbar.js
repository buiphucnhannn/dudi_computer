import { SlidersHorizontal, Filter } from "lucide-react";

export default function ProductToolbar({
  productCount,
  sort,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount = 0,
}) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3.5 rounded-xl bg-white p-3.5 sm:p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-gray-900">
            Tất cả sản phẩm
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">{productCount} sản phẩm</p>
        </div>

        {/* Nút Bộ lọc trên Mobile / Tablet */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#dc2626] border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          aria-label="Mở bộ lọc tìm kiếm"
        >
          <Filter className="w-3.5 h-3.5 text-[#dc2626]" />
          <span>Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-4.5 h-4.5 bg-[#dc2626] text-white rounded-full text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <label htmlFor="product-sort-select" className="flex items-center gap-1.5 cursor-pointer">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Sắp xếp:</span>
        </label>

        <select
          id="product-sort-select"
          name="product-sort-select"
          aria-label="Sắp xếp sản phẩm"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-semibold outline-none focus:border-[#dc2626] cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến</option>
          <option value="price-low">Giá thấp - cao</option>
          <option value="price-high">Giá cao - thấp</option>
        </select>
      </div>
    </div>
  );
}
