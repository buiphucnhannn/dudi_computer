import { Laptop, Monitor, CircuitBoard, ImageOff } from "lucide-react";

const services = [
  {
    icon: Laptop,
    title: "Laptop Gaming / Văn phòng cũ",
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
    title: "Linh Kiện Lẻ (VGA, CPU, Main)",
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
    <section id="kham-pha" className="w-full bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-black uppercase text-gray-900 md:text-4xl">
            Thu Mua Mọi Tình Trạng
          </h2>

          <div className="mb-6 h-1 w-24 bg-red-600" />

          <p className="max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            Từ máy cũ, đến máy nguyên seal, DUDI SOFTWARE đều thu mua với giá tốt
            nhất thị trường, đảm bảo quyền lợi tối đa cho khách hàng.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg"
              >
                {/* Decorative icon */}
                <div className="absolute right-3 top-3 opacity-5 transition-opacity group-hover:opacity-10">
                  <Icon size={80} className="text-red-600" />
                </div>

                {/* Main icon */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors group-hover:border-red-600">
                  <Icon
                    size={22}
                    className="text-gray-800 transition-colors group-hover:text-red-600"
                  />
                </div>

                <h3 className="relative z-10 text-lg font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="relative z-10 text-sm leading-relaxed text-gray-500">
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
