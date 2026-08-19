import { SlidersHorizontal } from "lucide-react";

export default function ProductToolbar({ productCount, sort, onSortChange }) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <div>
        <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
          Tất cả sản phẩm
        </h1>

        <p className="mt-1 text-xs text-gray-500">{productCount} sản phẩm</p>
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-gray-500" />

        <span className="hidden text-sm text-gray-500 sm:block">Sắp xếp:</span>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#dc2626]"
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
