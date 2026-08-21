"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProductGallery from "../../components/product-detail/ProductGallery";
import ProductInfo from "../../components/product-detail/ProductInfo";
import ProductHighlights from "../../components/product-detail/ProductHighlights";
import ProductSpecifications from "../../components/product-detail/ProductSpecifications";
import StoreInfo from "../../components/product-detail/StoreInfo";
import WhyChooseUs from "../../components/product-detail/WhyChooseUs";
import NewsSection from "../../components/product-detail/NewsSection";
import RelatedProducts from "../../components/product-detail/RelatedProducts";
import SimilarProducts from "@/components/product-detail/SimilarProducts";
import { productAPI } from "@/lib/api";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(slug));

  /**
   * Fetch product from Database API
   */
  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

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
        console.error("Lỗi khi tải chi tiết sản phẩm:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

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
   * Loading
   */
  if (loading && !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
        <p className="font-semibold text-gray-500">
          Đang tải sản phẩm...
        </p>
      </main>
    );
  }

  /**
   * Product không tồn tại
   */
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
        <p className="font-semibold text-gray-500">
          Không tìm thấy sản phẩm
        </p>
      </main>
    );
  }

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
                href={`/product?category=${encodeURIComponent(product.categoryName || product.category || "")}`}
                className="hover:text-[#eb1c24] transition-colors uppercase font-semibold text-gray-600"
              >
                {product.categoryName || product.category || product.brand || "Sản phẩm"}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="font-bold text-gray-900 line-clamp-1 max-w-[320px] sm:max-w-md md:max-w-xl truncate">
                {product.name}
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
                    key={product._id || product.slug}
                    product={product}
                  />

                  {/* Product Information */}

                  <ProductInfo
                    product={product}
                  />

                </div>
              </div>

              {/* ================= SPECIFICATIONS & DESCRIPTION ================= */}

              <ProductSpecifications
                product={product}
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
                product={product}
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
          RELATED PRODUCTS
          Full width
      ===================================================== */}

      <section className="w-full bg-white">

        <RelatedProducts
          products={related}
        />

      </section>

    </main>
  );
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
          <p className="font-semibold text-gray-500">
            Đang tải sản phẩm...
          </p>
        </main>
      }
    >
      <ProductDetailContent />
      <SimilarProducts />
    </Suspense>
  );
};

export default Page;