"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BANNERS = [
  "https://zcomputer.vn/uploads/image-1784730915598-869631355.webp",
  "https://zcomputer.vn/uploads/image-1784727646608-314735893.webp",
  "https://zcomputer.vn/uploads/image-1784723786956-517954066.webp",
  "https://zcomputer.vn/uploads/image-1785249221437-528368707.webp",
  "https://zcomputer.vn/uploads/image-1784731172192-558618536.webp",
  "https://zcomputer.vn/uploads/image-1784727158263-712835383.webp",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xs bg-[#050505] aspect-[16/9] md:aspect-[16/8] lg:aspect-auto lg:h-[530px] w-full h-full group">
      {BANNERS.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={img}
            alt={`ZComputer Banner ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              idx === current ? "w-7 bg-[#eb1c24]" : "w-2.5 bg-white/70 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
