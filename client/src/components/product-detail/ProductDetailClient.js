"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductSpecifications from "./ProductSpecifications";
import StoreInfo from "./StoreInfo";
import WhyChooseUs from "./WhyChooseUs";
import NewsSection from "./NewsSection";
import SimilarProducts from "./SimilarProducts";
import { productAPI } from "@/lib/api";

export default function ProductDetailClient({
  slug,
  initialProduct = null,
  initialRelatedProducts = [],
}) {
  const router = useRouter();

  const [product, setProduct] = useState(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState(initialRelatedProducts);
  const [loading, setLoading] = useState(!initialProduct && Boolean(slug));

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | DUDI SOFTWARE`;
    }
  }, [product?.name]);

  /**
   * Fetch product from Database API if not provided via SSR
   */
  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    // Nếu đã có initialProduct khớp slug thì không cần fetch lại ngay
    if (initialProduct && initialProduct.slug === slug) {
      setProduct(initialProduct);
      setRelatedProducts(initialRelatedProducts);
      setLoading(false);
    } else {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await productAPI.getBySlug(slug);
          const data = response?.data?.data;
          const apiProduct = data?.product || data;

          if (apiProduct) {
            setProduct(apiProduct);
            setRelatedProducts(data?.relatedProducts || []);
          } else {
            setProduct(null);
          }
        } catch (error) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error?.message);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }

    const handleProductHidden = (e) => {
      const data = e.detail;
      if (!data) return;
      if (
        (data.slug && data.slug === slug) ||
        (data.id && product?._id && data.id === product._id) ||
        (data.resourceType === "product" && (data.action === "hide" || data.action === "delete"))
      ) {
        setProduct(null); // Chuyển sang màn hình thông báo sản phẩm không tồn tại / đã tạm ngừng kinh doanh
      }
    };

    window.addEventListener("app:product-hidden", handleProductHidden);
    window.addEventListener("app:resource-update", handleProductHidden);

    return () => {
      window.removeEventListener("app:product-hidden", handleProductHidden);
      window.removeEventListener("app:resource-update", handleProductHidden);
    };
  }, [slug, initialProduct]);

  const related = useMemo(() => {
    return relatedProducts;
  }, [relatedProducts]);

  /**
   * Không có slug
   */
  if (!slug) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
        <p className="font-semibold text-gray-500">
          Không tìm thấy sản phẩm
        </p>
      </main>
    );
  }

  /**
   * Không có sản phẩm sau khi tải xong
   */
  if (!loading && !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xs border border-gray-100 max-w-md">
          <p className="font-bold text-gray-800 text-lg mb-2">
            Không tìm thấy sản phẩm
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Sản phẩm này có thể đã bị xóa hoặc tạm ngừng kinh doanh.
          </p>
          <Link
            href="/product"
            className="inline-block bg-[#eb1c24] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const currentProduct = product || {
    _id: "init-loading",
    slug: slug || "",
    name: "Đang tải thông tin sản phẩm...",
    price: 0,
    thumbnail: "/images/dudi/dudisoftware1.webp",
    images: ["/images/dudi/dudisoftware1.webp"],
    categoryName: "Sản phẩm",
    stock: 1,
  };

  return (
    <main className="w-full min-h-screen bg-[#f8f9fa] py-4 sm:py-6">
      {/* =====================================================
          PRODUCT DETAIL
      ===================================================== */}
      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Breadcrumb + Back Button */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6 text-xs sm:text-[13px] text-gray-500 font-medium overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#eb1c24] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link href="/" className="hover:text-[#eb1c24] transition-colors">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href={`/product?category=${encodeURIComponent(currentProduct.categoryName || currentProduct.category || "")}`}
                className="hover:text-[#eb1c24] transition-colors uppercase font-semibold text-gray-600"
              >
                {currentProduct.categoryName || currentProduct.category || currentProduct.brand || "Sản phẩm"}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-bold text-gray-900 line-clamp-1 max-w-[320px] sm:max-w-md md:max-w-xl truncate">
                {currentProduct.name}
              </span>
            </div>
          </div>

          {/* =================================================
              80 / 20 LAYOUT
          ================================================= */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

            {/* =================================================
                LEFT - 80%

                Product
                Product Highlights
                Specifications
            ================================================= */}

            <div className="flex flex-col gap-6 lg:col-span-4">

              {/* ================= PRODUCT ================= */}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

                  {/* Product Gallery */}

                  <ProductGallery
                    key={currentProduct._id || currentProduct.slug}
                    product={currentProduct}
                  />

                  {/* Product Information */}

                  <ProductInfo
                    product={currentProduct}
                  />

                </div>
              </div>

              {/* ================= SPECIFICATIONS & DESCRIPTION ================= */}

              <ProductSpecifications
                product={currentProduct}
              />

            </div>

            {/* =================================================
                RIGHT - 20%

                Store
                News
                Why Choose Us
            ================================================= */}

            <aside className="flex flex-col gap-6 lg:col-span-1">

              {/* ================= STORE ================= */}

              <StoreInfo
                product={currentProduct}
              />

              {/* ================= NEWS ================= */}

              <NewsSection />

              {/* ================= WHY CHOOSE US ================= */}

              <WhyChooseUs />

            </aside>

          </div>
        </div>
      </section>

      {/* =====================================================
          SIMILAR PRODUCTS SLIDER
          Full width
      ===================================================== */}
      <section className="w-full bg-white border-t border-slate-200/80">
        <SimilarProducts products={related} />
      </section>

    </main>
  );
}
