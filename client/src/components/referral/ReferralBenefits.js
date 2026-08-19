import { Zap, Infinity, ThumbsUp } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Thanh Toán 24H",
    description:
      "Nhận tiền hoa hồng ngay lập tức sau khi đơn hàng được giao thành công và thanh toán hoàn tất.",
  },
  {
    icon: Infinity,
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

const ReferralBenefits = () => {
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1280px] rounded-xl border-y border-slate-200 bg-slate-100 px-4 py-16 shadow-xl md:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {benefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white transition group-hover:border-red-700 group-hover:bg-red-50">
                <Icon className="h-7 w-7 text-red-700" />
              </div>

              <h3 className="text-lg font-semibold uppercase tracking-wide">
                {item.title}
              </h3>

              <p className="max-w-sm text-sm leading-5 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ReferralBenefits;
