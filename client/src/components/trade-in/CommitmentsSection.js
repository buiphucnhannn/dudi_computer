import { BadgeDollarSign, Timer, FileText, ShieldCheck } from "lucide-react";

const commitments = [
  {
    icon: BadgeDollarSign,
    title: "Giá cao cạnh tranh",
    description:
      "Báo giá chuẩn xác theo tình trạng máy thực tế, cam kết tuyệt đối không ép giá khách hàng.",
  },
  {
    icon: Timer,
    title: "Thu mua cực nhanh",
    description:
      "Test máy thần tốc trong 5 phút, thanh toán tiền mặt hoặc chuyển khoản tức thì 100%.",
  },
  {
    icon: FileText,
    title: "Thủ tục đơn giản",
    description:
      "Chỉ cần mang máy đến cửa hàng, mọi thủ tục test máy và định giá chúng tôi sẽ lo liệu.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật thông tin",
    description:
      "Hỗ trợ backup dữ liệu và xóa sạch dữ liệu cũ an toàn tuyệt đối 100% trước khi thu mua.",
  },
];

export default function CommitmentsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50/70 py-10 sm:py-12 md:py-14 border-t border-slate-200/60">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Image */}
          <div className="group relative lg:col-span-5">
            <div className="absolute inset-0 scale-95 bg-red-600/10 blur-xl transition-transform duration-700 group-hover:scale-100" />

            <div className="relative h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src="/screen.webp"
                alt="ZComputer thu mua"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 lg:col-span-7 lg:pl-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-red-600 mb-1 block">
                UY TÍN & CHẤT LƯỢNG
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
                Chúng Tôi Cam Kết
              </h2>

              <div className="mt-2 mb-3 h-1 w-16 rounded-full bg-red-600 shadow-2xs" />

              <p className="text-xs sm:text-sm leading-relaxed text-slate-500 max-w-xl">
                Quy trình làm việc minh bạch, chuyên nghiệp, đặt lợi ích của
                khách hàng lên hàng đầu.
              </p>
            </div>

            {/* Commitment list */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {commitments.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 shadow-2xs">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
