"use client";

import { useEffect, useMemo } from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import FilterGroup from "./FilterGroup";
import { detectProductType, PRODUCT_TYPES } from "@/lib/specParser";

const BASE_CATEGORIES = [
  { label: "Laptop", value: "laptop" },
  { label: "PC", value: "pc" },
  { label: "Màn hình máy tính", value: "man-hinh" },
  { label: "Mainboard - Bo mạch chủ", value: "mainboard-bo-mach-chu" },
  { label: "PSU - Nguồn máy tính", value: "psu-nguon-may-tinh" },
  { label: "CPU - Bộ vi xử lý", value: "cpu-bo-vi-xu-ly" },
  { label: "VGA - Card màn hình", value: "vga-card-man-hinh" },
  { label: "RAM - Bộ nhớ trong", value: "ram-bo-nho-trong" },
  { label: "Ổ cứng HDD - SSD", value: "o-cung-hdd-ssd" },
  { label: "CASE - Vỏ máy tính", value: "case-vo-may-tinh" },
  { label: "Chuột", value: "chuot" },
  { label: "Bàn phím", value: "ban-phim" },
  { label: "Tản nhiệt Cooling", value: "tan-nhiet-cooling" },
];

export default function ProductSidebar({
  filters,
  products = [],
  onFilterChange,
  isMobileOpen = false,
  onCloseMobile = () => {},
  onClearFilters = () => {},
}) {
  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // 1. Calculate Real Category Counts
  const computedCategories = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const type = detectProductType(p);
      const catSlug = (p.categorySlug || "").toLowerCase();
      const catName = (p.categoryName || "").toLowerCase();

      const inc = (key) => {
        counts[key] = (counts[key] || 0) + 1;
      };

      if (type === PRODUCT_TYPES.LAPTOP || catSlug.includes("laptop") || catName.includes("laptop")) inc("laptop");
      else if (type === PRODUCT_TYPES.PC || catSlug === "pc" || catName === "pc" || catSlug.includes("pc-") || catName.includes("bộ máy tính")) inc("pc");
      else if (type === PRODUCT_TYPES.MONITOR || catSlug.includes("man-hinh") || catName.includes("màn hình")) inc("man-hinh");
      else if (type === PRODUCT_TYPES.MAINBOARD || catSlug.includes("mainboard") || catName.includes("bo mạch")) inc("mainboard-bo-mach-chu");
      else if (type === PRODUCT_TYPES.PSU || catSlug.includes("psu") || catName.includes("nguồn")) inc("psu-nguon-may-tinh");
      else if (type === PRODUCT_TYPES.CPU || catSlug.includes("cpu") || catName.includes("vi xử lý")) inc("cpu-bo-vi-xu-ly");
      else if (type === PRODUCT_TYPES.VGA || catSlug.includes("vga") || catName.includes("card màn hình")) inc("vga-card-man-hinh");
      else if (type === PRODUCT_TYPES.RAM || catSlug.includes("ram") || catName.includes("bộ nhớ")) inc("ram-bo-nho-trong");
      else if (type === PRODUCT_TYPES.SSD || catSlug.includes("o-cung") || catName.includes("ổ cứng") || catSlug.includes("ssd")) inc("o-cung-hdd-ssd");
      else if (type === PRODUCT_TYPES.CASE || catSlug.includes("case") || catName.includes("vỏ máy")) inc("case-vo-may-tinh");
      else if (type === PRODUCT_TYPES.MOUSE || catSlug.includes("chuot") || catName.includes("chuột")) inc("chuot");
      else if (type === PRODUCT_TYPES.KEYBOARD || catSlug.includes("ban-phim") || catName.includes("bàn phím")) inc("ban-phim");
      else if (type === PRODUCT_TYPES.COOLER || catSlug.includes("tan-nhiet") || catName.includes("tản nhiệt")) inc("tan-nhiet-cooling");
      else {
        const matched = BASE_CATEGORIES.find((c) => catSlug.includes(c.value) || catName.includes(c.label.toLowerCase()));
        if (matched) inc(matched.value);
      }
    });

    return BASE_CATEGORIES.map((c) => ({
      ...c,
      count: counts[c.value] || 0,
    }));
  }, [products]);

  // 2. Calculate Real Condition Counts
  const computedConditions = useMemo(() => {
    let newCount = 0;
    let usedCount = 0;

    products.forEach((p) => {
      const cond = (p.condition || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const isUsed =
        cond.includes("cũ") ||
        cond.includes("like new") ||
        cond.includes("99%") ||
        cond.includes("used") ||
        cond.includes("lướt") ||
        cond.includes("second hand") ||
        name.includes("cũ") ||
        name.includes("like new") ||
        name.includes("99%") ||
        name.includes("lướt") ||
        name.includes("second hand");

      if (isUsed) {
        usedCount++;
      } else {
        newCount++;
      }
    });

    return [
      { label: "Mới 100%", value: "new", count: newCount },
      { label: "Cũ (Like New)", value: "used", count: usedCount },
    ];
  }, [products]);

  // 3. Calculate Real Brand Counts
  const computedBrands = useMemo(() => {
    const brandCounts = {};
    products.forEach((p) => {
      if (p.brand) {
        const b = p.brand.trim();
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      }
    });

    const brandNames = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
    if (brandNames.length === 0) {
      return [
        "Lenovo",
        "Dell",
        "ASUS",
        "HP",
        "Acer",
        "MSI",
        "Samsung",
        "LG",
        "Gigabyte",
      ].map((b) => ({ label: b, value: b, count: 0 }));
    }

    return brandNames.map((b) => ({
      label: b,
      value: b,
      count: brandCounts[b] || 0,
    }));
  }, [products]);

  // 4. Calculate Real Promotion Counts
  const computedPromotions = useMemo(() => {
    const discountCount = products.filter(
      (p) =>
        Number(p.originalPrice || 0) > Number(p.price || 0) ||
        p.discountPercent > 0
    ).length;

    const hotCount = products.filter(
      (p) => p.isHot || p.isFlashSale || p.badge === "HOT" || (p.soldCount && p.soldCount > 10)
    ).length;

    return [
      { label: "Đang giảm giá", value: "discount", count: discountCount },
      { label: "Sản phẩm Hot Sale", value: "hot", count: hotCount },
    ];
  }, [products]);

  const handleConditionChange = (condition) => {
    onFilterChange({
      ...filters,
      condition: filters.condition === condition ? "" : condition,
    });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? "" : category,
    });
  };

  const handleBrandChange = (brand) => {
    const exists = filters.brands.includes(brand);

    const newBrands = exists
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];

    onFilterChange({
      ...filters,
      brands: newBrands,
    });
  };

  const handlePromotionChange = (type) => {
    const exists = filters.promotions.includes(type);

    const newPromotions = exists
      ? filters.promotions.filter((item) => item !== type)
      : [...filters.promotions, type];

    onFilterChange({
      ...filters,
      promotions: newPromotions,
    });
  };

  const filterContent = (
    <div className="space-y-4">
      <FilterGroup
        title="Tình trạng"
        items={computedConditions}
        selected={filters.condition || ""}
        type="single"
        onChange={handleConditionChange}
      />

      <FilterGroup
        title="Danh mục"
        items={computedCategories}
        selected={filters.category}
        type="single"
        onChange={handleCategoryChange}
      />

      <FilterGroup
        title="Ưu đãi"
        items={computedPromotions}
        selected={filters.promotions}
        type="multiple"
        onChange={handlePromotionChange}
      />

      <FilterGroup
        title="Thương hiệu"
        items={computedBrands}
        selected={filters.brands}
        type="multiple"
        onChange={handleBrandChange}
      />
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 space-y-4">{filterContent}</div>
      </aside>

      {/* 2. Mobile / Tablet Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#dc2626]" />
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">
                  Bộ lọc sản phẩm
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Đóng bộ lọc"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filterContent}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3.5 border-t border-gray-100 bg-white grid grid-cols-2 gap-2 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  onCloseMobile();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thiết lập lại</span>
              </button>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-red-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Áp dụng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
