"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/common/ToastContext";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin } from "@/redux/slices/authSlice";
import {
  Check,
  CheckCircle,
  Gift,
  Heart,
  Share2,
  ShoppingCart,
  Scale,
} from "lucide-react";

import OrderCheckoutModal from "@/components/cart/OrderCheckoutModal";
import { useCompare } from "@/components/common/CompareContext";
import { parseProductSpecs } from "@/lib/specParser";
import { getCleanBrandName } from "@/lib/productHelpers";

const ProductInfo = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { compareItems, addToCompare, isComparing } = useCompare();
  const cartItems = useSelector(selectCartItems) || [];
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCart = cartItems.some(
    (item) =>
      (product?._id && item._id === product._id) ||
      (product?.id && (item.id === product.id || item._id === product.id)) ||
      (product?.slug && item.slug === product.slug)
  );

  const isOutOfStock = typeof product?.stock === "number" && product.stock <= 0;

  const handleToggleCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      showToast({
        title: "Sản phẩm đã hết hàng",
        message: `Sản phẩm "${product.name}" hiện đã hết hàng trong kho.`,
        type: "warning",
      });
      return;
    }
    dispatch(addToCartAsync({ product, quantity: 1 }));
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${product.name}" vào giỏ hàng (+1)!`,
      type: "success",
    });
  };

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Tự động mở Modal Đặt Hàng nếu quay về từ Login với cờ buyNow=true
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("buyNow") === "true") {
        setIsBuyModalOpen(true);
      }
    }
  }, [isAuthenticated]);

  // =====================================================
  // SPECIFICATIONS & HIGHLIGHTS
  // =====================================================

  const specs = parseProductSpecs(product);
  const highlights = specs.highlights || [];

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
  // THÊM SẢN PHẨM HIỆN TẠI VÀO SO SÁNH
  // =====================================================

  const handleOpenComparison = () => {
    if (!product) return;
    addToCompare(product);
  };

  const handleShare = async () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const title = product?.name || "Chi tiết sản phẩm - ZComputer";
    const text = `Xem sản phẩm ${product?.name || ""} tại ZComputer với giá ưu đãi!`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: currentUrl,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log("Web Share API cancelled or not supported, fallback to clipboard.");
        } else {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast({
        title: "Đã sao chép liên kết",
        message: "Đã sao chép đường dẫn sản phẩm vào bộ nhớ tạm thành công!",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Không thể sao chép",
        message: "Vui lòng sao chép liên kết sản phẩm trực tiếp từ thanh địa chỉ.",
        type: "error",
      });
    }
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
            onClick={handleShare}
            className="
              flex shrink-0 items-center gap-1.5
              rounded-full border border-slate-200
              px-3 py-1.5 text-xs text-slate-600
              transition
              hover:border-red-600
              hover:text-red-600
              cursor-pointer active:scale-95
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
              {getCleanBrandName(product)}
            </strong>
          </span>

          <span className="hidden text-slate-300 sm:block">
            |
          </span>

          <span>
            Tình trạng:{" "}
            <strong className={`font-bold ${isOutOfStock ? "text-red-600" : "text-emerald-600"}`}>
              {isOutOfStock
                ? "Hết hàng"
                : typeof product?.stock === "number"
                ? `Còn hàng (Kho: ${product.stock})`
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

        {/* COMPARE / FAVORITE / CART / BUY */}
        {mounted && isAdmin ? (
          /* Giao diện dành riêng cho Admin: Chỉ có nút So sánh, ẩn hoàn toàn chức năng mua hàng */
          <div className="flex w-full">
            <button
              type="button"
              onClick={handleOpenComparison}
              className="
                flex h-11 w-full items-center
                justify-center gap-2 rounded-lg
                border-2 border-red-600
                px-3 text-xs font-bold uppercase
                text-red-600 transition
                hover:bg-red-50
                sm:text-sm cursor-pointer
              "
            >
              <Scale size={17} />
              {compareItems.length > 0
                ? `So sánh cấu hình (${compareItems.length}/3)`
                : "So sánh cấu hình"}
            </button>
          </div>
        ) : (
          /* Giao diện đầy đủ dành cho Khách hàng thông thường */
          <>
            <div className="flex w-full gap-3">
              {/* SO SÁNH */}
              <button
                type="button"
                onClick={handleOpenComparison}
                className={`
                  flex h-11 items-center
                  justify-center gap-2 rounded-lg
                  border-2 border-red-600
                  px-3 text-xs font-bold uppercase
                  text-red-600 transition
                  hover:bg-red-50
                  sm:text-sm cursor-pointer
                  ${isOutOfStock ? "w-full" : "flex-1"}
                `}
              >
                <Scale size={17} />
                {compareItems.length > 0
                  ? `So sánh (${compareItems.length}/3)`
                  : "So sánh"}
              </button>

              {/* ADD TO CART - CHỈ HIỂN THỊ KHI CÒN HÀNG */}
              {!isOutOfStock && (
                <button
                  type="button"
                  onClick={handleToggleCart}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-transparent text-red-600 hover:bg-red-50 px-3 text-xs font-bold uppercase transition cursor-pointer sm:text-sm active:scale-95"
                >
                  <ShoppingCart size={17} className="text-red-600" />
                  <span>Thêm vào giỏ</span>
                </button>
              )}
            </div>

            {/* BUY - CHỈ HIỂN THỊ KHI CÒN HÀNG / HIỂN THỊ THÔNG BÁO KHI HẾT HÀNG */}
            {isOutOfStock ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-3.5 px-4 text-slate-600 font-bold text-sm select-none">
                <span>Sản phẩm này hiện đang tạm hết hàng</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    showToast({
                      title: "Yêu cầu đăng nhập",
                      message: "Vui lòng đăng nhập để tiến hành đặt hàng.",
                      type: "warning",
                    });
                    const currentPath = typeof window !== "undefined"
                      ? (window.location.pathname + window.location.search)
                      : (product?.slug ? `/product-detail?slug=${product.slug}` : "/");
                    const redirectTarget = currentPath.includes("buyNow")
                      ? currentPath
                      : `${currentPath}${currentPath.includes("?") ? "&" : "?"}buyNow=true`;
                    router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
                    return;
                  }
                  setIsBuyModalOpen(true);
                }}
                className="
                  flex h-12 w-full items-center
                  justify-center gap-2 rounded-lg
                  bg-red-600 px-4
                  text-base font-bold uppercase
                  text-white shadow-sm transition
                  hover:bg-red-700
                  active:scale-[0.99] cursor-pointer
                "
              >
                <ShoppingCart size={20} />
                Mua ngay
              </button>
            )}
          </>
        )}
      </div>

      {/* BUY CHECKOUT MODAL */}
      <OrderCheckoutModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        prefilledProduct={product}
      />
    </>
  );
};

export default ProductInfo;