"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Newspaper } from "lucide-react";
import { newsAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { handleImageError, NEWS_FALLBACK_IMAGE } from "@/lib/imageFallback";

const CURATED_DEFAULT_NEWS = [
  {
    _id: "default-news-1",
    title: "Top 5 Laptop Gaming Dưới 20 Triệu Đáng Mua Nhất 2025: Hiệu Năng Vượt Trội",
    slug: "top-5-laptop-gaming-duoi-20-trieu-dang-mua-nhat-2025",
    category: "Tin công nghệ",
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "default-news-2",
    title: "Hướng Dẫn Build PC Gaming i5 13400F + RTX 4060 Chiến Mọi Tựa Game AAA",
    slug: "huong-dan-build-pc-gaming-i5-13400f-rtx-4060-chien-moi-tua-game",
    category: "Thủ thuật",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "default-news-3",
    title: "So Sánh RTX 4060 vs RTX 3060 12GB: Đâu Là Lựa Chọn Kinh Tế Tối Ưu?",
    slug: "so-sanh-rtx-4060-vs-rtx-3060-12gb-nen-chon-card-nao",
    category: "Đánh giá sản phẩm",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "default-news-4",
    title: "Kinh Nghiệm Chọn Mua Laptop Cũ Like New Chuẩn Zin Không Lo Bị Luộc Đồ",
    slug: "kinh-nghiem-chon-mua-laptop-cu-like-new-nguyen-zin-khong-lo-bi-luoc-do",
    category: "Thủ thuật",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
];

export default function HomeNewsSection() {
  const [news, setNews] = useState(CURATED_DEFAULT_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const res = await newsAPI.getAll({ limit: 4 });
        let list = [];
        if (res.data?.data?.news && Array.isArray(res.data.data.news)) {
          list = res.data.data.news;
        } else if (Array.isArray(res.data?.data)) {
          list = res.data.data;
        }

        if (isMounted) {
          if (list.length > 0) {
            setNews(list);
          } else {
            setNews(CURATED_DEFAULT_NEWS);
          }
        }
      } catch (error) {
        console.warn("Dùng danh sách tin tức chuẩn cho trang chủ:", error?.message);
        if (isMounted) {
          setNews(CURATED_DEFAULT_NEWS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8 md:p-9">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-7 bg-[#eb1c24] rounded-full" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              BÀI VIẾT - TIN TỨC CÔNG NGHỆ
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 pl-4">
            Cập nhật kiến thức, thủ thuật và tin tức công nghệ mới nhất từ DUDI SOFTWARE
          </p>
        </div>

        <Link
          href="/news"
          className="text-xs font-bold text-[#eb1c24] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>Xem tất cả bài viết</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-gray-50 rounded-2xl p-3 border border-gray-100 animate-pulse">
              <div className="aspect-[16/10] bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Chưa có bài viết mới</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {news.map((item) => (
            <Link
              key={item._id || item.slug}
              href={`/news/${item.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs hover:shadow-xl hover:border-[#eb1c24] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                <img
                  src={item.thumbnail || NEWS_FALLBACK_IMAGE}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => handleImageError(e, NEWS_FALLBACK_IMAGE)}
                />
              </div>

              {/* Meta: Category badge & Date */}
              <div className="flex items-center justify-between gap-2 text-[11px] text-gray-400 mb-2">
                <span className="bg-red-50 text-[#eb1c24] font-bold px-2 py-0.5 rounded text-[10px] uppercase truncate">
                  {item.category || "Tin công nghệ"}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-xs sm:text-[13.5px] leading-snug line-clamp-2 group-hover:text-[#eb1c24] transition-colors min-h-[36px]">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
