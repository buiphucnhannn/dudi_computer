import { X } from "lucide-react";

export default function ActiveFilters({ filters, onFilterChange, onClear }) {
  const hasFilters =
    filters.category ||
    filters.brands.length > 0 ||
    filters.promotions.length > 0;

  if (!hasFilters) {
    return null;
  }

  const removeBrand = (brand) => {
    onFilterChange({
      ...filters,
      brands: filters.brands.filter((item) => item !== brand),
    });
  };

  const removePromotion = (promotion) => {
    onFilterChange({
      ...filters,
      promotions: filters.promotions.filter((item) => item !== promotion),
    });
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {filters.category && (
        <button
          onClick={() =>
            onFilterChange({
              ...filters,
              category: "",
            })
          }
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626]"
        >
          {filters.category}
          <X className="h-3 w-3" />
        </button>
      )}

      {filters.brands.map((brand) => (
        <button
          key={brand}
          onClick={() => removeBrand(brand)}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626]"
        >
          {brand}
          <X className="h-3 w-3" />
        </button>
      ))}

      {filters.promotions.map((promotion) => (
        <button
          key={promotion}
          onClick={() => removePromotion(promotion)}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626]"
        >
          {promotion === "discount" ? "Đang giảm giá" : "Hot Sale"}

          <X className="h-3 w-3" />
        </button>
      ))}

      <button
        onClick={onClear}
        className="ml-1 text-xs font-bold text-gray-500 hover:text-[#dc2626]"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
