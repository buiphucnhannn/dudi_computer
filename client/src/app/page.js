"use client";

import { useMemo, useState, useEffect } from "react";
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
import HomeNewsSection from "@/components/home/HomeNewsSection";
import CustomerGallery from "@/components/home/CustomerGallery";
import { productAPI } from "@/lib/api";

export default function Home() {
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productAPI.getAll({ limit: 100 });
        if (res.data && res.data.data && res.data.data.products) {
          setProducts(res.data.data.products);
        } else if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm từ Database:", error);
      }
    };
    loadProducts();
  }, []);

  // Lọc sản phẩm cho 5 khối Danh Mục Sản Phẩm
  const laptopProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      
      // Loại trừ các bộ máy PC, linh kiện rời
      if (
        name.startsWith("bộ máy") ||
        name.startsWith("máy tính để bàn") ||
        name.startsWith("pc ") ||
        name.includes("case pc") ||
        name.startsWith("main") ||
        name.startsWith("nguồn") ||
        catSlug.includes("pc-") ||
        catSlug === "mainboard-bo-mach-chu" ||
        catSlug === "psu-nguon-may-tinh" ||
        catSlug === "man-hinh"
      ) {
        return false;
      }

      return (
        catSlug === "laptop-cu" ||
        catSlug === "laptop-gaming" ||
        catSlug === "laptop-van-phong" ||
        catSlug === "macbook" ||
        cat.includes("laptop") ||
        name.includes("laptop") ||
        name.includes("thinkpad") ||
        name.includes("macbook") ||
        name.includes("surface") ||
        name.includes("latitude") ||
        name.includes("xps")
      );
    });
  }, [products]);

  const pcProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      const name = (p.name || "").toLowerCase();

      // Loại trừ laptop và linh kiện rời (Mainboard, Nguồn, VGA, RAM, CPU, SSD, Màn hình, Gear)
      if (
        name.includes("laptop") ||
        name.includes("macbook") ||
        name.includes("surface") ||
        name.startsWith("mainboard") ||
        name.startsWith("bo mạch") ||
        name.startsWith("nguồn") ||
        name.startsWith("card màn hình") ||
        name.startsWith("ram") ||
        name.startsWith("ssd") ||
        name.startsWith("cpu") ||
        name.startsWith("bàn phím") ||
        name.startsWith("chuột") ||
        catSlug.includes("laptop") ||
        catSlug === "macbook" ||
        catSlug === "mainboard-bo-mach-chu" ||
        catSlug === "psu-nguon-may-tinh" ||
        catSlug === "vga-card-man-hinh" ||
        catSlug === "cpu-bo-vi-xu-ly" ||
        catSlug === "ram-bo-nho-trong" ||
        catSlug === "o-cung-hdd-ssd" ||
        catSlug === "man-hinh" ||
        catSlug === "ban-phim" ||
        catSlug === "chuot"
      ) {
        return false;
      }

      return (
        catSlug === "pc-cu" ||
        catSlug === "pc-gaming" ||
        catSlug === "pc-do-hoa" ||
        catSlug === "pc-van-phong" ||
        name.startsWith("bộ máy") ||
        name.startsWith("pc ") ||
        name.startsWith("máy tính để bàn") ||
        name.startsWith("máy tính aio")
      );
    });
  }, [products]);

  const monitorProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      const name = (p.name || "").toLowerCase();

      // Loại trừ card màn hình (VGA), laptop, PC
      if (
        name.includes("card màn hình") ||
        name.includes("vga") ||
        catSlug.includes("vga") ||
        name.startsWith("laptop") ||
        name.startsWith("bộ máy") ||
        catSlug.includes("laptop") ||
        catSlug.includes("pc-")
      ) {
        return false;
      }

      return (
        catSlug === "man-hinh" ||
        cat.includes("màn hình") ||
        cat.includes("monitor") ||
        name.startsWith("màn hình") ||
        name.includes("monitor")
      );
    });
  }, [products]);

  const psuProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      
      // Loại trừ bộ máy PC và laptop
      if (
        name.startsWith("bộ máy") ||
        name.startsWith("pc ") ||
        name.includes("laptop") ||
        name.includes("màn hình") ||
        catSlug.includes("pc-") ||
        catSlug.includes("laptop")
      ) {
        return false;
      }

      return (
        catSlug === "psu-nguon-may-tinh" ||
        cat.includes("psu") ||
        cat.includes("nguồn") ||
        name.includes("nguồn") ||
        name.includes("psu")
      );
    });
  }, [products]);

  const mainboardProducts = useMemo(() => {
    return products.filter((p) => {
      const catSlug = (p.categorySlug || "").toLowerCase();
      const cat = (p.categoryName || p.category?.name || "").toLowerCase();
      const name = (p.name || "").toLowerCase();

      // Loại trừ bộ máy PC và laptop
      if (
        name.startsWith("bộ máy") ||
        name.startsWith("pc ") ||
        name.includes("laptop") ||
        name.includes("màn hình") ||
        catSlug.includes("pc-") ||
        catSlug.includes("laptop")
      ) {
        return false;
      }

      return (
        catSlug === "mainboard-bo-mach-chu" ||
        cat.includes("mainboard") ||
        cat.includes("bo mạch") ||
        name.includes("mainboard") ||
        name.includes("bo mạch")
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

      {/* 2. 4 Khối thông tin khuyến mãi/chính sách dưới Slider */}
      <div className="mb-4 sm:mb-6">
        <PromoGridCards />
      </div>

      {/* 3. Khối 4 tiêu chuẩn cam kết dịch vụ */}
      <div className="mb-4 sm:mb-6">
        <ServiceFeatures />
      </div>

      {/* 4. Danh mục nổi bật Pills */}
      <div className="mb-4 sm:mb-6">
        <CategoryPills
          activeCategory={selectedCategoryPill}
          onSelectCategory={setSelectedCategoryPill}
        />
      </div>

      {/* 5. ⚡ FLASH SALE HÀNG NGÀY GIÁ CỰC SỐC */}
      <div className="mb-6 sm:mb-8">
        <FlashSaleSection products={products} />
      </div>

      {/* 6. ZComputer Shorts / Video ngắn */}
      <div className="mb-6 sm:mb-8">
        <ZComputerShorts />
      </div>

      {/* 7. 🌟 SẢN PHẨM NỔI BẬT KHUYÊN DÙNG */}
      <div className="mb-6 sm:mb-8">
        <FeaturedProductsSection products={products} />
      </div>

      {/* 8. Logo các thương hiệu đối tác */}
      <div className="mb-6 sm:mb-8">
        <BrandLogosBar />
      </div>

      {/* 9. 💻 LAPTOP CŨ Box */}
      <CategoryProductBox
        title="LAPTOP CŨ"
        mainSlug="laptop-cu"
        tabs={[
          { name: "Tất cả", slug: "all" },
          { name: "Laptop Gaming", slug: "laptop-gaming" },
          { name: "Laptop Văn phòng", slug: "laptop-van-phong" },
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

      {/* 11. 📺 MÀN HÌNH Box */}
      <CategoryProductBox
        title="MÀN HÌNH"
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
          { name: "650W", slug: "650w" },
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
          { name: "B650", slug: "b650" },
        ]}
        products={mainboardProducts}
      />

      {/* 14. 📰 BÀI VIẾT - TIN TỨC CÔNG NGHỆ (Load trực tiếp từ Database API) */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <HomeNewsSection />
      </div>

      {/* 15. 🌟 LỜI CẢM ƠN TỪ ZCOMPUTER & HÌNH ẢNH KHÁCH HÀNG (Nền đen tràn viền) */}
      <CustomerGallery />
    </div>
  );
}
