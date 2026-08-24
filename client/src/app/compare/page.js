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

  // Tính toán bảng thông số linh hoạt theo từng danh mục đối chiếu (Tích hợp Dynamic Spec Parser)
  const dynamicSpecRows = useMemo(() => {
    if (!products || products.length === 0) return [];

    const parsedList = products.map((p) => ({
      raw: p,
      parsed: parseProductSpecs(p),
    }));

    const rowMap = new Map();

    // Thông tin cơ bản ban đầu
    rowMap.set("Danh mục", (p) => p.raw.categoryName || p.raw.category?.name || p.parsed.category || "-");
    rowMap.set("Thương hiệu", (p) => p.raw.brand || p.parsed.brand || "Chính hãng");

    // Thu thập tất cả các trường cấu hình đặc thù từ mảng items của từng sản phẩm
    parsedList.forEach(({ parsed }) => {
      if (parsed.items && Array.isArray(parsed.items)) {
        parsed.items.forEach((it) => {
          if (
            it.name &&
            it.name !== "Thương hiệu" &&
            it.name !== "Danh mục" &&
            it.name !== "Chế độ bảo hành" &&
            it.name !== "Tình trạng"
          ) {
            if (!rowMap.has(it.name)) {
              rowMap.set(it.name, (p) => {
                const match = p.parsed.items?.find((item) => item.name === it.name);
                if (match && match.detail && match.detail !== "-") return match.detail;
                return "-";
              });
            }
          }
        });
      }
    });

    // Thông tin tình trạng và bảo hành ở cuối
    rowMap.set("Tình trạng", (p) =>
      p.raw.status === "out_of_stock" ? "Hết hàng" : "Còn hàng (Chính hãng / Like New)"
    );
    rowMap.set("Chế độ bảo hành", (p) => {
      const w = p.raw.warranty || p.parsed.warranty;
      return w ? String(w).replace(/^Bảo\s*hành\s*/i, "BH ") : "BH 3 - 12 Tháng";
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
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold uppercase text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
              >
                <Plus size={15} />
                Thêm sản phẩm
              </button>
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:text-red-600 hover:border-red-300 cursor-pointer"
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
                minWidth: `${160 + products.length * 220 + (products.length < 3 ? 190 : 0)}px`,
                gridTemplateColumns: `minmax(160px, 200px) ${products.map(() => "minmax(210px, 1fr)").join(" ")} ${
                  products.length < 3 ? "minmax(180px, 1fr)" : ""
                }`,
              }}
            >
              {/* LABEL COLUMN HEADER - Friendly & Informative Control Card (Sticky on left on mobile) */}
              <div className="sticky left-0 z-20 flex min-h-[380px] sm:min-h-[420px] flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/95 to-slate-100/95 p-4 sm:p-6 shadow-md overflow-hidden backdrop-blur-md">
                {/* Ambient Background Accent */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Section */}
                <div>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-red-50 text-[#eb1c24] border border-red-100 mb-2.5 sm:mb-3.5 shadow-2xs">
                    <Scale className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                      Đối chiếu
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-lg font-black uppercase tracking-tight text-slate-900 leading-snug">
                    Sản phẩm so sánh
                  </h2>

                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                    Đối chiếu chi tiết tối đa <strong className="text-slate-800 font-bold">3 cấu hình</strong> cùng lúc.
                  </p>

                  {/* Slot Progress Card */}
                  <div className="mt-3 sm:mt-4 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3.5 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs">
                      <span className="text-slate-600 font-bold">Trạng thái:</span>
                      <span className="font-extrabold text-[#eb1c24] bg-red-50 border border-red-200 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px]">
                        {products.length} / 3 máy
                      </span>
                    </div>

                    {/* 3 Progress Bars */}
                    <div className="grid grid-cols-3 gap-1 pt-0.5">
                      {[0, 1, 2].map((slotIdx) => (
                        <div
                          key={slotIdx}
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                            slotIdx < products.length
                              ? "bg-[#eb1c24] shadow-[0_0_8px_rgba(235,28,36,0.4)]"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Features Checklist */}
                <div className="my-2 sm:my-3 space-y-1.5 sm:space-y-2 text-[10.5px] sm:text-[11.5px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[9px] sm:text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="truncate">CPU, RAM, VGA, Màn hình</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[9px] sm:text-[10px] font-bold">
                      ✓
                    </span>
                    <span className="truncate">Giá bán & Bảo hành</span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div>
                  {products.length < 3 ? (
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] sm:text-xs font-bold uppercase transition shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                    >
                      <Plus size={14} />
                      <span>Thêm (+{3 - products.length})</span>
                    </button>
                  ) : (
                    <div className="py-2 px-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-[11px] sm:text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Đủ 3 máy</span>
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCTS COLUMNS */}
              {products.map((product) => {
                const id = getProductId(product);
                const image = getProductImage(product);

                return (
                  <div
                    key={id}
                    className="group relative flex min-h-[380px] sm:min-h-[420px] flex-col rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm transition hover:border-red-500 hover:shadow-md"
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
                    <div className="mb-3 sm:mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                      <img
                        src={image}
                        alt={getProductName(product)}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* WARRANTY BADGE */}
                    <div className="text-[10px] sm:text-[10.5px] text-green-600 mb-1 flex items-center gap-1 font-semibold truncate">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{product.warranty ? String(product.warranty).replace(/^Bảo\s*hành\s*/i, "BH ") : "BH chính hãng"}</span>
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
                      className="mt-auto flex h-9 sm:h-10 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-red-600 text-[11px] sm:text-xs font-bold uppercase text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
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
                  className="group flex min-h-[380px] sm:min-h-[420px] flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-4 sm:p-6 transition-all duration-300 hover:border-red-500 hover:bg-red-50/30 hover:shadow-md cursor-pointer"
                >
                  <span className="mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 shadow-sm group-hover:scale-110 group-hover:bg-[#eb1c24] group-hover:text-white transition-all duration-300">
                    <Plus size={26} strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-extrabold uppercase text-slate-800 group-hover:text-red-600 transition-colors">
                    Thêm thiết bị
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 mt-1 text-center font-medium">
                    Nhấn để chọn cấu hình tiếp theo ({3 - products.length} vị trí còn trống)
                  </span>
                </button>
              )}
            </div>

            {/* =================================================
                SPECIFICATION COMPARISON TABLE (DYNAMIC ADAPTIVE)
            ================================================= */}
            <div
              className="mt-6 sm:mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              style={{
                minWidth: `${160 + products.length * 220 + (products.length < 3 ? 190 : 0)}px`,
              }}
            >
              <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 font-bold uppercase text-[11px] sm:text-xs tracking-wider flex items-center gap-2 sticky left-0 z-20">
                <Scale size={15} />
                <span>Bảng đối chiếu thông số phần cứng chi tiết</span>
              </div>

              {dynamicSpecRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid transition hover:bg-slate-50/80 ${
                    index !== dynamicSpecRows.length - 1 ? "border-b border-slate-150" : ""
                  }`}
                  style={{
                    gridTemplateColumns: `minmax(160px, 200px) ${products.map(() => "minmax(210px, 1fr)").join(" ")} ${
                      products.length < 3 ? "minmax(180px, 1fr)" : ""
                    }`,
                  }}
                >
                  {/* STICKY LABEL COLUMN */}
                  <div className="sticky left-0 z-10 flex items-center bg-slate-100/95 backdrop-blur-sm p-3 sm:p-4 text-[11.5px] sm:text-xs font-bold text-slate-800 border-r border-slate-200 shadow-[2px_0_6px_rgba(0,0,0,0.03)]">
                    {row.label}
                  </div>

                  {/* PRODUCT VALUE COLUMNS */}
                  {products.map((product) => {
                    const parsed = parseProductSpecs(product);
                    const value = row.getValue({ raw: product, parsed });

                    return (
                      <div
                        key={`${getProductId(product)}-${row.label}`}
                        className="flex min-h-[48px] sm:min-h-[56px] items-center border-r last:border-r-0 border-slate-200 p-3 sm:p-4 text-[11.5px] sm:text-xs font-medium leading-relaxed text-slate-700 break-words"
                      >
                        {value === "-" ? (
                          <span className="text-slate-400 italic">Không áp dụng</span>
                        ) : row.label === "Chế độ bảo hành" ? (
                          <span className="font-bold text-[#eb1c24] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                            {value}
                          </span>
                        ) : (
                          value
                        )}
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