"use client";

import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export default function ReferralCTA() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-24 text-white">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-red-400 border border-white/15 backdrop-blur-md shadow-2xs">
          <Sparkles className="h-4 w-4 text-red-400" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Cơ Hội Gia Tăng Thu Nhập
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          Bắt Đầu <span className="text-[#eb1c24]">Kiếm Tiền</span> Ngay Hôm Nay
        </h2>

        <p className="max-w-2xl text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Kết nối trực tiếp với đội ngũ của <strong className="text-white">DUDI SOFTWARE</strong> qua Zalo để đăng ký đối tác và bắt đầu gửi thông tin khách hàng. Nhận hoa hồng không giới hạn!
        </p>

        <a
          href="https://zalo.me/2871243904030074512"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#eb1c24] to-red-600 hover:from-red-700 hover:to-red-600 px-10 py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-red-600/40 active:scale-98 cursor-pointer"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Liên Hệ Zalo Ngay</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </a>
      </div>
    </section>
  );
}
