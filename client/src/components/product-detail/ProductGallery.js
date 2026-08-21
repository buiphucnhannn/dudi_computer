"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

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

  const rawImages = (
    product?.images?.length
      ? product.images
      : [product?.thumbnail]
  ).filter(Boolean);

  const images =
    rawImages.length > 0
      ? rawImages
      : ["/images/dudi/dudisoftware1.png"];

  const activeIndex = Math.min(
    selectedImage,
    images.length - 1
  );

  return (
    <div className="w-full min-w-0 flex flex-col">
      {/* ================= MAIN IMAGE ================= */}
      <div className="w-full aspect-square bg-white rounded-xl overflow-hidden border border-slate-200 relative group">
        <img
          src={images[activeIndex]}
          alt={product?.name || "Sản phẩm"}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
        {images.slice(0, 8).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`
              aspect-square
              bg-white
              rounded-lg
              overflow-hidden
              transition-all
              ${
                activeIndex === index
                  ? "border-2 border-red-600"
                  : "border border-slate-200 hover:border-red-400"
              }
            `}
          >
            <img
              src={image}
              alt={`${product?.name || "Thumbnail"} ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* ================= VIEW INFO ================= */}
      <div className="text-center mt-3 mb-4">
        <p className="text-xs text-slate-500">
          ◉ 0 lượt xem
        </p>

        <p className="text-[10px] italic text-slate-400 mt-1">
          Hình ảnh hiển thị có thể khác so với xem trực tiếp
          ở cửa hàng
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