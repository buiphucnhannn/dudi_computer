import HeroSection from "@/components/student-promotion/HeroSection";
import ValuePropositionSection from "@/components/student-promotion/ValuePropositionSection";
import StudentPromotionSection from "@/components/student-promotion/StudentPromotionSection";

export const metadata = {
    title: "Ưu Đãi Học Sinh - Sinh Viên | ZComputer",
    description:
        "Chương trình khuyến mãi và chính sách hỗ trợ giá đặc biệt dành riêng cho Học sinh - Sinh viên tại ZComputer.",
};

export default function StudentPromotionPage() {
    return (
        <main className="w-full bg-[#050505]">
            <HeroSection />

            <ValuePropositionSection />

            <StudentPromotionSection />
        </main>
    );
}