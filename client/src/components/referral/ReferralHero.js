"use client";

import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  Wallet,
  Monitor,
  Laptop,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
];

export default function ReferralHero() {
  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-8 sm:pt-12 sm:pb-20 lg:pt-16">
      {/* Background Decorative Pattern & Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-red-500/8 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-rose-500/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          {/* Left Column: Main Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            {/* Program Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-red-50/90 px-4 py-1.5 text-[#eb1c24] border border-red-200/80 shadow-2xs backdrop-blur-xs">
              <Sparkles className="h-4 w-4 text-[#eb1c24] shrink-0 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider">
                Chương Trình Đối Tác Giới Thiệu
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black uppercase tracking-tight text-slate-900 leading-[1.15]">
              Giới Thiệu Bạn Bè
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-linear-to-r from-[#eb1c24] via-red-600 to-rose-600">
                Nhận Lì Xì Liền!
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-xl text-sm sm:text-base md:text-[17px] leading-relaxed text-slate-600 font-normal">
              Trở thành đối tác của <strong className="text-slate-900 font-bold">DUDI SOFTWARE</strong> ngay hôm nay. Giới thiệu bạn bè mua sắm PC, Laptop thành công và nhận ngay hoa hồng tiền mặt lên đến{" "}
              <span className="inline-block font-black text-[#eb1c24] bg-red-50 px-2 py-0.5 rounded-lg border border-red-200/60">
                500.000 VNĐ
              </span>{" "}
              cho mỗi đơn hàng. Không giới hạn số lượng đơn giới thiệu!
            </p>

            {/* Call To Action Buttons */}
            <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="https://zalo.me/2871243904030074512"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-linear-to-r from-[#eb1c24] to-red-600 px-7 py-3.5 font-black text-sm uppercase tracking-wider text-white shadow-lg shadow-red-600/25 transition-all duration-200 hover:from-red-700 hover:to-red-600 hover:shadow-xl hover:shadow-red-600/35 active:scale-98 cursor-pointer"
              >
                <span>Liên Hệ Tư Vấn Ngay</span>
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#the-le-nhan-qua"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-7 py-3.5 font-bold text-sm uppercase tracking-wider text-slate-800 transition-all shadow-2xs hover:border-slate-300 hover:text-[#eb1c24] active:scale-98 cursor-pointer text-center"
              >
                Xem Thể Lệ
              </a>
            </div>

            {/* Social Proof / Trust stats */}
            <div className="mt-4 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-5 sm:gap-6">
              <div className="flex -space-x-3 items-center">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-xs ring-1 ring-slate-100"
                  >
                    <img
                      src={avatar}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white text-[11px] font-black shadow-xs">
                  +1.2K
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-xs font-black text-slate-900">4.9/5</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  <strong className="text-slate-900 font-bold">1,200+</strong> đối tác đã nhận hoa hồng thành công
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Earnings Live Dashboard Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-md">
              {/* Subtle ambient gradient */}
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-red-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                {/* Total Earnings Header Box */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-md">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tổng Hoa Hồng Đã Chi Trả</span>
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                      12.500.000<span className="text-red-400 font-bold text-xl sm:text-2xl">₫</span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-red-400 flex items-center justify-center shadow-inner shrink-0">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>

                {/* Real-time referral transaction items */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                    <span>Giao Dịch Giới Thiệu Gần Đây</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Trực tiếp
                    </span>
                  </div>

                  {/* Transaction Item 1 */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 p-3.5 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-[13px] text-slate-900 truncate">
                          PC Gaming Custom i5 13400F
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Đối tác: <strong className="text-slate-700">Trần Văn A</strong> • Vừa xong
                        </p>
                      </div>
                    </div>
                    <span className="ml-2 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black shrink-0">
                      +200.000₫
                    </span>
                  </div>

                  {/* Transaction Item 2 */}
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 p-3.5 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shrink-0">
                        <Laptop className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-[13px] text-slate-900 truncate">
                          Laptop Workstation ThinkPad P15
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          Đối tác: <strong className="text-slate-700">Nguyễn Thị B</strong> • 8 phút trước
                        </p>
                      </div>
                    </div>
                    <span className="ml-2 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black shrink-0">
                      +500.000₫
                    </span>
                  </div>
                </div>

                {/* Status Box */}
                <div className="rounded-2xl border border-red-100 bg-linear-to-r from-red-50/70 via-rose-50/50 to-red-50/70 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-slate-900">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span>Thanh toán tự động trong 24H qua Ngân hàng / MoMo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Nhận tiền ngay khi đơn hàng giao thành công • Minh bạch 100%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
