import { X } from "lucide-react";

const CATEGORY_NAMES = {
  "laptop-cu": "Laptop Cũ",
  "pc-cu": "PC Cũ",
  "chuot": "Chuột",
  "ban-phim": "Bàn phím",
  "man-hinh": "Màn Hình",
  "case-vo-may-tinh": "CASE - Vỏ máy tính",
  "cpu-bo-vi-xu-ly": "CPU - Bộ vi xử lý",
  "psu-nguon-may-tinh": "PSU - Nguồn máy tính",
  "mainboard-bo-mach-chu": "Mainboard - Bo mạch chủ",
  "o-cung-hdd-ssd": "Ổ cứng HDD - SSD",
  "ram-bo-nho-trong": "RAM - Bộ nhớ trong",
  "tan-nhiet-cooling": "Tản nhiệt Cooling",
  "vga-card-man-hinh": "VGA - Card màn hình",
};

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

  const categoryLabel =
    CATEGORY_NAMES[filters.category] || filters.category;

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
          className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#dc2626] cursor-pointer"
        >
          {categoryLabel}
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
