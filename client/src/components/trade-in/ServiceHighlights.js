import { Laptop, Monitor, CircuitBoard, ImageOff } from "lucide-react";

const services = [
  {
    icon: Laptop,
    title: "Laptop Gaming & Văn Phòng Cũ",
    description:
      "Thu mua tất cả các dòng laptop từ phổ thông đến cao cấp, đánh giá đúng tình trạng thực tế.",
  },
  {
    icon: Monitor,
    title: "PC Gaming Đã Qua Sử Dụng",
    description:
      "Định giá linh hoạt theo từng linh kiện, ưu tiên các dàn máy bộ tự build hoặc pre-built.",
  },
  {
    icon: CircuitBoard,
    title: "Linh Kiện Lẻ (VGA, CPU, RAM)",
    description:
      "Nhận thu mua lẻ từng bộ phận rời rạc, linh kiện nâng cấp thừa, còn bảo hành hoặc hết bảo hành.",
  },
  {
    icon: ImageOff,
    title: "Máy Lỗi, Hư Hỏng, Xác Máy",
    description:
      "Đừng vội bỏ đi, chúng tôi thu mua cả xác máy, máy vỡ màn, vào nước, mất nguồn để tận dụng linh kiện.",
  },
];

export default function ServiceHighlights() {
  return (
    <section id="kham-pha" className="w-full bg-white py-10 sm:py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 sm:mb-10 flex flex-col items-center text-center">
          <span className="text-xs font-black uppercase tracking-wider text-red-600 mb-1">
            DANH MỤC TIẾP NHẬN
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
            Thu Mua Mọi Tình Trạng
          </h2>

          <div className="mt-2 mb-3 h-1 w-16 rounded-full bg-red-600 shadow-2xs" />

          <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-slate-500">
            Từ máy cũ, đến máy nguyên seal, ZComputer đều thu mua với giá tốt
            nhất thị trường, đảm bảo quyền lợi tối đa cho khách hàng.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:bg-white hover:shadow-md"
              >
                {/* Decorative icon */}
                <div className="absolute right-2.5 top-2.5 opacity-5 transition-opacity group-hover:opacity-10">
                  <Icon size={64} className="text-red-600" />
                </div>

                {/* Main icon */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-2xs transition-colors group-hover:border-red-600 group-hover:bg-red-50">
                  <Icon
                    size={18}
                    className="text-slate-800 transition-colors group-hover:text-red-600"
                  />
                </div>

                <h3 className="relative z-10 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {service.title}
                </h3>

                <p className="relative z-10 text-xs sm:text-[13px] leading-relaxed text-slate-500">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
