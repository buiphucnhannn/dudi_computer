"use client";

import { Calendar, ChevronRight, Tag } from "lucide-react";

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

export default function HomeNewsSection() {
  return (
    <section className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8 md:p-9">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-7 bg-[#eb1c24] rounded-full" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
              BÀI VIẾT - TIN TỨC CÔNG NGHỆ
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 pl-4">
            Cập nhật kiến thức, thủ thuật và tin tức công nghệ mới nhất từ ZComputer
          </p>
        </div>

        <a
          href="https://zcomputer.vn/tin-tuc"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-[#eb1c24] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>Xem tất cả bài viết</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {news.map((item) => (
          <a
            key={item.id || item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col bg-white rounded-2xl border border-gray-200/80 p-3 shadow-2xs hover:shadow-xl hover:border-[#eb1c24] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Meta: Category badge & Date */}
            <div className="flex items-center justify-between gap-2 text-[11px] text-gray-400 mb-2">
              <span className="bg-red-50 text-[#eb1c24] font-bold px-2 py-0.5 rounded text-[10px] uppercase truncate">
                {item.category}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{item.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-xs sm:text-[13.5px] leading-snug line-clamp-2 group-hover:text-[#eb1c24] transition-colors min-h-[36px]">
              {item.title}
            </h3>
          </a>
        ))}
      </div>

      {/* Bottom Button */}
      <div className="mt-8 flex justify-center">
        <a
          href="https://zcomputer.vn/tin-tuc"
          target="_blank"
          rel="noreferrer"
          className="bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-xs sm:text-sm px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-102 cursor-pointer"
        >
          <span>XEM THÊM BÀI VIẾT & TIN TỨC</span>
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
