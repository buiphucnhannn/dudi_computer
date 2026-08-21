"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, ChevronRight, Search, Newspaper } from "lucide-react";
import { newsAPI } from "@/lib/api";

const CATEGORIES = [
  "Tất cả",
  "Tin công nghệ",
  "Khuyến mãi",
  "Đánh giá sản phẩm",
  "Thủ thuật",
];

export default function NewsContent() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== "Tất cả") {
        params.category = activeCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await newsAPI.getAll(params);
      if (res.data && res.data.data && res.data.data.news) {
        setNewsList(res.data.data.news);
      } else if (res.data && Array.isArray(res.data.data)) {
        setNewsList(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNews();
  };

  const featuredArticle = newsList.length > 0 ? newsList[0] : null;
  const otherArticles = newsList.length > 1 ? newsList.slice(1) : [];

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-20">
      {/* 1. HERO BANNER CHUẨN 100% ZCOMPUTER.VN (RADIAL GRADIENT TỰ NHIÊN, KHÔNG GIẬT OVAL) */}
      <div className="relative bg-[#0b0f19] pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden text-white">
        {/* Nút 'Về trang chủ' góc trên trái */}
        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#eb1c24] hover:text-white hover:bg-[#eb1c24] transition-all bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft size={16} />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Ambient Radial Gradient mượt mà (chỉ đỏ nhẹ góc trên bên phải, vẽ trực tiếp GPU không giật hình) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 82% 18%, rgba(235, 28, 36, 0.24) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(37, 99, 235, 0.12) 0%, transparent 45%)",
          }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight mb-3 md:mb-4 drop-shadow-lg">
            Tin Tức{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb1c24] to-[#eb1c24]">
              Công Nghệ
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-xl font-medium">
            Nơi cập nhật những xu hướng công nghệ mới nhất, đánh giá chân thực và các mẹo vặt hữu ích từ ZCOMPUTER.
          </p>
        </div>
      </div>

      {/* 2. THANH BỘ LỌC DANH MỤC & TÌM KIẾM */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-7xl">
        <div className="bg-white rounded-2xl p-2 md:p-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between gap-3 mb-8 md:mb-10">
          {/* Tabs Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#eb1c24] to-[#eb1c24] text-white shadow-lg shadow-[#eb1c24]/30"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#eb1c24]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-72 shrink-0 px-2 md:px-0"
          >
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-[#eb1c24] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-5 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eb1c24]"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. NỘI DUNG DANH SÁCH BÀI VIẾT */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            {/* Skeleton Featured Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 aspect-[16/10] bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                  <div className="aspect-[16/10] bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ) : newsList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-xl mx-auto my-12">
            <Newspaper className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Chưa có bài viết trong danh mục này</h3>
            <p className="text-sm text-gray-500 mb-6">Vui lòng chọn danh mục khác hoặc quay lại sau để cập nhật bài viết mới.</p>
            <button
              onClick={() => {
                setActiveCategory("Tất cả");
                setSearchQuery("");
              }}
              className="bg-[#eb1c24] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {/* FEATURED ARTICLE (Khổ lớn ngang ở trên) */}
            {featuredArticle && (
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image */}
                  <Link
                    href={`/tin-tuc/${featuredArticle.slug}`}
                    className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-slate-900 block cursor-pointer"
                  >
                    <img
                      src={featuredArticle.thumbnail || "/post-3.webp"}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "/post-3.webp";
                      }}
                    />
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="bg-[#eb1c24] text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {featuredArticle.category || "TIN CÔNG NGHỆ"}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#eb1c24]" />
                          <span>
                            {new Date(featuredArticle.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{featuredArticle.views || 106} lượt xem</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/tin-tuc/${featuredArticle.slug}`}>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight group-hover:text-[#eb1c24] transition-colors mb-4 line-clamp-3">
                          {featuredArticle.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed line-clamp-3 mb-6 font-normal">
                        {featuredArticle.summary || featuredArticle.title}
                      </p>
                    </div>

                    <Link
                      href={`/tin-tuc/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#eb1c24] group/link self-start hover:underline"
                    >
                      <span>Đọc tiếp bài viết</span>
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER ARTICLES GRID (Lưới 3 cột) */}
            {otherArticles.length > 0 && (
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#eb1c24] rounded-full"></span>
                  <span>BÀI VIẾT MỚI CẬP NHẬT</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {otherArticles.map((item) => (
                    <article
                      key={item._id || item.slug}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-[#eb1c24]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image */}
                        <Link
                          href={`/tin-tuc/${item.slug}`}
                          className="block relative aspect-[16/10] overflow-hidden bg-slate-100"
                        >
                          <img
                            src={item.thumbnail || "/post-1.webp"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/post-1.webp";
                            }}
                          />
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span className="bg-[#eb1c24] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              {item.category || "TIN CÔNG NGHỆ"}
                            </span>
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="p-4 sm:p-5">
                          {/* Meta */}
                          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{item.views || 45} xem</span>
                            </div>
                          </div>

                          {/* Title */}
                          <Link href={`/tin-tuc/${item.slug}`}>
                            <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#eb1c24] transition-colors mb-2.5 min-h-[44px]">
                              {item.title}
                            </h4>
                          </Link>

                          {/* Summary */}
                          <p className="text-gray-500 text-xs sm:text-[13px] leading-relaxed line-clamp-2 font-normal">
                            {item.summary || item.title}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                        <Link
                          href={`/tin-tuc/${item.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#eb1c24] hover:underline"
                        >
                          <span>Xem chi tiết</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
