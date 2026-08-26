"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RefreshCcw,
  Check,
  X,
  Move,
  Sparkles,
} from "lucide-react";

export default function BannerCropperModal({
  isOpen,
  onClose,
  imageSrc,
  zoneInfo,
  onCropComplete,
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 600, height: 300 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Khớp chính xác 100% tỉ lệ thật trên giao diện website
  const getAspectRatioNumber = () => {
    if (!zoneInfo?.id) return 2 / 1;
    switch (zoneInfo.id) {
      case "promo_grid":
        return 3 / 2; // 1.5:1
      case "popup":
        return 4 / 3; // 1.33:1
      case "product_top":
        return 5 / 1; // 5:1
      case "hero_slider":
      default:
        return 2 / 1; // 2:1 Khớp 100% với HeroSlider aspect-[2/1]
    }
  };

  const targetAspect = getAspectRatioNumber();

  // Reset transform when opened or image changes
  useEffect(() => {
    if (isOpen && imageSrc) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setImageLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Update container size on mount & resize
  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerDimensions({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [isOpen, targetAspect]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.min(Math.max(0.5, prev + zoomFactor), 4));
  };

  // Reset to initial
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Tính toán kích thước cơ sở hiển thị theo đúng chuẩn Cover
  const imgAspect = naturalSize.width > 0 ? naturalSize.width / (naturalSize.height || 1) : 1;
  let domBaseWidth = containerDimensions.width;
  let domBaseHeight = containerDimensions.height;

  if (imgAspect > targetAspect) {
    // Ảnh ngang bè hơn khung -> Khớp theo chiều cao khung
    domBaseHeight = containerDimensions.height;
    domBaseWidth = containerDimensions.height * imgAspect;
  } else {
    // Ảnh đứng/vuông hơn khung -> Khớp theo chiều rộng khung
    domBaseWidth = containerDimensions.width;
    domBaseHeight = containerDimensions.width / (imgAspect || 1);
  }

  // Export cropped canvas (Đồng bộ 100% pixel-perfect với những gì người dùng thấy)
  const handleApplyCrop = () => {
    if (!imageLoaded || !imageRef.current || !containerRef.current) return;

    const img = imageRef.current;

    // Kích thước chuẩn xuất ra độ phân giải cao (2K Ultra HD để đảm bảo siêu nét, không vỡ)
    let exportWidth = 2560;
    let exportHeight = Math.round(exportWidth / targetAspect);

    if (zoneInfo?.id === "promo_grid") {
      exportWidth = 1800;
      exportHeight = 1200; // 3:2 Ultra Sharp
    } else if (zoneInfo?.id === "popup") {
      exportWidth = 1600;
      exportHeight = 1200; // 4:3 Ultra Sharp
    } else if (zoneInfo?.id === "product_top") {
      exportWidth = 2400;
      exportHeight = 480; // 5:1 Dải ngang Ultra Sharp
    } else if (zoneInfo?.id === "hero_slider") {
      exportWidth = 2560;
      exportHeight = 1280; // 2:1 Khớp hoàn hảo với website
    }

    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Kích hoạt thuật toán khử răng cưa và làm mịn hình ảnh chất lượng cao nhất
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Tỉ lệ scale giữa Canvas và Container DOM
    const scaleFactor = exportWidth / containerDimensions.width;
    const canvasBaseWidth = domBaseWidth * scaleFactor;
    const canvasBaseHeight = domBaseHeight * scaleFactor;

    ctx.save();
    // Dời gốc tọa độ về chính giữa canvas
    ctx.translate(exportWidth / 2, exportHeight / 2);

    // Áp dụng tọa độ dịch chuyển của người dùng (nhân tỉ lệ scaleFactor)
    ctx.translate(position.x * scaleFactor, position.y * scaleFactor);

    // Áp dụng góc xoay
    ctx.rotate((rotation * Math.PI) / 180);

    // Áp dụng độ phóng to thu nhỏ
    ctx.scale(scale, scale);

    // Vẽ ảnh chính xác tại tâm
    ctx.drawImage(
      img,
      -canvasBaseWidth / 2,
      -canvasBaseHeight / 2,
      canvasBaseWidth,
      canvasBaseHeight
    );
    ctx.restore();

    // Convert sang file WebP chất lượng tối đa (0.96) - nhẹ và nét vượt trội
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], `cropped_banner_${Date.now()}.webp`, {
          type: "image/webp",
        });
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl, croppedFile);
        onClose();
      },
      "image/webp",
      0.96
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Cắt & Căn Chỉnh Vùng Ảnh Chuẩn 100%</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-red-500 text-white font-black">
                  Khung {zoneInfo?.shortName}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Kéo chuột để chọn chính xác phần ảnh muốn lấy • Cuộn chuột để phóng to/thu nhỏ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Cropper Area */}
        <div
          className="relative bg-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-hidden select-none min-h-[320px] sm:min-h-[380px] max-h-[58vh]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Framing Box with exact aspect ratio */}
          <div
            ref={containerRef}
            style={{
              aspectRatio: `${targetAspect}`,
              width: "100%",
              maxWidth: targetAspect > 3 ? "760px" : targetAspect > 1.8 ? "680px" : "560px",
            }}
            className="relative rounded-2xl overflow-hidden border-2 border-red-500 shadow-[0_0_50px_rgba(235,28,36,0.35)] bg-black/95 cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Image being transformed - Positioned 100% identically to Canvas */}
            {imageLoaded && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop target"
                crossOrigin="anonymous"
                draggable={false}
                style={{
                  width: `${domBaseWidth}px`,
                  height: `${domBaseHeight}px`,
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${domBaseWidth / 2}px`,
                  marginTop: `-${domBaseHeight / 2}px`,
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.08s ease-out",
                  maxWidth: "none",
                  maxHeight: "none",
                }}
                className="pointer-events-none select-none"
              />
            )}

            {/* Rule of Thirds Overlay Grid */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div />
            </div>

            {/* Floating helper badges */}
            <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs border border-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3.5 h-3.5 text-red-400" />
              <span>Khung chuẩn: {zoneInfo?.shortName}</span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs border border-white/10 text-white text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-lg pointer-events-none">
              Zoom: {Math.round(scale * 100)}%
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 flex-1 min-w-[240px]">
              <button
                type="button"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.02"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <button
                type="button"
                onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Rotate & Reset Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev - 90) % 360)}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                title="Xoay trái 90°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xoay trái</span>
              </button>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                title="Xoay phải 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Xoay phải</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                title="Đặt lại về mặc định"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="text-[11px] sm:text-[11.5px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Khung cắt khớp 100% với tỉ lệ hiển thị thực tế trên website</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] text-white text-xs font-bold transition shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Áp dụng cắt ảnh này</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
