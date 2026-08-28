import { Suspense } from "react";
import ReactDOM from "react-dom";
import ProductDetailClient from "@/components/product-detail/ProductDetailClient";
import { optimizeImageUrl } from "@/lib/imageOptimizer";

async function getProductData(slug) {
  if (!slug) return null;

  try {
    const baseUrl =
      process.env.INTERNAL_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${baseUrl}/products/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const slug = sp?.slug;

  if (!slug) {
    return {
      title: "Chi tiết sản phẩm | DUDI SOFTWARE",
      description: "Xem thông tin chi tiết sản phẩm chính hãng tại DUDI SOFTWARE.",
    };
  }

  const data = await getProductData(slug);
  const product = data?.product || data;

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | DUDI SOFTWARE",
      description: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.",
    };
  }

  const title = `${product.name} | DUDI SOFTWARE`;
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `${product.name} chính hãng giá tốt, bảo hành uy tín tại DUDI SOFTWARE.`;

  const rawImage =
    (Array.isArray(product.images) &&
      (typeof product.images[0] === "object"
        ? product.images[0]?.url
        : product.images[0])) ||
    product.thumbnail ||
    "/images/dudi/dudisoftware1.webp";

  const imageUrl = optimizeImageUrl(rawImage, { width: 800 });

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ searchParams }) {
  const sp = await searchParams;
  const slug = sp?.slug;

  const data = await getProductData(slug);
  const initialProduct = data?.product || data || null;
  const initialRelated = data?.relatedProducts || [];

  const rawMainImage = initialProduct
    ? (Array.isArray(initialProduct.images) &&
        (typeof initialProduct.images[0] === "object"
          ? initialProduct.images[0]?.url
          : initialProduct.images[0])) ||
      initialProduct.thumbnail
    : null;

  const lcpImageUrl = rawMainImage
    ? optimizeImageUrl(rawMainImage, { width: 800 })
    : null;

  if (lcpImageUrl) {
    ReactDOM.preload(lcpImageUrl, { as: "image", fetchPriority: "high" });
  }

  return (
    <>
      {lcpImageUrl && (
        <link
          rel="preload"
          as="image"
          href={lcpImageUrl}
          fetchPriority="high"
        />
      )}
      <Suspense
        fallback={
          <main className="flex min-h-screen items-center justify-center bg-slate-50 pt-20">
            <p className="font-semibold text-gray-500">
              Đang tải sản phẩm...
            </p>
          </main>
        }
      >
        <ProductDetailClient
          slug={slug}
          initialProduct={initialProduct}
          initialRelatedProducts={initialRelated}
        />
      </Suspense>
    </>
  );
}