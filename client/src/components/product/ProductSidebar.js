"use client";

import { useEffect, useMemo } from "react";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import FilterGroup from "./FilterGroup";
import { detectProductType, PRODUCT_TYPES } from "@/lib/specParser";

// Danh mục chuẩn theo hệ thống cơ sở dữ liệu hiện có
const FALLBACK_CATEGORIES = [
  // 1. Nhóm Laptop & Macbook
  { label: "Laptop & Macbook", value: "laptop", slug: "laptop", isParent: true },
  { label: "Laptop Cũ", value: "laptop-cu", slug: "laptop-cu", parent: "laptop", isChild: true },
  { label: "Laptop Gaming", value: "laptop-gaming", slug: "laptop-gaming", parent: "laptop", isChild: true },
  { label: "Laptop Văn phòng", value: "laptop-van-phong", slug: "laptop-van-phong", parent: "laptop", isChild: true },
  { label: "Macbook", value: "macbook", slug: "macbook", parent: "laptop", isChild: true },

  // 2. Nhóm Máy Tính Để Bàn (PC)
  { label: "Máy Tính Để Bàn (PC)", value: "pc", slug: "pc", isParent: true },
  { label: "PC Gaming", value: "pc-gaming", slug: "pc-gaming", parent: "pc", isChild: true },
  { label: "PC Đồ Họa", value: "pc-do-hoa", slug: "pc-do-hoa", parent: "pc", isChild: true },
  { label: "PC Văn Phòng", value: "pc-van-phong", slug: "pc-van-phong", parent: "pc", isChild: true },

  // 3. Nhóm Linh Kiện Máy Tính
  { label: "Linh Kiện Máy Tính", value: "linh-kien-pc", slug: "linh-kien-pc", isParent: true },
  { label: "CPU - Bộ vi xử lý", value: "cpu-bo-vi-xu-ly", slug: "cpu-bo-vi-xu-ly", parent: "linh-kien-pc", isChild: true, pcPartType: "cpu" },
  { label: "Mainboard - Bo mạch chủ", value: "mainboard-bo-mach-chu", slug: "mainboard-bo-mach-chu", parent: "linh-kien-pc", isChild: true, pcPartType: "mainboard" },
  { label: "RAM - Bộ nhớ trong", value: "ram-bo-nho-trong", slug: "ram-bo-nho-trong", parent: "linh-kien-pc", isChild: true, pcPartType: "ram" },
  { label: "VGA - Card màn hình", value: "vga-card-man-hinh", slug: "vga-card-man-hinh", parent: "linh-kien-pc", isChild: true, pcPartType: "vga" },
  { label: "Ổ cứng HDD - SSD", value: "o-cung-hdd-ssd", slug: "o-cung-hdd-ssd", parent: "linh-kien-pc", isChild: true, pcPartType: "ssd" },
  { label: "PSU - Nguồn máy tính", value: "psu-nguon-may-tinh", slug: "psu-nguon-may-tinh", parent: "linh-kien-pc", isChild: true, pcPartType: "psu" },
  { label: "CASE - Vỏ máy tính", value: "case-vo-may-tinh", slug: "case-vo-may-tinh", parent: "linh-kien-pc", isChild: true, pcPartType: "case" },
  { label: "Tản nhiệt Cooling", value: "tan-nhiet-cooling", slug: "tan-nhiet-cooling", parent: "linh-kien-pc", isChild: true, pcPartType: "cooler" },

  // 4. Nhóm Màn Hình & Phụ Kiện Gear
  { label: "Màn Hình & Phụ Kiện Gear", value: "man-hinh-gear", slug: "man-hinh-gear", isParent: true },
  { label: "Màn hình máy tính", value: "man-hinh", slug: "man-hinh", parent: "man-hinh-gear", isChild: true, pcPartType: "monitor" },
  { label: "Bàn phím", value: "ban-phim", slug: "ban-phim", parent: "man-hinh-gear", isChild: true, pcPartType: "gear" },
  { label: "Chuột", value: "chuot", slug: "chuot", parent: "man-hinh-gear", isChild: true, pcPartType: "gear" },
];

export default function ProductSidebar({
  filters,
  products = [],
  categories = [],
  onFilterChange,
  isMobileOpen = false,
  onCloseMobile = () => { },
  onClearFilters = () => { },
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

  // 1. Calculate Real Category Counts using dynamic categories or fallback
  const computedCategories = useMemo(() => {
    // Chuẩn hóa danh sách danh mục (nếu có từ API thì xử lý theo cây cha/con, nếu không dùng fallback)
    let categoryList = [];

    if (Array.isArray(categories) && categories.length > 0) {
      // Nhóm cha - con từ API
      const activeCats = categories.filter((c) => c.isActive !== false);
      const parentCats = activeCats.filter((c) => !c.parent);
      const childCats = activeCats.filter((c) => !!c.parent);

      if (parentCats.length > 0) {
        parentCats.sort((a, b) => (a.order || 0) - (b.order || 0));
        parentCats.forEach((parent) => {
          categoryList.push({
            label: parent.name,
            value: parent.slug,
            slug: parent.slug,
            id: parent._id,
            isParent: true,
            pcPartType: parent.pcPartType,
          });

          const children = childCats
            .filter((c) => {
              const pId = typeof c.parent === "object" ? c.parent?._id : c.parent;
              return String(pId) === String(parent._id) || c.parentSlug === parent.slug;
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          children.forEach((child) => {
            categoryList.push({
              label: child.name,
              value: child.slug,
              slug: child.slug,
              id: child._id,
              parent: parent.slug,
              isChild: true,
              pcPartType: child.pcPartType,
            });
          });
        });
      } else {
        categoryList = activeCats.map((c) => ({
          label: c.name,
          value: c.slug,
          slug: c.slug,
          id: c._id,
          pcPartType: c.pcPartType,
        }));
      }
    }

    if (categoryList.length === 0) {
      categoryList = FALLBACK_CATEGORIES;
    }

    // Đếm số lượng sản phẩm chính xác cho từng danh mục
    return categoryList.map((cat) => {
      const slug = (cat.slug || cat.value || "").toLowerCase();
      const count = products.filter((p) => {
        const type = detectProductType(p);
        const name = (p.name || "").toLowerCase();
        const catSlug = (p.categorySlug || "").toLowerCase();
        const catName = (p.categoryName || "").toLowerCase();
        const pCatId = typeof p.category === "object" ? p.category?._id : p.category;

        // Nếu khớp ID chính xác
        if (cat.id && pCatId && String(pCatId) === String(cat.id)) return true;

        // 1. Nhóm Laptop
        if (slug === "laptop" || slug === "laptop-cu") {
          return type === PRODUCT_TYPES.LAPTOP || catSlug.includes("laptop") || catSlug === "macbook";
        }
        if (slug === "laptop-gaming") {
          return catSlug === "laptop-gaming" || (type === PRODUCT_TYPES.LAPTOP && (name.includes("gaming") || catName.includes("gaming")));
        }
        if (slug === "laptop-van-phong") {
          return catSlug === "laptop-van-phong" || (type === PRODUCT_TYPES.LAPTOP && (name.includes("văn phòng") || name.includes("thinkpad") || name.includes("zenbook") || name.includes("latitude") || name.includes("swift")) && !name.includes("gaming") && !name.includes("tuf") && !name.includes("legion") && !name.includes("nitro"));
        }
        if (slug === "macbook") {
          return catSlug === "macbook" || name.includes("macbook") || name.includes("apple");
        }

        // 2. Nhóm PC
        if (slug === "pc" || slug === "pc-cu") {
          return type === PRODUCT_TYPES.PC || catSlug === "pc" || catSlug.startsWith("pc-");
        }
        if (slug === "pc-gaming") {
          return catSlug === "pc-gaming" || (type === PRODUCT_TYPES.PC && (name.includes("gaming") || catName.includes("gaming")));
        }
        if (slug === "pc-do-hoa") {
          return catSlug === "pc-do-hoa" || (type === PRODUCT_TYPES.PC && (name.includes("đồ họa") || name.includes("workstation") || name.includes("render")));
        }
        if (slug === "pc-van-phong") {
          return catSlug === "pc-van-phong" || (type === PRODUCT_TYPES.PC && (name.includes("văn phòng") || name.includes("office")));
        }

        // 3. Nhóm Linh Kiện PC gốc
        if (slug === "linh-kien-pc") {
          return [
            PRODUCT_TYPES.CPU,
            PRODUCT_TYPES.MAINBOARD,
            PRODUCT_TYPES.RAM,
            PRODUCT_TYPES.VGA,
            PRODUCT_TYPES.STORAGE,
            PRODUCT_TYPES.SSD,
            PRODUCT_TYPES.PSU,
            PRODUCT_TYPES.CASE,
            PRODUCT_TYPES.COOLER,
          ].includes(type) || catSlug.includes("linh-kien");
        }
        if (slug === "cpu-bo-vi-xu-ly" || cat.pcPartType === "cpu") {
          return type === PRODUCT_TYPES.CPU || catSlug.includes("cpu") || catName.includes("vi xử lý");
        }
        if (slug === "mainboard-bo-mach-chu" || cat.pcPartType === "mainboard") {
          return type === PRODUCT_TYPES.MAINBOARD || catSlug.includes("mainboard") || catName.includes("bo mạch");
        }
        if (slug === "ram-bo-nho-trong" || cat.pcPartType === "ram") {
          return type === PRODUCT_TYPES.RAM || catSlug.includes("ram") || catName.includes("bộ nhớ");
        }
        if (slug === "vga-card-man-hinh" || cat.pcPartType === "vga") {
          return type === PRODUCT_TYPES.VGA || catSlug.includes("vga") || catName.includes("card màn hình");
        }
        if (slug === "o-cung-hdd-ssd" || cat.pcPartType === "ssd" || cat.pcPartType === "hdd") {
          return type === PRODUCT_TYPES.STORAGE || type === PRODUCT_TYPES.SSD || catSlug.includes("o-cung") || catSlug.includes("ssd") || catSlug.includes("hdd");
        }
        if (slug === "psu-nguon-may-tinh" || cat.pcPartType === "psu") {
          return type === PRODUCT_TYPES.PSU || catSlug.includes("psu") || catName.includes("nguồn");
        }
        if (slug === "case-vo-may-tinh" || cat.pcPartType === "case") {
          return type === PRODUCT_TYPES.CASE || catSlug.includes("case") || catName.includes("vỏ máy");
        }
        if (slug === "tan-nhiet-cooling" || cat.pcPartType === "cooler") {
          return type === PRODUCT_TYPES.COOLER || catSlug.includes("tan-nhiet") || catName.includes("tản nhiệt");
        }

        // 4. Nhóm Màn hình & Gear
        if (slug === "man-hinh-gear") {
          return [PRODUCT_TYPES.MONITOR, PRODUCT_TYPES.KEYBOARD, PRODUCT_TYPES.MOUSE].includes(type) || catSlug.includes("gear");
        }
        if (slug === "man-hinh" || cat.pcPartType === "monitor") {
          return type === PRODUCT_TYPES.MONITOR || catSlug.includes("man-hinh") || catName.includes("màn hình");
        }
        if (slug === "ban-phim") {
          return type === PRODUCT_TYPES.KEYBOARD || catSlug.includes("ban-phim") || catName.includes("bàn phím");
        }
        if (slug === "chuot") {
          return type === PRODUCT_TYPES.MOUSE || catSlug.includes("chuot") || catName.includes("chuột");
        }

        // Fallback khớp chung
        return catSlug === slug || catSlug.includes(slug) || catName.toLowerCase().includes(slug);
      }).length;

      return {
        ...cat,
        count,
      };
    });
  }, [products, categories]);

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
        Number(p.discountPercent || 0) > 0 ||
        p.isFlashSale === true ||
        p.isFlashSale === "true"
    ).length;

    const flashSaleCount = products.filter(
      (p) => p.isFlashSale === true || p.isFlashSale === "true"
    ).length;

    return [
      { label: "Đang giảm giá", value: "discount", count: discountCount },
      { label: "Chiến dịch Flash Sale", value: "flash_sale", count: flashSaleCount },
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
