"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ChevronRight, Newspaper } from "lucide-react";
import { newsAPI } from "@/lib/api";

export default function HomeNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await newsAPI.getAll({ limit: 4 });
        if (res.data && res.data.data && res.data.data.news) {
          setNews(res.data.data.news);
        } else if (res.data && Array.isArray(res.data.data)) {
          setNews(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
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
                  src={item.thumbnail || "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80";
                  }}
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
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
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

      {/* Bottom Button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/news"
          className="bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102 cursor-pointer"
        >
          <span>XEM THÊM BÀI VIẾT & TIN TỨC</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
