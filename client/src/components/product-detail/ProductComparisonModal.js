"use client";

import {
  Search,
  X,
  Plus,
  Scale,
  Lightbulb,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { detectProductType, getProductTypeLabel } from "@/lib/specParser";
import { getProductImage } from "@/lib/productHelpers";
import { handleImageError } from "@/lib/imageFallback";

const ProductComparisonModal = ({
  isOpen,
  onClose,
  products = [],
  currentProduct,
  selectedProducts = [],
  onAddProduct,
}) => {
  const [keyword, setKeyword] =
    useState("");

  // =====================================================
  // RESET SEARCH
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      setKeyword("");
    }
  }, [isOpen]);

  // =====================================================
  // PRODUCT ID & TARGET TYPE
  // =====================================================

  const getProductId = (product) => {
    return (
      product?._id ||
      product?.id ||
      product?.slug
    );
  };

  const currentProductId =
    getProductId(currentProduct);

  const selectedIds = useMemo(() => {
    return selectedProducts
      .map((product) =>
        getProductId(product)
      )
      .filter(Boolean);
  }, [selectedProducts]);

  // Xác định loại sản phẩm đối chiếu (PC, Màn hình, Mainboard, Laptop,...)
  const referenceProduct =
    currentProduct ||
    (selectedProducts && selectedProducts.length > 0
      ? selectedProducts[0]
      : null);

  const targetType = referenceProduct ? detectProductType(referenceProduct) : null;
  const targetTypeLabel = targetType ? getProductTypeLabel(targetType) : null;

  // =====================================================
  // FILTER PRODUCTS (CHỈ LỌC SẢN PHẨM CÙNG LOẠI)
  // =====================================================

  const filteredProducts = useMemo(() => {
    const value = keyword
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const productId =
        getProductId(product);

      // Không hiển thị sản phẩm hiện tại
      if (
        currentProductId &&
        productId === currentProductId
      ) {
        return false;
      }

      // Không hiển thị sản phẩm đã chọn trong danh sách so sánh
      if (
        selectedIds.includes(productId)
      ) {
        return false;
      }

      // CHỈ HIỂN THỊ SẢN PHẨM CÙNG LOẠI (Bộ máy tính vs Bộ máy tính, Màn hình vs Màn hình,...)
      if (targetType) {
        const prodType = detectProductType(product);
        if (prodType !== targetType) {
          return false;
        }
      }

      // Không có từ khóa tìm kiếm -> lấy tất cả sản phẩm cùng loại
      if (!value) {
        return true;
      }

      const name = String(
        product?.name || ""
      ).toLowerCase();

      const sku = String(
        product?.sku || ""
      ).toLowerCase();

      const brand = String(
        product?.brand || ""
      ).toLowerCase();

      const shortDesc = String(
        product?.shortDescription || ""
      ).toLowerCase();

      return (
        name.includes(value) ||
        sku.includes(value) ||
        brand.includes(value) ||
        shortDesc.includes(value)
      );
    });
  }, [
    products,
    keyword,
    currentProductId,
    selectedIds,
    targetType,
  ]);

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    const value = Number(price || 0);

    return value > 0
      ? `${value.toLocaleString(
          "vi-VN"
        )} đ`
      : "Liên hệ";
  };

  // =====================================================
  // IMAGE
  // =====================================================

  const getImage = (product) => {
    return getProductImage(product);
  };

  // =====================================================
  // ADD
  // =====================================================

  const handleAdd = (product) => {
    if (!product) {
      return;
    }

    onAddProduct?.(product);
  };

  // =====================================================
  // CLOSE
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-slate-950/80
        p-4
        backdrop-blur-md
      "
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            bg-slate-50/80
            px-4
            py-4
            sm:px-6
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-red-50
              "
            >
              <Scale
                size={20}
                className="text-red-600"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Thêm sản phẩm so sánh
                </h2>
                {targetTypeLabel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100/80 text-red-700 font-bold text-[11px] border border-red-200">
                    {targetTypeLabel}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                {targetTypeLabel ? (
                  <span>
                    Chỉ hiển thị các sản phẩm cùng loại: <strong className="text-slate-800">{targetTypeLabel}</strong> ({filteredProducts.length} sản phẩm)
                  </span>
                ) : (
                  "Chọn sản phẩm bạn muốn so sánh"
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-slate-500
              transition
              hover:bg-slate-200
              hover:text-slate-900
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="shrink-0 px-4 pb-3 pt-5 sm:px-6 sm:pt-6">
          <div className="relative">
            <Search
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              placeholder="Nhập mã hoặc tên sản phẩm..."
              autoFocus
              className="
                h-12
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                pl-12
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-red-500
                focus:ring-1
                focus:ring-red-500
              "
            />
          </div>
        </div>

        {/* =================================================
            PRODUCT LIST
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            pb-6
            pt-2
            sm:px-6
          "
        >
          {filteredProducts.length ===
          0 ? (
            <div
              className="
                flex
                min-h-[250px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <Search
                size={36}
                className="mb-3 text-slate-300"
              />

              <p className="text-sm font-semibold text-slate-700">
                Không tìm thấy sản phẩm
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Thử tìm kiếm bằng tên sản
                phẩm, SKU hoặc thương hiệu
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredProducts.map(
                (item) => {
                  const image =
                    getImage(item);

                  const productId =
                    getProductId(item);

                  return (
                    <div
                      key={productId}
                      className="
                        group
                        flex
                        cursor-pointer
                        gap-4
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        p-4
                        transition
                        hover:border-red-500
                        hover:shadow-sm
                      "
                      onClick={() =>
                        handleAdd(item)
                      }
                    >
                      {/* IMAGE */}

                      <div
                        className="
                          h-24
                          w-24
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          border
                          border-slate-100
                          bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30
                          p-2
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <img
                          src={image}
                          alt={
                            item?.name ||
                            "Sản phẩm"
                          }
                          className="
                            h-full
                            w-full
                            object-contain
                            mix-blend-multiply
                            group-hover:scale-105
                            transition-transform
                            duration-300
                          "
                          loading="lazy"
                          onError={handleImageError}
                        />
                      </div>

                      {/* CONTENT */}

                      <div
                        className="
                          flex
                          min-w-0
                          flex-1
                          flex-col
                          justify-between
                        "
                      >
                        <div>
                          <h3
                            className="
                              line-clamp-2
                              text-sm
                              font-semibold
                              leading-5
                              text-slate-900
                              transition-colors
                              group-hover:text-red-600
                            "
                          >
                            {item?.name ||
                              "Tên sản phẩm"}
                          </h3>

                          {item?.sku && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              SKU: {item.sku}
                            </p>
                          )}

                          {item?.brand && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              Thương hiệu:{" "}
                              {item.brand}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 flex items-end justify-between gap-3">
                          <div className="flex min-w-0 flex-col">
                            <span className="text-base font-bold text-red-600">
                              {formatPrice(
                                item?.price
                              )}
                            </span>

                            {Number(
                              item?.originalPrice ||
                                0
                            ) >
                              Number(
                                item?.price ||
                                  0
                              ) && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(
                                  item?.originalPrice
                                )}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            aria-label={`Thêm ${
                              item?.name ||
                              ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdd(item);
                            }}
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-slate-100
                              text-red-600
                              shadow-sm
                              transition
                              hover:bg-red-600
                              hover:text-white
                            "
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-1
            border-t
            border-slate-200
            bg-slate-50
            px-4
            py-4
            text-[11px]
            text-slate-500
            sm:px-6
          "
        >
          <p className="flex items-center gap-2">
            <Lightbulb size={14} />

            Tìm kiếm theo mã máy hoặc tên
            sản phẩm để có kết quả chính xác
            nhất.
          </p>

          <p className="flex items-center gap-2">
            <Scale size={14} />

            Có thể chọn tối đa 3 sản phẩm để
            so sánh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonModal;