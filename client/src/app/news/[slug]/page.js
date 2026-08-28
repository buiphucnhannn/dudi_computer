import NewsDetailClient from "@/components/news/NewsDetailClient";
import { newsAPI } from "@/lib/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await newsAPI.getBySlug(slug);
    const article = res.data?.data?.article;
    if (article?.title) {
      return {
        title: {
          absolute: `${article.title} | DUDI SOFTWARE`,
        },
        description: article.summary || article.title,
        openGraph: {
          title: article.title,
          description: article.summary || article.title,
          images: article.thumbnail ? [{ url: article.thumbnail }] : [],
        },
      };
    }
  } catch (_) {}

  return {
    title: {
      absolute: "Tin Tức Công Nghệ | DUDI SOFTWARE",
    },
    description: "Cập nhật tin tức công nghệ mới nhất từ DUDI SOFTWARE.",
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  let initialArticle = null;
  let initialRelated = [];

  try {
    const res = await newsAPI.getBySlug(slug);
    if (res.data && res.data.data) {
      initialArticle = res.data.data.article || null;
      initialRelated = res.data.data.related || [];
    }
  } catch (error) {
    console.warn("SSR: Không thể fetch tin tức trên server, chuyển sang client fallback:", error?.message);
  }

  return (
    <NewsDetailClient
      initialArticle={initialArticle}
      initialRelated={initialRelated}
      slug={slug}
    />
  );
}
