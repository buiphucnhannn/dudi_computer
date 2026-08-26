"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Filter,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Laptop,
  Monitor,
  Cpu,
  CircuitBoard,
  HardDrive,
  MemoryStick,
  Zap,
  Server,
  Fan,
  Mouse,
  Keyboard,
  Sparkles,
  Layers,
} from "lucide-react";
import FilterGroup from "./FilterGroup";
import { detectProductType, PRODUCT_TYPES } from "@/lib/specParser";
import { isProductMatchingCategory } from "@/lib/productHelpers";

const getCategoryIcon = (slug = "", name = "", part = "none") => {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (s.includes("laptop") || n.includes("laptop") || s.includes("macbook") || n.includes("macbook")) return Laptop;
  if ((s.includes("pc") || n.includes("pc") || n.includes("máy tính để bàn")) && !s.includes("linh-kien")) return Monitor;
  if (s.includes("man-hinh") || n.includes("màn hình") || part === "monitor") return Monitor;
  if (s.includes("cpu") || n.includes("cpu") || n.includes("vi xử lý") || part === "cpu") return Cpu;
  if (s.includes("vga") || n.includes("vga") || n.includes("card") || part === "vga") return Sparkles;
  if (s.includes("ram") || n.includes("ram") || part === "ram") return MemoryStick;
  if (s.includes("mainboard") || n.includes("bo mạch") || part === "mainboard") return CircuitBoard;
  if (s.includes("o-cung") || n.includes("ổ cứng") || s.includes("ssd") || s.includes("hdd") || part === "ssd" || part === "hdd") return HardDrive;
  if (s.includes("psu") || n.includes("nguồn") || part === "psu") return Zap;
  if (s.includes("case") || n.includes("vỏ máy") || part === "case") return Server;
  if (s.includes("tan-nhiet") || n.includes("tản nhiệt") || part === "cooler") return Fan;
  if (s.includes("chuot") || n.includes("chuột")) return Mouse;
  if (s.includes("ban-phim") || n.includes("bàn phím")) return Keyboard;
  return FolderTree;
};

// Component cây danh mục chuyên nghiệp, phân cấp rõ ràng và dễ đọc
function CategoryTreeFilter({
  treeData = [],
  totalProductCount = 0,
  selectedCategory = "",
  onSelectCategory = () => {},
}) {
  const [expandedRoots, setExpandedRoots] = useState({});

  const toggleExpand = (slug, e) => {
    e.stopPropagation();
    setExpandedRoots((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-gray-900 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-[#eb1c24]" />
          <span>Danh mục</span>
        </h3>
        {selectedCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory("")}
            className="text-[11px] font-bold text-[#eb1c24] hover:underline cursor-pointer"
          >
            Bỏ chọn
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
        {/* Tất cả sản phẩm button */}
        <div
          onClick={() => onSelectCategory("")}
          className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all text-xs sm:text-[13px] ${
            !selectedCategory
              ? "bg-red-50 text-[#eb1c24] font-bold shadow-2xs border-l-3 border-[#eb1c24]"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                !selectedCategory ? "bg-[#eb1c24]" : "bg-gray-300"
              }`}
            />
            <span className="truncate">Tất cả sản phẩm</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold shrink-0">
            {totalProductCount}
          </span>
        </div>

        {/* Tree Roots & Children */}
        {treeData.map((root) => {
          const isRootSelected = selectedCategory === root.slug;
          const hasChildren = Array.isArray(root.children) && root.children.length > 0;
          const isChildSelected = hasChildren && root.children.some((c) => c.slug === selectedCategory);
          const isExpanded = expandedRoots[root.slug] ?? (isRootSelected || isChildSelected || true);
          const Icon = getCategoryIcon(root.slug, root.name, root.pcPartType);

          return (
            <div key={root.slug} className="space-y-0.5 pt-0.5">
              {/* Dòng Danh mục Cha */}
              <div
                onClick={() => onSelectCategory(root.slug)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all text-xs sm:text-[13px] group ${
                  isRootSelected
                    ? "bg-red-50 text-[#eb1c24] font-bold border-l-3 border-[#eb1c24]"
                    : isChildSelected
                    ? "text-gray-900 font-bold bg-gray-50/90"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isRootSelected ? "text-[#eb1c24]" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="font-semibold text-gray-800 group-hover:text-gray-900">
                    {root.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isRootSelected
                        ? "bg-red-100 text-red-700 font-bold"
                        : "text-gray-400 bg-gray-100 group-hover:text-gray-600"
                    }`}
                  >
                    {root.count}
                  </span>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(root.slug, e)}
                      className="p-1 text-gray-400 hover:text-gray-700 transition-transform"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? "rotate-0 text-[#eb1c24]" : "-rotate-90"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Danh mục con dạng lồng ghép tinh tế */}
              {hasChildren && isExpanded && (
                <div className="ml-4 pl-3 border-l-2 border-slate-100 space-y-0.5 py-1">
                  {root.children.map((child) => {
                    const isSelected = selectedCategory === child.slug;
                    return (
                      <div
                        key={child.slug}
                        onClick={() => onSelectCategory(child.slug)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all text-xs group ${
                          isSelected
                            ? "bg-red-50 text-[#eb1c24] font-bold border-l-2 border-[#eb1c24]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className="pr-1 flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? "bg-[#eb1c24]" : "bg-gray-300 group-hover:bg-gray-400"
                            }`}
                          />
                          <span>{child.name}</span>
                        </span>
                        <span
                          className={`text-[10.5px] px-1.5 py-0.2 rounded-full shrink-0 ${
                            isSelected
                              ? "bg-red-100 text-red-700 font-bold"
                              : "text-gray-400 bg-gray-100 group-hover:text-gray-600"
                          }`}
                        >
                          {child.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductSidebar({
  categories = [],
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

  // 1. Cấu trúc cây Danh mục thực tế từ Database
  const categoryTreeData = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];

    const activeCats = categories.filter((c) => c.isActive !== false);
    const rootCats = activeCats.filter((c) => !c.parent || c.parent === null);
    const childCats = activeCats.filter((c) => !!c.parent);

    // Hàm đếm số sản phẩm khớp với 1 category cụ thể
    const countForCategory = (targetCat, isParentWithChildren = false) => {
      const myChildren = isParentWithChildren
        ? childCats.filter((ch) => (ch.parent?._id || ch.parent || "").toString() === targetCat._id.toString())
        : [];

      return products.filter((p) => {
        if (isProductMatchingCategory(p, targetCat.slug, categories)) return true;
        if (myChildren.some((ch) => isProductMatchingCategory(p, ch.slug, categories))) return true;
        return false;
      }).length;
    };

    return rootCats.map((root) => {
      const myChildren = childCats.filter(
        (c) => (c.parent?._id || c.parent || "").toString() === root._id.toString()
      );

      const rootCount = countForCategory(root, myChildren.length > 0);

      return {
        name: root.name,
        slug: root.slug,
        pcPartType: root.pcPartType,
        count: rootCount,
        children: myChildren.map((ch) => ({
          name: ch.name,
          slug: ch.slug,
          count: countForCategory(ch, false),
        })),
      };
    });
  }, [categories, products]);

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

  // 3. Calculate Real Brand Counts (Deduplicate & normalize case)
  const computedBrands = useMemo(() => {
    const brandMap = {}; // key: lowercase, value: { canonicalName, count }
    products.forEach((p) => {
      if (p.brand && p.brand.trim()) {
        const raw = p.brand.trim();
        const lower = raw.toLowerCase();
        if (!brandMap[lower]) {
          brandMap[lower] = {
            canonicalName: raw,
            count: 0,
          };
        }
        // Ưu tiên cách viết hoa chuẩn
        if (["ASUS", "MSI", "HP", "LG", "AMD", "NVIDIA", "ASRock", "DareU"].includes(raw.toUpperCase())) {
          brandMap[lower].canonicalName = raw;
        } else if (raw === "Dell" || raw === "Apple" || raw === "Lenovo" || raw === "Acer" || raw === "Samsung" || raw === "Gigabyte" || raw === "Microsoft" || raw === "Kingston" || raw === "Corsair" || raw === "Logitech" || raw === "Razer" || raw === "Akko" || raw === "Keychron") {
          brandMap[lower].canonicalName = raw;
        }
        brandMap[lower].count += 1;
      }
    });

    const sorted = Object.values(brandMap)
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return sorted.map((b) => ({
      label: b.canonicalName,
      value: b.canonicalName,
      count: b.count,
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
      {/* Bộ lọc Danh mục Cây phân cấp hiện đại */}
      <CategoryTreeFilter
        treeData={categoryTreeData}
        totalProductCount={products.length}
        selectedCategory={filters.category || ""}
        onSelectCategory={handleCategoryChange}
      />

      <FilterGroup
        title="Tình trạng"
        items={computedConditions}
        selected={filters.condition || ""}
        type="single"
        onChange={handleConditionChange}
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
      <aside className="hidden w-64 lg:w-[270px] shrink-0 lg:block">
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
