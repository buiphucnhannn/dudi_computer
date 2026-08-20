"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import ProductSidebar from "@/components/product/ProductSidebar";
import ProductToolbar from "@/components/product/ProductToolbar";
import ProductSearch from "@/components/product/ProductSearch";
import ProductPagination from "@/components/product/ProductPagination";
import ActiveFilters from "@/components/product/ActiveFilters";

import staticProducts from "@/data/products.json";
import { productAPI } from "@/lib/api";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const isFlashSaleParam = searchParams.get("isFlashSale");
  const brandParam = searchParams.get("brand") || "";

  const [products, setProducts] = useState(staticProducts);
  const [search, setSearch] = useState(searchParam);
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState({
    category: categoryParam,
    brands: brandParam ? [brandParam] : [],
    promotions: isFlashSaleParam === "true" ? ["discount"] : [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Sync URL search params with state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      brands: brandParam ? [brandParam] : prev.brands,
      promotions: isFlashSaleParam === "true" ? ["discount"] : prev.promotions,
    }));
    if (searchParam) {
      setSearch(searchParam);
    }
    setCurrentPage(1);
  }, [categoryParam, searchParam, isFlashSaleParam, brandParam]);

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
        const category = (product.categoryName || "").toLowerCase();

        return (
          name.includes(keyword) ||
          brand.includes(keyword) ||
          category.includes(keyword)
        );
      });
    }

    // CATEGORY
    if (filters.category) {
      const selectedCat = filters.category.toLowerCase().trim();

      result = result.filter((product) => {
        const catName = (product.categoryName || "").toLowerCase();
        const catSlug = (product.categorySlug || "").toLowerCase();
        const prodName = (product.name || "").toLowerCase();

        if (
          selectedCat === "laptop-cu" ||
          selectedCat === "laptop cũ" ||
          selectedCat === "laptop"
        ) {
          return (
            catName.includes("laptop") ||
            catSlug.includes("laptop") ||
            prodName.includes("laptop") ||
            prodName.includes("macbook") ||
            prodName.includes("dell latitude") ||
            prodName.includes("thinkpad")
          );
        }

        if (
          selectedCat === "pc-cu" ||
          selectedCat === "pc cũ" ||
          selectedCat === "pc"
        ) {
          return (
            catName.includes("pc") ||
            catSlug.includes("pc") ||
            prodName.startsWith("pc") ||
            prodName.includes("bộ máy tính") ||
            prodName.includes("case pc")
          );
        }

        if (
          selectedCat === "man-hinh" ||
          selectedCat === "màn hình" ||
          selectedCat === "màn hình máy tính" ||
          selectedCat === "24inch" ||
          selectedCat === "22inch"
        ) {
          return (
            catName.includes("màn hình") ||
            catName.includes("inch") ||
            catSlug.includes("man-hinh") ||
            prodName.includes("màn hình") ||
            prodName.includes("monitor")
          );
        }

        if (
          selectedCat === "psu-nguon-may-tinh" ||
          selectedCat === "psu - nguồn máy tính" ||
          selectedCat === "nguồn"
        ) {
          return (
            catName.includes("nguồn") ||
            catName.includes("psu") ||
            catName.includes("850w") ||
            catName.includes("750w") ||
            catName.includes("700w") ||
            prodName.includes("nguồn") ||
            prodName.includes("psu") ||
            prodName.includes("850w") ||
            prodName.includes("750w")
          );
        }

        if (
          selectedCat === "mainboard-bo-mach-chu" ||
          selectedCat === "mainboard - bo mạch chủ" ||
          selectedCat === "mainboard"
        ) {
          return (
            catName.includes("mainboard") ||
            catName.includes("bo mạch") ||
            prodName.startsWith("main") ||
            prodName.startsWith("bo mạch") ||
            prodName.includes("mainboard")
          );
        }

        if (
          selectedCat === "vga-card-man-hinh" ||
          selectedCat === "vga - card màn hình" ||
          selectedCat === "vga"
        ) {
          return (
            catName.includes("vga") ||
            prodName.includes("rtx") ||
            prodName.includes("gtx") ||
            prodName.includes("vga") ||
            prodName.includes("card màn hình")
          );
        }

        if (
          selectedCat === "cpu-bo-vi-xu-ly" ||
          selectedCat === "cpu - bộ vi xử lý" ||
          selectedCat === "cpu"
        ) {
          return (
            catName.includes("cpu") ||
            prodName.includes("cpu") ||
            prodName.includes("i5") ||
            prodName.includes("i7") ||
            prodName.includes("i9") ||
            prodName.includes("ryzen")
          );
        }

        if (
          selectedCat === "ram-bo-nho-trong" ||
          selectedCat === "ram - bộ nhớ trong" ||
          selectedCat === "ram"
        ) {
          return (
            catName.includes("ram") ||
            prodName.includes("ram") ||
            prodName.includes("ddr4") ||
            prodName.includes("ddr5")
          );
        }

        if (
          selectedCat === "o-cung-hdd-ssd" ||
          selectedCat === "ổ cứng hdd - ssd" ||
          selectedCat === "ssd" ||
          selectedCat === "hdd"
        ) {
          return (
            catName.includes("ổ cứng") ||
            catName.includes("ssd") ||
            catName.includes("hdd") ||
            prodName.includes("ssd") ||
            prodName.includes("nvme")
          );
        }

        if (
          selectedCat === "case-vo-may-tinh" ||
          selectedCat === "case - vỏ máy tính" ||
          selectedCat === "case"
        ) {
          return (
            catName.includes("case") ||
            catName.includes("vỏ") ||
            prodName.includes("case") ||
            prodName.includes("vỏ máy")
          );
        }

        if (selectedCat === "chuot" || selectedCat === "chuột") {
          return (
            catName.includes("chuột") ||
            catName.includes("mouse") ||
            prodName.includes("chuột") ||
            prodName.includes("mouse")
          );
        }

        if (selectedCat === "ban-phim" || selectedCat === "bàn phím") {
          return (
            catName.includes("bàn phím") ||
            catName.includes("keyboard") ||
            prodName.includes("bàn phím") ||
            prodName.includes("keyboard")
          );
        }

        if (
          selectedCat === "tan-nhiet-cooling" ||
          selectedCat === "tản nhiệt cooling" ||
          selectedCat === "tản nhiệt"
        ) {
          return (
            catName.includes("tản nhiệt") ||
            catName.includes("cooling") ||
            prodName.includes("tản nhiệt") ||
            prodName.includes("aio") ||
            prodName.includes("cooling")
          );
        }

        return (
          catName === selectedCat ||
          catSlug === selectedCat ||
          catName.includes(selectedCat) ||
          prodName.includes(selectedCat)
        );
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

            <ActiveFilters
              filters={filters}
              onFilterChange={handleFilterChange}
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
