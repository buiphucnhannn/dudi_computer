"use client";

import ReferralHero from "@/components/referral/ReferralHero";
import ReferralBenefits from "@/components/referral/ReferralBenefits";
import ReferralProcess from "@/components/referral/ReferralProcess";
import ReferralRewards from "@/components/referral/ReferralRewards";
import ReferralCTA from "@/components/referral/ReferralCTA";
import ShowroomSection from "@/components/referral/ShowroomSection";

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
