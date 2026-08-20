"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/common/ToastContext";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";

import {
  Check,
  CheckCircle,
  Gift,
  Heart,
  Share2,
  ShoppingCart,
  Scale,
} from "lucide-react";

import BuyContactModal from "./BuyContactModal";
import ProductComparisonModal from "./ProductComparisonModal";
import ProductComparisonBar from "./ProductComparisonBar";

import staticProducts from "@/data/products.json";
import { parseProductSpecs } from "@/lib/specParser";

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const cartItems = useSelector(selectCartItems) || [];

  const isFavorite = cartItems.some(
    (item) =>
      (product?._id && item._id === product._id) ||
      (product?.id && (item.id === product.id || item._id === product.id)) ||
      (product?.slug && item.slug === product.slug)
  );

  const handleToggleFavorite = () => {
    if (!product) return;
    const productId = product._id || product.id || product.slug;
    if (isFavorite) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(addToCartAsync({ product, quantity: 1 }));
    }
  };

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const [isComparisonModalOpen, setIsComparisonModalOpen] =
    useState(false);

  // Danh sách sản phẩm đang so sánh
  const [comparisonProducts, setComparisonProducts] = useState([]);

  // =====================================================
  // SPECIFICATIONS & HIGHLIGHTS
  // =====================================================

  const specs = parseProductSpecs(product);

  const highlights = [
    {
      label: "CPU",
      value: specs.cpu,
    },
    {
      label: "RAM",
      value: specs.ram,
    },
    {
      label: "Ổ CỨNG",
      value: specs.ssd,
    },
    {
      label: "CARD MÀN HÌNH",
      value: specs.vga,
    },
    {
      label: "MAINBOARD",
      value: specs.mainboard,
    },
    {
      label: "NGUỒN",
      value: specs.psu,
    },
    {
      label: "COOLER",
      value: specs.cooler,
    },
    {
      label: "CASE",
      value: specs.caseBox,
    },
  ];

  // =====================================================
  // PRICE
  // =====================================================

  const price = Number(product?.price || 0);

  const originalPrice = Number(
    product?.originalPrice || 0
  );

  const discount =
    product?.discount ??
    (originalPrice > price && price > 0
      ? Math.round(
        ((originalPrice - price) / originalPrice) * 100
      )
      : 0);

  const saving =
    originalPrice > price
      ? originalPrice - price
      : 0;

  // =====================================================
  // HELPER
  // =====================================================

  const getProductId = (item) => {
    return (
      item?.slug ||
      item?._id ||
      item?.id
    );
  };

  // =====================================================
  // THÊM SẢN PHẨM HIỆN TẠI VÀO SO SÁNH
  // =====================================================

  const handleOpenComparison = () => {
    if (!product) return;

    const currentProductId =
      getProductId(product);

    const exists = comparisonProducts.some(
      (item) =>
        getProductId(item) === currentProductId
    );

    if (!exists) {
      setComparisonProducts([product]);
    }
  };

  // =====================================================
  // MỞ POPUP THÊM SẢN PHẨM
  // =====================================================

  const handleOpenAddProductModal = () => {
    if (comparisonProducts.length >= 3) {
      return;
    }

    setIsComparisonModalOpen(true);
  };

  // =====================================================
  // THÊM SẢN PHẨM VÀO BAR
  // =====================================================

  const handleAddComparisonProduct = (
    selectedProduct
  ) => {
    if (!selectedProduct) return;

    const selectedId =
      getProductId(selectedProduct);

    if (!selectedId) return;

    // Không vượt quá 3 sản phẩm
    if (comparisonProducts.length >= 3) {
      return;
    }

    // Không thêm trùng
    const alreadyExists =
      comparisonProducts.some(
        (item) =>
          getProductId(item) === selectedId
      );

    if (alreadyExists) {
      return;
    }

    setComparisonProducts((prev) => [
      ...prev,
      selectedProduct,
    ]);

    // Đóng popup
    setIsComparisonModalOpen(false);
  };

  // =====================================================
  // XÓA 1 SẢN PHẨM
  // =====================================================

  const handleRemoveComparison = (
    productId
  ) => {
    setComparisonProducts((prev) =>
      prev.filter(
        (item) =>
          getProductId(item) !== productId
      )
    );
  };

  // =====================================================
  // XÓA TẤT CẢ
  // =====================================================

  const handleClearComparison = () => {
    setComparisonProducts([]);
  };

  // =====================================================
  // SO SÁNH NGAY
  // =====================================================

  const handleCompare = () => {
    if (comparisonProducts.length < 2) {
      return;
    }

    /*
     * Lấy slug/id của các sản phẩm.
     *
     * Ưu tiên slug vì trang compare có thể
     * dùng slug để gọi productAPI.getBySlug().
     */
    const productIds = comparisonProducts
      .map((item) => getProductId(item))
      .filter(Boolean);

    if (productIds.length < 2) {
      return;
    }

    /*
     * Ví dụ:
     *
     * /compare?products=pc-gaming-1,pc-gaming-2
     */
    const query = productIds
      .map((id) => encodeURIComponent(id))
      .join(",");

    router.push(`/compare?products=${query}`);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-4">

        {/* HEADER */}
        <div className="flex w-full items-start justify-between gap-3">
          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 sm:text-xs">
            {product?.condition ||
              "Sản phẩm chính hãng"}
          </span>

          <button
            type="button"
            className="
              flex shrink-0 items-center gap-1.5
              rounded-full border border-slate-200
              px-3 py-1.5 text-xs text-slate-600
              transition
              hover:border-red-600
              hover:text-red-600
            "
          >
            <Share2 size={14} />
            Chia sẻ
          </button>
        </div>

        {/* TITLE */}
        <h1 className="w-full text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl lg:text-[26px]">
          {product?.name ||
            "Tên sản phẩm"}
        </h1>

        {/* META */}
        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          <span>
            Thương hiệu:{" "}
            <strong className="font-bold text-red-600">
              {product?.brand ||
                "CUSTOM"}
            </strong>
          </span>

          <span className="hidden text-slate-300 sm:block">
            |
          </span>

          <span>
            Tình trạng:{" "}
            <strong className="font-bold text-emerald-600">
              {product?.status ===
                "out_of_stock"
                ? "Hết hàng"
                : "Còn hàng"}
            </strong>
          </span>

          <span className="hidden text-slate-300 sm:block">
            |
          </span>

          <span>
            SKU: {product?.sku || "N/A"}
          </span>
        </div>

        {/* HIGHLIGHTS */}
        <div className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-slate-900">
            <span className="flex items-center justify-center">
              <svg
                className="h-4 w-4 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  fillRule="evenodd"
                />
              </svg>
            </span>

            Cấu hình nổi bật
          </h3>

          <div className="grid w-full grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="min-w-0"
              >
                <div className="mb-0.5 text-xs font-semibold uppercase text-slate-500">
                  {item.label}
                </div>

                <div className="break-words text-sm font-medium leading-relaxed text-slate-800">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="relative w-full overflow-hidden rounded-xl border border-red-200 bg-red-50/40">
          <div className="w-full p-4">
            <div className="mb-1 text-xs font-bold text-red-600 sm:text-sm">
              GIÁ ƯU ĐÃI ĐẶC BIỆT
            </div>

            <div className="flex w-full flex-wrap items-end gap-2.5">
              <span className="text-2xl font-extrabold tracking-tight text-red-600 sm:text-3xl lg:text-4xl">
                {price > 0
                  ? `${price.toLocaleString(
                    "vi-VN"
                  )}₫`
                  : "Liên hệ"}
              </span>

              {originalPrice > price && (
                <div className="flex flex-col pb-0.5">
                  <span className="text-xs text-slate-500 line-through sm:text-sm">
                    {originalPrice.toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </span>

                  <span className="mt-0.5 w-fit rounded border border-red-200 bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-500">
                    GIẢM {discount}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {saving > 0 && (
            <div className="flex w-full items-center gap-2 border-t border-green-100 bg-green-50 px-4 py-2.5 text-xs font-medium text-green-700">
              <CheckCircle
                size={16}
                className="shrink-0"
              />

              <span>
                Tiết kiệm ngay{" "}
                {saving.toLocaleString(
                  "vi-VN"
                )}
                ₫ so với giá gốc!
              </span>
            </div>
          )}
        </div>

        {/* PROMOTION */}
        <div className="w-full overflow-hidden rounded-xl border border-orange-200">
          <div className="flex w-full items-center gap-2 border-b border-orange-200 bg-orange-50 px-4 py-2.5 text-xs font-bold uppercase text-orange-700">
            <Gift size={15} />
            Khuyến mãi & Quà tặng kèm
          </div>

          <div className="w-full bg-white px-4 py-3">
            <div className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm">
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-orange-500"
              />

              <span className="break-words">
                {product?.promotion ||
                  "Combo phím + chuột Dareu"}
              </span>
            </div>
          </div>
        </div>

        {/* COMPARE / FAVORITE */}
        <div className="flex w-full gap-3">

          {/* SO SÁNH */}
          <button
            type="button"
            onClick={handleOpenComparison}
            className="
              flex h-11 flex-1 items-center
              justify-center gap-2 rounded-lg
              border-2 border-red-600
              px-3 text-xs font-bold uppercase
              text-red-600 transition
              hover:bg-red-50
              sm:text-sm
            "
          >
            <Scale size={17} />

            {comparisonProducts.length > 0
              ? `So sánh (${comparisonProducts.length}/3)`
              : "So sánh"}
          </button>

          {/* YÊU THÍCH */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`
              flex h-11 flex-1 items-center
              justify-center gap-2 rounded-lg
              border-2 border-red-600
              px-3 text-xs font-bold uppercase transition
              cursor-pointer sm:text-sm
              ${isFavorite
                ? "bg-red-600 text-white shadow-sm hover:bg-red-700"
                : "bg-transparent text-red-600 hover:bg-red-50"
              }
            `}
          >
            <Heart
              size={17}
              className={isFavorite ? "fill-white text-white" : "text-red-600"}
            />
            {isFavorite ? "Đã ưa thích" : "Ưa thích"}
          </button>
        </div>

        {/* BUY */}
        <button
          type="button"
          onClick={() =>
            setIsBuyModalOpen(true)
          }
          className="
            flex h-12 w-full items-center
            justify-center gap-2 rounded-lg
            bg-red-600 px-4
            text-base font-bold uppercase
            text-white shadow-sm transition
            hover:bg-red-700
            active:scale-[0.99]
          "
        >
          <ShoppingCart size={20} />
          Mua ngay
        </button>
      </div>

      {/* BUY MODAL */}
      <BuyContactModal
        isOpen={isBuyModalOpen}
        onClose={() =>
          setIsBuyModalOpen(false)
        }
      />

      {/* ADD PRODUCT MODAL */}
      <ProductComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() =>
          setIsComparisonModalOpen(false)
        }
        products={staticProducts}
        selectedProducts={comparisonProducts}
        currentProduct={product}
        onAddProduct={
          handleAddComparisonProduct
        }
      />

      {/* COMPARISON BAR */}
      <ProductComparisonBar
        products={comparisonProducts}
        maxProducts={3}
        onAddProduct={
          handleOpenAddProductModal
        }
        onRemove={
          handleRemoveComparison
        }
        onClear={
          handleClearComparison
        }
        onCompare={handleCompare}
      />
    </>
  );
};

export default ProductInfo;