"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { PackageSearch } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductSidebar from "@/components/product/ProductSidebar";
import ProductToolbar from "@/components/product/ProductToolbar";
import ProductSearch from "@/components/product/ProductSearch";
import ProductPagination from "@/components/product/ProductPagination";
import ActiveFilters from "@/components/product/ActiveFilters";
import { productAPI, categoryAPI } from "@/lib/api";
import { isProductMatchingCategory } from "@/lib/productHelpers";

// Module-level cache để load tức thì 0ms khi quay lại trang
let globalProductCache = null;
let globalCategoryCache = null;

// Skeleton Card Placeholder khi đang tải dữ liệu
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 flex flex-col justify-between animate-pulse shadow-xs">
      <div>
        <div className="aspect-square w-full bg-slate-100 rounded-xl mb-3" />
        <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-3.5 bg-slate-100 rounded w-full mb-1.5" />
        <div className="h-3.5 bg-slate-100 rounded w-3/4 mb-3" />
        <div className="h-12 bg-slate-50 rounded-xl mb-2 border border-slate-100" />
      </div>
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-red-100/80 rounded w-1/2" />
        <div className="h-7 bg-slate-100 rounded-xl w-1/3" />
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const isFlashSaleParam = searchParams.get("flashSale") || "";
  const brandParam = searchParams.get("brand") || "";
  const conditionParam = searchParams.get("condition") || "";

  // =========================
  // STATE
  // =========================
  const [products, setProducts] = useState(() => globalProductCache || []);
  const [categories, setCategories] = useState(() => globalCategoryCache || []);
  const [loading, setLoading] = useState(!globalProductCache);
  const [search, setSearch] = useState(searchParam);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    category: categoryParam,
    brands: brandParam ? [brandParam] : [],
    promotions: isFlashSaleParam === "true" ? ["flash_sale"] : [],
    condition: conditionParam,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  // Active filter count for badge
  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.condition ? 1 : 0) +
    filters.brands.length +
    filters.promotions.length;

  // Sync URL search params with state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      brands: brandParam ? [brandParam] : prev.brands,
      promotions: isFlashSaleParam === "true" ? ["flash_sale"] : prev.promotions,
      condition: conditionParam || prev.condition,
    }));
    setSearch(searchParam || "");
    setCurrentPage(1);
  }, [categoryParam, searchParam, isFlashSaleParam, brandParam, conditionParam]);

  // =========================
  // LOAD PRODUCTS & CATEGORIES TỪ API
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productAPI.getAll({ limit: 1000 }),
          categoryAPI.getAll(),
        ]);

        if (isMounted && prodRes.status === "fulfilled") {
          const data =
            prodRes.value?.data?.data?.products ||
            (Array.isArray(prodRes.value?.data?.data) ? prodRes.value.data.data : []);
          if (data?.length > 0) {
            globalProductCache = data;
            setProducts(data);
          }
        }

        if (isMounted && catRes.status === "fulfilled") {
          const catData = Array.isArray(catRes.value?.data?.data)
            ? catRes.value.data.data
            : [];
          if (catData.length > 0) {
            globalCategoryCache = catData;
            setCategories(catData);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm/danh mục từ API:", error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const keyword = search.toLowerCase().trim();
      const parts = keyword.split(/[\s-]+/).filter(Boolean);

      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";
        const brand = product.brand?.toLowerCase() || "";
        const category = (product.categoryName || "").toLowerCase();
        const sku = (product.sku || "").toLowerCase();
        const shortDesc = (product.shortDescription || "").toLowerCase();
        const fullText = `${name} ${brand} ${category} ${sku} ${shortDesc}`;

        return (
          fullText.includes(keyword) ||
          parts.every((part) => fullText.includes(part))
        );
      });
    }

    // CATEGORY (Lọc động theo Danh mục Database & Phân cấp Cha - Con)
    if (filters.category) {
      const selectedCat = filters.category.toLowerCase().trim();
      result = result.filter((product) =>
        isProductMatchingCategory(product, selectedCat, categories)
      );
    }

    // CONDITION (Tình trạng: Chọn 1 trong 2 - Mới 100% hoặc Cũ Like New)
    if (filters.condition) {
      result = result.filter((product) => {
        const cond = (product.condition || "").toLowerCase();
        const name = (product.name || "").toLowerCase();

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

        if (filters.condition === "new") return !isUsed;
        if (filters.condition === "used") return isUsed;
        return true;
      });
    }

    // BRANDS
    if (filters.brands.length > 0) {
      result = result.filter((product) => {
        const prodBrand = (product.brand || "").toLowerCase();
        const prodName = (product.name || "").toLowerCase();

        return filters.brands.some((b) => {
          const brandKey = b.toLowerCase();
          return (
            prodBrand.includes(brandKey) ||
            prodName.includes(brandKey) ||
            brandKey.includes(prodBrand)
          );
        });
      });
    }

    // PROMOTIONS (Đang giảm giá & Chiến dịch Flash Sale)
    if (filters.promotions.length > 0) {
      if (filters.promotions.includes("discount")) {
        result = result.filter(
          (product) =>
            Number(product.discountPercent || 0) > 0 ||
            Number(product.originalPrice || 0) > Number(product.price || 0),
        );
      }

      if (
        filters.promotions.includes("flash_sale") ||
        filters.promotions.includes("hot")
      ) {
        result = result.filter(
          (product) =>
            product.isFlashSale === true ||
            product.isFlashSale === "true",
        );
      }
    }

    // SORT
    switch (sort) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;

      case "price-low":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;

      case "price-high":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;

      case "popular":
        result.sort(
          (a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0),
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, search, filters, sort, categories]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // =========================
  // HANDLERS
  // =========================
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      category: "",
      brands: [],
      promotions: [],
    });
    setSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen">
      <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-4 lg:px-6">
        {/* BANNER PROMOTION (Mặc định cố định chuẩn đẹp) */}
        <div className="mb-5 overflow-hidden rounded-2xl shadow-xs border border-slate-700/40 bg-gradient-to-r from-[#0a0c10] via-[#141824] to-[#0a0c10] relative select-none">
          {/* Showroom background with dark gradient overlay */}
          <img
            src="/images/dudi/dudi_showroom_hero.jpg"
            alt="DUDI SOFTWARE Showroom"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-32 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-5 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <img
                src="/images/dudi/dudisoftware4.png"
                alt="DUDI SOFTWARE Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md rounded-2xl shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                    DUDI SOFTWARE
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-extrabold border border-red-500/30 uppercase tracking-wider">
                    CHÍNH HÃNG 100%
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 line-clamp-1">
                  Bộ sưu tập Laptop Gaming, PC Workstation, Linh kiện & Gaming Gear cao cấp
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-semibold mt-1.5">
                  <span>⚡ Bảo hành 1 đổi 1 siêu tốc</span>
                  <span>•</span>
                  <span>🚚 Giao hàng hỏa tốc toàn quốc</span>
                  <span>•</span>
                  <span>💰 Hỗ trợ trả góp 0% lãi suất</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                  HOTLINE TƯ VẤN 24/7
                </span>
                <span className="text-sm font-black text-red-400 tracking-wide">
                  (+84) 909 163 821
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          {/* SIDEBAR (Desktop & Mobile Drawer) */}
          <ProductSidebar
            filters={filters}
            products={products}
            categories={categories}
            onFilterChange={handleFilterChange}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            onClearFilters={handleClearFilters}
          />

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <ProductToolbar
              productCount={filteredProducts.length}
              sort={sort}
              onSortChange={handleSort}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            <ProductSearch value={search} onChange={handleSearch} />

            <ActiveFilters
              filters={filters}
              categories={categories}
              search={search}
              onFilterChange={handleFilterChange}
              onClearSearch={() => handleSearch("")}
              onClear={handleClearFilters}
            />

            {/* PRODUCT GRID OR SKELETON */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center border border-gray-100 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#eb1c24] mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mb-5">
                  Danh mục này hiện chưa có sản phẩm sẵn hàng hoặc không khớp với bộ lọc hiện tại. Vui lòng thử chọn danh mục khác.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-[#eb1c24] hover:bg-[#b3141a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-8">
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#eb1c24] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
