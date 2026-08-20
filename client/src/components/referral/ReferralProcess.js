import { Share2, ShoppingBag, CreditCard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Share2,
    title: "Chia Sẻ & Giới Thiệu",
    description:
      "Gửi thông tin bạn bè có nhu cầu mua sắm qua Zalo hoặc Fanpage cho ZCOMPUTER.",
  },
  {
    number: "02",
    icon: ShoppingBag,
    title: "Mua Sắm Thành Công",
    description:
      "Nhân viên ZCOMPUTER tư vấn, chốt đơn và giao hàng thành công cho người được giới thiệu.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Nhận Quà Tặng",
    description:
      "Hoa hồng được chuyển khoản trực tiếp vào tài khoản của bạn trong vòng 24h.",
  },
];

const ReferralProcess = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="mb-16 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-700">
            Đơn Giản - Nhanh Chóng
          </p>

          <h2 className="text-3xl font-bold uppercase text-slate-900">
            Quy Trình Nhận Quà
          </h2>
        </div>

        <div className="relative">
          {/* Line */}
          <div className="absolute left-0 top-12 hidden h-px w-full bg-slate-200 md:block" />

          <div className="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <div
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 bg-white shadow-lg ${
                      index === 1 ? "border-red-700/50" : "border-slate-200"
                    }`}
                  >
                    <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white">
                      {step.number}
                    </span>

                    <Icon
                      className={`h-9 w-9 ${
                        index === 1 ? "text-red-700" : "text-slate-800"
                      }`}
                    />
                  </div>

                  <div>
                    <h4 className="mb-2 text-lg font-semibold uppercase">
                      {step.title}
                    </h4>

                    <p className="text-sm leading-5 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralProcess;
