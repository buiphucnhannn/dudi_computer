"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Tự động chuyển slide sau 4.5s (tạm dừng khi đang rê chuột hoặc kéo)
  useEffect(() => {
    if (isDragging || isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isDragging, isHovered]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  // --- Xử lý kéo chuột (Mouse Drag) ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      if (dragOffset < -50) {
        nextSlide();
      } else if (dragOffset > 50) {
        prevSlide();
      }
      setIsDragging(false);
      setDragOffset(0);
    }
    setIsHovered(false);
  };

  // --- Xử lý vuốt trên màn hình cảm ứng (Touch Swipe) ---
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-2xl overflow-hidden shadow-xs bg-[#050505] aspect-[16/9] md:aspect-[16/8] lg:aspect-auto lg:h-[530px] w-full h-full group select-none cursor-grab active:cursor-grabbing"
    >
      {/* Track chứa tất cả banner trượt mượt mà */}
      <div
        className={`flex h-full w-full ${
          isDragging ? "transition-none" : "transition-transform duration-500 ease-out"
        }`}
        style={{
          transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
        }}
      >
        {BANNERS.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-full shrink-0 relative pointer-events-none"
          >
            <img
              src={img}
              alt={`ZComputer Banner ${idx + 1}`}
              className="w-full h-full object-cover select-none pointer-events-none"
              loading={idx === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-auto">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(idx);
            }}
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
