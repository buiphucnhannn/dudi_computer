"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductGallery from "../../components/product-detail/ProductGallery";
import ProductInfo from "../../components/product-detail/ProductInfo";
import ProductHighlights from "../../components/product-detail/ProductHighlights";
import ProductSpecifications from "../../components/product-detail/ProductSpecifications";
import StoreInfo from "../../components/product-detail/StoreInfo";
import WhyChooseUs from "../../components/product-detail/WhyChooseUs";
import NewsSection from "../../components/product-detail/NewsSection";
import RelatedProducts from "../../components/product-detail/RelatedProducts";

import staticProducts from "@/data/products.json";
import { productAPI } from "@/lib/api";

/**
 * Tìm sản phẩm trong products.json
 * nếu API không tìm thấy hoặc API bị lỗi.
 */
const findStaticProduct = (slug) =>
  staticProducts.find(
    (item) =>
      item.slug === slug ||
      item._id === slug ||
      item.id === slug
  );

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState(() =>
    slug ? findStaticProduct(slug) || null : null
  );

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(slug));

  /**
   * Fetch product
   */
  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    // Tìm fallback trước
    const fallback = findStaticProduct(slug);

    if (fallback) {
      setProduct(fallback);
    }

    const fetchProduct = async () => {
      setLoading(true);

      try {
        const response = await productAPI.getBySlug(slug);

        const data = response?.data?.data;
        const apiProduct = data?.product;

        if (apiProduct) {
          setProduct(apiProduct);

          setRelatedProducts(
            data?.relatedProducts || []
          );
        } else {
          setProduct(fallback || null);
        }
      } catch (error) {
        console.info(
          "[Database] Sử dụng products.json:",
          error.message
        );

        setProduct(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  /**
   * Related products
   *
   * Nếu API có relatedProducts thì dùng API.
   *
   * Nếu không có thì lấy từ products.json
   * cùng category.
   */
  const related = useMemo(() => {
    if (relatedProducts.length > 0) {
      return relatedProducts;
    }

    if (!product) {
      return [];
    }

    return staticProducts
      .filter(
        (item) =>
          item._id !== product._id &&
          item.id !== product.id &&
          item.slug !== product.slug &&
          item.categoryName === product.categoryName
      )
      .slice(0, 4);
  }, [product, relatedProducts]);

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
    <main className="w-full min-h-screen bg-slate-50 pt-20">

      {/* =====================================================
          PRODUCT DETAIL
      ===================================================== */}

      <section className="w-full bg-slate-50">

        <div className="mx-auto w-full max-w-7xl px-4 py-10 lg:px-10">

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

              {/* =================================================
                  PRODUCT HIGHLIGHTS

                  Cấu hình nổi bật
                  Hỗ trợ thanh toán
                  Hỗ trợ trả góp
              ================================================= */}

              <ProductHighlights
                product={product}
              />

              {/* ================= SPECIFICATIONS ================= */}

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
    </Suspense>
  );
};

export default Page;