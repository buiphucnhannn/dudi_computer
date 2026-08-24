"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, ShoppingCart, X, Trash2, Scale, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { productAPI } from "@/lib/api";
import { parseProductSpecs } from "@/lib/specParser";
import { useCompare } from "@/components/common/CompareContext";
import ProductComparisonModal from "@/components/product-detail/ProductComparisonModal";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getProductId = (product) => {
  return product?.slug || product?._id || product?.id;
};

const getProductName = (product) => {
  return product?.name || product?.title || "Sản phẩm";
};

const getProductImage = (product) => {
  if (!product) return "/images/dudi/dudisoftware1.png";
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]?.url || product.images[0] || product.thumbnail;
  }
  return product.thumbnail || product.image || "/images/dudi/dudisoftware1.png";
};

const getPrice = (product) => {
  const price = Number(product?.price || 0);
  return price > 0 ? `${price.toLocaleString("vi-VN")}₫` : "Liên hệ";
};

const getOriginalPrice = (product) => {
  const price = Number(product?.originalPrice || 0);
  return price > 0 ? `${price.toLocaleString("vi-VN")}₫` : null;
};

// =====================================================
// SPECIFICATION ROWS DEFINITION
// =====================================================

const SPEC_ROWS = [
  { label: "Danh mục", key: "category" },
  { label: "Thương hiệu", key: "brand" },
  { label: "Bộ vi xử lý (CPU)", key: "cpu" },
  { label: "RAM (Bộ nhớ trong)", key: "ram" },
  { label: "Ổ cứng (SSD / HDD)", key: "ssd" },
  { label: "Card đồ họa (VGA)", key: "vga" },
  { label: "Bo mạch chủ (Mainboard)", key: "mainboard" },
  { label: "Nguồn (PSU)", key: "psu" },
  { label: "Tản nhiệt (Cooling)", key: "cooler" },
  { label: "Vỏ Case / Thiết kế", key: "caseBox" },
  { label: "Màn hình hiển thị", key: "display" },
  { label: "Chế độ bảo hành", key: "warranty" },
  { label: "Tình trạng hàng", key: "status" },
];

// =====================================================
// COMPARE CONTENT COMPONENT
// =====================================================

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsParam = searchParams.get("products");

  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tải danh sách tất cả sản phẩm phục vụ Modal tìm kiếm
  useEffect(() => {
    productAPI
      .getAll({ limit: 500 })
      .then((res) => {
        if (res.data?.data?.products) {
          setAllProducts(res.data.data.products);
        } else if (Array.isArray(res.data?.data)) {
          setAllProducts(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      });
  }, []);

  // Parse ID danh sách so sánh từ URL
  const productIds = useMemo(() => {
    if (productsParam) {
      return productsParam
        .split(",")
        .map((id) => decodeURIComponent(id.trim()))
        .filter(Boolean)
        .slice(0, 3);
    }
    // Nếu URL chưa có params thì lấy từ Context
    if (compareItems.length > 0) {
      return compareItems.map(getProductId).filter(Boolean).slice(0, 3);
    }
    return [];
  }, [productsParam, compareItems]);

  // Load chi tiết các sản phẩm cần so sánh
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      setLoading(true);

      try {
        const loadedProducts = await Promise.all(
          productIds.map(async (id) => {
            // Thử tìm trong Context trước để hiển thị tức thì
            const inContext = compareItems.find((item) => getProductId(item) === id);

            try {
              const response = await productAPI.getBySlug(id);
              const data = response?.data?.data;
              const apiProduct = data?.product || data;
              if (apiProduct) {
                return apiProduct;
              }
            } catch (error) {
              console.info(`[Compare] Lấy chi tiết API cho ${id}`);
            }

            return inContext || null;
          })
        );

        if (!cancelled) {
          setProducts(loadedProducts.filter(Boolean));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  // Xóa 1 sản phẩm
  const handleRemoveProduct = (productId) => {
    removeFromCompare(productId);
    const nextProducts = products.filter((p) => getProductId(p) !== productId);
    setProducts(nextProducts);

    if (nextProducts.length === 0) {
      router.push("/compare");
      return;
    }

    const ids = nextProducts.map(getProductId).filter(Boolean);
    router.replace(`/compare?products=${ids.map(encodeURIComponent).join(",")}`);
  };

  // Xóa tất cả
  const handleClearAll = () => {
    clearCompare();
    setProducts([]);
    router.push("/compare");
  };

  // Thêm sản phẩm
  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleSelectProductFromModal = (selectedProduct) => {
    addToCompare(selectedProduct);
    const id = getProductId(selectedProduct);
    if (!id) return;

    const nextProducts = [...products, selectedProduct].slice(0, 3);
    const ids = nextProducts.map(getProductId).filter(Boolean);
    router.replace(`/compare?products=${ids.map(encodeURIComponent).join(",")}`);
    setIsModalOpen(false);
  };

  // Chuyển tới trang chi tiết
  const handleBuy = (product) => {
    const id = getProductId(product);
    if (!id) return;
    router.push(`/product-detail?slug=${encodeURIComponent(id)}`);
  };

  // MÀN HÌNH TRỐNG KHI CHƯA CÓ SẢN PHẨM NÀO
  if (!loading && products.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-inner">
            <Scale size={44} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">
            Chưa có sản phẩm để so sánh
          </h1>

          <p className="mt-3 max-w-md text-sm sm:text-base text-slate-500">
            Vui lòng chọn thêm ít nhất 2 sản phẩm trên hệ thống để xem bảng so sánh thông số kỹ thuật chi tiết.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex h-12 items-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold uppercase text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700"
            >
              <Plus size={18} />
              Chọn sản phẩm so sánh
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold uppercase text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Về trang chủ
            </button>
          </div>
        </div>

        {/* Modal chọn sản phẩm so sánh */}
        <ProductComparisonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          products={allProducts}
          currentProduct={products[0] || null}
          selectedProducts={products}
          onAddProduct={handleSelectProductFromModal}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs tracking-wider mb-1">
              <Scale size={16} />
              <span>Công cụ đối chiếu cấu hình</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
              So sánh thông số kỹ thuật ({products.length}/3)
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Đối chiếu chi tiết cấu hình CPU, RAM, VGA, Màn hình, Ổ cứng và giá bán
            </p>
          </div>

          <div className="flex items-center gap-3">
            {products.length < 3 && (
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold uppercase text-white shadow-sm transition hover:bg-red-700"
              >
                <Plus size={15} />
                Thêm sản phẩm
              </button>
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:text-red-600 hover:border-red-300"
            >
              <Trash2 size={15} />
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm animate-pulse">
            Đang tải và xử lý dữ liệu so sánh cấu hình...
          </div>
        )}

        {/* PRODUCT CARDS TOP ROW */}
        {!loading && (
          <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
            {/* Mobile Scroll Hint */}
            <div className="flex items-center justify-between md:hidden mb-2 text-[11px] text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1 text-red-600 font-bold">
                👉 Vuốt ngang để xem chi tiết
              </span>
              <span>{products.length}/3 sản phẩm</span>
            </div>

            <div
              className="grid gap-3 sm:gap-4"
              style={{
                minWidth: `${140 + products.length * 210 + (products.length < 3 ? 180 : 0)}px`,
                gridTemplateColumns: `140px ${products.map(() => "minmax(200px, 1fr)").join(" ")} ${
                  products.length < 3 ? "minmax(170px, 1fr)" : ""
                }`,
              }}
            >
              {/* LABEL COLUMN HEADER (Sticky on left) */}
              <div className="sticky left-0 z-20 flex flex-col justify-end p-3 sm:p-4 rounded-xl bg-slate-100/95 backdrop-blur-sm border border-slate-200 shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Sản phẩm so sánh
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                  Đối chiếu tối đa 3 cấu hình
                </span>
              </div>

              {/* PRODUCTS COLUMNS */}
              {products.map((product) => {
                const id = getProductId(product);
                const image = getProductImage(product);

                return (
                  <div
                    key={id}
                    className="group relative flex min-h-[380px] sm:min-h-[420px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm transition hover:border-red-500 hover:shadow-md"
                  >
                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(id)}
                      className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-600 hover:text-white cursor-pointer"
                      title="Xóa khỏi so sánh"
                    >
                      <X size={14} />
                    </button>

                    {/* PRODUCT IMAGE */}
                    <div className="mb-3 sm:mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2">
                      <img
                        src={image}
                        alt={getProductName(product)}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* WARRANTY BADGE */}
                    <div className="text-[10px] sm:text-[10.5px] text-green-600 mb-1 flex items-center gap-1 font-semibold truncate">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{product.warranty || "Bảo hành chính hãng"}</span>
                    </div>

                    {/* PRODUCT NAME */}
                    <h3
                      className="mb-2 line-clamp-2 min-h-[36px] sm:min-h-[44px] text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug cursor-pointer"
                      onClick={() => handleBuy(product)}
                      title={getProductName(product)}
                    >
                      {getProductName(product)}
                    </h3>

                    {/* PRICE */}
                    <div className="mb-3 sm:mb-4 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg font-black text-red-600">
                        {getPrice(product)}
                      </span>
                      {getOriginalPrice(product) && (
                        <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                          {getOriginalPrice(product)}
                        </span>
                      )}
                    </div>

                    {/* ACTION BUY BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleBuy(product)}
                      className="mt-auto flex h-9 sm:h-10 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-red-600 text-[11px] sm:text-xs font-bold uppercase text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
                    >
                      <ShoppingCart size={14} />
                      <span>Chi tiết & Mua</span>
                    </button>
                  </div>
                );
              })}

              {/* EMPTY COLUMN PLACEHOLDER TO ADD */}
              {products.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex min-h-[380px] sm:min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white/70 p-4 sm:p-6 transition hover:border-red-500 hover:bg-red-50/20 cursor-pointer"
                >
                  <span className="mb-2.5 sm:mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-700">
                    Thêm thiết bị
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                    Chọn thêm để so sánh
                  </span>
                </button>
              )}
            </div>

            {/* =================================================
                SPECIFICATION COMPARISON TABLE
            ================================================= */}
            <div
              className="mt-6 sm:mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              style={{
                minWidth: `${140 + products.length * 210 + (products.length < 3 ? 180 : 0)}px`,
              }}
            >
              <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 font-bold uppercase text-[11px] sm:text-xs tracking-wider flex items-center gap-2 sticky left-0 z-20">
                <Scale size={15} />
                <span>Bảng đối chiếu thông số phần cứng chi tiết</span>
              </div>

              {SPEC_ROWS.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid transition hover:bg-slate-50/80 ${
                    index !== SPEC_ROWS.length - 1 ? "border-b border-slate-150" : ""
                  }`}
                  style={{
                    gridTemplateColumns: `140px ${products.map(() => "minmax(200px, 1fr)").join(" ")} ${
                      products.length < 3 ? "minmax(170px, 1fr)" : ""
                    }`,
                  }}
                >
                  {/* STICKY LABEL COLUMN */}
                  <div className="sticky left-0 z-10 flex items-center bg-slate-100/95 backdrop-blur-sm p-3 sm:p-4 text-[11.5px] sm:text-xs font-bold text-slate-800 border-r border-slate-200 shadow-[2px_0_6px_rgba(0,0,0,0.03)]">
                    {row.label}
                  </div>

                  {/* PRODUCT VALUE COLUMNS */}
                  {products.map((product) => {
                    const specs = parseProductSpecs(product);
                    const value = specs[row.key] || "Theo cấu hình chuẩn";

                    return (
                      <div
                        key={`${getProductId(product)}-${row.key}`}
                        className="flex min-h-[48px] sm:min-h-[56px] items-center border-r last:border-r-0 border-slate-200 p-3 sm:p-4 text-[11.5px] sm:text-xs font-medium leading-relaxed text-slate-700 break-words"
                      >
                        {value}
                      </div>
                    );
                  })}

                  {/* EMPTY FILLER COLUMNS */}
                  {products.length < 3 && (
                    <div className="flex min-h-[48px] sm:min-h-[56px] items-center justify-center border-r last:border-r-0 border-slate-200 bg-slate-50/30 p-3 sm:p-4">
                      <span className="text-xs italic text-slate-400">---</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={allProducts}
        currentProduct={products[0] || null}
        selectedProducts={products}
        onAddProduct={handleSelectProductFromModal}
      />
    </main>
  );
}

// =====================================================
// MAIN EXPORT PAGE
// =====================================================

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <p className="font-semibold text-slate-500">Đang tải trang so sánh...</p>
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  );
}