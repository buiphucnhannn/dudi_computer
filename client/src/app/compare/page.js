"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Plus,
  ShoppingCart,
  X,
  Trash2,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import staticProducts from "@/data/products.json";
import { productAPI } from "@/lib/api";


// =====================================================
// HELPER
// =====================================================

const getProductId = (product) => {
  return (
    product?.slug ||
    product?._id ||
    product?.id
  );
};

const getProductName = (product) => {
  return (
    product?.name ||
    product?.title ||
    "Sản phẩm"
  );
};

const getProductImage = (product) => {
  if (!product) return null;

  if (Array.isArray(product.images)) {
    return (
      product.images[0]?.url ||
      product.images[0] ||
      null
    );
  }

  return (
    product.image ||
    product.imageUrl ||
    null
  );
};

const getPrice = (product) => {
  const price = Number(
    product?.price || 0
  );

  return price > 0
    ? `${price.toLocaleString(
        "vi-VN"
      )}₫`
    : "Liên hệ";
};

const getOriginalPrice = (product) => {
  const price = Number(
    product?.originalPrice || 0
  );

  return price > 0
    ? `${price.toLocaleString(
        "vi-VN"
      )}₫`
    : null;
};


// =====================================================
// LẤY SPEC
// =====================================================

const getSpecifications = (product) => {
  const specifications =
    product?.specifications || [];

  const result = {};

  specifications.forEach((item) => {
    const name = String(
      item?.name ||
        item?.label ||
        ""
    ).trim();

    const value =
      item?.value ??
      item?.detail ??
      "";

    if (!name) return;

    result[name] = value;
  });

  return result;
};


// =====================================================
// TÌM SPEC THEO KEYWORD
// =====================================================

const findSpec = (
  product,
  keywords
) => {
  const specifications =
    product?.specifications || [];

  const item =
    specifications.find(
      (spec) => {
        const name = String(
          spec?.name ||
            spec?.label ||
            ""
        ).toLowerCase();

        return keywords.some(
          (keyword) =>
            name.includes(
              keyword.toLowerCase()
            )
        );
      }
    );

  return (
    item?.value ||
    item?.detail ||
    "Trống"
  );
};


// =====================================================
// SPEC ROWS
// =====================================================

const SPEC_ROWS = [
  {
    label: "Mainboard",
    keywords: [
      "mainboard",
      "main",
      "bo mạch chủ",
    ],
  },
  {
    label: "CPU",
    keywords: [
      "cpu",
      "bộ xử lý",
      "processor",
    ],
  },
  {
    label: "RAM",
    keywords: [
      "ram",
      "memory",
      "bộ nhớ",
    ],
  },
  {
    label: "Ổ cứng",
    keywords: [
      "ssd",
      "storage",
      "ổ cứng",
      "hdd",
    ],
  },
  {
    label: "VGA",
    keywords: [
      "vga",
      "gpu",
      "card màn hình",
      "graphics",
    ],
  },
  {
    label: "Nguồn",
    keywords: [
      "psu",
      "nguồn",
      "power supply",
    ],
  },
  {
    label: "Tản nhiệt",
    keywords: [
      "cooler",
      "tản nhiệt",
      "tản",
    ],
  },
  {
    label: "Vỏ Case",
    keywords: [
      "case",
      "vỏ case",
      "thùng máy",
    ],
  },
];


// =====================================================
// COMPARE CONTENT
// =====================================================

function CompareContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const productsParam =
    searchParams.get("products");

  const productIds = useMemo(() => {
    if (!productsParam) {
      return [];
    }

    return productsParam
      .split(",")
      .map((id) =>
        decodeURIComponent(
          id.trim()
        )
      )
      .filter(Boolean)
      .slice(0, 3);
  }, [productsParam]);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      setLoading(true);

      try {
        const loadedProducts =
          await Promise.all(
            productIds.map(
              async (id) => {

                /*
                 * 1. Ưu tiên tìm trong staticProducts
                 */
                const staticProduct =
                  staticProducts.find(
                    (item) =>
                      item.slug === id ||
                      item._id === id ||
                      item.id === id
                  );

                /*
                 * 2. Thử lấy API
                 *
                 * Nếu API lỗi thì sử dụng
                 * staticProducts.
                 */
                try {
                  const response =
                    await productAPI.getBySlug(
                      id
                    );

                  const data =
                    response?.data?.data;

                  const apiProduct =
                    data?.product;

                  if (apiProduct) {
                    return apiProduct;
                  }
                } catch (error) {
                  console.info(
                    `[Compare] Không lấy được API cho ${id}`
                  );
                }

                return (
                  staticProduct || null
                );
              }
            )
          );

        if (!cancelled) {
          setProducts(
            loadedProducts.filter(Boolean)
          );
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


  // =====================================================
  // XÓA 1 PRODUCT
  // =====================================================

  const handleRemoveProduct = (
    productId
  ) => {
    const nextProducts =
      products.filter(
        (product) =>
          getProductId(product) !==
          productId
      );

    if (nextProducts.length === 0) {
      router.push(
        "/compare"
      );
      return;
    }

    const ids = nextProducts
      .map(getProductId)
      .filter(Boolean);

    router.replace(
      `/compare?products=${ids
        .map((id) =>
          encodeURIComponent(id)
        )
        .join(",")}`
    );
  };


  // =====================================================
  // XÓA TẤT CẢ
  // =====================================================

  const handleClearAll = () => {
    router.push("/compare");
  };


  // =====================================================
  // THÊM PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    /*
     * Hiện tại quay lại trang sản phẩm.
     *
     * Bạn có thể thay bằng popup
     * ProductComparisonModal nếu muốn
     * dùng chung component.
     */
    router.back();
  };


  // =====================================================
  // MUA NGAY
  // =====================================================

  const handleBuy = (
    product
  ) => {
    const id =
      product?.slug ||
      product?._id ||
      product?.id;

    if (!id) return;

    router.push(
      `/product?slug=${encodeURIComponent(
        id
      )}`
    );
  };


  // =====================================================
  // EMPTY
  // =====================================================

  if (
    !loading &&
    products.length === 0
  ) {
    return (
      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Plus
              size={34}
              className="text-slate-400"
            />
          </div>

          <h1 className="text-2xl font-extrabold uppercase text-slate-900">
            Chưa có sản phẩm
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Hãy thêm ít nhất 2 sản phẩm
            để bắt đầu so sánh.
          </p>

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mt-6 flex h-11 items-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold uppercase text-white transition hover:bg-red-700"
          >
            <ArrowLeft size={17} />
            Quay lại
          </button>
        </div>
      </main>
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 pt-20">

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-20 pt-8 lg:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">

          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-red-600 sm:text-4xl">
              So sánh cấu hình
            </h1>

            <p className="mt-2 text-base text-slate-500">
              So sánh chi tiết các thông số
              kỹ thuật
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex w-fit items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-red-600"
          >
            <Trash2 size={17} />
            Xóa tất cả
          </button>
        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center text-sm text-slate-500">
            Đang tải thông tin sản phẩm...
          </div>
        )}


        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {!loading && (
          <div className="w-full overflow-x-auto pb-3">

            <div
              className="
                grid
                min-w-[900px]
                grid-cols-4
                gap-5
              "
            >

              {/* LABEL COLUMN */}

              <div className="hidden flex-col justify-end pb-6 md:flex">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thông số kỹ thuật
                </span>
              </div>


              {/* PRODUCTS */}

              {products.map(
                (product) => {
                  const id =
                    getProductId(
                      product
                    );

                  const image =
                    getProductImage(
                      product
                    );

                  return (
                    <div
                      key={id}
                      className="
                        group
                        relative
                        flex
                        min-h-[430px]
                        flex-col
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        transition
                        hover:border-red-500
                        hover:shadow-md
                      "
                    >

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveProduct(
                            id
                          )
                        }
                        className="
                          absolute
                          right-4
                          top-4
                          z-10
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-slate-100
                          text-slate-500
                          opacity-100
                          transition
                          hover:bg-red-600
                          hover:text-white
                          md:opacity-0
                          md:group-hover:opacity-100
                        "
                      >
                        <X size={15} />
                      </button>


                      {/* IMAGE */}

                      <div className="mb-5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                        {image ? (
                          <img
                            src={image}
                            alt={getProductName(
                              product
                            )}
                            className="h-full w-full object-contain mix-blend-multiply"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <ShoppingCart
                              size={32}
                            />

                            <span className="mt-2 text-xs">
                              Chưa có hình ảnh
                            </span>
                          </div>
                        )}
                      </div>


                      {/* NAME */}

                      <h3 className="mb-3 line-clamp-2 min-h-[56px] text-base font-bold leading-7 text-slate-900">
                        {getProductName(
                          product
                        )}
                      </h3>


                      {/* PRICE */}

                      <div className="mb-5 flex flex-col gap-1">
                        {getOriginalPrice(
                          product
                        ) && (
                          <span className="text-sm text-slate-400 line-through">
                            {getOriginalPrice(
                              product
                            )}
                          </span>
                        )}

                        <span className="text-xl font-extrabold text-red-600">
                          {getPrice(
                            product
                          )}
                        </span>
                      </div>


                      {/* BUY */}

                      <button
                        type="button"
                        onClick={() =>
                          handleBuy(
                            product
                          )
                        }
                        className="
                          mt-auto
                          flex
                          h-11
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-red-600
                          text-sm
                          font-bold
                          uppercase
                          text-white
                          transition
                          hover:bg-red-700
                        "
                      >
                        <ShoppingCart
                          size={17}
                        />

                        Mua ngay
                      </button>
                    </div>
                  );
                }
              )}


              {/* ADD PRODUCT */}

              {products.length < 3 && (
                <button
                  type="button"
                  onClick={
                    handleAddProduct
                  }
                  className="
                    flex
                    min-h-[430px]
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    p-5
                    transition
                    hover:border-red-500
                    hover:bg-red-50/30
                  "
                >
                  <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-red-600">
                    <Plus size={30} />
                  </span>

                  <span className="text-sm font-bold uppercase text-slate-500">
                    Thêm sản phẩm
                  </span>
                </button>
              )}

            </div>


            {/* =================================================
                SPECIFICATION TABLE
            ================================================= */}

            <div className="mt-8 min-w-[900px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {SPEC_ROWS.map(
                (row, index) => (
                  <div
                    key={row.label}
                    className={`
                      grid
                      grid-cols-4
                      transition
                      hover:bg-slate-50
                      ${
                        index !==
                        SPEC_ROWS.length - 1
                          ? "border-b border-slate-200"
                          : ""
                      }
                    `}
                  >

                    {/* LABEL */}

                    <div className="flex items-center bg-slate-100 p-4 text-sm font-bold text-slate-900">
                      {row.label}
                    </div>


                    {/* PRODUCT VALUES */}

                    {products.map(
                      (product) => (
                        <div
                          key={`${getProductId(
                            product
                          )}-${row.label}`}
                          className="flex min-h-[64px] items-center border-l border-slate-200 p-4 text-sm leading-relaxed text-slate-600"
                        >
                          {findSpec(
                            product,
                            row.keywords
                          )}
                        </div>
                      )
                    )}


                    {/* EMPTY COLUMNS */}

                    {Array.from({
                      length:
                        3 -
                        products.length,
                    }).map(
                      (_, emptyIndex) => (
                        <div
                          key={`empty-${row.label}-${emptyIndex}`}
                          className="flex min-h-[64px] items-center justify-center border-l border-slate-200 bg-slate-50 p-4"
                        >
                          <span className="text-sm italic text-slate-400">
                            Trống
                          </span>
                        </div>
                      )
                    )}

                  </div>
                )
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}


// =====================================================
// PAGE
// =====================================================

const Page = () => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <p className="font-semibold text-slate-500">
            Đang tải trang so sánh...
          </p>
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  );
};

export default Page;