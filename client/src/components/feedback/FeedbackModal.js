"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, X, Loader2 } from "lucide-react";
import { feedbackAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

export default function FeedbackModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // Đóng modal bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập họ và tên của bạn.",
        type: "error",
      });
      return;
    }

    if (!formData.email.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ email của bạn.",
        type: "error",
      });
      return;
    }

    if (!formData.content.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập nội dung bạn muốn góp ý.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await feedbackAPI.create(formData);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        content: "",
      });

      // Đóng modal
      onClose();

      // Hiện Toast cảm ơn cực đẹp
      showToast({
        title: "Gửi phản hồi thành công!",
        message:
          "Cảm ơn bạn đã đóng góp ý kiến để DUDI SOFTWARE ngày càng hoàn thiện và phục vụ bạn tốt hơn!",
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.";
      showToast({
        title: "Gửi thất bại",
        message: errorMsg,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Purple Icon Top Badge */}
        <div className="w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
          <MessageSquare className="w-7 h-7 text-white fill-white/20" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-[22px] font-black text-gray-900 tracking-tight">
            Góp ý & Phản hồi
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Chúng tôi luôn lắng nghe để phục vụ bạn tốt hơn mỗi ngày.
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên của bạn *"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-50/80 border border-gray-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-3 focus:ring-[#8b5cf6]/15 transition-all"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ Email *"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-50/80 border border-gray-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-3 focus:ring-[#8b5cf6]/15 transition-all"
            />
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại (không bắt buộc)"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-50/80 border border-gray-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-3 focus:ring-[#8b5cf6]/15 transition-all"
            />
          </div>

          <div>
            <textarea
              name="content"
              rows={3}
              placeholder="Bạn muốn góp ý điều gì với chúng tôi? *"
              value={formData.content}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-50/80 border border-gray-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#8b5cf6] focus:ring-3 focus:ring-[#8b5cf6]/15 transition-all resize-none min-h-[90px]"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] hover:from-[#7c3aed] hover:to-[#5b21b6] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer pt-3 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi phản hồi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
