"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CategorySidebar from "@/components/home/CategorySidebar";
import HeroSlider from "@/components/home/HeroSlider";
import PromoGridCards from "@/components/home/PromoGridCards";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import CategoryPills from "@/components/home/CategoryPills";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import BrandLogosBar from "@/components/home/BrandLogosBar";
import { productAPI, categoryAPI } from "@/lib/api";
import { sortProductsByBestSeller, isProductMatchingCategory } from "@/lib/productHelpers";

// Below-the-fold: dynamic imports để giảm initial JS bundle
const CategoryProductBox = dynamic(() => import("@/components/home/CategoryProductBox"), {
  loading: () => <div className="h-[500px] bg-gray-50 rounded-3xl animate-pulse mb-10" />,
});
const HomeNewsSection = dynamic(() => import("@/components/home/HomeNewsSection"), {
  loading: () => <div className="h-[300px] bg-gray-50 rounded-3xl animate-pulse" />,
});
const CustomerGallery = dynamic(() => import("@/components/home/CustomerGallery"), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse" />,
});

export default function Home() {
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("all");
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    // 1. Tải danh sách sản phẩm & danh mục thực từ Database với sắp xếp bán chạy nhất
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productAPI.getAll({ limit: 1000, sort: "best_seller" }),
          categoryAPI.getAll(),
        ]);

        let rawProducts = [];
        if (prodRes.data?.data?.products) {
          rawProducts = prodRes.data.data.products;
        } else if (Array.isArray(prodRes.data?.data)) {
          rawProducts = prodRes.data.data;
        }
        setProducts(sortProductsByBestSeller(rawProducts));

        if (Array.isArray(catRes.data?.data)) {
          setDbCategories(catRes.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ từ Database:", error);
      }
    };

    loadData();
  }, []);

  // Tabs danh mục con cho Laptop load động từ DB
  const laptopTabs = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "Laptop Gaming", slug: "laptop-gaming" },
        { name: "Laptop Văn phòng", slug: "laptop-van-phong" },
        { name: "Macbook", slug: "macbook" },
      ];
    }
    const laptopParent = dbCategories.find(
      (c) => (c.slug || "").toLowerCase() === "laptop" || (c.name || "").toLowerCase().includes("laptop")
    );
    if (!laptopParent) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "Laptop Gaming", slug: "laptop-gaming" },
        { name: "Laptop Văn phòng", slug: "laptop-van-phong" },
        { name: "Macbook", slug: "macbook" },
      ];
    }
    const children = dbCategories.filter(
      (c) =>
        (c.parent?._id || c.parent)?.toString() === laptopParent._id.toString() ||
        c.parentSlug === laptopParent.slug
    );
    return [
      { name: "Tất cả", slug: "all" },
      ...children.map((c) => ({ name: c.name, slug: c.slug })),
    ];
  }, [dbCategories]);

  // Tabs danh mục con cho PC load động từ DB
  const pcTabs = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "PC Gaming", slug: "pc-gaming" },
        { name: "PC Đồ Họa", slug: "pc-do-hoa" },
        { name: "PC Văn Phòng", slug: "pc-van-phong" },
      ];
    }
    const pcParent = dbCategories.find(
      (c) => (c.slug || "").toLowerCase() === "pc" || (c.name || "").toLowerCase().includes("máy tính để bàn") || (c.name || "").toLowerCase() === "pc"
    );
    if (!pcParent) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "PC Gaming", slug: "pc-gaming" },
        { name: "PC Đồ Họa", slug: "pc-do-hoa" },
        { name: "PC Văn Phòng", slug: "pc-van-phong" },
      ];
    }
    const children = dbCategories.filter(
      (c) =>
        (c.parent?._id || c.parent)?.toString() === pcParent._id.toString() ||
        c.parentSlug === pcParent.slug
    );
    return [
      { name: "Tất cả", slug: "all" },
      ...children.map((c) => ({ name: c.name, slug: c.slug })),
    ];
  }, [dbCategories]);

  // Tabs danh mục con cho Màn Hình Máy Tính load động từ DB
  const monitorTabs = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "Màn hình Gaming", slug: "man-hinh-gaming" },
        { name: "Màn hình Văn phòng", slug: "man-hinh-van-phong" },
        { name: "Màn hình Đồ họa", slug: "man-hinh-do-hoa" },
      ];
    }
    const monitorParent = dbCategories.find(
      (c) => (c.slug || "").toLowerCase() === "man-hinh" || (c.name || "").toLowerCase().includes("màn hình")
    );
    let children = [];
    if (monitorParent) {
      children = dbCategories.filter(
        (c) =>
          (c.parent?._id || c.parent)?.toString() === monitorParent._id.toString() ||
          c.parentSlug === monitorParent.slug
      );
    }
    return [
      { name: "Tất cả", slug: "all" },
      ...children.map((c) => ({ name: c.name, slug: c.slug })),
    ];
  }, [dbCategories]);

  // Tabs danh mục con cho Phụ Kiện Gear load động từ DB
  const gearTabs = useMemo(() => {
    if (!Array.isArray(dbCategories) || dbCategories.length === 0) {
      return [
        { name: "Tất cả", slug: "all" },
        { name: "Bàn phím", slug: "ban-phim" },
        { name: "Chuột", slug: "chuot" },
      ];
    }
    const gearParent = dbCategories.find(
      (c) =>
        (c.slug || "").toLowerCase() === "phu-kien-gear" ||
        (c.slug || "").toLowerCase() === "gear" ||
        (c.name || "").toLowerCase().includes("phụ kiện gear") ||
        (c.name || "").toLowerCase() === "gear"
    );
    let children = [];
    if (gearParent) {
      children = dbCategories.filter(
        (c) =>
          (c.parent?._id || c.parent)?.toString() === gearParent._id.toString() ||
          c.parentSlug === gearParent.slug
      );
    }
    if (children.length === 0) {
      children = dbCategories.filter(
        (c) =>
          (c.slug || "").toLowerCase() === "ban-phim" ||
          (c.slug || "").toLowerCase() === "chuot"
      );
    }
    return [
      { name: "Tất cả", slug: "all" },
      ...children.map((c) => ({ name: c.name, slug: c.slug })),
    ];
  }, [dbCategories]);

  // Lọc sản phẩm theo từng nhóm danh mục lớn
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
        isProductMatchingCategory(p, "phu-kien-gear", dbCategories) ||
        isProductMatchingCategory(p, "ban-phim", dbCategories) ||
        isProductMatchingCategory(p, "chuot", dbCategories) ||
        (p.name && /bàn phím|chuột|keyboard|mouse/i.test(p.name))
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
        <FlashSaleSection categories={dbCategories} />
      </div>

      {/* 6. 🌟 SẢN PHẨM NỔI BẬT KHUYÊN DÙNG (Tối đa 8 sản phẩm bán chạy nhất) */}
      <div className="mb-6 sm:mb-8">
        <FeaturedProductsSection products={products} categories={dbCategories} />
      </div>

      {/* 7. Logo các thương hiệu đối tác */}
      <div className="mb-6 sm:mb-8">
        <BrandLogosBar />
      </div>

      {/* 8. 💻 LAPTOP Box (Tabs lọc chính xác theo dòng máy, Max 8 sản phẩm) */}
      <CategoryProductBox
        title="LAPTOP"
        mainSlug="laptop"
        tabs={laptopTabs}
        products={laptopProducts}
        categories={dbCategories}
      />

      {/* 9. 🖥️ PC Box (Max 8 sản phẩm) */}
      <CategoryProductBox
        title="PC"
        mainSlug="pc"
        tabs={pcTabs}
        products={pcProducts}
        categories={dbCategories}
      />

      {/* 10. 📺 MÀN HÌNH MÁY TÍNH Box (Max 8 sản phẩm) */}
      <CategoryProductBox
        title="MÀN HÌNH MÁY TÍNH"
        mainSlug="man-hinh"
        tabs={monitorTabs}
        products={monitorProducts}
        categories={dbCategories}
      />

      {/* 11. ⌨️ PHỤ KIỆN GEAR (Bàn phím & Chuột riêng biệt, Max 8 sản phẩm) */}
      <CategoryProductBox
        title="PHỤ KIỆN GEAR"
        mainSlug="phu-kien-gear"
        tabs={gearTabs}
        products={gearProducts}
        categories={dbCategories}
      />

      {/* 12. ⚡ PSU - NGUỒN MÁY TÍNH Box (Max 8 sản phẩm) */}
      <CategoryProductBox
        title="PSU - NGUỒN MÁY TÍNH"
        mainSlug="psu-nguon-may-tinh"
        tabs={[]}
        products={psuProducts}
        categories={dbCategories}
      />

      {/* 13. 🎛️ MAINBOARD - BO MẠCH CHỦ Box (Max 8 sản phẩm) */}
      <CategoryProductBox
        title="MAINBOARD - BO MẠCH CHỦ"
        mainSlug="mainboard-bo-mach-chu"
        tabs={[]}
        products={mainboardProducts}
        categories={dbCategories}
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
