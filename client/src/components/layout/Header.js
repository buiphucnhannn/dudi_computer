"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  PhoneCall,
  MapPin,
  Heart,
  Menu,
  ChevronDown,
  ChevronRight,
  X,
  User,
  Laptop,
  Monitor,
  Mouse,
  Keyboard,
  Server,
  Cpu,
  Zap,
  CircuitBoard,
  HardDrive,
  MemoryStick,
  Fan,
  Sparkles,
  LogOut,
} from "lucide-react";
import {
  loadCartFromStorage,
  selectTotalItems,
  fetchCloudWishlist,
  resetCartOnLogout,
} from "@/redux/slices/cartSlice";
import {
  initAuthFromStorage,
  logoutUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/slices/authSlice";
import { authAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

const NAV_CATEGORIES = [
  {
    name: "Laptop Cũ",
    slug: "laptop-cu",
    icon: Laptop,
    hasSub: true,
    subGroups: [
      {
        title: "Laptop Gaming",
        slug: "laptop-gaming",
        items: ["Laptop Dell", "Laptop Lenovo", "Laptop Asus", "Laptop Acer", "Laptop MSI", "Laptop HP", "Laptop Gigabyte", "Laptop Razer"],
      },
      {
        title: "Laptop Văn phòng",
        slug: "laptop-van-phong",
        items: ["Laptop Dell", "Laptop Lenovo", "Laptop HP", "Laptop Acer", "Laptop Asus", "Laptop MSI", "Laptop LG", "Laptop Surface"],
      },
    ],
  },
  {
    name: "PC Cũ",
    slug: "pc-cu",
    icon: Monitor,
    hasSub: false,
  },
  {
    name: "Chuột",
    slug: "chuot",
    icon: Mouse,
    hasSub: false,
  },
  {
    name: "Bàn phím",
    slug: "ban-phim",
    icon: Keyboard,
    hasSub: false,
  },
  {
    name: "Màn Hình",
    slug: "man-hinh",
    icon: Monitor,
    hasSub: true,
    subGroups: [
      {
        title: "Kích Thước Màn Hình",
        slug: "man-hinh",
        items: ["Màn hình 22 inch", "Màn hình 24 inch", "Màn hình 27 inch", "Màn hình 32 inch", "Màn hình cong", "Màn hình Gaming"],
      },
    ],
  },
  {
    name: "CASE - Vỏ máy tính",
    slug: "case-vo-may-tinh",
    icon: Server,
    hasSub: false,
  },
  {
    name: "CPU - Bộ vi xử lý",
    slug: "cpu-bo-vi-xu-ly",
    icon: Cpu,
    hasSub: false,
  },
  {
    name: "PSU - Nguồn máy tính",
    slug: "psu-nguon-may-tinh",
    icon: Zap,
    hasSub: true,
    subGroups: [
      {
        title: "Công Suất Nguồn",
        slug: "psu-nguon-may-tinh",
        items: ["Nguồn 450W - 550W", "Nguồn 600W - 750W", "Nguồn 850W - 1000W", "Nguồn 80 Plus Bronze", "Nguồn 80 Plus Gold"],
      },
    ],
  },
  {
    name: "Mainboard - Bo mạch chủ",
    slug: "mainboard-bo-mach-chu",
    icon: CircuitBoard,
    hasSub: false,
  },
  {
    name: "Ổ cứng HDD - SSD",
    slug: "o-cung-hdd-ssd",
    icon: HardDrive,
    hasSub: false,
  },
  {
    name: "RAM - Bộ nhớ trong",
    slug: "ram-bo-nho-trong",
    icon: MemoryStick,
    hasSub: false,
  },
  {
    name: "Tản nhiệt Cooling",
    slug: "tan-nhiet-cooling",
    icon: Fan,
    hasSub: false,
  },
  {
    name: "VGA - Card màn hình",
    slug: "vga-card-man-hinh",
    icon: Sparkles,
    hasSub: false,
  },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const totalItems = useSelector(selectTotalItems);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    setMounted(true);
    dispatch(loadCartFromStorage());
    dispatch(initAuthFromStorage());
  }, [dispatch]);

  // Đồng bộ Wishlist từ Cloud nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCloudWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(logoutUser());
      dispatch(resetCartOnLogout());
      setUserDropdownOpen(false);
      showToast({
        title: "Đã đăng xuất",
        message: "Bạn đã đăng xuất tài khoản thành công!",
        type: "info",
      });
    }
  };

  // Theo dõi cuộn trang để quyết định khi nào hiển thị Dropdown Danh Mục Sản Phẩm
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Chỉ hiển thị Dropdown khi cuộn xuống dưới hoặc khi ở trang con
  const showCategoryDropdown = pathname !== "/" || isScrolled;

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
              className="w-full border-2 border-[#eb1c24] bg-white rounded-full py-2.5 pl-6 pr-14 text-sm focus:outline-none focus:ring-3 focus:ring-red-100 transition-all duration-300 placeholder-gray-400 font-medium"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-[38px] w-12 bg-[#eb1c24] rounded-full text-white flex items-center justify-center hover:brightness-110 transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          {/* Hotline (Hiển thị thông tin, không kích hoạt gọi điện) */}
          <div
            className="hidden xl:flex items-center gap-2.5 p-1.5 rounded-full select-none cursor-default"
          >
            <div className="relative w-10 h-10 rounded-full bg-red-50 text-[#eb1c24] flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse-ring pointer-events-none"></span>
              <PhoneCall className="w-5 h-5 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                HOTLINE MUA HÀNG
              </span>
              <span className="text-sm font-black text-[#eb1c24] leading-tight tracking-tight">
                0977 334 415
              </span>
            </div>
          </div>

          {/* Showroom */}
          <Link
            href="/showroom"
            className="hidden lg:flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100/80 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center group-hover:bg-[#eb1c24] group-hover:text-white transition-colors duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                HỆ THỐNG 2 CƠ SỞ
              </span>
              <span className="text-sm font-black text-gray-900 leading-tight">
                Showroom
              </span>
            </div>
          </Link>

          {/* Wishlist / Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/cart"
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

          {/* User Auth Links (Đăng nhập | Đăng ký | Dropdown Profile) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-700 pl-2 relative">
            {mounted && isAuthenticated ? (
              <div
                className="relative group/user py-1"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#eb1c24] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-gray-500 font-medium block leading-tight">
                      Xin chào,
                    </span>
                    <span className="text-xs font-bold text-gray-900 leading-tight block truncate max-w-[100px]">
                      {user?.name}
                    </span>
                  </div>
                </Link>

                {/* User Dropdown Menu with Hover Bridge */}
                <div
                  className={`absolute right-0 top-full pt-1 w-48 z-50 transition-all duration-150 ${
                    userDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-100/80 py-1.5 overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:text-[#eb1c24] hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100/60"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Đăng nhập
                </Link>
                <span className="text-gray-300 font-normal">|</span>
                <Link
                  href="/register"
                  className="hover:text-[#dc2626] transition-colors"
                >
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
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                  showCategoryDropdown ? "group-hover/cat:rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu: CHỈ XUẤT HIỆN KHI ĐÃ CUỘN XUỐNG DƯỚI HOẶC Ở TRANG CON */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 w-[260px] bg-white text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-200/90 border-t-0 rounded-b-2xl z-50 py-1.5 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 pointer-events-none group-hover/cat:pointer-events-auto">
                {NAV_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.slug} className="group/item relative flex-1 flex flex-col justify-center">
                      <div className="px-2 py-0.5 flex items-center">
                        <Link
                          href={`/${cat.slug}`}
                          className="flex w-full items-center justify-between px-3 py-1.5 transition-all duration-200 rounded-lg text-gray-700 hover:bg-[#eb1c24] hover:text-white group-hover/item:bg-[#eb1c24] group-hover/item:text-white"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-gray-500 group-hover/item:text-white transition-colors" />
                            <span className="text-[13px] font-bold group-hover/item:text-white transition-colors">
                              {cat.name}
                            </span>
                          </div>
                          {cat.hasSub && (
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover/item:text-white transition-colors" />
                          )}
                        </Link>
                      </div>

                      {/* Flyout Submenu - Dính liền ngay bên cạnh dòng danh mục đang rê chuột */}
                      {cat.hasSub && cat.subGroups && (
                        <div
                          className={`opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible absolute left-full top-0 ${
                            cat.subGroups.length > 1 ? "w-[520px]" : "w-[280px]"
                          } bg-white shadow-[0_12px_35px_rgba(0,0,0,0.15)] border border-gray-200/90 z-50 rounded-2xl transition-all duration-200 p-4 sm:p-5 flex items-start gap-6 ml-0.5 pointer-events-none group-hover/item:pointer-events-auto`}
                        >
                          <div className="flex flex-wrap gap-x-6 gap-y-4 w-full items-start">
                            {cat.subGroups.map((group) => (
                              <div key={group.title} className="flex flex-col min-w-[210px] flex-1">
                                <Link
                                  href={`/${group.slug}`}
                                  className="font-bold text-gray-900 mb-2.5 hover:text-[#eb1c24] transition-colors text-[13px] border-b pb-1.5 border-red-100 uppercase"
                                >
                                  {group.title}
                                </Link>
                                <div className="flex flex-col gap-1">
                                  {group.items.map((brand) => (
                                    <Link
                                      key={brand}
                                      href={`/san-pham?search=${encodeURIComponent(brand)}`}
                                      className="group/link text-xs font-semibold text-gray-600 hover:text-[#eb1c24] hover:bg-red-50 hover:translate-x-0.5 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-2"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover/link:bg-[#eb1c24] transition-all shrink-0"></span>
                                      {brand}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
