"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  PhoneCall,
  MapPin,
  Heart,
  Menu,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { loadCartFromStorage, selectTotalItems } from "@/redux/slices/cartSlice";
import { initAuthFromStorage, selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const totalItems = useSelector(selectTotalItems);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setMounted(true);
    dispatch(loadCartFromStorage());
    dispatch(initAuthFromStorage());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white/95 md:bg-white/85 md:backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-gray-200/50">
      {/* Top Header Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-[#eb1c24] transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group relative">
          <img
            src="https://zcomputer.vn/logo-main.png"
            alt="ZComputer Logo"
            className="h-11 w-11 sm:h-[54px] sm:w-[54px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
          />
          <div className="flex items-center font-serif tracking-tight select-none">
            <span className="text-[#eb1c24] text-[40px] sm:text-[50px] font-black leading-none pb-[2px]">
              Z
            </span>
            <div className="flex flex-col justify-center ml-0.5 sm:ml-1 mt-[2px]">
              <span className="text-[#0B1527] text-[20px] sm:text-[25px] font-black leading-[0.8] tracking-normal font-sans">
                COMPUTER
              </span>
              <div className="flex justify-between items-center w-full mt-[3px] font-sans">
                <span className="text-[6px] sm:text-[8px] font-black text-[#eb1c24] uppercase tracking-tight">
                  PC GAMING
                </span>
                <span className="text-[6px] sm:text-[8px] font-black text-[#eb1c24] tracking-tight">
                  -
                </span>
                <span className="text-[6px] sm:text-[8px] font-black text-[#eb1c24] uppercase tracking-tight">
                  LAPTOP
                </span>
                <span className="text-[6px] sm:text-[8px] font-black text-[#eb1c24] tracking-tight">
                  -
                </span>
                <span className="text-[6px] sm:text-[8px] font-black text-[#eb1c24] uppercase tracking-tight">
                  WORKSTATION
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="flex-1 w-full min-w-[200px] max-w-2xl lg:max-w-3xl hidden md:flex relative mx-2 lg:mx-6">
          <form onSubmit={handleSearch} className="relative w-full group/search z-50">
            <input
              id="desktop-search-input"
              aria-label="Tìm kiếm sản phẩm"
              type="text"
              placeholder="Bạn cần tìm linh kiện, PC hay Laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-red-600/20 bg-gray-50 rounded-full py-2.5 pl-5 pr-16 text-sm focus:outline-none focus:border-red-600/60 focus:bg-white shadow-inner transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full w-14 bg-[#eb1c24] hover:bg-[#d01720] rounded-r-full text-white flex items-center justify-center transition-all duration-300"
              aria-label="Tìm kiếm"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          </form>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
          {/* Hotline */}
          <div className="hidden xl:flex items-center gap-3 border-r pr-3 border-gray-200">
            <a href="tel:0977334415" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#eb1c24] group-hover:bg-[#eb1c24] group-hover:text-white transition-colors duration-300">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">
                  HOTLINE MUA HÀNG
                </span>
                <span className="text-[15px] font-black text-[#eb1c24] leading-tight">
                  0977 334 415
                </span>
              </div>
            </a>

            {/* Showroom */}
            <Link href="#he-thong-showroom" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">
                  HỆ THỐNG 2 CƠ SỞ
                </span>
                <span className="text-[15px] font-black text-gray-800 leading-tight">
                  Showroom
                </span>
              </div>
            </Link>
          </div>

          {/* Wishlist / Cart Heart button */}
          <div className="relative">
            <Link
              href="/gio-hang"
              className="relative p-2 text-gray-700 hover:text-[#eb1c24] transition-colors flex items-center gap-1"
              title="Sản phẩm yêu thích / Giỏ hàng"
            >
              <Heart className="w-6 h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#eb1c24] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* User Auth Links (Đăng nhập | Đăng ký) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-700 pl-2">
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#eb1c24]" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </div>
            ) : (
              <>
                <Link href="/dang-nhap" className="hover:text-[#eb1c24] transition-colors">
                  Đăng nhập
                </Link>
                <span className="text-gray-300 font-normal">|</span>
                <Link href="/dang-ky" className="hover:text-[#eb1c24] transition-colors">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 relative z-30">
        <form onSubmit={handleSearch} className="relative w-full group/search">
          <input
            id="mobile-search-input"
            aria-label="Tìm kiếm sản phẩm di động"
            type="text"
            placeholder="Tìm kiếm linh kiện, PC, Laptop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-red-600/20 bg-gray-50 rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none focus:bg-white focus:border-red-600/60 transition-all duration-300 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full w-10 bg-[#eb1c24] rounded-r-full text-white flex items-center justify-center hover:brightness-110"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Dark Navigation Bar (Desktop) */}
      <div className="hidden md:block bg-gray-800 text-white relative z-40">
        <div className="container mx-auto px-4 relative flex items-center">
          {/* Category Dropdown Button */}
          <div className="relative hidden md:block mr-4 md:mr-8 shrink-0 w-[260px] group/cat" tabIndex={0}>
            <div className="bg-[#eb1c24] text-white flex items-center justify-between px-3 py-2 md:px-5 md:py-[14px] cursor-pointer hover:brightness-110 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center gap-1.5 md:gap-3 relative z-10">
                <Menu className="w-5 h-5" />
                <span className="font-bold tracking-wide uppercase text-[12px] md:text-[15px] whitespace-nowrap">
                  DANH MỤC SẢN PHẨM
                </span>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 relative z-10 group-hover/cat:rotate-180" />
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center flex-wrap lg:flex-nowrap justify-center md:justify-start gap-x-3 md:gap-x-4 lg:gap-x-6 xl:gap-x-8 gap-y-1 py-1 md:py-0 text-[11px] lg:text-[13px] xl:text-[14px] font-bold tracking-wide flex-1">
            {/* Tất cả sản phẩm */}
            <li className="shrink-0">
              <Link
                href="/san-pham"
                className="flex items-center gap-1 py-3 md:py-3.5 text-white hover:text-[#eb1c24] transition-all duration-300"
              >
                <span className="uppercase relative inline-block">
                  TẤT CẢ SẢN PHẨM
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#eb1c24] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm">
                    SHOP
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-[#eb1c24]"></span>
                  </span>
                </span>
              </Link>
            </li>

            {/* Chính Sách Tổng Hợp Dropdown */}
            <li className="relative shrink-0 group/policy">
              <div className="py-3 md:py-3.5 flex items-center gap-1 cursor-pointer uppercase text-white hover:text-[#eb1c24] transition-colors select-none">
                CHÍNH SÁCH TỔNG HỢP
                <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-300 group-hover/policy:rotate-180" />
              </div>
              <div className="absolute top-full left-0 w-60 bg-white/95 backdrop-blur-xl text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t-2 border-[#eb1c24] rounded-b-xl overflow-hidden z-50 transition-all duration-200 origin-top opacity-0 invisible group-hover/policy:opacity-100 group-hover/policy:visible pointer-events-none group-hover/policy:pointer-events-auto">
                <ul className="py-2 text-[13px] font-bold">
                  <li>
                    <Link
                      href="/chinh-sach-bao-hanh"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Chính sách bảo hành
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chinh-sach-bao-mat"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chinh-sach-van-chuyen"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Chính sách vận chuyển
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chinh-sach-doi-tra"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Chính sách đổi trả
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/chinh-sach-thanh-toan"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 uppercase"
                    >
                      Chính sách thanh toán
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Thu cũ đổi mới */}
            <li className="shrink-0">
              <Link
                href="/thu-mua-cu"
                className="py-3 md:py-3.5 block text-white hover:text-[#eb1c24] transition-colors uppercase"
              >
                THU CŨ ĐỔI MỚI
              </Link>
            </li>

            {/* Giới thiệu bạn bè (Chỉ đổi màu đỏ khi rê chuột tới) */}
            <li className="shrink-0">
              <Link
                href="/gioi-thieu-ban-be"
                className="py-3 md:py-3.5 block text-white hover:text-[#eb1c24] transition-colors uppercase font-bold"
              >
                GIỚI THIỆU BẠN BÈ
              </Link>
            </li>

            {/* Công cụ Test Dropdown */}
            <li className="relative shrink-0 group/test">
              <div className="py-3 md:py-3.5 flex items-center gap-1 cursor-pointer uppercase text-white hover:text-[#eb1c24] transition-colors select-none">
                CÔNG CỤ TEST
                <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-300 group-hover/test:rotate-180" />
              </div>
              <div className="absolute top-full right-0 w-60 bg-white/95 backdrop-blur-xl text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t-2 border-[#eb1c24] rounded-b-xl overflow-hidden z-50 transition-all duration-200 origin-top opacity-0 invisible group-hover/test:opacity-100 group-hover/test:visible pointer-events-none group-hover/test:pointer-events-auto">
                <ul className="py-2 text-[13px] font-bold">
                  <li>
                    <Link
                      href="/cong-cu-test/ban-phim"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Test Bàn Phím
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cong-cu-test/man-hinh"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Test Màn Hình
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cong-cu-test/loa-micro-webcam"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 uppercase"
                    >
                      Test Loa, Micro, Webcam
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
