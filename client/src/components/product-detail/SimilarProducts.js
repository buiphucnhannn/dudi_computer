"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";
import SimilarProductCard from "./SimilarProductCard";

const defaultProducts = [
  {
    id: "6a82e7e82d131e707e0e7c97",
    slug: "bo-may-tinh-b760m-tuf-wifii5-14600kram-32gbssd-1tbvga-rtx-3060-12gb750w-aio-360-lcdcase-be-ca-mik-kem-4-fan",
    category: "PC Cũ",
    name: "BỘ MÁY TÍNH B760M TUF WIFI/I5 14600K/RAM 32GB/SSD 1TB/VGA RTX 3060 12GB/750W/AIO 360 LCD/CASE BỂ CÁ MIK KÈM 4 FAN",
    image: "https://zcomputer.vn/uploads/image-1786963920224-267366888.webp",
    oldPrice: 32500000,
    price: 31500000,
    discount: 3,
    views: 154,
    specs: {
      cpu: "Core i5 14600K",
      ram: "32GB DDR5",
      motherboard: "ASUS TUF B760M",
      gpu: "RTX 3060 12GB",
    },
  },
  {
    id: "6a82dcfe2d131e707e0e79d8",
    slug: "bo-may-tinh-b760m-msi-magi5-14600k16gbssd-1tbvga-rtx-3070ti-8gb-gigabytenguon-750w-xigmateckcase-nzxt-tan-khi",
    category: "PC Cũ",
    name: "BỘ MÁY TÍNH B760M MSI MAG/I5 14600K/16GB/SSD 1TB/VGA RTX 3070TI 8GB GIGABYTE/NGUỒN 750W XIGMATEK/CASE NZXT+ TẢN KHÍ",
    image: "https://zcomputer.vn/uploads/image-1786961033039-703478160.webp",
    oldPrice: 24200000,
    price: 23200000,
    discount: 4,
    views: 128,
    specs: {
      cpu: "Core i5 14600K",
      ram: "16GB RAM",
      motherboard: "MSI MAG B760M",
      gpu: "RTX 3070Ti 8GB",
    },
  },
  {
    id: "6a82d9382d131e707e0e7841",
    slug: "bo-may-tinh-b760m-p-msi-i5-12400f-16gb-ram-500gb-ssdvga-rx-6600-8gb-nguon-650w-case-led-gaming-kem-tan-khi-rgb",
    category: "PC Cũ",
    name: "BỘ MÁY TÍNH B760M-P MSI/I5 12400F/16GB RAM/500GB SSD/VGA RX 6600 8GB/NGUỒN 650W/CASE LED GAMING KÈM TẢN KHÍ RGB",
    image: "https://zcomputer.vn/uploads/image-1786960128692-909868080.webp",
    oldPrice: 15500000,
    price: 14500000,
    discount: 6,
    views: 86,
    outOfStock: false,
    specs: {
      cpu: "Core i5 12400F",
      ram: "16GB RAM",
      motherboard: "MSI PRO B760M-P",
      gpu: "Radeon RX 6600",
    },
  },
  {
    id: "6a82d5212d131e707e0e76ae",
    slug: "bo-may-tinh-h610m-k-asusi5-12400fram-16gbssd-512gbvga-rtx-2060super-8gb-gigabytenguon-550wcase-led-tan-nhiet-khi",
    category: "PC Cũ",
    name: "BỘ MÁY TÍNH H610M-K ASUS/I5 12400F/RAM 16GB/SSD 512GB/VGA RTX 2060SUPER 8GB GIGABYTE/NGUỒN 550W/CASE LED+ TẢN NHIỆT KHÍ",
    image: "https://zcomputer.vn/uploads/image-1786959115438-669054953.webp",
    oldPrice: 14900000,
    price: 13900000,
    discount: 7,
    views: 95,
    specs: {
      cpu: "Core i5 12400F",
      ram: "16GB RAM",
      motherboard: "ASUS H610M-K",
      gpu: "RTX 2060S 8GB",
    },
  },
  {
    id: "6a82eb522d131e707e0e7dc7",
    slug: "laptop-lenovo-slim-7-prox-14arh7-ryzen-9-6900hs32gbssd-512gbrtx-3050-4gblcd-14-3k-120hz-touch",
    category: "Laptop Lenovo",
    name: "LAPTOP LENOVO SLIM 7 PROX 14ARH7 RYZEN 9 6900HS/32GB/SSD 512GB/RTX 3050 4GB/LCD 14'' 3K 120HZ TOUCH",
    image: "https://zcomputer.vn/uploads/image-1786964803138-701647732.webp",
    oldPrice: 21900000,
    price: 20900000,
    discount: 5,
    views: 210,
    specs: {
      cpu: "Ryzen 9 6900HS",
      ram: "32GB LPDDR5",
      motherboard: "Lenovo OEM",
      gpu: "RTX 3050 4GB",
    },
  },
  {
    id: "6a82d1812d131e707e0e74c8",
    slug: "bo-may-tinh-b660m-tuf-i5-13400f-ram-16gb-ssd-500gb-rtx-3060-12gb-nguon-750w-case-ac-01-tan-aio-360",
    category: "PC Cũ",
    name: "BỘ MÁY TÍNH B660M TUF/ I5 13400F/ RAM 16GB/ SSD 500GB/ RTX 3060 12GB/ NGUỒN 750W/ CASE AC-01/ TẢN AIO 360",
    image: "https://zcomputer.vn/uploads/image-1786958194452-233412527.webp",
    oldPrice: 19500000,
    price: 18500000,
    discount: 5,
    views: 142,
    specs: {
      cpu: "Core i5 13400F",
      ram: "16GB RAM",
      motherboard: "ASUS TUF B660M",
      gpu: "RTX 3060 12GB",
    },
  },
];

export default function SimilarProducts({ products = defaultProducts }) {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayProducts =
    products && products.length > 0 ? products : defaultProducts;

  // Check scroll bounds
  const checkScrollBounds = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollBounds();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener("scroll", checkScrollBounds, { passive: true });
      window.addEventListener("resize", checkScrollBounds);
    }
    return () => {
      if (current) current.removeEventListener("scroll", checkScrollBounds);
      window.removeEventListener("resize", checkScrollBounds);
    };
  }, [displayProducts]);

  // Scroll button actions
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 340;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse Drag to scroll (drag right-to-left or left-to-right)
  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <section className="w-full bg-slate-50/70 py-12 md:py-16 border-t border-slate-200">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-2 h-7 bg-red-600 rounded-sm" />
              <h2 className="text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
                Sản Phẩm Tương Tự
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 ml-4 font-medium">
              Khám phá các cấu hình tương đương với hiệu năng và mức giá hấp dẫn
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              href="/tat-ca-san-pham"
              className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center gap-1 mr-2 transition-colors"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                canScrollLeft
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs cursor-pointer"
                  : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                canScrollRight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs cursor-pointer"
                  : "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draggable Carousel Slider Container */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-5 overflow-x-auto pb-4 pt-1 select-none ${
            isDragging
              ? "cursor-grabbing scroll-auto"
              : "cursor-grab scroll-smooth"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayProducts.map((product) => (
            <div
              key={product.id || product.slug}
              className="flex-none w-[270px] sm:w-[290px] md:w-[310px]"
            >
              <SimilarProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}