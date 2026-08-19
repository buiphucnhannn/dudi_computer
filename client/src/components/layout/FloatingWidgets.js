"use client";

import { useEffect, useState } from "react";
import { Phone, ArrowUp, MessageSquare } from "lucide-react";

export default function FloatingWidgets() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
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
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-2.5">
      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-gray-800 hover:bg-[#dc2626] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
          title="Lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Purple Feedback Button */}
      <button
        onClick={() => alert("Cảm ơn bạn đã gửi ý kiến đóng góp cho ZComputer!")}
        className="w-11 h-11 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
        title="Góp ý dịch vụ"
        aria-label="Góp ý dịch vụ"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Hotline Red Pulsating Call Button */}
      <a
        href="tel:0977334415"
        className="w-12 h-12 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white flex items-center justify-center shadow-xl animate-pulse-ring cursor-pointer"
        title="Gọi ngay 0977 334 415"
        aria-label="Hotline 0977 334 415"
      >
        <Phone className="w-6 h-6 animate-bounce" />
      </a>

      {/* Zalo Chat Button */}
      <a
        href="https://zalo.me/0977334415"
        target="_blank"
        rel="noreferrer"
        className="w-11 h-11 rounded-full bg-[#0068FF] hover:brightness-110 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 font-bold text-xs"
        title="Chat Zalo ngay"
        aria-label="Chat Zalo"
      >
        Zalo
      </a>

      {/* Facebook Messenger Button */}
      <a
        href="https://m.me/zcomputer.vn"
        target="_blank"
        rel="noreferrer"
        className="w-11 h-11 rounded-full bg-[#1877F2] hover:brightness-110 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        title="Chat Facebook"
        aria-label="Chat Facebook"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
    </div>
  );
}
