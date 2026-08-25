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
  FileText,
  Target,
  Gift,
  PhoneCall,
  ArrowRight,
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

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const getGmailUrl = (jobTitle) => {
    const email = "contact@dudisoftware.com";
    const subject = `[Ứng tuyển ${jobTitle}] - [Họ và tên]`;
    const body = `Kính gửi Phòng Nhân sự DUDI SOFTWARE,\n\nTôi viết email này để nộp hồ sơ ứng tuyển vào vị trí: "${jobTitle}".\n\nThông tin của tôi:\n- Họ và tên: \n- Số điện thoại: \n- Email liên hệ: \n- Link đính kèm CV / Portfolio: \n\nRất mong nhận được phản hồi từ Quý công ty.\nXin chân thành cảm ơn!`;

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ========================================================================= */}
        {/* 1. HERO HEADER */}
        {/* ========================================================================= */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eb1c24]/10 border border-[#eb1c24]/30 text-[#eb1c24] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Gia nhập đội ngũ DUDI SOFTWARE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase">
            Cơ Hội Nghề Nghiệp & Tuyển Dụng
          </h1>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
            Chúng tôi luôn tìm kiếm những tài năng trẻ trung, đam mê công nghệ phần cứng và nhiệt huyết để cùng nhau xây dựng hệ thống thương mại điện tử linh kiện máy tính hàng đầu.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. TẠI SAO NÊN CHỌN DUDI SOFTWARE? */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-[#eb1c24]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Thu nhập cạnh tranh</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Lương cứng hấp dẫn theo năng lực + Thưởng doanh số, thưởng hiệu suất hàng tháng không giới hạn.
            </p>
          </div>

          <div className="bg-[#141414] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-[#eb1c24]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Star size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Môi trường năng động</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Đồng nghiệp trẻ trung, hỗ trợ nhau hết mình. Văn phòng làm việc hiện đại trang bị dàn PC Gaming cao cấp.
            </p>
          </div>

          <div className="bg-[#141414] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden group hover:border-[#eb1c24]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Lộ trình thăng tiến rõ ràng</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Được đào tạo bài bản kiến thức phần cứng chuyên sâu. Cơ hội lên Trưởng nhóm / Quản lý sau 6-12 tháng.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DANH SÁCH CÁC VỊ TRÍ ĐANG TUYỂN DỤNG */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2.5">
                <Briefcase className="text-[#eb1c24]" size={24} />
                <span>Vị trí đang tuyển dụng</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Khám phá các vị trí phù hợp với năng lực và đam mê của bạn
              </p>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-gray-800 text-xs font-bold text-gray-300 w-fit">
              {jobs.length} vị trí đang mở
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Đang tải danh sách việc làm...
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center bg-[#141414] rounded-2xl border border-gray-800 text-gray-400 text-sm">
              Hiện tại chưa có vị trí tuyển dụng nào đang mở. Vui lòng quay lại sau!
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => {
                const isExpanded = expandedJobId === job._id;

                return (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    {/* Job Card Header */}
                    <div
                      onClick={() => toggleExpand(job._id)}
                      className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-[#eb1c24] text-[11px] font-bold uppercase tracking-wider">
                            {job.department || "Khối Kinh Doanh"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium">
                            {job.type || "Toàn thời gian"}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {job.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            {job.location || "TP.HCM"}
                          </span>
                          <span className="flex items-center gap-1 text-[#eb1c24] font-bold">
                            <DollarSign size={14} />
                            {job.salary || "Thỏa thuận"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-900 hover:bg-[#eb1c24] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isExpanded ? "Thu gọn" : "Xem chi tiết"}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Job Card Detail Body */}
                    {isExpanded && (
                      <div className="border-t border-gray-150 p-5 sm:p-6 bg-gray-50/50 space-y-5 text-xs sm:text-sm">
                        {job.description && (
                          <div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                              <FileText size={15} className="text-[#eb1c24]" />
                              <span>Mô tả công việc:</span>
                            </h4>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-6">
                              {job.description}
                            </p>
                          </div>
                        )}

                        {job.requirements && job.requirements.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                              <Target size={15} className="text-[#eb1c24]" />
                              <span>Yêu cầu ứng viên:</span>
                            </h4>
                            <ul className="space-y-1.5 text-gray-600 pl-6">
                              {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#eb1c24] font-bold">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.benefits && job.benefits.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2 flex items-center gap-2">
                              <Gift size={15} className="text-[#eb1c24]" />
                              <span>Quyền lợi được hưởng:</span>
                            </h4>
                            <ul className="space-y-1.5 text-gray-600 pl-6">
                              {job.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Button: Mở trực tiếp Gmail Web soạn thư */}
                        <div className="pt-4 flex flex-wrap items-center gap-4">
                          <a
                            href={getGmailUrl(job.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-102 cursor-pointer active:scale-98"
                          >
                            <Mail size={16} />
                            <span>Nộp hồ sơ ngay cho vị trí này</span>
                          </a>
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
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#eb1c24]/10 text-[#eb1c24] border border-[#eb1c24]/20 flex items-center justify-center mx-auto mb-2">
              <Send size={24} />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Cách thức nộp hồ sơ
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Gửi CV của bạn về địa chỉ Email:{" "}
              <a
                href={getGmailUrl("Ứng viên")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#eb1c24] hover:underline inline-flex items-center gap-1"
              >
                <Mail size={16} />
                <span>contact@dudisoftware.com</span>
                <span className="text-xs text-gray-400 font-normal">(Nhấn để mở Gmail)</span>
              </a>
              <br />
              Tiêu đề Email ghi rõ:{" "}
              <span className="text-white font-semibold italic">
                [Vị trí ứng tuyển] - [Họ và tên]
              </span>
            </p>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
              <PhoneCall size={15} className="text-[#eb1c24]" />
              <span>Mọi thắc mắc vui lòng liên hệ Hotline Nhân sự:</span>
              <a href="tel:0909163821" className="text-white hover:underline font-bold">
                (+84) 909 163 821
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
