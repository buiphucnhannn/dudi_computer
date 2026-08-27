import { useMemo, useState } from "react";

import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductBanner from "./ProductBanner";
import ProductSidebar from "./ProductSidebar";
import ProductToolbar from "./ProductToolbar";
import ProductSearch from "./ProductSearch";
import ActiveFilters from "./ActiveFilters";
import ProductPagination from "./ProductPagination";

import ProductCard from "../ProductCard";

import { products } from "../../data/productData";

export default function ProductMain() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState({
    category: "",
    brands: [],
    promotions: [],
  });

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 12;

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase().trim();

      result = result.filter((product) =>
        product.name?.toLowerCase().includes(keyword),
      );
    }

    // Category
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    // Brand
    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand),
      );
    }

    // Promotion
    if (filters.promotions.includes("discount")) {
      result = result.filter((product) => product.discountPercent > 0);
    }

    // Flash sale
    if (filters.promotions.includes("flash_sale") || filters.promotions.includes("flash")) {
      result = result.filter((product) => product.isFlashSale === true);
    }

    // Sort
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "popular":
        result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;

      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
    }

    return result;
  }, [search, filters, sort]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brands: [],
      promotions: [],
    });

    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <ProductBreadcrumb />

      {/* Banner */}
      <ProductBanner />

      {/* Main */}
      <section className="px-4 pb-16 lg:px-8 xl:px-10">
        <div className="mx-auto flex max-w-[1600px] gap-6">
          {/* Sidebar */}
          <ProductSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Products area */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <ProductToolbar
              productCount={filteredProducts.length}
              sort={sort}
              onSortChange={handleSort}
            />

            {/* Search */}
            <ProductSearch value={search} onChange={handleSearch} />

            {/* Active filters */}
            <ActiveFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />

            {/* Product grid */}
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
              <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-700">
                    Không tìm thấy sản phẩm
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-lg bg-[#dc2626] px-5 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
