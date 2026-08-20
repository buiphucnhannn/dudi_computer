"use client";

import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";

const TECH_NEWS = [
  {
    id: 1,
    slug: "top-5-laptop-gaming-duoi-20-trieu-dang-mua-nhat-2025",
    title: "Top 5 Laptop Gaming Dưới 20 Triệu Đáng Mua Nhất 2025: Hiệu Năng Vượt Trội",
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    date: "18/08/2025",
  },
  {
    id: 2,
    slug: "huong-dan-build-pc-gaming-i5-13400f-rtx-4060-chien-moi-tua-game",
    title: "Hướng Dẫn Build PC Gaming i5 13400F + RTX 4060 Chiến Mọi Tựa Game AAA",
    thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    date: "15/08/2025",
  },
  {
    id: 3,
    slug: "so-sanh-rtx-4060-vs-rtx-3060-12gb-nen-chon-card-nao",
    title: "So Sánh RTX 4060 vs RTX 3060 12GB: Đâu Là Lựa Chọn Kinh Tế Tối Ưu?",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    date: "12/08/2025",
  },
  {
    id: 4,
    slug: "kinh-nghiem-chon-mua-laptop-cu-like-new-nguyen-zin-khong-lo-bi-luoc-do",
    title: "Kinh Nghiệm Chọn Mua Laptop Cũ Like New Chuẩn Zin Không Lo Bị Luộc Đồ",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    date: "09/08/2025",
  },
];

export default function TechNewsSection() {
  return (
    <section className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8">
        TIN TỨC CÔNG NGHỆ MỚI
      </h2>

      {/* 4 Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {TECH_NEWS.map((item) => (
          <Link
            key={item.id}
            href={`/tin-tuc/${item.slug}`}
            className="group flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-gray-50 border border-gray-100 shadow-2xs">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{item.date}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-[15px] leading-snug line-clamp-2 group-hover:text-[#eb1c24] transition-colors">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* 'XEM THÊM TIN CÔNG NGHỆ >' Button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/tin-tuc"
          className="bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102"
        >
          <span>XEM THÊM TIN CÔNG NGHỆ</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </Link>
      </div>
    </section>
  );
}
