"use client";

import { useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import { useDebounce } from "@/lib/useDebounce";
import { productAPI } from "@/lib/api";
import ProductPageHeader from "@/components/admin/products/ProductPageHeader";
import ProductFilters from "@/components/admin/products/ProductFilters";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductGrid from "@/components/admin/products/ProductGrid";
import ProductPagination from "@/components/admin/products/ProductPagination";
import ProductModal from "@/components/admin/products/ProductModal";
import { useToast } from "@/components/common/ToastContext";

function AdminProductsContent() {
  // Always start with empty list and loading state so stale/mock data is NEVER rendered on reload
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    brand: "",
  });
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 1500);
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const { showToast } = useToast();

  // Dedicated function to fetch fresh data directly from Database
  const fetchProductsFromDatabase = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) {
      setIsLoading(true);
    }

    try {
      const res = await productAPI.getAll({ limit: 500 });
      const items = res.data?.data?.products || res.data?.products;

      if (items && Array.isArray(items)) {
        const mapped = items.map((p, idx) => {
          const firstImgUrl = typeof p.images?.[0] === "object" ? p.images?.[0]?.url : p.images?.[0];
          const thumb = p.thumbnail || firstImgUrl || "";
          return {
            id: p._id || `prod-db-${idx}`,
            _id: p._id,
            sku: p.sku || `SKU-${1000 + idx}`,
            name: p.name,
            slug: p.slug,
            price: p.price,
            oldPrice: p.originalPrice || null,
            stock: typeof p.stock === "number" ? p.stock : 10,
            rating: p.ratings?.average || 5.0,
            badge: p.isHot ? "HOT" : p.isFlashSale ? "SALE" : null,
            category: p.categoryName || (typeof p.category === "object" ? p.category?.name : p.category) || "Linh kiện PC",
            brand: p.brand || "DUDI",
            status: p.stock === 0 ? "out-of-stock" : "active",
            image: thumb,
            thumbnail: thumb,
            images: p.images || [],
          };
        });

        setProducts(mapped);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu từ Database:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial Fetch on component mount
  useEffect(() => {
    fetchProductsFromDatabase(true);
  }, [fetchProductsFromDatabase]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || "Khác";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Compute brand list
  const brandList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  // Compute status counts
  const statusCounts = useMemo(() => {
    return {
      active: products.filter((p) => (typeof p.stock === "number" ? p.stock > 0 : p.status !== "out_of_stock")).length,
      lowStock: products.filter((p) => typeof p.stock === "number" && p.stock > 0 && p.stock <= 3).length,
      outOfStock: products.filter((p) => p.stock === 0 || p.status === "out_of_stock").length,
    };
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters, sort]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filters.status) {
      if (filters.status === "active") {
        result = result.filter((p) => (typeof p.stock === "number" ? p.stock > 0 : p.status !== "out_of_stock"));
      } else if (filters.status === "low-stock") {
        result = result.filter((p) => typeof p.stock === "number" && p.stock > 0 && p.stock <= 3);
      } else if (filters.status === "out-of-stock") {
        result = result.filter((p) => p.stock === 0 || p.status === "out_of_stock");
      }
    }

    // Category filter
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand);
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "stock-desc":
          return b.stock - a.stock;
        case "stock-asc":
          return a.stock - b.stock;
        case "newest":
        default:
          return String(b.id).localeCompare(String(a.id));
      }
    });

    return result;
  }, [products, searchQuery, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleClearFilters = () => {
    setFilters({ status: "", category: "", brand: "" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  // FLOW: Thêm / Sửa → Upload ảnh lên Cloudinary qua multipart/form-data → Cập nhật DB → Fetch lại data mới nhất
  const handleSaveProduct = async (productData) => {
    const isEdit = Boolean(productData.id || productData._id);
    const targetId = productData._id || productData.id;

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("sku", productData.sku || "");
      formData.append("price", productData.price);
      if (
        productData.oldPrice !== null &&
        productData.oldPrice !== undefined &&
        productData.oldPrice !== ""
      ) {
        formData.append("originalPrice", productData.oldPrice);
      }
      formData.append("stock", productData.stock);
      formData.append("categoryName", productData.category);
      formData.append("brand", productData.brand);

      if (productData.existingImages && productData.existingImages.length > 0) {
        formData.append(
          "existingImages",
          JSON.stringify(productData.existingImages)
        );
      } else {
        formData.append("existingImages", JSON.stringify([]));
      }

      if (productData.newFiles && productData.newFiles.length > 0) {
        productData.newFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      if (isEdit && targetId) {
        // 1. Gửi request cập nhật vào Database (multipart/form-data)
        await productAPI.update(targetId, formData);
        showToast(`Đã lưu thay đổi cho "${productData.name}" thành công!`);
      } else {
        // 1. Gửi request tạo mới vào Database (multipart/form-data)
        await productAPI.create(formData);
        showToast(`Đã thêm sản phẩm "${productData.name}" thành công!`);
      }

      setIsModalOpen(false);

      // 2. Database cập nhật thành công → Fetch lại toàn bộ data mới nhất từ Database
      await fetchProductsFromDatabase(false);
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm vào Database:", err);
      showToast(
        err.response?.data?.message ||
          `Không thể lưu thông tin sản phẩm "${productData.name}". Vui lòng kiểm tra lại dữ liệu nhập.`,
        "error"
      );
    }
  };

  // FLOW: Chỉnh Tồn kho → API cập nhật Database thành công → Fetch lại data mới nhất → Cập nhật state
  const handleStockChange = async (productId, newStock) => {
    try {
      // 1. Gửi cập nhật tồn kho vào Database
      await productAPI.updateStock(productId, newStock);

      // 2. Fetch lại data mới nhất từ Database
      await fetchProductsFromDatabase(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật tồn kho vào Database:", err);
      showToast(
        err.response?.data?.message || "Không thể cập nhật số lượng tồn kho. Vui lòng thử lại sau giây lát.",
        "error"
      );
    }
  };

  // FLOW: Xóa → API xóa trong Database thành công → Fetch lại data mới nhất → Cập nhật state
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmProduct) return;
    const targetId = deleteConfirmProduct._id || deleteConfirmProduct.id;
    const prodName = deleteConfirmProduct.name;
    setDeleteConfirmProduct(null);

    try {
      // 1. Gửi lệnh xóa trong Database
      await productAPI.delete(targetId);
      showToast(`Đã xóa sản phẩm "${prodName}" thành công!`);

      // 2. Fetch lại danh sách mới nhất từ Database
      await fetchProductsFromDatabase(false);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm trong Database:", err);
      showToast(
        err.response?.data?.message || `Không thể xóa sản phẩm "${prodName}". Vui lòng kiểm tra lại.`,
        "error"
      );
    }
  };

  // Export CSV từ dữ liệu hiện tại
  const handleExportCSV = () => {
    const headers = ["Mã SKU", "Tên sản phẩm", "Danh mục", "Thương hiệu", "Giá bán (VNĐ)", "Giá gốc (VNĐ)", "Tồn kho", "Đánh giá"];
    const rows = products.map((p) => [
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      `"${p.brand || ""}"`,
      p.price,
      p.oldPrice || "",
      p.stock,
      p.rating || "",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_san_pham_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Đã xuất danh sách sản phẩm thành file CSV!");
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <ProductPageHeader
        onAddProduct={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
        onExport={handleExportCSV}
      />

      {/* Top Filter Bar */}
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onClear={handleClearFilters}
        categoryCounts={categoryCounts}
        brandList={brandList}
        statusCounts={statusCounts}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      {/* Toolbar (Count + Sort + Grid/List Mode) */}
      <ProductToolbar
        total={isLoading ? 0 : filteredProducts.length}
        currentPage={currentPage}
        pageSize={pageSize}
        sort={sort}
        setSort={setSort}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Products Grid / List with Loading Skeleton */}
      <ProductGrid
        products={paginatedProducts}
        viewMode={viewMode}
        isLoading={isLoading}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={(prod) => setDeleteConfirmProduct(prod)}
        onStockChange={handleStockChange}
      />

      {/* Pagination */}
      {!isLoading && filteredProducts.length > 0 && (
        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Create / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={Object.keys(categoryCounts).map((c) => ({ name: c }))}
        brands={brandList}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop Layer - Bấm ra ngoài để đóng */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteConfirmProduct(null)}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Xác nhận xóa sản phẩm
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Thao tác này sẽ xóa sản phẩm vĩnh viễn.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-5">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong className="text-slate-900 font-bold">
                "{deleteConfirmProduct.name}"
              </strong>{" "}
              (Mã: {deleteConfirmProduct.sku})?
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs transition cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}