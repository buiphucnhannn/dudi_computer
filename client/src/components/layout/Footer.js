"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const StoreLocations = dynamic(() => import("@/components/home/StoreLocations"), {
  ssr: false,
  loading: () => <div className="h-48 rounded-2xl bg-white/5 animate-pulse mb-8" />,
});

export default function Footer() {
  // Mobile accordion state (mở mặc định trên desktop, toggle linh hoạt trên mobile)
  const [openSections, setOpenSections] = useState({
    categories: true,
    policies: false,
    about: false,
    payments: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer className="relative bg-[#0b0f19] text-white/80 font-sans mt-0 border-t border-white/10 overflow-hidden">
      {/* 2 Khối ánh sáng mờ hậu cảnh: Đỏ góc trên trái + Xanh Sapphire góc dưới phải */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#eb1c24]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-4 right-1/10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 relative z-10">
        {/* Hệ thống cửa hàng Showroom (Nền đen trong suốt lung linh) */}
        <StoreLocations />

        {/* 5 Cột Footer chuẩn zcomputer.vn */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 relative z-10 pt-6 md:pt-10 border-t border-white/10">
          {/* Cột 1: Thông tin thương hiệu + Fanpage Facebook Widget */}
          <div className="md:col-span-6 lg:col-span-3 pr-0 lg:pr-4 space-y-4">
            {/* Logo trắng bo góc */}
            <Link
              href="/"
              className="inline-block bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-md hover:opacity-95 transition-opacity"
            >
              <div className="flex items-center gap-2 select-none">
                <Image
                  src="/images/dudi/dudisoftware4.webp"
                  alt="DUDI SOFTWARE Logo"
                  width={40}
                  height={40}
                  className="h-8 sm:h-10 w-8 sm:w-10 object-contain rounded-xl"
                />
                <div className="flex flex-col justify-center select-none">
                  <div className="flex items-baseline">
                    <span className="text-[#eb1c24] text-[16px] sm:text-[18px] font-black leading-none tracking-tight font-sans">
                      DUDI
                    </span>
                    <span className="text-[#0B1527] text-[11px] sm:text-[12px] font-black leading-none ml-1 tracking-wider font-sans">
                      SOFTWARE
                    </span>
                  </div>
                  <span className="text-[5.5px] sm:text-[6px] font-black text-[#b91c1c] uppercase mt-0.5 sm:mt-1 tracking-tight">
                    PC GAMING - LAPTOP - WORKSTATION
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-normal">
              DUDI SOFTWARE - Hệ thống chuyên cung cấp PC, Laptop Cũ / Like New uy tín, chất lượng cao với mức giá tốt nhất tại khu vực TP.HCM.
            </p>

            {/* Fanpage Facebook Card Widget */}
            <div className="space-y-2 pt-1 sm:pt-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase text-white/80 block tracking-wider">
                THEO DÕI DUDI SOFTWARE TẠI
              </span>
              <div className="bg-white text-gray-900 p-3 sm:p-3.5 rounded-2xl shadow-md border border-gray-100 space-y-2.5 sm:space-y-3 max-w-sm">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/dudi/dudisoftware2.webp"
                    alt="DUDI SOFTWARE Avatar"
                    width={40}
                    height={40}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 p-0.5 object-contain shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-[12.5px] font-bold text-gray-900 leading-snug truncate">
                      DUDI Software : Gaming.Nox.Office
                    </h5>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 block mt-0.5 font-medium">
                      3.185 người theo dõi
                    </span>
                  </div>
                </div>
                <a
                  href="https://www.facebook.com/dudi.websitechuyennghiep"
                  target="_blank"
                  rel="noreferrer"
                  className="w-max bg-[#f0f2f5] hover:bg-[#e4e6eb] text-[#050505] font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Theo dõi Trang</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: DANH MỤC CŨ/ LIKE NEW */}
          <div className="md:col-span-3 lg:col-span-2 border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("categories")}
              className="w-full flex items-center justify-between font-black uppercase mb-3 md:mb-5 text-[13px] sm:text-[14px] text-white tracking-wider cursor-pointer md:cursor-default"
            >
              <span>DANH MỤC CŨ / LIKE NEW</span>
              <ChevronDown
                className={`w-4 h-4 text-white/60 md:hidden transition-transform duration-200 ${
                  openSections.categories ? "rotate-180 text-red-500" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70 font-medium ${
                openSections.categories ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/product?category=pc&condition=used" className="hover:text-[#eb1c24] transition-colors">
                  PC Cũ
                </Link>
              </li>
              <li>
                <Link href="/product?category=laptop&condition=used" className="hover:text-[#eb1c24] transition-colors">
                  Laptop Cũ
                </Link>
              </li>
              <li>
                <Link href="/product?category=man-hinh" className="hover:text-[#eb1c24] transition-colors">
                  Màn hình máy tính
                </Link>
              </li>
              <li>
                <Link href="/product?search=linh%20ki%E1%BB%87n&condition=used" className="hover:text-[#eb1c24] transition-colors">
                  Linh Kiện Cũ
                </Link>
              </li>
              <li>
                <Link href="/screen-test" className="hover:text-[#eb1c24] transition-colors">
                  Công Cụ Test Màn Hình
                </Link>
              </li>
              <li>
                <Link href="/keyboard-test" className="hover:text-[#eb1c24] transition-colors">
                  Công Cụ Test Bàn Phím
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: CHÍNH SÁCH TỔNG HỢP */}
          <div className="md:col-span-3 lg:col-span-2 border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("policies")}
              className="w-full flex items-center justify-between font-black uppercase mb-3 md:mb-5 text-[13px] sm:text-[14px] text-white tracking-wider cursor-pointer md:cursor-default"
            >
              <span>CHÍNH SÁCH TỔNG HỢP</span>
              <ChevronDown
                className={`w-4 h-4 text-white/60 md:hidden transition-transform duration-200 ${
                  openSections.policies ? "rotate-180 text-red-500" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70 font-medium ${
                openSections.policies ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/return-policy" className="hover:text-[#eb1c24] transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#eb1c24] transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="hover:text-[#eb1c24] transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="hover:text-[#eb1c24] transition-colors">
                  Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#eb1c24] transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/installment-guide" className="hover:text-[#eb1c24] transition-colors">
                  Hướng dẫn trả góp
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: VỀ DUDI SOFTWARE */}
          <div className="md:col-span-4 lg:col-span-2 border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("about")}
              className="w-full flex items-center justify-between font-black uppercase mb-3 md:mb-5 text-[13px] sm:text-[14px] text-white tracking-wider cursor-pointer md:cursor-default"
            >
              <span>VỀ DUDI SOFTWARE</span>
              <ChevronDown
                className={`w-4 h-4 text-white/60 md:hidden transition-transform duration-200 ${
                  openSections.about ? "rotate-180 text-red-500" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 sm:space-y-3 text-xs sm:text-[13px] text-white/70 font-medium ${
                openSections.about ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/contact" className="hover:text-[#eb1c24] transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#eb1c24] transition-colors">
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#eb1c24] transition-colors">
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/store-locations" className="hover:text-[#eb1c24] transition-colors">
                  Hệ Thống Cửa Hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#eb1c24] transition-colors">
                  Giới Thiệu Về DUDI SOFTWARE
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: HỖ TRỢ THANH TOÁN & TRẢ GÓP */}
          <div className="md:col-span-8 lg:col-span-3 space-y-5 sm:space-y-6">
            {/* HỖ TRỢ THANH TOÁN */}
            <div>
              <h4 className="font-black uppercase mb-3 sm:mb-4 text-[13px] sm:text-[14px] text-white tracking-wider">
                HỖ TRỢ THANH TOÁN
              </h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-xs sm:max-w-none">
                {/* VISA */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 24 24" className="h-[18px] sm:h-[20px] w-auto fill-[#1434CB]">
                    <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 100 60" className="h-[20px] sm:h-[22px] w-auto">
                    <circle fill="#ea001b" cx="30" cy="30" r="30" />
                    <circle fill="#f79e1b" cx="70" cy="30" r="30" />
                    <path fill="#ff5f00" d="M50 52.4A30 30 0 0 1 50 7.6a30 30 0 0 0 0 44.8z" />
                  </svg>
                </div>

                {/* JCB */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 100 70" className="h-[20px] sm:h-[22px] w-auto">
                    <rect x="0" y="15" width="31" height="40" rx="4" fill="#003883" />
                    <rect x="34.5" y="15" width="31" height="40" rx="4" fill="#C11030" />
                    <rect x="69" y="15" width="31" height="40" rx="4" fill="#007F3E" />
                    <path fill="#fff" d="M22 28h-6v10c0 3-1.5 4-4 4s-4-1-4-4v-1H5v2c0 5 3 6 7 6 5 0 7-2 7-7V28zM57 39c-1 1-3 2-6 2-4 0-7-2-7-6s3-6 7-6c3 0 5 1 6 2l-2 3c-1-1-2-1-3-1-2 0-3 1-3 3 0 1 1 2 3 2 1 0 2 0 3-1l2 2zM91 35c2-1 3-2 3-4 0-3-2-4-5-4h-9v14h10c2 0 4-1 4-4 0-1-1-2-3-2zM83 30h4c1 0 2 1 2 2 0 1-1 2-2 2h-4v-4zm0 8v-4h4c1 0 2 0 2 2s-1 2-2 2h-4z" />
                  </svg>
                </div>

                {/* VietQR */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all">
                  <span className="font-bold text-xs sm:text-[13px] tracking-tighter font-sans">
                    <span className="text-[#005BAB]">Viet</span><span className="text-[#ED1C24]">QR</span>
                  </span>
                </div>

                {/* COD */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all">
                  <span className="font-black text-xs sm:text-[13px] tracking-wide text-amber-600 font-sans">
                    COD
                  </span>
                </div>

                {/* napas* */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all">
                  <span className="text-[#002776] font-black italic text-xs sm:text-[14px] tracking-tighter flex items-center gap-[1px] font-sans">
                    napas
                    <svg width="6" height="6" viewBox="0 0 24 24" fill="#4E9C2D" className="mt-[-4px]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* HỖ TRỢ TRẢ GÓP */}
            <div>
              <h4 className="font-black uppercase mb-3 sm:mb-4 text-[13px] sm:text-[14px] text-white tracking-wider">
                HỖ TRỢ TRẢ GÓP
              </h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-3 max-w-xs sm:max-w-none">
                {/* HD SAISON */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all overflow-hidden p-1">
                  <span className="text-[11px] sm:text-xs font-black tracking-tight">
                    <span className="text-[#103E8A]">HD</span> <span className="text-[#E31E24]">SAISON</span>
                  </span>
                </div>

                {/* MIRAE ASSET */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all overflow-hidden p-1">
                  <span className="text-[10px] sm:text-[11px] font-black text-[#F37021] tracking-tight">
                    MIRAE ASSET
                  </span>
                </div>

                {/* Kredivo */}
                <div className="bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-xs h-[38px] sm:h-[42px] hover:shadow-md transition-all overflow-hidden p-1">
                  <span className="text-[11px] sm:text-xs font-black text-[#FF6B00] tracking-tight">
                    Kredivo
                  </span>
                </div>
              </div>

              {/* DMCA Badge */}
              <a
                href="https://www.dmca.com/Protection/Status.aspx"
                target="_blank"
                rel="noreferrer"
                className="inline-block hover:opacity-90 transition-opacity"
                title="DMCA.com Protection Status"
              >
                <img
                  src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-01.png"
                  alt="DMCA.com Protection Status"
                  className="h-[22px] sm:h-[26px] w-auto object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Vùng chân trang Bản quyền & Pháp lý */}
      <div className="w-full bg-[#050608] border-t border-white/5 py-6 sm:py-8 text-center text-xs text-white/50 space-y-2 relative z-20">
        <div className="container mx-auto px-4 space-y-2 max-w-3xl">
          <h5 className="font-black text-white text-xs sm:text-sm uppercase tracking-wide">
            CÔNG TY TNHH GIẢI PHÁP PHẦN MỀM DUDI
          </h5>
          <p className="text-[11.5px] sm:text-[12.5px] text-white/60 leading-relaxed">
            <strong>Mã số GPKD:</strong> 0319641544 - Cấp bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh.
          </p>
          <p className="text-[11.5px] sm:text-[12.5px] text-white/60 leading-relaxed">
            <strong>Địa chỉ:</strong> 49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh.
          </p>
          <p className="text-[11.5px] sm:text-[12.5px] text-white/60 leading-relaxed">
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@dudisoftware.com" className="hover:text-white transition-colors">
              contact@dudisoftware.com
            </a>{" "}
            | <strong>Hotline:</strong>{" "}
            <a
              href="tel:0909163821"
              className="text-white hover:text-[#eb1c24] font-bold transition-colors"
            >
              (+84) 909 163 821
            </a>
          </p>
          <div className="pt-2 text-[11px] sm:text-[12px] text-white/40">
            © 2026 <strong>DUDI SOFTWARE</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}


