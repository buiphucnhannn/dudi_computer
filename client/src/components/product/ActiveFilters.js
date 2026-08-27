import { X } from "lucide-react";

const CATEGORY_NAMES = {
  "laptop": "Laptop",
  "laptop-gaming": "Laptop Gaming",
  "laptop-van-phong": "Laptop Văn phòng",
  "macbook": "Macbook",
  "pc": "Máy Tính Để Bàn (PC)",
  "pc-gaming": "PC Gaming",
  "pc-do-hoa": "PC Đồ Họa",
  "pc-van-phong": "PC Văn Phòng",
  "phu-kien-gear": "Phụ Kiện Gear",
  "chuot": "Chuột",
  "ban-phim": "Bàn phím",
  "man-hinh": "Màn hình máy tính",
  "man-hinh-gaming": "Màn hình Gaming",
  "man-hinh-van-phong": "Màn hình Văn phòng",
  "man-hinh-do-hoa": "Màn hình Đồ họa",
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
    <div className="mb-5 flex flex-wrap items-center gap-2 max-w-full overflow-hidden">
      {/* Category Tag */}
      {filters.category && (
        <button
          onClick={() =>
            onFilterChange({
              ...filters,
              category: "",
            })
          }
          className="max-w-full inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc danh mục này"
        >
          <span className="truncate max-w-[200px]">{categoryLabel}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      )}

      {/* Condition Tag */}
      {filters.condition && (
        <button
          onClick={removeCondition}
          className="max-w-full inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc tình trạng"
        >
          <span className="truncate">Tình trạng: {filters.condition === "new" ? "Mới 100%" : "Cũ (Like New)"}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      )}

      {/* Search Query Tag */}
      {search && search.trim() && (
        <button
          onClick={onClearSearch}
          className="max-w-full inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title={`Bỏ từ khóa: "${search}"`}
        >
          <span className="truncate max-w-[180px] sm:max-w-[280px] md:max-w-[380px]">
            Từ khóa: &quot;{search}&quot;
          </span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      )}

      {/* Brands */}
      {filters.brands?.map((brand) => (
        <button
          key={brand}
          onClick={() => removeBrand(brand)}
          className="max-w-full inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title={`Bỏ lọc thương hiệu ${brand}`}
        >
          <span className="truncate max-w-[150px]">{brand}</span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      ))}

      {/* Promotions */}
      {filters.promotions?.map((promotion) => (
        <button
          key={promotion}
          onClick={() => removePromotion(promotion)}
          className="max-w-full inline-flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200/80 px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer group"
          title="Bỏ lọc khuyến mãi"
        >
          <span className="truncate max-w-[200px]">
            {promotion === "discount" ? "Đang giảm giá" : "Chiến dịch Flash Sale"}
          </span>
          <X className="h-3.5 w-3.5 text-[#eb1c24] group-hover:scale-110 transition-transform shrink-0" />
        </button>
      ))}

      <button
        onClick={onClear}
        className="ml-2 text-xs font-bold text-slate-500 hover:text-[#eb1c24] hover:underline cursor-pointer transition-colors px-2 py-1 shrink-0"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
