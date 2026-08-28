"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Tag,
  Share2,
  TrendingUp,
  PhoneCall,
  Flame,
  Check,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { handleImageError, NEWS_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { optimizeImageUrl } from "@/lib/imageOptimizer";
import { newsAPI } from "@/lib/api";

export default function NewsDetailClient({
  slug,
  initialArticle = null,
  initialRelatedArticles = [],
}) {
  const router = useRouter();
  const [article, setArticle] = useState(initialArticle);
  const [relatedArticles] = useState(initialRelatedArticles);
  const [copied, setCopied] = useState(false);
  // loading chỉ true khi SSR không lấy được article → cần client fetch
  const [loading, setLoading] = useState(!initialArticle && !!slug);

  // Đồng bộ tab title với tên bài viết thực
  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | DUDI SOFTWARE`;
    }
  }, [article?.title]);

  // Client-side fallback fetch: khi SSR không lấy được article (Vercel không có INTERNAL_API_URL)
  useEffect(() => {
    if (initialArticle || !slug) return;
    let cancelled = false;
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await newsAPI.getBySlug(slug);
        if (!cancelled) {
          const data = res.data?.data;
          if (data?.article) {
            setArticle(data.article);
          }
        }
      } catch (err) {
        // Giữ article = null → hiện "Không tìm thấy"
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchArticle();
    return () => { cancelled = true; };
  }, [slug, initialArticle]);

  // Lắng nghe sự kiện admin ẩn/xóa bài viết để cập nhật real-time
  useEffect(() => {
    const handleNewsHidden = (e) => {
      const data = e.detail;
      if (!data) return;
      if (
        (data.slug && data.slug === slug) ||
        (data.resourceType === "news_category" &&
          article?.category &&
          data.name === article.category) ||
        (data.resourceType === "news" &&
          (data.action === "hide" || data.action === "delete"))
      ) {
        setArticle(null);
      }
    };

    window.addEventListener("app:news-hidden", handleNewsHidden);
    window.addEventListener("app:resource-update", handleNewsHidden);

    return () => {
      window.removeEventListener("app:news-hidden", handleNewsHidden);
      window.removeEventListener("app:resource-update", handleNewsHidden);
    };
  }, [slug, article?.category]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Skeleton loading khi đang client-fetch
  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen pb-20 animate-pulse">
        <div className="relative min-h-[48vh] md:min-h-[58vh] w-full bg-[#0b0f19] pt-24 pb-12 md:pb-20 flex flex-col justify-end overflow-hidden">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10 space-y-4">
            <div className="w-20 h-7 bg-white/10 rounded-lg"></div>
            <div className="w-24 h-5 bg-[#eb1c24]/50 rounded"></div>
            <div className="w-4/5 h-8 sm:h-10 bg-white/10 rounded-xl"></div>
            <div className="w-1/2 h-4 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-20 -mt-8 md:-mt-12">
          <div className="bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 space-y-6">
            <div className="h-16 bg-red-50/50 rounded-xl w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="aspect-[16/9] bg-gray-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-black text-gray-800 mb-3">
              Không tìm thấy bài viết
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Bài viết này không tồn tại hoặc đã được chuyển sang đường dẫn khác.
            </p>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 bg-[#dc2626] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang tin tức</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bgThumbnail = article.thumbnail || "/post-3.webp";

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* 1. HERO BANNER VỚI ẢNH NỀN THUMBNAIL CỦA BÀI VIẾT */}
      <div className="relative min-h-[48vh] md:min-h-[58vh] w-full bg-black pt-24 pb-12 md:pb-20 flex flex-col justify-end overflow-hidden">
        {/* Ảnh thumbnail thật của bài viết làm nền - img với explicit width/height tránh CLS */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optimizeImageUrl(bgThumbnail || NEWS_FALLBACK_IMAGE, { width: 1200, quality: 70 })}
            alt={article.title}
            width={1200}
            height={630}
            fetchPriority="high"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
            onError={(e) => { e.currentTarget.src = NEWS_FALLBACK_IMAGE; }}
          />
          {/* Lớp gradient phủ mờ từ dưới lên */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/50 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10">
          {/* Nút 'Trở về' */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white mb-5 font-medium text-sm transition-all w-max bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Trở về</span>
          </button>

          {/* Badge danh mục */}
          <div className="inline-flex mb-3 sm:mb-4">
            <span className="bg-[#dc2626] text-white font-bold text-[10px] md:text-xs uppercase px-3 py-1 rounded shadow-lg">
              {article.category || "TIN CÔNG NGHỆ"}
            </span>
          </div>

          {/* Tiêu đề bài viết */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] font-black text-white leading-snug sm:leading-tight mb-4 md:mb-5 max-w-5xl drop-shadow-md [text-wrap:balance]">
            {article.title}
          </h1>

          {/* Meta tác giả, ngày, lượt xem */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-1.5 md:gap-2">
              <User size={14} className="md:w-4 md:h-4 text-[#dc2626]" />
              <span>{article.authorName || "Admin DUDI SOFTWARE"}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Calendar size={15} />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Eye size={15} />
              <span>{article.views || 21} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NỘI DUNG CHI TIẾT & SIDEBAR */}
      <div className="container mx-auto px-4 relative z-20 -mt-8 md:-mt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT (8/12 hoặc 9/12) */}
          <main className="lg:w-8/12 xl:w-9/12 min-w-0 bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 lg:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            {/* Excerpt tóm tắt */}
            {article.summary && (
              <div className="bg-red-50/70 border-l-4 border-[#dc2626] p-5 md:p-6 rounded-r-xl mb-8 text-gray-800 text-base md:text-lg font-medium italic break-words">
                {article.summary}
              </div>
            )}

            {/* Main HTML Content */}
            {article.content && (
              <div
                className="prose prose-base sm:prose-lg max-w-none text-gray-800 leading-relaxed break-words overflow-hidden font-sans
                  [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-black [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-3.5 [&>h2]:leading-snug
                  [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-2.5
                  [&>p]:text-sm [&>p]:sm:text-base [&>p]:leading-7 [&>p]:text-gray-700 [&>p]:mb-4
                  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:text-sm [&>ul]:sm:text-base [&>ul]:text-gray-700 [&>ul]:mb-4
                  [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:text-sm [&>ol]:sm:text-base [&>ol]:text-gray-700 [&>ol]:mb-4
                  [&>img]:rounded-xl [&>img]:shadow-md [&>img]:my-6 [&>img]:w-full [&>img]:max-w-full [&>img]:h-auto [&>img]:object-cover
                  [&>table]:w-full [&>table]:max-w-full [&>table]:overflow-x-auto [&>table]:block
                  [&>blockquote]:border-l-4 [&>blockquote]:border-[#dc2626] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:bg-red-50/40 [&>blockquote]:p-3.5 [&>blockquote]:rounded-r-xl"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/&nbsp;/g, " "),
                }}
              />
            )}

            {/* Tags & Share */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-gray-500">Từ khóa:</span>
                {(article.tags && article.tags.length > 0
                  ? article.tags
                  : ["dudisoftware", "laptop cu", "pc"]
                ).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium hover:bg-[#dc2626] hover:text-white transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Đã sao chép link!" : "Chia sẻ bài viết"}</span>
              </button>
            </div>
          </main>

          {/* CỘT PHẢI: SIDEBAR - STICKY KHI CUỘN TRANG */}
          <aside className="lg:w-4/12 xl:w-3/12 w-full space-y-6 lg:sticky lg:top-[120px] self-start transition-all">
            {/* 1. ƯU ĐÃI ĐỘC QUYỀN */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#dc2626] text-[10px] font-black px-2.5 py-0.5 rounded-full mb-3 uppercase tracking-wider border border-red-100">
                <Flame className="w-3 h-3 text-[#dc2626]" />
                <span>ƯU ĐÃI ĐỘC QUYỀN</span>
              </div>
              <h4 className="text-base font-bold text-gray-900 leading-snug mb-2">
                Tư Vấn Build PC & Mua Laptop Cũ Giá Tốt Nhất
              </h4>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                DUDI SOFTWARE cam kết máy zin 100%, bảo hành 1 đổi 1 chu đáo, hỗ
                trợ trả góp 0% duyệt nhanh.
              </p>
              <a
                href="tel:0909163821"
                className="flex items-center justify-center gap-2 w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer group"
                title="Gọi Hotline tư vấn ngay: (+84) 909 163 821"
              >
                <PhoneCall className="w-4 h-4 group-hover:animate-bounce" />
                <span>HOTLINE: (+84) 909 163 821</span>
              </a>
            </div>

            {/* 2. CÁC TIN TỨC KHÁC */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#dc2626]" />
                  <span>Các tin tức khác</span>
                </h3>

                <div className="flex flex-col gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel._id || rel.slug}
                      href={`/tin-tuc/${rel.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={optimizeImageUrl(
                            rel.thumbnail || NEWS_FALLBACK_IMAGE,
                            { width: 200 }
                          )}
                          alt={rel.title}
                          fill
                          sizes="80px"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) =>
                            handleImageError(e, NEWS_FALLBACK_IMAGE)
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 text-xs leading-snug line-clamp-2 mb-1 group-hover:text-[#dc2626] transition-colors">
                          {rel.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(rel.createdAt)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
