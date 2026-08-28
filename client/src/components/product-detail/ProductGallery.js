"use client";

import { useState, useRef, useEffect } from "react";
import { CreditCard, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from "@/lib/imageFallback";
import { optimizeImageUrl } from "@/lib/imageOptimizer";
import { formatViews } from "@/lib/productHelpers";

const paymentMethods = [
  {
    name: "VISA",
    className: "text-gray-900",
  },
  {
    name: "mastercard",
    className: "text-red-600",
  },
  {
    name: "JCB",
    className: "text-blue-600",
  },
  {
    name: (
      <>
        VNPAY<span className="text-blue-600">QR</span>
      </>
    ),
    className: "text-red-600",
  },
  {
    name: (
      <>
        Zalo<span className="text-blue-700">pay</span>
      </>
    ),
    className: "text-sky-600",
  },
  {
    name: "napas",
    className: "text-blue-700",
  },
];

const installmentMethods = [
  {
    name: "HD SAISON",
    className: "text-red-700",
  },
  {
    name: "MIRAE ASSET",
    className: "text-orange-600",
  },
  {
    name: "Kredivo",
    className: "text-sky-500",
  },
];

const ProductGallery = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailsRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const rawImages = (
    product?.images?.length
      ? product.images.map((img) => (typeof img === "object" ? img.url : img))
      : [product?.thumbnail]
  ).filter(Boolean);

  const images =
    rawImages.length > 0
      ? rawImages
      : [DEFAULT_FALLBACK_IMAGE];

  const activeIndex = Math.min(
    selectedImage,
    images.length - 1
  );

  const checkScroll = () => {
    if (!thumbnailsRef.current) return;
    requestAnimationFrame(() => {
      if (!thumbnailsRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    });
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => {
      requestAnimationFrame(checkScroll);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [images.length]);

  const handleScrollLeft = () => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({ left: -180, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({ left: 180, behavior: "smooth" });
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full min-w-0 flex flex-col">
      {/* ================= MAIN IMAGE ================= */}
      <div className="w-full aspect-square bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs relative group p-5 sm:p-8 flex items-center justify-center">
        <img
          src={optimizeImageUrl(images[activeIndex], { width: 800 })}
          alt={product?.name || "Sản phẩm"}
          width={600}
          height={600}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Floating Arrows on Main Image if multiple images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-slate-200/80 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-600 hover:scale-110 transition-all cursor-pointer z-20"
              title="Ảnh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md border border-slate-200/80 text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:text-red-600 hover:scale-110 transition-all cursor-pointer z-20"
              title="Ảnh tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {images.length > 1 && (
          <div className="absolute top-2.5 right-3 z-20 bg-slate-900/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Subtle Watermark Tag */}
        <div className="absolute bottom-2.5 left-3 pointer-events-none opacity-80 z-20">
          <span className="inline-block bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
            DUDI SOFTWARE
          </span>
        </div>
      </div>

      {/* ================= THUMBNAILS CAROUSEL (LƯỚT NGANG KHI NHIỀU ẢNH) ================= */}
      {images.length > 1 && (
        <div className="relative mt-3.5 group/thumb">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={handleScrollLeft}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Scrollable Track */}
          <div
            ref={thumbnailsRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`
                  shrink-0 w-16 h-16 sm:w-[70px] sm:h-[70px]
                  bg-white
                  rounded-xl
                  overflow-hidden
                  p-1.5
                  transition-all duration-200 cursor-pointer
                  ${
                    activeIndex === index
                      ? "border-2 border-red-600 shadow-xs ring-2 ring-red-500/20 scale-102"
                      : "border border-slate-200/90 hover:border-red-400 hover:scale-102 opacity-75 hover:opacity-100"
                  }
                `}
              >
                <img
                  src={optimizeImageUrl(image, { width: 140 })}
                  alt={`${product?.name || "Thumbnail"} ${index + 1}`}
                  width={70}
                  height={70}
                  loading="lazy"
                  className="w-full h-full object-contain mix-blend-multiply"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={handleScrollRight}
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ================= VIEW INFO ================= */}
      <div className="text-center mt-3 mb-4">
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatViews(product?.views)}</span>
        </p>

        <p className="text-[10px] italic text-slate-400 mt-1.5">
          Hình ảnh hiển thị có thể khác so với xem trực tiếp ở cửa hàng
        </p>
      </div>

      {/* =================================================
          PAYMENT SUPPORT
      ================================================= */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>

          <h4 className="text-sm font-bold text-slate-900 uppercase">
            Hỗ trợ thanh toán
          </h4>
        </div>

        {/* PAYMENT METHODS */}
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="
                h-8
                bg-white
                border border-slate-200
                rounded-md
                px-1
                flex items-center justify-center
              "
            >
              <span
                className={`
                  text-[8px] sm:text-[9px]
                  font-black
                  whitespace-nowrap
                  ${method.className}
                `}
              >
                {method.name}
              </span>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-slate-200 my-4" />

        {/* INSTALLMENT */}
        <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">
          Hỗ trợ trả góp
        </h4>

        <div className="grid grid-cols-3 gap-2">
          {installmentMethods.map((method, index) => (
            <div
              key={index}
              className="
                h-9
                bg-white
                border border-slate-200
                rounded-md
                px-1
                flex items-center justify-center
              "
            >
              <span
                className={`
                  text-[8px]
                  font-bold
                  text-center
                  ${method.className}
                `}
              >
                {method.name}
              </span>
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Hỗ trợ thanh toán qua thẻ tín dụng, ví điện tử
            và các đơn vị trả góp uy tín.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;