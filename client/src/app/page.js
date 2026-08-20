"use client";

import { useMemo, useState } from "react";
import CategorySidebar from "@/components/home/CategorySidebar";
import HeroSlider from "@/components/home/HeroSlider";
import PromoGridCards from "@/components/home/PromoGridCards";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryPills from "@/components/home/CategoryPills";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ZComputerShorts from "@/components/home/ZComputerShorts";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import CategoryProductBox from "@/components/home/CategoryProductBox";
import TechNewsSection from "@/components/home/TechNewsSection";
import CustomerGallery from "@/components/home/CustomerGallery";
import products from "@/data/products.json";

export default function Home() {
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("all");

  // Lọc sản phẩm cho 5 khối Danh Mục Sản Phẩm chuẩn 100% website gốc
  const laptopProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return (
        cat.includes("laptop") ||
        name.includes("laptop") ||
        name.includes("dell latitude") ||
        name.includes("lenovo thinkpad") ||
        name.includes("macbook")
      );
    });
  }, [products]);

  const pcProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return (
        cat.includes("pc") ||
        name.startsWith("pc") ||
        name.includes("bộ máy tính") ||
        name.includes("case pc") ||
        name.includes("i5") ||
        name.includes("i7") ||
        name.includes("ryzen")
      );
    });
  }, [products]);

  const monitorProducts = useMemo(() => {
    const directMonitors = products.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return (
        cat.includes("màn hình") ||
        cat.includes("monitor") ||
        name.includes("màn hình") ||
        name.includes("monitor")
      );
    });

    if (directMonitors.length >= 4) return directMonitors;

    // Bổ sung các màn hình chuẩn từ zcomputer.vn
    const fallbackMonitors = [
      {
        id: "mon-1",
        name: "MÀN HÌNH MÁY TÍNH KTC H24V13 24 INCH VA 100HZ FHD NEW",
        price: 1590000,
        originalPrice: 1890000,
        slug: "man-hinh-ktc-h24v13-24-inch-100hz",
        image: "https://zcomputer.vn/uploads/image-1785590924976-597554988.webp",
        badge: "New 100%",
        specs: {
          kichThuoc: "23.8 inch",
          doPhanGiai: "FHD (1920x1080)",
          tanSoQuet: "100Hz",
          tamNen: "VA",
        },
      },
      {
        id: "mon-2",
        name: "MÀN HÌNH GAMING VIEWSONIC VX2479-HD-PRO 24 INCH IPS 165HZ",
        price: 2490000,
        originalPrice: 2890000,
        slug: "man-hinh-viewsonic-vx2479-hd-pro-165hz",
        image: "https://zcomputer.vn/uploads/image-1785591040855-885444738.webp",
        badge: "Like New",
        specs: {
          kichThuoc: "24 inch",
          doPhanGiai: "FHD (1920x1080)",
          tanSoQuet: "165Hz",
          tamNen: "Fast IPS",
        },
      },
      {
        id: "mon-3",
        name: "MÀN HÌNH GIGABYTE G27F 2 27 INCH IPS 170HZ CHUYÊN GAME",
        price: 3390000,
        originalPrice: 3990000,
        slug: "man-hinh-gigabyte-g27f-2-170hz",
        image: "https://zcomputer.vn/uploads/image-1785591150244-665578125.webp",
        badge: "Chính Hãng",
        specs: {
          kichThuoc: "27 inch",
          doPhanGiai: "FHD (1920x1080)",
          tanSoQuet: "170Hz",
          tamNen: "IPS",
        },
      },
      {
        id: "mon-4",
        name: "MÀN HÌNH CONG SAMSUNG ODYSSEY G5 G55C 32 INCH 2K 165HZ",
        price: 4990000,
        originalPrice: 5890000,
        slug: "man-hinh-samsung-odyssey-g5-32-inch-2k",
        image: "https://zcomputer.vn/uploads/image-1785591240112-998877665.webp",
        badge: "Hot Sale",
        specs: {
          kichThuoc: "32 inch Cong 1000R",
          doPhanGiai: "2K QHD (2560x1440)",
          tanSoQuet: "165Hz",
          tamNen: "VA",
        },
      },
    ];

    return [...directMonitors, ...fallbackMonitors].slice(0, 8);
  }, [products]);

  const psuProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return (
        name.includes("nguồn") ||
        name.includes("psu") ||
        cat.includes("nguồn") ||
        cat.includes("psu")
      );
    });
  }, [products]);

  const mainboardProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = p.category?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      return (
        name.startsWith("main") ||
        name.startsWith("bo mạch") ||
        cat.includes("mainboard") ||
        cat.includes("bo mạch")
      );
    });
  }, [products]);

  return (
    <div className="container mx-auto px-2 sm:px-4 pt-0 pb-0">
      {/* 1. Hero Area: Sidebar + Full width carousel */}
      <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch mb-3 sm:mb-4">
        <CategorySidebar />
        <HeroSlider />
      </section>

      {/* 2. 4 Promo Cards Row */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <PromoGridCards />
      </div>

      {/* 3. 5 Service Trust Criteria */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <ServiceFeatures />
      </div>

      {/* 4. Circular Category Icons */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <CategoryPills
          activeCategory={selectedCategoryPill}
          onSelectCategory={setSelectedCategoryPill}
        />
      </div>

      {/* 5. ⚡ FLASH SALE Section */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <FlashSaleSection products={products} />
      </div>

      {/* 6. ▶ ZCOMPUTER SHORT Video Shorts */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <ZComputerShorts />
      </div>

      {/* 7. 🔥 SẢN PHẨM NỔI BẬT (Featured Slider) */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <FeaturedProductsSection products={products} />
      </div>

      {/* 8. 🏷️ Brand Logos Bar (Infinite Marquee) */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <BrandLogosBar />
      </div>

      {/* 9. 💻 LAPTOP CŨ Box */}
      <CategoryProductBox
        title="LAPTOP CŨ"
        mainSlug="laptop-cu"
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "Laptop Văn phòng", slug: "van-phong" },
          { name: "Laptop Gaming", slug: "gaming" },
          { name: "Macbook", slug: "macbook" },
        ]}
        products={laptopProducts}
      />

      {/* 10. 🖥️ PC CŨ Box */}
      <CategoryProductBox
        title="PC CŨ"
        mainSlug="pc-cu"
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "PC Gaming", slug: "pc-gaming" },
          { name: "PC Đồ họa", slug: "pc-do-hoa" },
          { name: "PC Văn phòng", slug: "pc-van-phong" },
        ]}
        products={pcProducts}
      />

      {/* 11. 📺 MÀN HÌNH MÁY TÍNH Box */}
      <CategoryProductBox
        title="MÀN HÌNH MÁY TÍNH"
        mainSlug="man-hinh"
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "24 inch", slug: "24-inch" },
          { name: "27 inch", slug: "27-inch" },
          { name: "32 inch", slug: "32-inch" },
        ]}
        products={monitorProducts}
      />

      {/* 12. ⚡ PSU - NGUỒN MÁY TÍNH Box */}
      <CategoryProductBox
        title="PSU - NGUỒN MÁY TÍNH"
        mainSlug="psu-nguon-may-tinh"
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "850W", slug: "850w" },
          { name: "750W", slug: "750w" },
          { name: "700W", slug: "700w" },
        ]}
        products={psuProducts}
      />

      {/* 13. 🎛️ MAINBOARD - BO MẠCH CHỦ Box */}
      <CategoryProductBox
        title="MAINBOARD - BO MẠCH CHỦ"
        mainSlug="mainboard-bo-mach-chu"
        tabs={[]}
        products={mainboardProducts}
      />

      {/* 14. 📰 TIN TỨC CÔNG NGHỆ MỚI */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <TechNewsSection />
      </div>

      {/* 15. 🌟 LỜI CẢM ƠN TỪ ZCOMPUTER & HÌNH ẢNH KHÁCH HÀNG (Nền đen tràn viền) */}
      <CustomerGallery />
    </div>
  );
}
