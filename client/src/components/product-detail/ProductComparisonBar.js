"use client";

import {
  Scale,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";

const ProductComparisonBar = ({
  products = [],
  onRemove,
  onAddProduct,
  onClear,
  onCompare,
}) => {
  if (!products.length) {
    return null;
  }

  const formatPrice = (price) => {
    const value = Number(price || 0);

    return value > 0
      ? `${value.toLocaleString("vi-VN")}đ`
      : "Liên hệ";
  };

  const getImage = (product) => {
    if (
      Array.isArray(product?.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return (
      product?.thumbnail ||
      product?.image ||
      ""
    );
  };

  const getProductId = (product) => {
    return (
      product?._id ||
      product?.id ||
      product?.slug
    );
  };

  return (
    <section className="fixed bottom-0 left-0 right-0 z-[90] px-3 sm:px-4 md:px-8">
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          overflow-hidden
          rounded-t-2xl
          border
          border-slate-200
          border-b-0
          bg-white
          p-3
          shadow-[0_-4px_12px_rgba(0,0,0,0.10)]
          sm:p-4
          md:p-5
        "
      >
        {/* HEADER */}

        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <div className="flex min-w-0 items-center gap-2">
            <Scale
              size={21}
              className="shrink-0 text-red-600"
            />

            <h2 className="truncate text-sm font-bold uppercase text-red-600 sm:text-lg">
              So sánh sản phẩm
            </h2>

            <span className="shrink-0 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {products.length}/3
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClear}
              className="
                text-xs
                text-slate-500
                transition
                hover:text-slate-900
                hover:underline
                sm:text-sm
              "
            >
              Xóa tất cả
            </button>

            <button
              type="button"
              aria-label="Thu gọn"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
              "
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* PRODUCTS */}

        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {products.map((product) => {
            const productId =
              getProductId(product);

            const image =
              getImage(product);

            return (
              <div
                key={productId}
                className="
                  relative
                  flex
                  min-w-0
                  flex-1
                  items-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50/50
                  p-3
                "
              >
                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    onRemove?.(productId)
                  }
                  aria-label="Xóa sản phẩm"
                  className="
                    absolute
                    -right-2
                    -top-2
                    z-10
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-red-600
                    text-white
                    shadow-sm
                    transition
                    hover:bg-red-700
                  "
                >
                  <X size={14} />
                </button>

                <div className="flex w-full items-center gap-3">
                  {/* IMAGE */}

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      p-1
                    "
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={
                          product?.name ||
                          "Sản phẩm"
                        }
                        className="
                          h-full
                          w-full
                          object-contain
                        "
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        No image
                      </span>
                    )}
                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {product?.name ||
                        "Tên sản phẩm"}
                    </h3>

                    <span className="mt-1 block text-base font-bold text-red-600">
                      {formatPrice(
                        product?.price
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ADD PRODUCT */}

          {products.length < 3 && (
            <button
              type="button"
              onClick={onAddProduct}
              className="
                flex
                min-h-[80px]
                flex-1
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                transition
                hover:border-red-400
                hover:bg-red-50/30
              "
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-300
                    bg-white
                    text-red-600
                  "
                >
                  <Plus size={16} />
                </div>

                Thêm máy
              </div>
            </button>
          )}

          {/* COMPARE */}

          <button
            type="button"
            disabled={products.length < 2}
            onClick={onCompare}
            className={`
              flex
              min-h-[80px]
              shrink-0
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              px-7
              text-white
              shadow-sm
              transition

              ${
                products.length >= 2
                  ? "bg-red-600 hover:bg-red-700"
                  : "cursor-not-allowed bg-slate-300"
              }
            `}
          >
            <Scale size={27} />

            <span className="whitespace-nowrap text-xs font-bold uppercase">
              So sánh ngay
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductComparisonBar;