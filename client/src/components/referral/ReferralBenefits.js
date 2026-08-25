"use client";

import { Zap, Infinity as InfinityIcon, ThumbsUp } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Thanh Toán 24H",
    description:
      "Nhận tiền hoa hồng ngay lập tức sau khi đơn hàng được giao thành công và thanh toán hoàn tất.",
  },
  {
    icon: InfinityIcon,
    title: "Không Giới Hạn Lượt",
    description:
      "Giới thiệu càng nhiều, nhận thưởng càng lớn. Không có mức trần cho thu nhập của bạn.",
  },
  {
    icon: ThumbsUp,
    title: "Thủ Tục Cực Dễ",
    description:
      "Chỉ cần nhắn tin thông tin người mua qua Zalo, chúng tôi sẽ lo toàn bộ quá trình tư vấn và chốt sale.",
  },
];

export default function ReferralBenefits() {
  return (
    <section className="relative z-20 mx-auto -mt-6 sm:-mt-8 max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {benefits.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center gap-3.5 text-center ${
                  idx !== 0 ? "pt-6 md:pt-0 md:pl-8" : "md:pr-8"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#eb1c24] border border-red-100/80 shadow-2xs transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-base font-black uppercase tracking-wide text-slate-900">
                  {item.title}
                </h3>

                <p className="max-w-xs text-xs sm:text-[13px] leading-relaxed text-slate-500 font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
