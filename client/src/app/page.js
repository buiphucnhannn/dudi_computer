"use client";

import { useEffect, useState, useMemo } from "react";
import CategorySidebar from "@/components/home/CategorySidebar";
import HeroSlider from "@/components/home/HeroSlider";
import PromoGridCards from "@/components/home/PromoGridCards";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryPills from "@/components/home/CategoryPills";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ZComputerShorts from "@/components/home/ZComputerShorts";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import CategoryProductBox from "@/components/home/CategoryProductBox";
import TechNewsSection from "@/components/home/TechNewsSection";
import CustomerGallery from "@/components/home/CustomerGallery";
import StoreLocations from "@/components/home/StoreLocations";
import SEOSection from "@/components/home/SEOSection";
import staticProducts from "@/data/products.json";
import { productAPI } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState(staticProducts);
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("all");

  // Fetch dữ liệu từ MongoDB Backend API
  useEffect(() => {
    const fetchProductsFromDB = async () => {
      try {
        const response = await productAPI.getAll({ limit: 100 });
        if (response?.data?.data?.products?.length > 0) {
          setProducts(response.data.data.products);
        }
      } catch (err) {
        console.info("[Database] Sử dụng dữ liệu offline:", err.message);
      }
    };
    fetchProductsFromDB();
  }, []);

  // 1. Lọc sản phẩm Laptop
  const laptopProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.categoryName || "").toLowerCase();
      return (
        cat.includes("laptop") ||
        name.includes("laptop") ||
        name.includes("macbook") ||
        name.includes("thinkpad")
      );
    });
  }, [products]);

  // 2. Lọc sản phẩm PC
  const pcProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.categoryName || "").toLowerCase();
      return (
        cat.includes("pc") ||
        name.includes("bộ máy") ||
        name.includes("vostro") ||
        name.includes("pc ")
      );
    });
  }, [products]);

  // 3. Lọc sản phẩm Màn hình (chỉ lấy Màn hình thuần túy, không lẫn Laptop)
  const monitorProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.categoryName || "").toLowerCase();
      const isLaptop = cat.includes("laptop") || name.startsWith("laptop") || name.startsWith("macbook");
      if (isLaptop) return false;
      return (
        cat.includes("màn hình") ||
        cat.includes("monitor") ||
        name.startsWith("màn hình") ||
        name.includes("asus vg249") ||
        name.includes("edra egm24") ||
        name.includes("dell e2225") ||
        name.includes("philips 22e2") ||
        name.includes("asus vp227") ||
        name.includes("tuf vg279") ||
        name.includes("odyssey g5") ||
        name.includes("ultragear 32") ||
        name.includes("strix xg32")
      );
    });
  }, [products]);

  // 4. Lọc sản phẩm Nguồn máy tính (PSU)
  const psuProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.categoryName || "").toLowerCase();
      return (
        cat.includes("nguồn") ||
        cat.includes("psu") ||
        name.startsWith("nguồn") ||
        name.startsWith("psu") ||
        name.includes("850w") ||
        name.includes("750w") ||
        name.includes("700w") ||
        name.includes("650w")
      );
    });
  }, [products]);

  // 5. Lọc sản phẩm Mainboard (Bo mạch chủ)
  const mainboardProducts = useMemo(() => {
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.categoryName || "").toLowerCase();
      return (
        cat.includes("mainboard") ||
        cat.includes("bo mạch") ||
        name.startsWith("mainboard") ||
        name.startsWith("bo mạch") ||
        name.includes("b760m") ||
        name.includes("z790") ||
        name.includes("b650")
      );
    });
  }, [products]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-5 space-y-6 sm:space-y-8">
      {/* 1. Hero Area: Sidebar + Full width carousel */}
      <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch">
        <CategorySidebar />
        <HeroSlider />
      </section>

      {/* 2. 4 Promo Cards Row */}
      <PromoGridCards />

      {/* 3. 5 Service Trust Criteria */}
      <ServiceFeatures />

      {/* 4. Circular Category Icons */}
      <CategoryPills
        activeCategory={selectedCategoryPill}
        onSelectCategory={setSelectedCategoryPill}
      />

      {/* 5. ⚡ FLASH SALE Section */}
      <FlashSaleSection products={products} />

      {/* 6. ▶ ZCOMPUTER SHORT Video Shorts */}
      <ZComputerShorts />

      {/* 7. 🔥 SẢN PHẨM NỔI BẬT (Featured Slider) */}
      <FeaturedProductsSection products={products} />

      {/* 8. 🏷️ Brand Logos Bar (Infinite Marquee) */}
      <BrandLogosBar />

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
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "B760", slug: "b760" },
          { name: "Z790", slug: "z790" },
        ]}
        products={mainboardProducts}
      />

      {/* 14. 📰 TIN TỨC CÔNG NGHỆ MỚI */}
      <TechNewsSection />

      {/* 15. 🌟 LỜI CẢM ƠN TỪ ZCOMPUTER & HÌNH ẢNH KHÁCH HÀNG */}
      <CustomerGallery />

      {/* 16. 📍 HỆ THỐNG SHOWROOM & BẢN ĐỒ GOOGLE MAPS */}
      <div id="he-thong-showroom">
        <StoreLocations />
      </div>

      {/* 17. 📖 SEO SECTION */}
      <SEOSection />
    </div>
  );
}
