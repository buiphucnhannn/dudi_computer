import { Info, Monitor, Gamepad2, Palette, Rocket } from "lucide-react";

const rewards = [
  {
    icon: Monitor,
    title: "PC / Laptop Văn Phòng",
    subtitle: null,
    description:
      "Phân khúc phổ thông, đáp ứng nhu cầu học tập, làm việc cơ bản.",
    reward: "100.000₫",
  },
  {
    icon: Gamepad2,
    title: "PC / Laptop Gaming",
    subtitle: "Dưới 20 Triệu",
    description: "Phân khúc tầm trung, chiến game mượt mà.",
    reward: "200.000₫",
  },
  {
    icon: Palette,
    title: "PC Đồ Họa / Laptop Gaming",
    subtitle: "Từ 20 - 40 Triệu",
    description: "Cấu hình mạnh mẽ cho thiết kế, render và hardcore gaming.",
    reward: "300.000₫",
    popular: true,
  },
  {
    icon: Rocket,
    title: "PC Workstation / Laptop Cao Cấp",
    subtitle: "Trên 40 Triệu",
    description: "Cỗ máy tối thượng, hiệu năng đỉnh cao không giới hạn.",
    reward: "500.000₫",
    featured: true,
  },
];

const ReferralRewards = () => {
  return (
    <section id="the-le-nhan-qua" className="relative overflow-hidden bg-white py-24 scroll-mt-16">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-8">
        <div className="flex flex-col items-start gap-16 lg:flex-row">
          {/* Description */}
          <div className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:w-1/3">
            <h2 className="border-l-4 border-red-700 pl-4 text-3xl font-bold uppercase">
              Danh Sách Quà Tặng Chi Tiết
            </h2>

            <p className="text-base leading-6 text-slate-500">
              Mức hoa hồng được phân chia rõ ràng theo từng phân khúc sản phẩm.
              Giá trị đơn hàng càng cao, tiền thưởng nhận được càng hấp dẫn.
            </p>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-100 p-6">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Info className="h-5 w-5 text-red-700" />
                Lưu ý
              </h4>

              <ul className="list-inside list-disc space-y-3 text-sm leading-5 text-slate-500">
                <li>Chỉ áp dụng cho đơn hàng thanh toán thành công 100%.</li>
                <li>
                  Không áp dụng đồng thời với voucher giảm giá của nhân viên.
                </li>
                <li>Tiền thưởng được thanh toán qua chuyển khoản ngân hàng.</li>
              </ul>
            </div>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:w-2/3">
            {rewards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-xl border p-8 transition ${
                    item.featured
                      ? "border-red-700/50 shadow-lg"
                      : item.popular
                        ? "border-red-700/30"
                        : "border-slate-200"
                  } bg-slate-100 hover:bg-slate-200`}
                >
                  {item.popular && (
                    <div className="absolute right-4 top-4 rounded-sm bg-red-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Phổ biến
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded border ${
                        item.featured
                          ? "border-red-700 bg-red-700"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          item.featured
                            ? "text-white"
                            : item.popular
                              ? "text-red-700"
                              : "text-slate-900"
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>

                      {item.subtitle && (
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-red-700">
                          {item.subtitle}
                        </p>
                      )}

                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Hoa hồng
                      </span>

                      <span className="text-2xl font-bold text-red-700">
                        {item.reward}
                      </span>
                    </div>
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

export default ReferralRewards;
