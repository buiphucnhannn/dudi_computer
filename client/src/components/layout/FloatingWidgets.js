"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import FeedbackModal from "@/components/feedback/FeedbackModal";

export default function FloatingWidgets() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-2 sm:right-3 z-50 flex flex-col items-center gap-3 select-none">
        {/* 1. Nút Lên đầu trang (Back to top) */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1e293b] hover:bg-[#334155] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* 2. Nút Góp ý / Phản hồi Tím (Mở FeedbackModal) */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#8b5cf6]/50 animate-ripple pointer-events-none"></span>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 cursor-pointer z-10"
            title="Góp ý & Phản hồi"
            aria-label="Góp ý & Phản hồi"
          >
            <svg
              className="w-5 h-5 stroke-white fill-none stroke-[2]"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

      {/* 3. Nút Hotline Đỏ (Kích hoạt cuộc gọi trực tiếp) */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#eb1c24]/55 animate-ripple pointer-events-none"></span>
        <a
          href="tel:0909163821"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#eb1c24] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer z-10"
          title="Gọi Hotline: (+84) 909 163 821"
          aria-label="Gọi Hotline: (+84) 909 163 821"
        >
          <svg
            className="w-5 h-5 stroke-white fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
            viewBox="0 0 24 24"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            <path d="M14.05 2a9 9 0 0 1 8 7.94" />
            <path d="M14.05 6A5 5 0 0 1 18 10" />
          </svg>
        </a>
      </div>

      {/* 4. Nút Zalo Xanh Dương (Gắn link Zalo DUDI Software) */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#0068ff]/50 animate-ripple pointer-events-none"></span>
        <a
          href="https://zalo.me/2871243904030074512"
          target="_blank"
          rel="noreferrer"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0068ff] hover:brightness-110 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 cursor-pointer font-black text-[12.5px] tracking-tight z-10"
          title="Zalo DUDI Software"
          aria-label="Zalo DUDI Software"
        >
          Zalo
        </a>
      </div>

      {/* 5. Nút Facebook / Messenger Xanh Dương */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#1877f2]/50 animate-ripple pointer-events-none"></span>
        <a
          href="https://www.facebook.com/dudi.websitechuyennghiep"
          target="_blank"
          rel="noreferrer"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1877f2] hover:brightness-110 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 cursor-pointer z-10"
          title="Facebook DUDI Software"
          aria-label="Facebook DUDI Software"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>
    </div>

    {/* Popup Góp ý & Phản hồi */}
    <FeedbackModal
      isOpen={showFeedbackModal}
      onClose={() => setShowFeedbackModal(false)}
    />
  </>
  );
}
