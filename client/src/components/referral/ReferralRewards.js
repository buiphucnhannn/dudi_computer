"use client";

import {
  Monitor,
  Gamepad2,
  Palette,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const rewards = [
  {
    icon: Monitor,
    title: "PC / Laptop Văn Phòng",
    range: "Phổ thông",
    reward: "100.000đ",
  },
  {
    icon: Gamepad2,
    title: "PC / Laptop Gaming",
    range: "Dưới 20 triệu",
    reward: "200.000đ",
  },
  {
    icon: Palette,
    title: "PC Đồ Họa / Gaming Pro",
    range: "20 - 40 triệu",
    reward: "300.000đ",
  },
  {
    icon: Rocket,
    title: "Workstation / Cao Cấp",
    range: "Trên 40 triệu",
    reward: "500.000đ",
  },
];

const notes = [
  "Thanh toán chuyển khoản trong 24H",
  "Không giới hạn số lượng đơn",
  "Hỗ trợ tư vấn & chốt sale A - Z",
  "Báo cáo minh bạch 100%",
];

export default function ReferralRewards() {
  return (
    <section id="the-le-nhan-qua" className="py-12 sm:py-16 bg-white border-t border-slate-100 scroll-mt-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
            Bảng Hoa Hồng Giới Thiệu
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
            Tiền thưởng nhận được cho mỗi đơn hàng giới thiệu thành công
          </p>
        </div>

        {/* 4 Clean Minimal Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {rewards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-red-300 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-[#eb1c24] group-hover:border-red-200 transition-colors mb-2.5 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {item.range}
                </span>

                <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-1 min-h-[34px] flex items-center justify-center">
                  {item.title}
                </h3>

                <div className="mt-3 pt-3 border-t border-slate-200/70 w-full">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Hoa hồng
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#eb1c24]">
                    {item.reward}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes & Quick CTA */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            {notes.map((note, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{note}</span>
              </span>
            ))}
          </div>

          <a
            href="https://zalo.me/2871243904030074512"
            target="_blank"
            rel="noreferrer"
            className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-98"
          >
            <span>Tư vấn qua Zalo</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
