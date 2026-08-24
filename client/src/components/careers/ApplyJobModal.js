"use client";

import { useState } from "react";
import {
  X,
  Briefcase,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  Loader2,
  Send,
  Building2,
  MapPin,
} from "lucide-react";
import { contactAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function ApplyJobModal({ isOpen, onClose, job }) {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cvLink, setCvLink] = useState("");
  const [intro, setIntro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast({ title: "Thiếu thông tin", message: "Vui lòng nhập họ và tên của bạn!", type: "error" });
      return;
    }
    if (!phone.trim()) {
      showToast({ title: "Thiếu thông tin", message: "Vui lòng nhập số điện thoại để HR liên hệ!", type: "error" });
      return;
    }
    if (!email.trim()) {
      showToast({ title: "Thiếu thông tin", message: "Vui lòng nhập địa chỉ email của bạn!", type: "error" });
      return;
    }

    setIsSubmitting(true);

    const messageContent = `[HỒ SƠ ỨNG TUYỂN VỊ TRÍ: ${job.title.toUpperCase()}]
- Vị trí: ${job.title} (${job.department || "Khối Công Nghệ"} - ${job.location || "TP.HCM"})
- Họ và tên ứng viên: ${fullName.trim()}
- Số điện thoại: ${phone.trim()}
- Email: ${email.trim()}
- Link CV / Portfolio: ${cvLink.trim() || "Chưa đính kèm link"}
- Giới thiệu / Kinh nghiệm: ${intro.trim() || "Không có ghi chú thêm"}`;

    try {
      await contactAPI.create({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: messageContent,
        isApplication: true,
        jobTitle: job.title,
        cvLink: cvLink.trim(),
      });

      setIsSuccess(true);
      showToast({
        title: "Nộp hồ sơ thành công!",
        message: `Hồ sơ ứng tuyển vị trí "${job.title}" đã được gửi tới Ban Quản Trị & HR DUDI SOFTWARE.`,
        type: "success",
      });
    } catch (err) {
      console.error("Lỗi khi gửi hồ sơ ứng tuyển:", err);
      showToast({
        title: "Có lỗi xảy ra",
        message: err.response?.data?.message || "Không thể gửi hồ sơ. Vui lòng thử lại sau!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setCvLink("");
    setIntro("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-150 px-5 sm:px-6 py-4 bg-gradient-to-r from-red-50/80 via-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eb1c24] text-white shrink-0 shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                Ứng tuyển vị trí
              </h3>
              <p className="text-xs font-bold text-[#eb1c24] truncate max-w-[280px] sm:max-w-md">
                {job.title}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                Đã tiếp nhận hồ sơ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2.5">
                Nộp hồ sơ thành công!
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                Cảm ơn <strong>{fullName}</strong> đã quan tâm đến cơ hội nghề nghiệp tại <strong>DUDI SOFTWARE</strong>. Ban Nhân sự sẽ xem xét hồ sơ và liên hệ với bạn trong vòng 2-3 ngày làm việc.
              </p>
            </div>

            <div className="w-full pt-4 border-t border-gray-150">
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {/* Job Summary Card */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span>{job.department || "Khối Kỹ Thuật & Kinh Doanh"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{job.location || "TP. Hồ Chí Minh"}</span>
              </div>
              <div className="font-bold text-[#eb1c24]">
                Mức lương: {job.salary || "Thỏa thuận hấp dẫn"}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span>Họ và tên <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb1c24]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span>Số điện thoại <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb1c24]/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>Địa chỉ Email <span className="text-red-500">*</span></span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: ungvien@gmail.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb1c24]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between gap-1">
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                  <span>Link CV / Portfolio</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  (Google Drive, TopCV, LinkedIn, Behance...)
                </span>
              </label>
              <input
                type="url"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/... hoặc link CV của bạn"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb1c24]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-gray-400" />
                <span>Giới thiệu bản thân / Kinh nghiệm nổi bật (Tùy chọn)</span>
              </label>
              <textarea
                rows={3}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Tóm tắt ngắn gọn số năm kinh nghiệm, kỹ năng thế mạnh hoặc mong muốn của bạn..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb1c24]/20 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-150">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#eb1c24] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d01720] transition cursor-pointer uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang nộp hồ sơ...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Gửi hồ sơ ngay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
