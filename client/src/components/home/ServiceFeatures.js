import { Truck, RotateCcw, CreditCard, Tag, Headphones } from "lucide-react";

export default function ServiceFeatures() {
  const features = [
    {
      icon: Truck,
      iconColor: "text-[#6c5ce7]",
      title: "Giao hàng toàn quốc",
      desc: "Nhanh chóng & An toàn",
    },
    {
      icon: RotateCcw,
      iconColor: "text-[#e1b12c]",
      title: "Đổi trả dễ dàng",
      desc: "Trong 7 ngày",
    },
    {
      icon: CreditCard,
      iconColor: "text-[#6c5ce7]",
      title: "Thanh toán an toàn",
      desc: "Nhiều hình thức",
    },
    {
      icon: Tag,
      iconColor: "text-[#e1b12c]",
      title: "Sản phẩm chính hãng",
      desc: "Cam kết 100%",
    },
    {
      icon: Headphones,
      iconColor: "text-[#6c5ce7]",
      title: "Hỗ trợ 24/7",
      desc: "0977.334.415",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs py-3.5 px-2 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 gap-y-3">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 sm:px-4 group cursor-default ${
                idx === 4 ? "col-span-2 md:col-span-1 justify-center md:justify-start pt-2 md:pt-0" : ""
              }`}
            >
              <Icon
                className={`w-7 h-7 sm:w-8 sm:h-8 ${item.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}
              />
              <div className="text-left overflow-hidden">
                <p className="font-bold text-gray-800 text-[13px] leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
