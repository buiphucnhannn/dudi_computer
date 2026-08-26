"use client";

import { useMemo, useState, useEffect } from "react";
import CategorySidebar from "@/components/home/CategorySidebar";
import HeroSlider from "@/components/home/HeroSlider";
import PromoGridCards from "@/components/home/PromoGridCards";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryPills from "@/components/home/CategoryPills";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import CategoryProductBox from "@/components/home/CategoryProductBox";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import CustomerGallery from "@/components/home/CustomerGallery";
import { productAPI, categoryAPI } from "@/lib/api";
import { sortProductsByPriority, isProductMatchingCategory } from "@/lib/productHelpers";

export default function Home() {
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("all");
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    // 1. Tải danh sách sản phẩm & danh mục thực từ Database
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ limit: 300 }),
          categoryAPI.getAll(),
        ]);

        let rawProducts = [];
        if (prodRes.data?.data?.products) {
          rawProducts = prodRes.data.data.products;
        } else if (Array.isArray(prodRes.data?.data)) {
          rawProducts = prodRes.data.data;
        }
        setProducts(sortProductsByPriority(rawProducts));

        if (Array.isArray(catRes.data?.data)) {
          setDbCategories(catRes.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ từ Database:", error);
      }
    };

    loadData();
  }, []);

  // Tabs danh mục con chuẩn cho Laptop
  const laptopTabs = [
    { name: "Tất cả", slug: "all" },
    { name: "Laptop Gaming", slug: "laptop-gaming" },
    { name: "Laptop Văn phòng", slug: "laptop-van-phong" },
    { name: "Macbook", slug: "macbook" },
  ];

  // Tabs danh mục con chuẩn cho PC
  const pcTabs = [
    { name: "Tất cả", slug: "all" },
    { name: "PC Gaming", slug: "pc-gaming" },
    { name: "PC Đồ Họa", slug: "pc-do-hoa" },
    { name: "PC Văn Phòng", slug: "pc-van-phong" },
  ];

  // Tabs danh mục con cho Phụ Kiện Gear (Bàn phím & Chuột)
  const gearTabs = [
    { name: "Tất cả", slug: "all" },
    { name: "Bàn phím", slug: "ban-phim" },
    { name: "Chuột", slug: "chuot" },
  ];

  // Lọc sản phẩm cho từng khối Danh Mục Sản Phẩm (Đảm bảo chuẩn xác 100% không bị lẫn)
  const laptopProducts = useMemo(() => {
    return products.filter((p) => isProductMatchingCategory(p, "laptop", dbCategories));
  }, [products, dbCategories]);

  const pcProducts = useMemo(() => {
    return products.filter((p) => isProductMatchingCategory(p, "pc", dbCategories));
  }, [products, dbCategories]);

  const monitorProducts = useMemo(() => {
    return products.filter((p) => isProductMatchingCategory(p, "man-hinh", dbCategories));
  }, [products, dbCategories]);

  const gearProducts = useMemo(() => {
    return products.filter(
      (p) =>
        isProductMatchingCategory(p, "ban-phim", dbCategories) ||
        isProductMatchingCategory(p, "chuot", dbCategories)
    );
  }, [products, dbCategories]);

  const psuProducts = useMemo(() => {
    return products.filter((p) => isProductMatchingCategory(p, "psu-nguon-may-tinh", dbCategories));
  }, [products, dbCategories]);

  const mainboardProducts = useMemo(() => {
    return products.filter((p) => isProductMatchingCategory(p, "mainboard-bo-mach-chu", dbCategories));
  }, [products, dbCategories]);

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

      {/* 5. ⚡ FLASH SALE HÀNG NGÀY GIÁ CỰC SỐC - Tự động fetch từ API */}
      <div className="mb-6 sm:mb-8">
        <FlashSaleSection />
      </div>

      {/* 6. 🌟 SẢN PHẨM NỔI BẬT KHUYÊN DÙNG */}
      <div className="mb-6 sm:mb-8">
        <FeaturedProductsSection products={products} />
      </div>

      {/* 7. Logo các thương hiệu đối tác */}
      <div className="mb-6 sm:mb-8">
        <BrandLogosBar />
      </div>

      {/* 8. 💻 LAPTOP Box (Tabs lọc chính xác theo dòng máy) */}
      <CategoryProductBox
        title="LAPTOP"
        mainSlug="laptop-cu"
        tabs={laptopTabs}
        products={laptopProducts}
      />

      {/* 9. 🖥️ PC Box (Đã bỏ chữ "Máy tính để bàn" theo yêu cầu) */}
      <CategoryProductBox
        title="PC"
        mainSlug="pc-cu"
        tabs={pcTabs}
        products={pcProducts}
      />

      {/* 10. 📺 MÀN HÌNH MÁY TÍNH Box (Chỉ chứa màn hình, không kèm chuột/bàn phím) */}
      <CategoryProductBox
        title="MÀN HÌNH MÁY TÍNH"
        mainSlug="man-hinh"
        tabs={[]}
        products={monitorProducts}
      />

      {/* 11. ⌨️ PHỤ KIỆN GAMING GEAR (Bàn phím & Chuột riêng biệt chuyên nghiệp) */}
      <CategoryProductBox
        title="PHỤ KIỆN GAMING GEAR"
        mainSlug="ban-phim"
        tabs={gearTabs}
        products={gearProducts}
      />

      {/* 12. ⚡ PSU - NGUỒN MÁY TÍNH Box */}
      <CategoryProductBox
        title="PSU - NGUỒN MÁY TÍNH"
        mainSlug="psu-nguon-may-tinh"
        tabs={[]}
        products={psuProducts}
      />

      {/* 13. 🎛️ MAINBOARD - BO MẠCH CHỦ Box */}
      <CategoryProductBox
        title="MAINBOARD - BO MẠCH CHỦ"
        mainSlug="mainboard-bo-mach-chu"
        tabs={[]}
        products={mainboardProducts}
      />

      {/* 14. 📰 BÀI VIẾT - TIN TỨC CÔNG NGHỆ (Load trực tiếp từ Database API) */}
      <div className="mb-10 sm:mb-14 md:mb-16">
        <HomeNewsSection />
      </div>

      {/* 15. 🌟 LỜI CẢM ƠN TỪ DUDI SOFTWARE & HÌNH ẢNH KHÁCH HÀNG */}
      <CustomerGallery />
    </div>
  );
}
