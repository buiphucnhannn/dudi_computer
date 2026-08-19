"use client";

import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import ProductSidebar from "@/components/product/ProductSidebar";
import ProductToolbar from "@/components/product/ProductToolbar";
import ProductSearch from "@/components/product/ProductSearch";
import ProductPagination from "@/components/product/ProductPagination";

import staticProducts from "@/data/products.json";
import { productAPI } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState(staticProducts);

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
  // LOAD PRODUCTS
  // =========================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll({
          limit: 100,
        });

        const data = response?.data?.data?.products;

        if (data?.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.info("[Database] Sử dụng products.json:", error.message);
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

      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || "";

        const brand = product.brand?.toLowerCase() || "";

        const category = product.categoryName?.toLowerCase() || "";

        return (
          name.includes(keyword) ||
          brand.includes(keyword) ||
          category.includes(keyword)
        );
      });
    }

    // CATEGORY
    if (filters.category) {
      result = result.filter(
        (product) => product.categoryName === filters.category,
      );
    }

    // BRAND
    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brand),
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

  return (
    <main className="w-full bg-[#f8f9fa]">
      <div className="mx-auto max-w-[1600px] px-3 py-5 sm:px-4 lg:px-6">
        <div className="mb-6 overflow-hidden rounded-2xl">
          <img
            src="banner.webp"
            alt="ZComputer - Sản phẩm"
            className="block h-[140px] w-full object-cover sm:h-[200px] lg:h-[280px]"
          />
        </div>
        <div className="flex gap-6">
          {/* SIDEBAR */}
          <ProductSidebar
            filters={filters}
            products={products}
            onFilterChange={handleFilterChange}
          />

          {/* CONTENT */}
          <div className="min-w-0 flex-1">
            <ProductToolbar
              productCount={filteredProducts.length}
              sort={sort}
              onSortChange={handleSort}
            />

            <ProductSearch value={search} onChange={handleSearch} />

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
                <p className="font-semibold text-gray-500">
                  Không tìm thấy sản phẩm
                </p>
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
