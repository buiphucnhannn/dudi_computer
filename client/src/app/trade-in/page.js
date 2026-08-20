"use client";

import HeroSection from "@/components/trade-in/HeroSection";
import ServiceHighlights from "@/components/trade-in/ServiceHighlights";
import CommitmentsSection from "@/components/trade-in/CommitmentsSection";
import CategoriesSection from "@/components/trade-in/CategoriesSection";
import ContactCTA from "@/components/trade-in/ContactCTA";
import StoreSystem from "@/components/trade-in/StoreSystem";

export default function Page() {
  return (
    <main className="w-full bg-[#f8f9fa]">
      <HeroSection />

      <ServiceHighlights />

      <CommitmentsSection />

      <CategoriesSection />

      <ContactCTA />

      <StoreSystem />
    </main>
  );
}
