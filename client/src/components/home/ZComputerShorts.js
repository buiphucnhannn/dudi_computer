"use client";

import { Play, ChevronRight } from "lucide-react";

export default function ZComputerShorts() {
  const shorts = [
    {
      id: 1,
      title: "Review PC Gaming i5 13400F RTX 4060",
      thumbnail: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80",
      handle: "@zcomputer_official",
    },
    {
      id: 2,
      title: "Mở hộp Lenovo Legion Y7000P 2025",
      thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80",
      handle: "@zcomputer_official",
    },
    {
      id: 3,
      title: "Test game Black Myth Wukong trên RTX 4070",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
      handle: "@zcomputer_official",
    },
    {
      id: 4,
      title: "Hướng dẫn chọn mua Laptop Cũ Like New",
      thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
      handle: "@zcomputer_official",
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-gray-100 relative overflow-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-red-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Centered */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10 text-center">
        <div className="flex items-center gap-2.5">
          <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-[#eb1c24]" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            ZCOMPUTER <span className="text-[#eb1c24]">SHORT</span>
          </h2>
        </div>
        <div className="w-20 h-1.5 bg-[#eb1c24] rounded-full mt-2.5 shadow-sm"></div>
      </div>

      {/* 4 Phone-framed Video Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6 relative z-10">
        {shorts.map((s) => (
          <div
            key={s.id}
            className="relative rounded-[26px] sm:rounded-[30px] overflow-hidden aspect-[9/16] bg-black border-[4px] sm:border-[5px] border-gray-900 shadow-xl group cursor-pointer"
          >
            {/* Background Thumbnail */}
            <img
              src={s.thumbnail}
              alt={s.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
            />

            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85" />

            {/* Top User Bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white z-20">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center">
                    <img
                      src="https://zcomputer.vn/logo-main.png"
                      alt="ZComputer Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Red Live indicator dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#eb1c24] border-2 border-white rounded-full"></span>
                </div>
                <div className="text-left">
                  <h3 className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-xs">
                    ZComputer Short
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-gray-300 block">
                    {s.handle}
                  </span>
                </div>
              </div>
            </div>

            {/* Center Translucent Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#eb1c24] transition-all duration-300 shadow-2xl text-white">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Bottom TikTok label & 'Xem Ngay >' Pill Button */}
            <div className="absolute bottom-3.5 left-3 right-3 flex flex-col items-center gap-1.5 z-20">
              <div className="text-[9px] sm:text-[10px] text-gray-300 font-medium">
                TikTok <span className="font-bold text-white">{s.handle}</span>
              </div>
              <a
                href="https://tiktok.com/@zcomputer_official"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-black/60 hover:bg-[#eb1c24] backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-full flex items-center justify-center gap-1 transition-all duration-300 shadow-md group-hover:bg-[#eb1c24]"
              >
                <span>Xem Ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
