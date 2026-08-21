import Link from "next/link";
import {
    Backpack,
    Briefcase,
    Mouse,
    Layers,
    Wrench,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import PromotionGiftCard from "./PromotionGiftCard";
import PromotionMainCard from "./PromotionMainCard";

const gifts = [
    {
        icon: Backpack,
        title: "Balo Chuyên Dụng",
        value: "Trị giá 350.000đ",
    },
    {
        icon: Briefcase,
        title: "Túi Chống Sốc",
        value: "Trị giá 200.000đ",
    },
    {
        icon: Mouse,
        title: "Chuột Không Dây",
        value: "Trị giá 250.000đ",
    },
    {
        icon: Layers,
        title: "Lót Chuột",
        value: "Trị giá 150.000đ",
    },
    {
        icon: Wrench,
        title: "Dịch Vụ Trọn Đời",
        value: "Bảo Trì",
    },
];

export default function StudentPromotionSection() {
    return (
        <section className="w-full border-t border-[#b70011]/20 bg-[#050505] py-20 text-white">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-10">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b70011]/50 bg-black/50 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em]">
                        <Sparkles className="h-3.5 w-3.5 text-[#b70011]" />
                        <span>Chương trình khuyến mãi</span>
                    </div>

                    <h2 className="mb-4 text-[32px] font-extrabold uppercase italic leading-tight md:text-[48px]">
                        Chính sách hỗ trợ{" "}
                        <span className="text-[#b70011]">
                            Học sinh - Sinh viên
                        </span>
                    </h2>

                    <p className="mx-auto max-w-2xl text-base text-white/60">
                        Áp dụng cho khách hàng có thẻ HSSV hoặc Giấy báo
                        nhập học hợp lệ.
                    </p>
                </div>

                {/* Main promotion */}
                <PromotionMainCard />

                {/* Gifts */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-6">
                    {gifts.map((gift) => (
                        <PromotionGiftCard
                            key={gift.title}
                            icon={gift.icon}
                            title={gift.title}
                            value={gift.value}
                        />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <h2 className="mb-4 text-[32px] font-extrabold uppercase italic leading-tight md:text-[48px]">
                        Đồng hành cùng bạn
                    </h2>

                    <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/60">
                        Khởi đầu chặng đường học tập với những sản phẩm
                        công nghệ chất lượng nhất. Đội ngũ ZCOMPUTER luôn
                        tận tâm đồng hành, sẵn sàng tư vấn giải pháp và cấu
                        hình tối ưu, đáp ứng trọn vẹn mọi nhu cầu cá nhân
                        của khách hàng.
                    </p>

                    <Link
                        href="/tat-ca-san-pham"
                        className="group mx-auto flex w-fit items-center gap-2 rounded-full border border-white bg-white px-8 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-transparent hover:text-white"
                    >
                        <span>XEM SẢN PHẨM</span>

                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}