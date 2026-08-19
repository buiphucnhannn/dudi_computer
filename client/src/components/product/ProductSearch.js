import { Search, X } from "lucide-react";

export default function ProductSearch({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-10 text-sm outline-none transition focus:border-[#dc2626] focus:ring-2 focus:ring-red-50"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#dc2626]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
