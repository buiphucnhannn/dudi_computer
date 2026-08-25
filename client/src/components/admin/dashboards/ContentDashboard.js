"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  Briefcase,
  PlusCircle,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MapPin,
  DollarSign,
  TrendingUp,
  Compass,
  FileEdit,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { newsAPI, jobAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ContentDashboard() {
  const [loading, setLoading] = useState(true);
  const [newsList, setNewsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    totalJobs: 0,
    activeJobs: 0,
  });

  const navigationItems = [
    {
      title: "Tin tức & Bài viết",
      description: "Quản lý danh sách bài viết, viết bài đánh giá & tin công nghệ",
      href: "/admin/news",
      icon: Newspaper,
      badge: "Bài Viết",
      bgLight: "bg-purple-50 text-purple-600 border-purple-100",
      colorText: "text-purple-600",
    },
    {
      title: "Tuyển dụng việc làm",
      description: "Đăng tin tuyển dụng nhân sự, quản lý vị trí đang mở",
      href: "/admin/careers",
      icon: Briefcase,
      badge: "Tuyển Dụng",
      bgLight: "bg-blue-50 text-blue-600 border-blue-100",
      colorText: "text-blue-600",
    },
    {
      title: "Xem trang tin tức",
      description: "Kiểm tra giao diện hiển thị bài viết tin tức thực tế trên web",
      href: "/news",
      icon: ExternalLink,
      badge: "Client Web",
      bgLight: "bg-emerald-50 text-emerald-600 border-emerald-100",
      colorText: "text-emerald-600",
      isExternal: true,
    },
    {
      title: "Xem trang tuyển dụng",
      description: "Kiểm tra trang cơ hội nghề nghiệp dành cho ứng viên",
      href: "/careers",
      icon: ExternalLink,
      badge: "Client Web",
      bgLight: "bg-amber-50 text-amber-600 border-amber-100",
      colorText: "text-amber-600",
      isExternal: true,
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch News
      const newsRes = await newsAPI.getAdminAll({ limit: 10 }).catch(() => newsAPI.getAll({ limit: 10 }));
      const newsData = newsRes.data?.data?.news || newsRes.data?.data || newsRes.data?.news || [];
      const articles = Array.isArray(newsData) ? newsData : [];
      setNewsList(articles.slice(0, 5));

      const publishedCount = articles.filter((a) => a.isPublished !== false).length;

      // 2. Fetch Jobs
      const jobsRes = await jobAPI.getAdminAll({ limit: 10 }).catch(() => jobAPI.getAll({ limit: 10 }));
      const jobsData = jobsRes.data?.data?.jobs || jobsRes.data?.data || jobsRes.data?.jobs || [];
      const jobs = Array.isArray(jobsData) ? jobsData : [];
      setJobsList(jobs.slice(0, 5));

      const activeJobsCount = jobs.filter((j) => j.status === "active" || j.status === "published" || j.isActive).length;

      setStats({
        totalNews: articles.length,
        publishedNews: publishedCount,
        totalJobs: jobs.length,
        activeJobs: activeJobsCount || jobs.length,
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Content Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 animate-smooth-fade">
      {/* Content Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-700 via-indigo-700 to-purple-900 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20">
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-purple-100 text-xs font-bold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Cổng Quản Trị Nội Dung & Tuyển Dụng</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              Bảng Điều Khiển Nội Dung
            </h1>
            <p className="text-purple-100/90 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
              Quản trị toàn diện bài viết tin tức công nghệ, bài đăng tuyển dụng nhân sự, theo dõi lượt đọc và thu hút nhân tài.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 font-black text-xs sm:text-sm transition-all shadow-md active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Bài Viết Mới</span>
            </Link>

            <Link
              href="/admin/careers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-98"
            >
              <Briefcase className="w-4 h-4" />
              <span>Đăng Tin Tuyển Dụng</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Module Navigation Hub */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Điều Hướng Phân Hệ Nội Dung & Tuyển Dụng
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Truy cập các phân hệ quản lý bài viết và tin tuyển dụng
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 hidden sm:inline-block">
            4 Phân Hệ Khả Dụng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {navigationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all duration-200 active:scale-98"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${item.bgLight} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-600 shadow-2xs">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 group-hover:text-purple-600 transition truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className={`mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold ${item.colorText}`}>
                  <span>{item.isExternal ? "Mở trang xem" : "Mở phân hệ"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số tin tức */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng Bài Viết
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <FileText className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats.totalNews}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-purple-600 font-bold">{stats.publishedNews}</span> bài đã xuất bản
          </div>
        </div>

        {/* Card 2: Tin tức đã xuất bản */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang Hiển Thị Web
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {stats.publishedNews}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Tiếp cận độc giả trực tiếp
          </div>
        </div>

        {/* Card 3: Vị trí tuyển dụng */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tin Tuyển Dụng
            </span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats.totalJobs}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-blue-600 font-bold">{stats.activeJobs}</span> vị trí đang tuyển
          </div>
        </div>

        {/* Card 4: Cơ hội việc làm đang mở */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang Nhận Hồ Sơ
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {stats.activeJobs}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Sẵn sàng đón nhận ứng viên
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent News Articles */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Bài Viết Tin Tức Mới Nhất
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Các bài viết vừa được tạo hoặc cập nhật gần đây
                  </p>
                </div>
              </div>

              <Link
                href="/admin/news"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
              >
                <span>Tất cả bài viết</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
                Đang tải dữ liệu tin tức...
              </div>
            ) : newsList.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Chưa có bài viết nào được đăng tải.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {newsList.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/80 rounded-2xl px-2 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image || item.thumbnail ? (
                        <img
                          src={item.image || item.thumbnail}
                          alt={item.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-black text-xs">
                          DOC
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-purple-600 transition truncate max-w-[260px] sm:max-w-md">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10.5px] text-slate-400">
                          <span>{formatDate(item.createdAt)}</span>
                          <span>•</span>
                          <span className="font-semibold text-purple-600">
                            {item.category?.name || item.category || "Công nghệ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.isPublished !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {item.isPublished !== false ? "Đã đăng" : "Nháp"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/news"
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Soạn Thảo Bài Viết Mới</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Job Openings */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Vị Trí Tuyển Dụng
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Các vị trí đang mở tìm kiếm ứng viên
                  </p>
                </div>
              </div>

              <Link
                href="/admin/careers"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                Đang tải dữ liệu tuyển dụng...
              </div>
            ) : jobsList.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Chưa có tin tuyển dụng nào được đăng.
              </div>
            ) : (
              <div className="space-y-3">
                {jobsList.map((job, idx) => (
                  <div
                    key={job._id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate max-w-[200px]">
                        {job.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {job.status === "closed" ? "Đã đóng" : "Đang tuyển"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location || "Đà Nẵng"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        {job.salary || "Thỏa thuận"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/admin/careers"
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Tin Tuyển Dụng Mới</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
