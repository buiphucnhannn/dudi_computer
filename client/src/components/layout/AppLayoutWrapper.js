"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const FloatingWidgets = dynamic(() => import("@/components/layout/FloatingWidgets"), { ssr: false });
const PromotionPopup = dynamic(() => import("@/components/common/PromotionPopup"), { ssr: false });

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <FloatingWidgets />
      <PromotionPopup />
    </>
  );
}
