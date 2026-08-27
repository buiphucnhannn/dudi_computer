"use client";

import { Suspense, useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { PackageSearch, Loader2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductSidebar from "@/components/product/ProductSidebar";
import ProductToolbar from "@/components/product/ProductToolbar";
import ProductSearch from "@/components/product/ProductSearch";
import ProductPagination from "@/components/product/ProductPagination";
import ActiveFilters from "@/components/product/ActiveFilters";
import { productAPI, categoryAPI, brandAPI } from "@/lib/api";

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingPage, setIsFetchingPage] = useState(false);

  const [search, setSearch] = useState(searchParam);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    category: categoryParam,
    brands: brandParam ? [brandParam] : [],
    promotions: isFlashSaleParam === "true" ? ["flash_sale"] : [],
    condition: conditionParam,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  // Track initial mount for debounce
  const isInitialMount = useRef(true);

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
    setDebouncedSearch(searchParam || "");
    setCurrentPage(1);
  }, [categoryParam, searchParam, isFlashSaleParam, brandParam, conditionParam]);

  // Debounce search input (350ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // 1. TẢI DANH MỤC & THƯƠNG HIỆU ONCE
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.allSettled([
          categoryAPI.getAll(),
          brandAPI.getAll(),
        ]);

        if (isMounted && catRes.status === "fulfilled") {
          const catData = Array.isArray(catRes.value?.data?.data)
            ? catRes.value.data.data
            : [];
          setCategories(catData);
        }

        if (isMounted && brandRes.status === "fulfilled") {
          const brandData = Array.isArray(brandRes.value?.data?.data)
            ? brandRes.value.data.data
            : [];
          setBrands(brandData);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục/thương hiệu:", error);
      }
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // 2. FETCH SẢN PHẨM THEO TRANG VÀ BỘ LỌC TỪ API
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchProductsByPage = async () => {
      try {
        setIsFetchingPage(true);

        const params = {
          page: currentPage,
          limit: productsPerPage,
          sort: sort,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.brands && filters.brands.length > 0) {
          params.brand = filters.brands.join(",");
        }

        if (filters.condition) {
          params.condition = filters.condition;
        }

        if (filters.promotions && filters.promotions.length > 0) {
          if (filters.promotions.includes("flash_sale")) {
            params.isFlashSale = true;
          }
          if (filters.promotions.includes("discount")) {
            params.discount = true;
          }
        }

        const res = await productAPI.getAll(params);

        if (isMounted) {
          const responseData = res?.data?.data;
          const items =
            responseData?.products ||
            (Array.isArray(responseData) ? responseData : []);
          const pageInfo = responseData?.pagination || {
            total: items.length,
            page: currentPage,
            limit: productsPerPage,
            totalPages: Math.max(1, Math.ceil(items.length / productsPerPage)),
          };

          setProducts(items);
          setPagination(pageInfo);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm theo trang:", error);
        if (isMounted) {
          setProducts([]);
          setPagination({
            total: 0,
            page: currentPage,
            limit: productsPerPage,
            totalPages: 1,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsFetchingPage(false);
        }
      }
    };

    fetchProductsByPage();

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    debouncedSearch,
    sort,
    filters.category,
    filters.condition,
    filters.brands,
    filters.promotions,
  ]);

  // =========================
  // HANDLERS
  // =========================
  const handleSearch = (value) => {
    setSearch(value);
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
      condition: "",
    });
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen">
      <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-4 lg:px-6">
        {/* BANNER PROMOTION */}
        <div className="mb-5 overflow-hidden rounded-2xl shadow-xs border border-slate-700/40 bg-gradient-to-r from-[#0a0c10] via-[#141824] to-[#0a0c10] relative select-none">
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
            brands={brands}
            totalProductCount={pagination.total}
            onFilterChange={handleFilterChange}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            onClearFilters={handleClearFilters}
          />

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <ProductToolbar
              productCount={pagination.total}
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
              onClearSearch={() => {
                setSearch("");
                setDebouncedSearch("");
                setCurrentPage(1);
              }}
              onClear={handleClearFilters}
            />

            {/* PRODUCT GRID OR SKELETON */}
            {loading || isFetchingPage ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: productsPerPage }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
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
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-8">
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
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
