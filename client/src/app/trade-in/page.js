import HeroSection from "@/components/trade-in/HeroSection";
import ServiceHighlights from "@/components/trade-in/ServiceHighlights";
import CommitmentsSection from "@/components/trade-in/CommitmentsSection";
import CategoriesSection from "@/components/trade-in/CategoriesSection";
import ContactCTA from "@/components/trade-in/ContactCTA";

export const metadata = {
  title: "Thu Cũ Đổi Mới PC, Laptop Trợ Giá Cao Nhất",
  description: "Dịch vụ thu mua máy cũ, nâng cấp PC, Laptop đời mới trợ giá hấp dẫn nhất tại DUDI SOFTWARE.",
};

export default function Page() {
  return (
    <main className="w-full bg-[#f8f9fa] pb-12">
      <HeroSection />

      <ServiceHighlights />

      <CommitmentsSection />

      <CategoriesSection />

      <ContactCTA />
    </main>
  );
}
