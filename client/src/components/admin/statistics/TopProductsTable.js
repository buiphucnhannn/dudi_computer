"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  X,
  ExternalLink,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { statisticAPI, categoryAPI } from "@/lib/api";
import { useDebounce } from "@/lib/useDebounce";

export default function TopProductsTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ key: "all", label: "Tất cả" }]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sold-desc"); // "sold-desc" | "revenue-desc" | "progress-desc"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          statisticAPI.getTopProducts({ limit: 50 }),
          categoryAPI.getAll(),
        ]);

        if (isMounted) {
          if (prodRes.data?.data) {
            setProducts(prodRes.data.data);
          }

          const catList = catRes.data?.data || catRes.data || [];
          if (Array.isArray(catList) && catList.length > 0) {
            const dynamicCategories = [
              { key: "all", label: "Tất cả" },
              ...catList.map((c) => ({
                key: c.slug || c.name.toLowerCase(),
                label: c.name,
              })),
            ];
            setCategories(dynamicCategories);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải top sản phẩm:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const debouncedSearch = useDebounce(search, 1500);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      list = list.filter(
        (p) =>
          p.categoryKey === categoryFilter ||
          p.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    list.sort((a, b) => {
      if (sortBy === "revenue-desc") return (b.revenue || 0) - (a.revenue || 0);
      if (sortBy === "progress-desc") return (b.progress || 0) - (a.progress || 0);
      return (b.sold || 0) - (a.sold || 0);
    });

    return list;
  }, [products, debouncedSearch, categoryFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      {/* Header Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-150 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Top Sản phẩm bán chạy nhất
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Xếp hạng theo doanh số và doanh thu thực tế
            </p>
          </div>

          <Link
            href="/admin/products"
            className="text-red-600 hover:text-red-700 text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Quản lý tất cả sản phẩm</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filter Bar: Search + Category Pills + Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
          {/* Search */}
          <div className="relative flex items-center rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 transition w-full lg:w-72">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm top sản phẩm..."
              className="ml-2 w-full bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills & Sort */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[500px]">
              {categories.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategoryFilter(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${categoryFilter === c.key
                      ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="sold-desc">Đã bán nhiều nhất</option>
              <option value="revenue-desc">Doanh thu cao nhất</option>
              <option value="progress-desc">Tiến độ mục tiêu cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6 font-bold whitespace-nowrap text-left">Sản Phẩm</th>
                <th className="py-3.5 px-4 font-bold w-36 whitespace-nowrap text-center">Mã SKU</th>
                <th className="py-3.5 px-4 font-bold w-36 whitespace-nowrap text-center">Giá Bán</th>
                <th className="py-3.5 px-4 font-bold w-44 whitespace-nowrap text-center">Tồn kho / Bán</th>
                <th className="py-3.5 px-4 font-bold w-40 whitespace-nowrap text-center">Tổng Doanh Thu</th>
                <th className="py-3.5 px-6 font-bold w-28 whitespace-nowrap text-center">Đã Bán</th>
              </tr>
            </thead>

            <tbody key={debouncedSearch + categoryFilter + sortBy + currentPage} className="divide-y divide-slate-150 text-sm animate-smooth-fade">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-xs text-slate-400 font-medium whitespace-nowrap">
                    Không tìm thấy sản phẩm nào phù hợp với tiêu chí lọc.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => {
                  const actualIdx = (currentPage - 1) * pageSize + index + 1;

                  return (
                    <tr
                      key={product.id || product.code}
                      onClick={() => setSelectedProduct(product)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Product */}
                      <td className="py-3.5 px-6 whitespace-nowrap text-left">
                        <div className="flex items-center gap-3.5">
                          <span className={`w-5 text-center text-xs font-black shrink-0 ${actualIdx === 1 ? "text-amber-500" : actualIdx === 2 ? "text-slate-400" : actualIdx === 3 ? "text-amber-700" : "text-slate-300"
                            }`}>
                            #{actualIdx}
                          </span>

                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 p-1">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition truncate max-w-[280px] whitespace-nowrap">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5 whitespace-nowrap">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-500 whitespace-nowrap text-center">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10.5px] font-bold text-slate-700 inline-block font-mono">
                        {product.code}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-xs font-black text-slate-900 whitespace-nowrap text-center">
                      {product.priceFormatted}
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center gap-2.5">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${index === 0
                                ? "bg-slate-900"
                                : index === 1
                                  ? "bg-red-600"
                                  : "bg-blue-600"
                              }`}
                            style={{
                              width: `${Math.max(5, product.progress || 10)}%`,
                            }}
                          />
                        </div>

                        <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                          {product.stock} còn
                        </span>
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="text-xs font-black text-red-600">
                        {(product.revenue || 0).toLocaleString("vi-VN")}₫
                      </span>
                    </td>

                    {/* Sold */}
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      <span className="text-sm font-black text-slate-900">
                        {product.sold || 0}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium ml-1">cái</span>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Thanh Phân Trang Đồng Bộ */}
        {!loading && filteredProducts.length > 0 && (
          <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị{" "}
              <strong className="text-slate-800 font-bold">
                {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredProducts.length)}
              </strong>{" "}
              trong tổng số{" "}
              <strong className="text-slate-800 font-bold">{filteredProducts.length}</strong> sản phẩm
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    page === currentPage
                      ? "bg-[#eb1c24] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop Layer - Bấm ra ngoài để đóng */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProduct(null)}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between border-b border-slate-150 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-50 p-1 border border-slate-200 shrink-0">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {selectedProduct.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {selectedProduct.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-medium text-[11px]">Đã bán ra:</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {selectedProduct.sold || 0} chiếc
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                  <span className="text-slate-400 font-medium text-[11px]">Tồn kho hiện tại:</span>
                  <div className="text-base font-black text-red-600 mt-0.5">
                    {selectedProduct.stock} cái
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Giá bán:</span>
                  <span className="font-bold text-slate-900">{selectedProduct.priceFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Tổng doanh thu:</span>
                  <span className="font-black text-emerald-600">
                    {(selectedProduct.revenue || 0).toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Đánh giá trung bình:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{selectedProduct.rating || 5} / 5.0</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-150 mt-4">
              {selectedProduct.slug ? (
                <Link
                  href={`/product-detail?slug=${selectedProduct.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Xem trên shop</span>
                </Link>
              ) : (
                <span />
              )}

              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}