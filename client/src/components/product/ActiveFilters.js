import { X } from "lucide-react";

const CATEGORY_NAMES = {
  "laptop": "Laptop & Macbook",
  "laptop-cu": "Laptop Cũ",
  "laptop-gaming": "Laptop Gaming",
  "laptop-van-phong": "Laptop Văn phòng",
  "macbook": "Macbook",
  "pc": "PC",
  "pc-cu": "PC",
  "pc-gaming": "PC Gaming",
  "pc-do-hoa": "PC Đồ Họa",
  "pc-van-phong": "PC Văn Phòng",
  "chuot": "Chuột máy tính",
  "ban-phim": "Bàn phím máy tính",
  "man-hinh": "Màn hình máy tính",
  "man-hinh-gear": "Màn Hình & Phụ Kiện Gear",
  "linh-kien-pc": "Linh Kiện Máy Tính",
  "case-vo-may-tinh": "CASE - Vỏ máy tính",
  "cpu-bo-vi-xu-ly": "CPU - Bộ vi xử lý",
  "psu-nguon-may-tinh": "PSU - Nguồn máy tính",
  "mainboard-bo-mach-chu": "Mainboard - Bo mạch chủ",
  "o-cung-hdd-ssd": "Ổ cứng HDD - SSD",
  "ram-bo-nho-trong": "RAM - Bộ nhớ trong",
  "tan-nhiet-cooling": "Tản nhiệt Cooling",
  "vga-card-man-hinh": "VGA - Card màn hình",
};

// Hàm định dạng slug thô thành tên hiển thị tiếng Việt đẹp mắt
function formatFriendlyCategoryName(slugOrId, categories = []) {
  if (!slugOrId) return "";
  const raw = String(slugOrId).trim();

  // 1. Tìm trong DB categories
  if (Array.isArray(categories) && categories.length > 0) {
    const matched = categories.find(
      (c) => (c.slug || "").toLowerCase() === raw.toLowerCase() || (c._id || "").toString() === raw
    );
    if (matched && matched.name) return matched.name;
  }

  // 2. Tra cứu trong bảng tên chuẩn
  if (CATEGORY_NAMES[raw.toLowerCase()]) {
    return CATEGORY_NAMES[raw.toLowerCase()];
  }

  // 3. Tự động chuyển đổi slug có dấu gạch ngang (kebab-case -> Title Case)
  if (raw.includes("-")) {
    return raw
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return raw;
}

export default function ActiveFilters({
  filters,
  categories = [],
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

  const categoryLabel = formatFriendlyCategoryName(filters.category, categories);

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
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc danh mục này"
        >
          <span>{categoryLabel}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Condition Tag */}
      {filters.condition && (
        <button
          onClick={removeCondition}
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc tình trạng"
        >
          <span>Tình trạng: {filters.condition === "new" ? "Mới 100%" : "Cũ (Like New)"}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Search Query Tag */}
      {search && search.trim() && (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ từ khóa tìm kiếm"
        >
          <span>Từ khóa: &quot;{search}&quot;</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Brands */}
      {filters.brands?.map((brand) => (
        <button
          key={brand}
          onClick={() => removeBrand(brand)}
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title={`Bỏ lọc thương hiệu ${brand}`}
        >
          <span>{brand}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform" />
        </button>
      ))}

      {/* Promotions */}
      {filters.promotions?.map((promotion) => (
        <button
          key={promotion}
          onClick={() => removePromotion(promotion)}
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc khuyến mãi"
        >
          <span>{promotion === "discount" ? "Đang giảm giá" : "Chiến dịch Flash Sale"}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform" />
        </button>
      ))}

      <button
        onClick={onClear}
        className="ml-2 text-xs font-bold text-slate-500 hover:text-[#eb1c24] hover:underline cursor-pointer transition-colors px-2 py-1"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
