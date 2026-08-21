import {
  BadgeCheck,
  Banknote,
  Wrench,
  Zap,
} from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    text: "Hệ thống phân phối PC/Laptop uy tín hàng đầu",
  },
  {
    icon: Banknote,
    text: "Sản phẩm chất lượng với giá Rẻ Nhất thị trường",
  },
  {
    icon: Wrench,
    text: "Hỗ trợ kỹ thuật trọn đời với đội ngũ KTV kinh nghiệm",
  },
  {
    icon: Zap,
    text: "Dịch vụ bảo hành, bảo trì sản phẩm siêu tốc.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="flex w-full flex-col gap-4">

      {/* Title */}
      <h2 className="flex items-center gap-2 text-lg font-extrabold leading-tight text-slate-900">
        <span className="h-6 w-1 shrink-0 rounded-sm bg-red-600" />
        <span>VÌ SAO NÊN CHỌN DUDI SOFTWARE?</span>
      </h2>

      {/* Reasons */}
      <div className="flex flex-col gap-2.5">
        {reasons.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-sm
              transition-all
              duration-300
              hover:border-red-600
              hover:shadow-md
            "
          >
            {/* Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
              <Icon className="h-4 w-4 text-red-600" />
            </div>

            {/* Text */}
            <p className="text-xs font-medium leading-relaxed text-slate-900">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;