import { Suspense } from "react";
import ReactDOM from "react-dom";
import NewsContent from "@/components/news/NewsContent";
import { optimizeImageUrl } from "@/lib/imageOptimizer";
import { NEWS_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { DEFAULT_ARTICLES } from "@/lib/defaultNews";

async function getNewsData() {
  try {
    const baseUrl =
      process.env.INTERNAL_API_URL || "http://localhost:5000/api/v1";
    const res = await fetch(`${baseUrl}/news`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.news && json.data.news.length > 0) {
        return json.data.news;
      }
      if (Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error) {
    // API not reachable in SSR, fallback to default news
  }

  return DEFAULT_ARTICLES;
}

export const metadata = {
  title: "Tin Tức Công Nghệ & Thủ Thuật | DUDI SOFTWARE",
  description:
    "Cập nhật tin tức công nghệ mới nhất, đánh giá phần cứng máy tính, kinh nghiệm build PC và mẹo vặt hữu ích từ DUDI SOFTWARE.",
  openGraph: {
    title: "Tin Tức Công Nghệ & Thủ Thuật | DUDI SOFTWARE",
    description:
      "Cập nhật tin tức công nghệ mới nhất, đánh giá phần cứng máy tính và hướng dẫn build PC.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Tin Tức Công Nghệ DUDI SOFTWARE",
      },
    ],
  },
};

export default async function NewsPage() {
  const initialNews = await getNewsData();
  const featuredArticle = initialNews.length > 0 ? initialNews[0] : null;

  const rawFeaturedImage =
    featuredArticle?.thumbnail || NEWS_FALLBACK_IMAGE;
  const lcpImageUrl = rawFeaturedImage
    ? optimizeImageUrl(rawFeaturedImage, { width: 800 })
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
          <div className="bg-[#f4f6f8] min-h-screen pb-20 animate-pulse">
            <div className="relative bg-[#0b0f19] pt-20 pb-16 md:pt-28 md:pb-24 text-white text-center">
              <div className="h-10 bg-white/10 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        }
      >
        <NewsContent initialNews={initialNews} />
      </Suspense>
    </>
  );
}
