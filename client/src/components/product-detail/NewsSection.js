"use client";

import { Calendar, ChevronRight } from "lucide-react";

const news = [
  {
    id: 1,
    title:
      'Cách Kiểm Tra Laptop Cũ Từ A-Z: Mua Máy "Ngon" Không Sợ Bị Lừa',
    category: "Tin tức công nghệ",
    image: "/post-3.webp",
    date: "18/08/2025",
    href: "https://zcomputer.vn/tin-tuc/huong-dan-cach-kiem-tra-laptop-cu-tu-a-z-mua-may-ngon-khong-so-bi-lua",
  },
  {
    id: 2,
    title:
      "Cách Kiểm Tra Win Bản Quyền Hay Win Lậu Chính Xác 100%",
    category: "Thủ thuật máy tính",
    image: "/post-2.webp",
    date: "15/08/2025",
    href: "https://zcomputer.vn/tin-tuc/cach-kiem-tra-win-lau-hay-win-ban-quyen",
  },
  {
    id: 3,
    title:
      "Mua Laptop Cũ Ở Đâu Uy Tín? 5 Lý Do Khách Hàng Tuyệt Đối Tin Tưởng ZComputer",
    category: "Về chúng tôi",
    image: "/post-1.webp",
    date: "12/08/2025",
    href: "https://zcomputer.vn/tin-tuc/mua-laptop-cu-o-dau-uy-tin-5-ly-do-khach-hang-tuyet-doi-tin-tuong-zcomputer",
  },
  {
    id: 4,
    title:
      "Top 5 Laptop Gaming Dưới 20 Triệu Đáng Mua Nhất 2025: Hiệu Năng Vượt Trội",
    category: "Tin tức công nghệ",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    date: "09/08/2025",
    href: "https://zcomputer.vn/tin-tuc",
  },
];

const NewsSection = () => {
  return (
    <section className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-8">
        TIN TỨC CÔNG NGHỆ MỚI
      </h2>

      {/* 4 Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col cursor-pointer"
          >
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 bg-gray-50 border border-gray-100 shadow-2xs">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between gap-1.5 text-[11px] text-gray-400 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </div>
              {item.category && (
                <span className="text-[10px] font-bold text-[#eb1c24] uppercase">
                  {item.category}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-sm md:text-[15px] leading-snug line-clamp-2 group-hover:text-[#eb1c24] transition-colors">
              {item.title}
            </h3>
          </a>
        ))}
      </div>

      {/* 'XEM THÊM TIN CÔNG NGHỆ >' Button */}
      <div className="mt-8 flex justify-center">
        <a
          href="https://zcomputer.vn/tin-tuc"
          target="_blank"
          rel="noreferrer"
          className="bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102 cursor-pointer"
        >
          <span>XEM THÊM TIN CÔNG NGHỆ</span>
          <ChevronRight className="w-4.5 h-4.5" />
        </a>
      </div>
    </section>
  );
};

export default NewsSection;