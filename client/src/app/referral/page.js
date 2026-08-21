import ReferralHero from "@/components/referral/ReferralHero";
import ReferralBenefits from "@/components/referral/ReferralBenefits";
import ReferralProcess from "@/components/referral/ReferralProcess";
import ReferralRewards from "@/components/referral/ReferralRewards";
import ReferralCTA from "@/components/referral/ReferralCTA";
import ShowroomSection from "@/components/referral/ShowroomSection";

export const metadata = {
  title: "Giới Thiệu Bạn Bè - Nhận Quà Liền Tay",
  description: "Chương trình giới thiệu bạn bè mua PC, Laptop nhận voucher và hoa hồng hấp dẫn tại DUDI SOFTWARE.",
};

export default function Page() {
  return (
    <main className="w-full bg-[#f8f9fa]">
      <ReferralHero />

      <ReferralBenefits />

      <ReferralProcess />

      <ReferralRewards />

      <ReferralCTA />

      <ShowroomSection />
    </main>
  );
}
