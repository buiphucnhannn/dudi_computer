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
import { productAPI } from "@/lib/api";
import { detectProductType, PRODUCT_TYPES } from "@/lib/specParser";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const isFlashSaleParam = searchParams.get("isFlashSale");
  const brandParam = searchParams.get("brand") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParam);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    category: categoryParam,
    brands: brandParam ? [brandParam] : [],
    promotions: isFlashSaleParam === "true" ? ["discount"] : [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  // Active filter count for badge
  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.brands.length +
    filters.promotions.length;

  // Sync URL search params with state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      brands: brandParam ? [brandParam] : prev.brands,
      promotions: isFlashSaleParam === "true" ? ["discount"] : prev.promotions,
    }));
    setSearch(searchParam || "");
    setCurrentPage(1);
  }, [categoryParam, searchParam, isFlashSaleParam, brandParam]);

  // =========================
  // LOAD PRODUCTS TỪ API
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll({
          limit: 500,
        });

        const data = response?.data?.data?.products;

        if (data?.length > 0) {
          setProducts(data);
        } else if (Array.isArray(response?.data?.data)) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm từ API:", error.message);
      }
    };

    fetchProducts();
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

    // CATEGORY (Chuẩn hóa chính xác theo Loại sản phẩm & Danh mục, không nhầm linh kiện trong PC)
    if (filters.category) {
      const selectedCat = filters.category.toLowerCase().trim();

      result = result.filter((product) => {
        const pType = detectProductType(product);
        const catSlug = (product.categorySlug || "").toLowerCase();
        const catName = (product.categoryName || "").toLowerCase();
        const prodName = (product.name || "").toLowerCase();

        // 1. Laptop
        if (
          selectedCat === "laptop-cu" ||
          selectedCat === "laptop cũ" ||
          selectedCat === "laptop" ||
          selectedCat === "laptop-gaming" ||
          selectedCat === "laptop-van-phong" ||
          selectedCat === "macbook"
        ) {
          return pType === PRODUCT_TYPES.LAPTOP || catSlug.includes("laptop") || catName.includes("laptop");
        }

        // 2. PC Cũ / Trọn bộ
        if (
          selectedCat === "pc-cu" ||
          selectedCat === "pc cũ" ||
          selectedCat === "pc" ||
          selectedCat === "pc-gaming" ||
          selectedCat === "pc-do-hoa" ||
          selectedCat === "pc-van-phong"
        ) {
          return pType === PRODUCT_TYPES.PC || catSlug.includes("pc-") || catName.includes("pc");
        }

        // 3. Màn hình
        if (
          selectedCat === "man-hinh" ||
          selectedCat === "màn hình" ||
          selectedCat === "monitor" ||
          selectedCat === "24-inch" ||
          selectedCat === "27-inch" ||
          selectedCat === "32-inch"
        ) {
          return pType === PRODUCT_TYPES.MONITOR;
        }

        // 4. PSU - Nguồn máy tính (Chỉ lấy sản phẩm Nguồn rời, KHÔNG lấy bộ máy tính có ghi nguồn)
        if (
          selectedCat === "psu-nguon-may-tinh" ||
          selectedCat === "psu - nguồn máy tính" ||
          selectedCat === "psu" ||
          selectedCat === "nguon" ||
          selectedCat === "850w" ||
          selectedCat === "750w" ||
          selectedCat === "650w"
        ) {
          return pType === PRODUCT_TYPES.PSU;
        }

        // 5. Mainboard - Bo mạch chủ (Chỉ lấy Mainboard rời)
        if (
          selectedCat === "mainboard-bo-mach-chu" ||
          selectedCat === "mainboard - bo mạch chủ" ||
          selectedCat === "mainboard" ||
          selectedCat === "b760" ||
          selectedCat === "z790" ||
          selectedCat === "b650"
        ) {
          return pType === PRODUCT_TYPES.MAINBOARD;
        }

        // 6. VGA - Card màn hình (Chỉ lấy VGA rời)
        if (
          selectedCat === "vga-card-man-hinh" ||
          selectedCat === "vga - card màn hình" ||
          selectedCat === "vga" ||
          selectedCat === "card-man-hinh"
        ) {
          return pType === PRODUCT_TYPES.VGA;
        }

        // 7. CPU - Bộ vi xử lý (Chỉ lấy CPU rời)
        if (
          selectedCat === "cpu-bo-vi-xu-ly" ||
          selectedCat === "cpu - bộ vi xử lý" ||
          selectedCat === "cpu"
        ) {
          return pType === PRODUCT_TYPES.CPU;
        }

        // 8. RAM - Bộ nhớ trong (Chỉ lấy thanh RAM rời)
        if (
          selectedCat === "ram-bo-nho-trong" ||
          selectedCat === "ram - bộ nhớ trong" ||
          selectedCat === "ram"
        ) {
          return pType === PRODUCT_TYPES.RAM;
        }

        // 9. Ổ cứng HDD - SSD (Chỉ lấy ổ cứng rời)
        if (
          selectedCat === "o-cung-hdd-ssd" ||
          selectedCat === "ổ cứng hdd - ssd" ||
          selectedCat === "ssd" ||
          selectedCat === "hdd"
        ) {
          return pType === PRODUCT_TYPES.SSD;
        }

        // 10. Case - Vỏ máy tính (Chỉ lấy vỏ Case rời)
        if (
          selectedCat === "case-vo-may-tinh" ||
          selectedCat === "case - vỏ máy tính" ||
          selectedCat === "case"
        ) {
          return pType === PRODUCT_TYPES.CASE;
        }

        // 11. Chuột Gaming
        if (selectedCat === "chuot" || selectedCat === "chuột") {
          return (
            (pType === PRODUCT_TYPES.GEAR || catSlug.includes("chuot")) &&
            (prodName.includes("chuột") || prodName.includes("mouse"))
          );
        }

        // 12. Bàn phím Gaming
        if (selectedCat === "ban-phim" || selectedCat === "bàn phím") {
          return (
            (pType === PRODUCT_TYPES.GEAR || catSlug.includes("ban-phim")) &&
            (prodName.includes("bàn phím") || prodName.includes("keyboard"))
          );
        }

        // 13. Tản nhiệt Cooling
        if (
          selectedCat === "tan-nhiet-cooling" ||
          selectedCat === "tản nhiệt cooling" ||
          selectedCat === "tan-nhiet" ||
          selectedCat === "tản nhiệt"
        ) {
          return pType === PRODUCT_TYPES.COOLER;
        }

        // Khớp tuyệt đối theo categorySlug
        return catSlug === selectedCat || catName === selectedCat;
      });
    }

    // BRAND
    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.some(
          (b) =>
            (product.brand || "").toLowerCase() === b.toLowerCase() ||
            (product.name || "").toLowerCase().includes(b.toLowerCase()),
        ),
      );
    }

    // DISCOUNT
    if (filters.promotions.includes("discount")) {
      result = result.filter(
        (product) => Number(product.discountPercent || 0) > 0,
      );
    }

    // SORT
    switch (sort) {
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
  }, [products, search, filters, sort]);

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
    // Khi chọn danh mục mới trên Sidebar hoặc chuyển đổi danh mục, tự động làm mới thanh tìm kiếm
    if (newFilters.category !== filters.category) {
      setSearch("");
    }
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
        <div className="mb-6 overflow-hidden rounded-2xl shadow-xs">
          <img
            src="/banner.webp"
            alt="ZComputer - Sản phẩm"
            className="block h-[140px] w-full object-cover sm:h-[200px] lg:h-[280px]"
          />
        </div>
        <div className="flex gap-6">
          {/* SIDEBAR (Desktop & Mobile Drawer) */}
          <ProductSidebar
            filters={filters}
            products={products}
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
              search={search}
              onFilterChange={handleFilterChange}
              onClearSearch={() => handleSearch("")}
              onClear={handleClearFilters}
            />

            {paginatedProducts.length > 0 ? (
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

            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
        <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] pt-20">
          <p className="font-semibold text-gray-500">Đang tải sản phẩm...</p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
