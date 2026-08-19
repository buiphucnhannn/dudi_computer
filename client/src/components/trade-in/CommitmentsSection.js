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
    <section className="relative w-full overflow-hidden bg-gray-50 py-20 md:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Image */}
          <div className="group relative lg:col-span-5">
            <div className="absolute inset-0 scale-90 bg-red-600/20 blur-2xl transition-transform duration-700 group-hover:scale-100" />

            <div className="relative h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 md:h-[500px]">
              <img
                src="screen.webp"
                alt="ZComputer thu mua"
                className="h-full w-full"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-10 lg:col-span-7 lg:pl-12">
            <div>
              <h2 className="mb-4 text-3xl font-black uppercase text-gray-900 md:text-4xl">
                Chúng Tôi Cam Kết
              </h2>

              <div className="mb-6 h-1 w-16 bg-red-600" />

              <p className="text-base leading-relaxed text-gray-500 md:text-lg">
                Quy trình làm việc minh bạch, chuyên nghiệp, đặt lợi ích của
                khách hàng lên hàng đầu.
              </p>
            </div>

            {/* Commitment list */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {commitments.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-200 bg-white">
                      <Icon size={20} className="text-red-600" />
                    </div>

                    <div>
                      <h4 className="mb-2 text-base font-bold text-gray-900">
                        {item.title}
                      </h4>

                      <p className="text-sm leading-relaxed text-gray-500">
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
