"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { contactAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function ContactContent() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập họ và tên của bạn",
        type: "warning",
      });
      return;
    }

    if (!formData.phone.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập số điện thoại liên hệ",
        type: "warning",
      });
      return;
    }

    if (!formData.message.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập nội dung tin nhắn hoặc nhu cầu tư vấn",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      await contactAPI.create(formData);
      setSubmittedSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      showToast({
        title: "Lỗi gửi thông tin",
        message: error.response?.data?.message || "Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans">
      <div className="bg-[#f8f9fa] min-h-screen pb-20">
        
        {/* ========================================================================= */}
        {/* 1. HERO HEADER BANNER (Dark Glowing Background with Rich Red Aura) */}
        {/* ========================================================================= */}
        <div className="bg-[#0b0e14] py-16 md:py-24 relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Vùng ánh sáng đỏ rực rỡ bên phải (Red ambient glow) */}
          <div className="absolute -top-24 -right-16 w-[550px] h-[550px] bg-gradient-to-bl from-[#eb1c24]/45 via-[#eb1c24]/25 to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#eb1c24]/35 rounded-full blur-[100px] pointer-events-none" />

          {/* Vùng ánh sáng xanh dương mờ bên trái (Blue ambient glow) */}
          <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[110px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                LIÊN HỆ{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb1c24] via-red-500 to-orange-400">
                  DUDI SOFTWARE
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#eb1c24] to-orange-500 mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(235,28,36,0.6)]" />
              <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Đừng ngần ngại liên hệ với DUDI SOFTWARE qua các kênh dưới đây hoặc để lại tin nhắn cho chúng tôi.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CONTACT SECTION (Card Container elevated -mt-10) */}
        {/* ========================================================================= */}
        <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Cột trái (1/3): THÔNG TIN LIÊN HỆ */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-8 h-full">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-6">
                    Thông Tin Liên Hệ
                  </h2>

                  <div className="space-y-6">
                    {/* Item 1: Địa chỉ các chi nhánh */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          Hệ thống cửa hàng
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          <strong>Showroom 1:</strong> 49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh
                          <br />
                          <strong>Showroom 2:</strong> 232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh
                        </p>
                      </div>
                    </div>

                    {/* Item 2: Hotline */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          Hotline tư vấn
                        </h4>
                        <a
                          href="tel:0909163821"
                          className="text-gray-600 text-sm leading-relaxed font-bold text-[#eb1c24] text-lg hover:underline block"
                        >
                          (+84) 909 163 821
                        </a>
                      </div>
                    </div>

                    {/* Item 3: Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          Email hỗ trợ
                        </h4>
                        <a
                          href="mailto:contact@dudisoftware.com"
                          className="text-gray-600 text-sm leading-relaxed hover:text-[#eb1c24] transition-colors break-all"
                        >
                          contact@dudisoftware.com
                        </a>
                      </div>
                    </div>

                    {/* Item 4: Giờ làm việc */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          Giờ làm việc
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          9:00 - 19:00 (Thứ 2 - Chủ nhật)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải (2/3): FORM GỬI TIN NHẮN */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">
                    Gửi Tin Nhắn Cho Chúng Tôi
                  </h2>
                  <p className="text-gray-500 mb-8 text-sm">
                    Vui lòng điền thông tin vào form bên dưới, đội ngũ tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                  </p>

                  {submittedSuccess && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <p className="text-xs sm:text-sm font-medium">
                        Cảm ơn quý khách đã gửi thông tin liên hệ! Đội ngũ tư vấn DUDI SOFTWARE đã tiếp nhận và sẽ liên hệ hỗ trợ quý khách trong thời gian sớm nhất.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hàng 1: Họ tên & Số điện thoại */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">
                          Họ và tên <span className="text-[#eb1c24]">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-sm text-gray-800 placeholder-gray-400"
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">
                          Số điện thoại <span className="text-[#eb1c24]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-sm text-gray-800 placeholder-gray-400"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                    </div>

                    {/* Hàng 2: Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 block">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white text-sm text-gray-800 placeholder-gray-400"
                        placeholder="Nhập địa chỉ email của bạn (không bắt buộc)"
                      />
                    </div>

                    {/* Hàng 3: Nội dung tin nhắn */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 block">
                        Nội dung tin nhắn <span className="text-[#eb1c24]">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 focus:bg-white resize-none text-sm text-gray-800 placeholder-gray-400"
                        placeholder="Bạn đang quan tâm đến sản phẩm nào hoặc cần hỗ trợ vấn đề gì?"
                      />
                    </div>

                    {/* Nút gửi */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-[#eb1c24] to-[#d01720] hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0 text-sm sm:text-base"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Đang gửi thông tin...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Gửi Tin Nhắn Ngay</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
