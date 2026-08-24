import { X } from "lucide-react";

const CATEGORY_NAMES = {
  "laptop": "Laptop",
  "laptop-cu": "Laptop",
  "pc": "PC",
  "pc-cu": "PC",
  "chuot": "Chuột",
  "ban-phim": "Bàn phím",
  "man-hinh": "Màn hình máy tính",
  "case-vo-may-tinh": "CASE - Vỏ máy tính",
  "cpu-bo-vi-xu-ly": "CPU - Bộ vi xử lý",
  "psu-nguon-may-tinh": "PSU - Nguồn máy tính",
  "mainboard-bo-mach-chu": "Mainboard - Bo mạch chủ",
  "o-cung-hdd-ssd": "Ổ cứng HDD - SSD",
  "ram-bo-nho-trong": "RAM - Bộ nhớ trong",
  "tan-nhiet-cooling": "Tản nhiệt Cooling",
  "vga-card-man-hinh": "VGA - Card màn hình",
};

export default function ActiveFilters({
  filters,
  search = "",
  onFilterChange,
  onClearSearch,
  onClear,
}) {
  const hasFilters =
    Boolean(search?.trim()) ||
    Boolean(filters.category) ||
    Boolean(filters.condition) ||
    (filters.brands && filters.brands.length > 0) ||
    (filters.promotions && filters.promotions.length > 0);

  if (!hasFilters) {
    return null;
  }

  const removeCondition = () => {
    onFilterChange({
      ...filters,
      condition: "",
    });
  };

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

  const categoryLabel =
    CATEGORY_NAMES[filters.category] || filters.category;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {/* Category Tag */}
      {filters.category && (
        <button
          onClick={() =>
            onFilterChange({
              ...filters,
              category: "",
            })
          }
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer hover:bg-red-100 transition-colors"
        >
          {categoryLabel}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Condition Tag */}
      {filters.condition && (
        <button
          onClick={removeCondition}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer hover:bg-red-100 transition-colors"
        >
          Tình trạng: {filters.condition === "new" ? "Mới 100%" : "Cũ (Like New)"}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Search Query Tag */}
      {search && search.trim() && (
        <button
          onClick={onClearSearch}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer hover:bg-red-100 transition-colors"
        >
          Từ khóa: {search}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Brands */}
      {filters.brands?.map((brand) => (
        <button
          key={brand}
          onClick={() => removeBrand(brand)}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer hover:bg-red-100 transition-colors"
        >
          {brand}
          <X className="h-3 w-3" />
        </button>
      ))}

      {/* Promotions */}
      {filters.promotions?.map((promotion) => (
        <button
          key={promotion}
          onClick={() => removePromotion(promotion)}
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer hover:bg-red-100 transition-colors"
        >
          {promotion === "discount" ? "Đang giảm giá" : "Hot Sale"}
          <X className="h-3 w-3" />
        </button>
      ))}

      <button
        onClick={onClear}
        className="ml-1 text-xs font-bold text-gray-500 hover:text-[#dc2626] cursor-pointer transition-colors"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
