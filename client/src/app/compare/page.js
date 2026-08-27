"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Scale,
  Plus,
  X,
  ShoppingCart,
  Trash2,
  Eye,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectIsAdmin } from "@/redux/slices/authSlice";
import { productAPI } from "@/lib/api";
import { parseProductSpecs } from "@/lib/specParser";
import { useCompare } from "@/components/common/CompareContext";
import ProductComparisonModal from "@/components/product-detail/ProductComparisonModal";
import { getProductImage } from "@/lib/productHelpers";
import { handleImageError } from "@/lib/imageFallback";

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getProductId = (product) => {
  return product?.slug || product?._id || product?.id;
};

const getProductName = (product) => {
  return product?.name || product?.title || "Sản phẩm";
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
// COMPARE CONTENT COMPONENT
// =====================================================

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsParam = searchParams.get("products");

  const { compareItems, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const isAdmin = useSelector(selectIsAdmin);

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Đảm bảo URL chỉ chứa tối đa 3 sản phẩm và không bị trùng lặp
  useEffect(() => {
    if (productsParam) {
      const parsed = productsParam
        .split(",")
        .map((id) => decodeURIComponent(id.trim()))
        .filter(Boolean);
      const unique = Array.from(new Set(parsed));
      if (unique.length !== parsed.length || unique.length > 3) {
        const limited = unique.slice(0, 3);
        router.replace(`/compare?products=${limited.map(encodeURIComponent).join(",")}`);
      }
    }
  }, [productsParam, router]);

  // Parse ID danh sách so sánh từ URL (loại bỏ trùng lặp và tối đa 3 sản phẩm)
  const productIds = useMemo(() => {
    let ids = [];
    if (productsParam) {
      ids = productsParam
        .split(",")
        .map((id) => decodeURIComponent(id.trim()))
        .filter(Boolean);
    } else if (compareItems.length > 0) {
      ids = compareItems.map(getProductId).filter(Boolean);
    }
    return Array.from(new Set(ids)).slice(0, 3);
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
          const seen = new Set();
          const uniqueProducts = [];
          for (const item of loadedProducts.filter(Boolean)) {
            const pid = getProductId(item);
            if (pid && !seen.has(pid)) {
              seen.add(pid);
              uniqueProducts.push(item);
            }
          }
          setProducts(uniqueProducts);
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
  const handleRemoveProduct = (productIdOrProduct) => {
    removeFromCompare(productIdOrProduct);
    const targetIds =
      typeof productIdOrProduct === "object"
        ? [
            productIdOrProduct.slug,
            productIdOrProduct._id ? String(productIdOrProduct._id) : null,
            productIdOrProduct.id ? String(productIdOrProduct.id) : null,
            getProductId(productIdOrProduct),
          ].filter(Boolean)
        : [String(productIdOrProduct)];

    const nextProducts = products.filter((p) => {
      const pId = getProductId(p);
      const p_id = p._id ? String(p._id) : null;
      const pSlug = p.slug ? String(p.slug) : null;
      return (
        !targetIds.includes(pId) &&
        !targetIds.includes(p_id) &&
        !targetIds.includes(pSlug)
      );
    });
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

  // Tính toán bảng thông số linh hoạt theo từng danh mục đối chiếu (Tích hợp Dynamic Spec Parser)
  const dynamicSpecRows = useMemo(() => {
    if (!products || products.length === 0) return [];

    const parsedList = products.map((p) => ({
      raw: p,
      parsed: parseProductSpecs(p),
    }));

    const rowMap = new Map();

    // Check if comparing PCs / Laptops to prioritize standard PC labels
    const hasPC = parsedList.some(
      ({ parsed, raw }) =>
        parsed.isPCorLaptop ||
        parsed.cpu ||
        parsed.vga ||
        raw.specs?.cpu ||
        raw.specs?.ram
    );

    if (hasPC) {
      rowMap.set("CPU", (p) => p.raw.specs?.cpu || p.raw.specifications?.find((s) => s.name?.toUpperCase() === "CPU")?.value || p.parsed.cpu || "-");
      rowMap.set("Mainboard", (p) => p.raw.specs?.mainboard || p.raw.specifications?.find((s) => s.name?.toLowerCase().includes("main"))?.value || p.parsed.mainboard || "-");
      rowMap.set("Cooler", (p) => p.raw.specs?.cooler || p.raw.specifications?.find((s) => s.name?.toLowerCase().includes("cooler") || s.name?.toLowerCase().includes("tản"))?.value || p.parsed.cooler || "-");
      rowMap.set("RAM", (p) => p.raw.specs?.ram || p.raw.specifications?.find((s) => s.name?.toUpperCase() === "RAM")?.value || p.parsed.ram || "-");
      rowMap.set("Storage", (p) => p.raw.specs?.storage || p.raw.specifications?.find((s) => s.name?.toLowerCase().includes("storage") || s.name?.toLowerCase().includes("ssd") || s.name?.toLowerCase().includes("ổ cứng"))?.value || p.parsed.ssd || "-");
      rowMap.set("VGA", (p) => p.raw.specs?.gpu || p.raw.specs?.vga || p.raw.specifications?.find((s) => s.name?.toUpperCase() === "VGA" || s.name?.toUpperCase() === "GPU")?.value || p.parsed.vga || "-");
      rowMap.set("PSU", (p) => p.raw.specs?.psu || p.raw.specifications?.find((s) => s.name?.toUpperCase() === "PSU" || s.name?.toLowerCase().includes("nguồn"))?.value || p.parsed.psu || "-");
      rowMap.set("Case", (p) => p.raw.specs?.caseBox || p.raw.specifications?.find((s) => s.name?.toLowerCase().includes("case") || s.name?.toLowerCase().includes("vỏ"))?.value || p.parsed.caseBox || "-");
    }

    // Thu thập tất cả các trường cấu hình đặc thù từ mảng items của từng sản phẩm
    parsedList.forEach(({ parsed, raw }) => {
      if (parsed.items && Array.isArray(parsed.items)) {
        parsed.items.forEach((it) => {
          if (
            it.name &&
            it.name !== "Thương hiệu" &&
            it.name !== "Danh mục" &&
            it.name !== "Chế độ bảo hành" &&
            it.name !== "Tình trạng"
          ) {
            let label = it.name;
            if (label.includes("CPU")) label = "CPU";
            else if (label.includes("Mainboard") || label.includes("Bo mạch")) label = "Mainboard";
            else if (label.includes("Tản nhiệt") || label.includes("Cooling")) label = "Cooler";
            else if (label.includes("RAM") || label.includes("Bộ nhớ")) label = "RAM";
            else if (label.includes("Ổ cứng") || label.includes("lưu trữ")) label = "Storage";
            else if (label.includes("Card đồ họa") || label.includes("VGA")) label = "VGA";
            else if (label.includes("Nguồn") || label.includes("PSU")) label = "PSU";
            else if (label.includes("Case") || label.includes("Khung vỏ")) label = "Case";

            if (!rowMap.has(label)) {
              rowMap.set(label, (p) => {
                const match = p.parsed.items?.find((item) => item.name === it.name);
                if (match && match.detail && match.detail !== "-") return match.detail;
                return "-";
              });
            }
          }
        });
      }

      if (raw.specifications && Array.isArray(raw.specifications)) {
        raw.specifications.forEach((spec) => {
          if (spec.name && !rowMap.has(spec.name)) {
            rowMap.set(spec.name, (p) => {
              const match = p.raw.specifications?.find((s) => s.name === spec.name);
              return match?.value || "-";
            });
          }
        });
      }
    });

    // Chuyển sang danh sách và loại bỏ các dòng mà tất cả sản phẩm đều không có dữ liệu (-)
    const rows = [];
    for (const [label, getValue] of rowMap.entries()) {
      const values = parsedList.map(getValue);
      const hasValidValue = values.some((v) => v && v !== "-" && v !== "---");
      if (hasValidValue) {
        rows.push({
          label,
          getValue,
        });
      }
    }

    return rows;
  }, [products]);

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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* HEADER MATCHING REFERENCE */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                SO SÁNH CẤU HÌNH
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
                So sánh chi tiết các thông số kỹ thuật
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {products.length < 3 && (
              <button
                type="button"
                onClick={handleAddProduct}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs transition hover:bg-red-700 cursor-pointer"
              >
                <Plus size={15} />
                Thêm sản phẩm
              </button>
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Xóa tất cả</span>
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm animate-pulse">
            Đang tải và xử lý dữ liệu so sánh cấu hình...
          </div>
        )}

        {/* Single product guidance alert */}
        {!loading && products.length === 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-900 text-xs sm:text-sm shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">💡</span>
              <p className="font-medium">
                Bạn đang chọn <strong>1 sản phẩm</strong>. Vui lòng bấm <strong>"Thêm sản phẩm"</strong> để đối chiếu thông số giữa 2 hoặc 3 sản phẩm cùng lúc.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 text-xs transition shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <Plus size={14} />
              <span>Thêm sản phẩm so sánh</span>
            </button>
          </div>
        )}

        {/* Not found products notice */}
        {!loading && productIds.length > products.length && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-blue-50 border border-blue-200 p-3.5 text-blue-900 text-xs font-medium shadow-2xs">
            <span className="shrink-0">ℹ️</span>
            <span>Một số sản phẩm trong liên kết không tồn tại hoặc đã ngừng kinh doanh và đã được hệ thống tự động bỏ qua.</span>
          </div>
        )}

        {/* UNIFIED COMPARISON TABLE */}
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
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
              style={{
                minWidth: `${180 + products.length * 240 + (products.length < 3 ? 200 : 0)}px`,
              }}
            >
              {/* =================================================
                  ROW 1: SẢN PHẨM (PRODUCT CARDS ROW)
              ================================================= */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `minmax(160px, 190px) ${products.map(() => "minmax(230px, 1fr)").join(" ")} ${
                    products.length < 3 ? "minmax(200px, 1fr)" : ""
                  }`,
                }}
              >
                {/* 1. STICKY LABEL "SẢN PHẨM" */}
                <div className="sticky left-0 z-20 flex items-center justify-start border-r border-slate-100 bg-white p-4 sm:p-6 shadow-[2px_0_6px_rgba(0,0,0,0.02)]">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
                    SẢN PHẨM
                  </span>
                </div>

                {/* 2. PRODUCT CARDS */}
                {products.map((product, index) => {
                  const id = getProductId(product);
                  const image = getProductImage(product);

                  return (
                    <div
                      key={`${id || "prod"}-${index}`}
                      className="group relative flex min-h-[380px] sm:min-h-[420px] flex-col justify-between border-r last:border-r-0 border-slate-100 bg-white p-4 sm:p-5 transition hover:bg-slate-50/40"
                    >
                      {/* REMOVE BUTTON (TOP-RIGHT CIRCULAR X) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleRemoveProduct(product || id);
                        }}
                        className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 shadow-2xs cursor-pointer active:scale-95"
                        title="Xóa khỏi so sánh"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>

                      {/* PRODUCT IMAGE */}
                      <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 border border-slate-100 p-3 sm:p-4">
                        <img
                          src={image}
                          alt={getProductName(product)}
                          className="h-full w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out max-h-[190px]"
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </div>

                      {/* PRODUCT NAME */}
                      <h3
                        className="mb-2 line-clamp-3 min-h-[50px] sm:min-h-[60px] text-xs sm:text-sm font-bold uppercase text-slate-900 group-hover:text-red-600 transition-colors leading-snug cursor-pointer"
                        onClick={() => handleBuy(product)}
                        title={getProductName(product)}
                      >
                        {getProductName(product)}
                      </h3>

                      {/* PRICE BLOCK */}
                      <div className="mb-4">
                        {getOriginalPrice(product) ? (
                          <div className="text-[11px] sm:text-xs text-slate-400 line-through">
                            {getOriginalPrice(product)}
                          </div>
                        ) : (
                          <div className="h-4 sm:h-4.5" />
                        )}
                        <div className="text-base sm:text-lg font-black text-red-600">
                          {getPrice(product)}
                        </div>
                      </div>

                      {/* BUY NOW (USER) OR VIEW DETAILS (ADMIN) */}
                      {mounted && isAdmin ? (
                        <button
                          type="button"
                          onClick={() => {
                            const slugOrId = product.slug || product._id || product.id;
                            router.push(`/product-detail?slug=${encodeURIComponent(slugOrId)}`);
                          }}
                          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.99] cursor-pointer"
                        >
                          <Eye size={15} />
                          <span>Xem chi tiết</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(product)}
                          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-xs sm:text-sm font-bold text-red-600 transition hover:bg-red-100/90 active:scale-[0.99] cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          <span>Mua ngay</span>
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* 3. EMPTY COLUMN PLACEHOLDER TO ADD */}
                {products.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="group flex min-h-[380px] sm:min-h-[420px] flex-col items-center justify-center border-r last:border-r-0 border-slate-100 bg-slate-50/30 p-4 sm:p-6 transition-all duration-300 hover:bg-red-50/20 cursor-pointer"
                  >
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 border border-slate-200 shadow-2xs group-hover:scale-110 group-hover:border-red-200 transition-all duration-300">
                      <Plus size={24} strokeWidth={2.5} />
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-700 group-hover:text-red-600 transition-colors">
                      Thêm sản phẩm
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 text-center font-medium">
                      ({3 - products.length} vị trí còn trống)
                    </span>
                  </button>
                )}
              </div>

              {/* =================================================
                  ROWS 2..N: SPECIFICATION ROWS
              ================================================= */}
              {dynamicSpecRows.map((row) => (
                <div
                  key={row.label}
                  className="grid border-t border-slate-150 transition hover:bg-slate-50/60"
                  style={{
                    gridTemplateColumns: `minmax(160px, 190px) ${products.map(() => "minmax(230px, 1fr)").join(" ")} ${
                      products.length < 3 ? "minmax(200px, 1fr)" : ""
                    }`,
                  }}
                >
                  {/* STICKY SPEC LABEL */}
                  <div className="sticky left-0 z-10 flex items-center bg-white p-4 sm:p-5 text-xs sm:text-sm font-bold text-slate-800 border-r border-slate-100 shadow-[2px_0_6px_rgba(0,0,0,0.02)]">
                    {row.label}
                  </div>

                  {/* PRODUCT VALUE COLUMNS */}
                  {products.map((product, index) => {
                    const parsed = parseProductSpecs(product);
                    const value = row.getValue({ raw: product, parsed });

                    return (
                      <div
                        key={`${getProductId(product) || "prod"}-${index}-${row.label}`}
                        className="flex min-h-[52px] sm:min-h-[60px] items-center border-r last:border-r-0 border-slate-100 p-4 sm:p-5 text-xs sm:text-sm font-medium leading-relaxed text-slate-700 break-words"
                      >
                        {value === "-" ? (
                          <span className="text-slate-400 italic">Không áp dụng</span>
                        ) : (
                          value
                        )}
                      </div>
                    );
                  })}

                  {/* EMPTY FILLER COLUMNS */}
                  {products.length < 3 && (
                    <div className="flex min-h-[52px] sm:min-h-[60px] items-center justify-center border-r last:border-r-0 border-slate-100 bg-slate-50/20 p-4 sm:p-5">
                      <span className="text-xs italic text-slate-300">---</span>
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