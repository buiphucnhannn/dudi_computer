"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Star,
  Award,
  Briefcase,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  Send,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { jobAPI } from "@/lib/api";

export default function CareersContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobAPI.getAll();
        if (res.data?.data?.items) {
          setJobs(res.data.data.items);
        } else if (Array.isArray(res.data?.data)) {
          setJobs(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách tuyển dụng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleJob = (id) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans">
      <div className="bg-[#f8f9fa] min-h-screen pb-20">
        
        {/* ========================================================================= */}
        {/* 1. HERO HEADER BANNER (Dark Glowing Background with Red Ambient Glow) */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e14] py-16 md:py-24 relative overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Glowing Red Ambient Aura on Right */}
          <div className="absolute -top-24 -right-16 w-[550px] h-[550px] bg-gradient-to-bl from-[#eb1c24]/45 via-[#eb1c24]/25 to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#eb1c24]/35 rounded-full blur-[100px] pointer-events-none" />

          {/* Blue Ambient Aura on Left */}
          <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[110px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                TUYỂN DỤNG{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb1c24] via-red-500 to-orange-400">
                  ZCOMPUTER
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#eb1c24] to-orange-500 mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(235,28,36,0.6)]" />
              <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                Gia nhập đội ngũ ZComputer ngay hôm nay! Chúng tôi luôn tìm kiếm những con người đam mê công nghệ, nhiệt huyết và khát khao khẳng định bản thân.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl">
          
          {/* ========================================================================= */}
          {/* 2. THREE BENEFIT CARDS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-red-50 text-[#eb1c24] rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#eb1c24] group-hover:text-white transition-colors duration-300">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                Thu nhập hấp dẫn
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Lương cứng cạnh tranh, thưởng KPIs không giới hạn. Xét duyệt tăng lương định kỳ 6 tháng/lần.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-red-50 text-[#eb1c24] rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#eb1c24] group-hover:text-white transition-colors duration-300">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                Môi trường năng động
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Làm việc trong môi trường trẻ trung, sáng tạo, tiếp xúc trực tiếp với các thiết bị công nghệ mới nhất.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-red-50 text-[#eb1c24] rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:bg-[#eb1c24] group-hover:text-white transition-colors duration-300">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                Lộ trình thăng tiến
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Cơ hội đào tạo chuyên sâu và thăng tiến rõ ràng lên các vị trí Trưởng nhóm, Quản lý cửa hàng.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. VỊ TRÍ ĐANG TUYỂN (JOB LISTING FROM DATABASE) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-16">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                  Vị trí đang tuyển
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Tìm kiếm cơ hội phù hợp với năng lực của bạn.
                </p>
              </div>
              <Briefcase className="w-9 h-9 text-[#eb1c24] opacity-20 hidden sm:block" />
            </div>

            {/* Content list */}
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#eb1c24] border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-xs text-gray-400 font-medium">Đang tải danh sách vị trí...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-16 px-6 text-center text-gray-500 text-sm sm:text-base font-medium">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300 opacity-60" />
                <p>Hiện tại ZComputer đã đủ nhân sự và chưa có đợt tuyển dụng mới. Xin vui lòng quay lại sau!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => {
                  const isExpanded = expandedJobId === job._id;
                  return (
                    <div key={job._id} className="transition-colors hover:bg-gray-50/50">
                      {/* Job Row Header */}
                      <div
                        onClick={() => toggleJob(job._id)}
                        className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-red-50 text-[#eb1c24] font-extrabold text-[11px] uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                              {job.department || "Kỹ thuật"}
                            </span>
                            <span className="bg-gray-100 text-gray-600 font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                              {job.type || "Toàn thời gian"}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#eb1c24] transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                              <MapPin size={15} className="text-[#eb1c24]" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <DollarSign size={15} className="text-emerald-600" />
                              <strong className="text-emerald-600 font-bold">{job.salary}</strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={15} className="text-gray-400" />
                              {job.experience}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                          <button
                            type="button"
                            className="text-xs sm:text-sm font-bold text-[#eb1c24] hover:underline flex items-center gap-1"
                          >
                            <span>{isExpanded ? "Thu gọn" : "Xem chi tiết & Ứng tuyển"}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Job Details */}
                      {isExpanded && (
                        <div className="px-6 sm:px-8 pb-8 pt-2 bg-gray-50/70 border-t border-gray-100 space-y-6 text-sm text-gray-700">
                          {job.description && (
                            <div>
                              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">
                                📋 Mô tả công việc:
                              </h4>
                              <p className="leading-relaxed text-gray-600 whitespace-pre-line">
                                {job.description}
                              </p>
                            </div>
                          )}

                          {job.requirements && job.requirements.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">
                                🎯 Yêu cầu ứng viên:
                              </h4>
                              <ul className="space-y-1.5 text-gray-600">
                                {job.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-[#eb1c24] shrink-0 mt-0.5" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.benefits && job.benefits.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">
                                🎁 Quyền lợi được hưởng:
                              </h4>
                              <ul className="space-y-1.5 text-gray-600">
                                {job.benefits.map((b, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action Button to send CV email */}
                          <div className="pt-4 flex flex-wrap items-center gap-4">
                            <a
                              href={`mailto:truong.zvncomputer@gmail.com?subject=${encodeURIComponent(
                                `[Ứng tuyển ${job.title}] - [Họ và tên]`
                              )}`}
                              className="px-6 py-3 bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102"
                            >
                              <Send size={14} />
                              <span>Nộp hồ sơ ngay cho vị trí này</span>
                            </a>
                            <span className="text-xs text-gray-400">
                              (Email: truong.zvncomputer@gmail.com)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 4. CÁCH THỨC NỘP HỒ SƠ */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-br from-gray-900 to-[#111] rounded-2xl shadow-xl p-8 sm:p-10 text-center relative overflow-hidden border border-gray-800">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                Cách thức nộp hồ sơ
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Gửi CV của bạn về địa chỉ Email:{" "}
                <a
                  href="mailto:truong.zvncomputer@gmail.com"
                  className="font-bold text-[#eb1c24] hover:underline"
                >
                  truong.zvncomputer@gmail.com
                </a>
                <br />
                Tiêu đề Email ghi rõ:{" "}
                <span className="text-white font-semibold italic">
                  [Vị trí ứng tuyển] - [Họ và tên]
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-400 italic">
                Mọi thắc mắc vui lòng liên hệ Hotline Nhân sự:{" "}
                <a href="tel:0977334415" className="text-white hover:underline font-bold">
                  0977.334.415
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
