import { ShieldCheck, Wrench, ThumbsUp } from "lucide-react";
import ValueCard from "./ValueCard";

const values = [
    {
        icon: ShieldCheck,
        title: "Sản Phẩm Chính Hãng",
        description:
            "Phân phối các sản phẩm chính ngạch, đảm bảo nguồn gốc xuất xứ rõ ràng.",
    },
    {
        icon: Wrench,
        title: "Bảo Hành Chuyên Nghiệp",
        description:
            "Hỗ trợ kỹ thuật nhanh chóng, tiếp nhận bảo hành theo đúng tiêu chuẩn của hãng.",
    },
    {
        icon: ThumbsUp,
        title: "Chi Phí Tối Ưu",
        description:
            "Cung cấp giải pháp công nghệ với mức chi phí hợp lý cùng các chương trình hỗ trợ.",
    },
];

export default function ValuePropositionSection() {
    return (
        <section className="w-full border-t border-[#b70011]/20 bg-[#050505] py-20">
            <div className="mx-auto max-w-[1280px] px-4 lg:px-10">
                {/* Heading */}
                <div className="mb-16 space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-white">
                        Tiêu Chuẩn{" "}
                        <span className="text-[#b70011]">
                            ZComputer
                        </span>
                    </h2>

                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60">
                        Cam kết mang đến trải nghiệm mua sắm và sử dụng
                        sản phẩm công nghệ hoàn hảo nhất.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {values.map((item) => (
                        <ValueCard
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}