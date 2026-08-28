import { Suspense } from "react";
import ReactDOM from "react-dom";
import NewsDetailClient from "@/components/news/NewsDetailClient";
import { optimizeImageUrl } from "@/lib/imageOptimizer";
import { NEWS_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { getDefaultArticleBySlug, DEFAULT_ARTICLES } from "@/lib/defaultNews";

async function getArticleData(slug) {
  if (!slug) return null;

  try {
    const baseUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api/v1";
    const res = await fetch(`${baseUrl}/news/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.article) {
        return json.data;
      }
    }
  } catch (error) {
    // API not reachable in SSR environment, fallback to default articles
  }

  // Fallback to default / mock dataset with fuzzy matching
  return getDefaultArticleBySlug(slug);
}

export async function generateMetadata({ params }) {
  const p = await params;
  const slug = p?.slug;

  if (!slug) {
    return {
      title: "Chi tiết bài viết | DUDI SOFTWARE",
      description:
        "Xem các bài viết tin tức công nghệ mới nhất tại DUDI SOFTWARE.",
    };
  }

  const data = await getArticleData(slug);
  const article = data?.article;

  if (!article) {
    return {
      title: "Không tìm thấy bài viết | DUDI SOFTWARE",
      description: "Bài viết này không tồn tại hoặc đã được gỡ bỏ.",
    };
  }

  const title = `${article.title} | DUDI SOFTWARE`;
  const cleanDescription = article.summary
    ? article.summary.replace(/<[^>]*>?/gm, "").slice(0, 160)
    : `${article.title} - Tin tức công nghệ, đánh giá và thủ thuật tại DUDI SOFTWARE.`;

  const rawImage = article.thumbnail || NEWS_FALLBACK_IMAGE;
  const imageUrl = optimizeImageUrl(rawImage, { width: 1200 });

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
      type: "article",
      publishedTime: article.createdAt,
      authors: [article.authorName || "DUDI SOFTWARE"],
      tags: article.tags || ["tin-tuc", "cong-nghe"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
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

export default async function NewsDetailPage({ params }) {
  const p = await params;
  const slug = p?.slug;

  const data = await getArticleData(slug);
  const initialArticle = data?.article || null;
  const initialRelated =
    data?.related ||
    DEFAULT_ARTICLES.filter((item) => item.slug !== slug);

  const rawThumbnail = initialArticle?.thumbnail || NEWS_FALLBACK_IMAGE;
  const lcpImageUrl = initialArticle
    ? optimizeImageUrl(rawThumbnail, { width: 1200 })
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
          <div className="bg-[#f8f9fa] min-h-screen pb-20 animate-pulse">
            <div className="relative min-h-[48vh] md:min-h-[58vh] w-full bg-[#0b0f19] pt-24 pb-12 md:pb-20 flex flex-col justify-end overflow-hidden">
              <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10 space-y-4">
                <div className="w-20 h-7 bg-white/10 rounded-lg"></div>
                <div className="w-24 h-5 bg-[#eb1c24]/50 rounded"></div>
                <div className="w-4/5 h-8 sm:h-10 bg-white/10 rounded-xl"></div>
                <div className="w-1/2 h-4 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        }
      >
        <NewsDetailClient
          slug={slug}
          initialArticle={initialArticle}
          initialRelatedArticles={initialRelated}
        />
      </Suspense>
    </>
  );
}
