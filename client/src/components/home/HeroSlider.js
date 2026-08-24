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
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  // Tự động chuyển slide sau 4s với hiệu ứng mờ dần xuất hiện (Cross-fade)
  useEffect(() => {
    if (isHovered || isDragging) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, isDragging]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % BANNERS.length);
  };

  // --- Xử lý kéo chuột để chuyển slide (Chỉ nhận diện cử chỉ, KHÔNG làm xê dịch khung ảnh) ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -40) {
      nextSlide();
    } else if (dragOffset > 40) {
      prevSlide();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      if (dragOffset < -40) {
        nextSlide();
      } else if (dragOffset > 40) {
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
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -40) {
      nextSlide();
    } else if (dragOffset > 40) {
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
      className="relative rounded-2xl overflow-hidden shadow-xs bg-[#050505] aspect-[2/1] w-full h-full group select-none cursor-grab active:cursor-grabbing"
    >
      {/* Khung chứa các slide cố định 100% không xê dịch, chuyển đổi bằng hiệu ứng Fade 1500ms mượt mà */}
      <div className="relative w-full h-full">
        {BANNERS.map((img, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full flex items-center justify-center bg-[#050505] transition-opacity duration-[1500ms] ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={img}
                alt={`DUDI SOFTWARE Banner ${idx + 1}`}
                className={`w-full h-full object-cover object-center select-none pointer-events-none transition-transform ease-out ${
                  isHovered && isActive ? "scale-105 duration-[6000ms]" : "scale-100 duration-[3000ms]"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination dots (Màu xám/trắng siêu nhạt nhòa tinh tế) */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-auto">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(idx);
            }}
            className={`h-2 rounded-full transition-all duration-700 cursor-pointer ${
              idx === current
                ? "w-6 bg-white/40 shadow-none"
                : "w-2 bg-white/15 hover:bg-white/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
