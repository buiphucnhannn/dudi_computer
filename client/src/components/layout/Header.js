"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
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
  TrendingUp,
  ShoppingCart,
  Scale,
  RefreshCw,
  Users,
  ShieldCheck,
  FileText,
} from "lucide-react";
import {
  fetchCloudWishlist,
  loadCartFromStorage,
  resetCartOnLogout,
  selectTotalItems,
} from "@/redux/slices/cartSlice";
import {
  initAuthFromStorage,
  logoutUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/slices/authSlice";
import { authAPI, productAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";
import { useCompare } from "@/components/common/CompareContext";

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
        items: [
          "Laptop Dell",
          "Laptop Lenovo",
          "Laptop Asus",
          "Laptop Acer",
          "Laptop MSI",
          "Laptop HP",
          "Laptop Gigabyte",
          "Laptop Razer",
        ],
      },
      {
        title: "Laptop Văn phòng",
        slug: "laptop-van-phong",
        items: [
          "Laptop Dell",
          "Laptop Lenovo",
          "Laptop HP",
          "Laptop Acer",
          "Laptop Asus",
          "Laptop MSI",
          "Laptop LG",
          "Laptop Surface",
        ],
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
        items: [
          "Màn hình 22 inch",
          "Màn hình 24 inch",
          "Màn hình 27 inch",
          "Màn hình 32 inch",
          "Màn hình cong",
          "Màn hình Gaming",
        ],
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
        items: [
          "Nguồn 450W - 550W",
          "Nguồn 600W - 750W",
          "Nguồn 850W - 1000W",
          "Nguồn 80 Plus Bronze",
          "Nguồn 80 Plus Gold",
        ],
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { compareItems } = useCompare();
  const totalItems = useSelector(selectTotalItems);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const POPULAR_SEARCHES = [
    "Laptop Lenovo",
    "PC Cũ",
    "i5 13400F",
    "RTX 4060",
    "Màn hình 24 inch",
    "B760M",
    "SSD 1TB",
    "RAM 16GB",
  ];

  const [headerProducts, setHeaderProducts] = useState([]);

  useEffect(() => {
    productAPI
      .getAll({ limit: 100 })
      .then((res) => {
        if (res.data?.data?.products) {
          setHeaderProducts(res.data.data.products);
        } else if (Array.isArray(res.data?.data)) {
          setHeaderProducts(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Instant live search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return headerProducts
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        const category = (p.categoryName || "").toLowerCase();
        return name.includes(q) || brand.includes(q) || category.includes(q);
      })
      .slice(0, 6);
  }, [searchQuery, headerProducts]);

  // Click outside listener for search suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutsideDesktop =
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target);
      const isOutsideMobile =
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tự động đóng menu mobile khi đổi trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedCategory(null);
  }, [pathname]);

  // Khóa cuộn trang khi menu mobile mở
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      setIsSearchOpen(false);
      router.push(`/product?search=${encodeURIComponent(q)}`);
    }
  };

  const handleSelectKeyword = (kw) => {
    setSearchQuery(kw);
    setIsSearchOpen(false);
    router.push(`/product?search=${encodeURIComponent(kw)}`);
  };

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    const slug = product.slug || product._id || product.id;
    router.push(`/product-detail?slug=${encodeURIComponent(slug)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 shrink-0 group relative"
        >
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
        <div
          ref={searchContainerRef}
          className="flex-1 w-full min-w-[200px] max-w-2xl lg:max-w-3xl hidden md:flex relative mx-2 lg:mx-6"
        >
          <form
            onSubmit={handleSearch}
            className="relative w-full group/search z-50"
          >
            <input
              id="desktop-search-input"
              aria-label="Tìm kiếm sản phẩm"
              type="text"
              placeholder="Bạn cần tìm linh kiện, PC hay Laptop..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full border-2 border-[#eb1c24] bg-white rounded-full py-2.5 pl-6 pr-20 text-sm focus:outline-none focus:ring-3 focus:ring-red-100 transition-all duration-300 placeholder-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer transition-colors"
                aria-label="Xóa từ khóa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-[38px] w-12 bg-[#eb1c24] rounded-full text-white flex items-center justify-center hover:brightness-110 transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Live Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {searchQuery.trim() ? (
                <>
                  {searchResults.length > 0 ? (
                    <div>
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          Sản phẩm gợi ý ({searchResults.length})
                        </span>
                      </div>
                      <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
                        {searchResults.map((item) => {
                          const img =
                            item.thumbnail ||
                            (Array.isArray(item.images)
                              ? item.images[0]
                              : "") ||
                            "";
                          const price = Number(item.price || 0);
                          const originalPrice = Number(
                            item.originalPrice || 0
                          );

                          return (
                            <div
                              key={item._id || item.slug}
                              onClick={() => handleSelectProduct(item)}
                              className="p-3 hover:bg-red-50/50 transition-colors flex items-center gap-3.5 cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                {img ? (
                                  <img
                                    src={img}
                                    alt={item.name}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <ShoppingCart className="w-5 h-5 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#eb1c24] transition-colors">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-extrabold text-[#eb1c24]">
                                    {price > 0
                                      ? `${price.toLocaleString("vi-VN")}₫`
                                      : "Liên hệ"}
                                  </span>
                                  {originalPrice > price && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                      {originalPrice.toLocaleString(
                                        "vi-VN"
                                      )}
                                      ₫
                                    </span>
                                  )}
                                  {item.categoryName && (
                                    <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-auto truncate max-w-[120px]">
                                      {item.categoryName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full p-3 bg-red-50 hover:bg-red-100 text-[#eb1c24] text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-t border-red-100"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>
                          Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Không tìm thấy sản phẩm phù hợp với &quot;
                        {searchQuery}&quot;
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hãy thử tìm kiếm với từ khóa khác như &quot;Laptop&quot;,
                        &quot;PC&quot;, &quot;RTX 4060&quot;
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#eb1c24]" />
                    <span>Tìm kiếm phổ biến</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SEARCHES.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleSelectKeyword(kw)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-[#eb1c24] text-gray-700 text-xs font-semibold rounded-full transition-colors cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
          {/* Hotline */}
          <div className="hidden xl:flex items-center gap-3 border-r pr-3 border-gray-200">
            <div className="flex items-center gap-2 select-none cursor-default">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#eb1c24]">
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
            </div>

            {/* Showroom */}
            <Link href="/store-locations" className="flex items-center gap-2 group cursor-pointer">
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
          <div className="hidden sm:flex items-center gap-2 pl-2 relative">
            {mounted && isAuthenticated ? (
              <div
                className="relative group/user py-1"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-gray-50 hover:bg-gray-100/90 border border-gray-200/60 transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#eb1c24] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-[12px] text-gray-500 font-medium block leading-tight">
                      Xin chào,
                    </span>
                    <span className="text-[15px] font-black text-gray-900 leading-tight block truncate max-w-[140px]">
                      {user?.name}
                    </span>
                  </div>
                </Link>

                {/* User Dropdown Menu with Hover Bridge (Căn giữa hoàn hảo ngay dưới thẻ người dùng) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[210px] z-50 transition-all duration-150 ${
                    userDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-1 pointer-events-none"
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 p-1.5 overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 text-[14px] font-bold text-gray-700 hover:text-[#eb1c24] hover:bg-red-50/60 rounded-xl transition-all"
                    >
                      <User className="w-4.5 h-4.5 text-gray-500 shrink-0" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-[14px] font-bold text-red-600 hover:bg-red-50/60 rounded-xl transition-all cursor-pointer border-t border-gray-100 mt-1"
                    >
                      <LogOut className="w-4.5 h-4.5 shrink-0 text-red-500" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[15px] font-bold text-gray-900">
                <Link href="/dang-nhap" className="hover:text-[#eb1c24] transition-colors py-1">
                  Đăng nhập
                </Link>
                <span className="text-gray-300 font-normal">|</span>
                <Link href="/dang-ky" className="hover:text-[#eb1c24] transition-colors py-1">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        ref={mobileSearchRef}
        className="md:hidden px-4 pb-3 relative z-30"
      >
        <form onSubmit={handleSearch} className="relative w-full group/search">
          <input
            id="mobile-search-input"
            aria-label="Tìm kiếm sản phẩm di động"
            type="text"
            placeholder="Tìm kiếm linh kiện, PC, Laptop..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            className="w-full border-2 border-red-600/20 bg-gray-50 rounded-full py-1.5 pl-4 pr-16 text-xs focus:outline-none focus:bg-white focus:border-red-600/60 transition-all duration-300 shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-11 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Xóa từ khóa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-0 top-0 h-full w-10 bg-[#eb1c24] rounded-r-full text-white flex items-center justify-center hover:brightness-110"
            aria-label="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {searchQuery.trim() ? (
              searchResults.length > 0 ? (
                <div>
                  <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {searchResults.map((item) => {
                      const img =
                        item.thumbnail ||
                        (Array.isArray(item.images)
                          ? item.images[0]
                          : "") ||
                        "";
                      const price = Number(item.price || 0);

                      return (
                        <div
                          key={item._id || item.slug}
                          onClick={() => handleSelectProduct(item)}
                          className="p-2.5 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded bg-slate-50 border p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            {img ? (
                              <img
                                src={img}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <ShoppingCart className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                              {item.name}
                            </h4>
                            <span className="text-[11px] font-extrabold text-[#eb1c24]">
                              {price > 0
                                ? `${price.toLocaleString("vi-VN")}₫`
                                : "Liên hệ"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full p-2.5 bg-red-50 text-[#eb1c24] text-xs font-bold text-center block border-t border-red-100 cursor-pointer"
                  >
                    Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  Không tìm thấy kết quả phù hợp với &quot;{searchQuery}&quot;
                </div>
              )
            ) : (
              <div className="p-3">
                <span className="text-[11px] font-bold text-gray-500 block mb-2">
                  Tìm kiếm phổ biến
                </span>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SEARCHES.slice(0, 6).map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleSelectKeyword(kw)}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-full hover:bg-red-50 hover:text-[#eb1c24]"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dark Navigation Bar (Desktop) */}
      <div className="hidden md:block bg-gray-800 text-white relative z-40">
        <div className="container mx-auto px-4 relative flex items-center">
          {/* Category Dropdown Button */}
          <div
            className="relative hidden md:block shrink-0 w-[240px] lg:w-[260px] group/cat"
            tabIndex={0}
          >
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
                                      href={`/product?search=${encodeURIComponent(brand)}`}
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

          {/* Navigation Links (Khoảng cách đều đặn, liền mạch sang bên trái) */}
          <ul className="flex items-center justify-start gap-x-5 lg:gap-x-7 xl:gap-x-9 py-1 md:py-0 text-[12px] lg:text-[13px] xl:text-[14px] font-bold tracking-wide flex-1 pl-4 lg:pl-7">
            {/* Tất cả sản phẩm */}
            <li className="shrink-0">
              <Link
                href="/product"
                className="flex items-center gap-1 py-3 md:py-[14px] text-white hover:text-[#eb1c24] transition-all duration-300"
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
              <div className="py-3 md:py-[14px] flex items-center gap-1.5 cursor-pointer uppercase text-white hover:text-[#eb1c24] transition-colors select-none">
                <span>CHÍNH SÁCH TỔNG HỢP</span>
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
                href="/trade-in"
                className="py-3 md:py-[14px] block text-white hover:text-[#eb1c24] transition-colors uppercase"
              >
                THU CŨ ĐỔI MỚI
              </Link>
            </li>

            {/* Giới thiệu bạn bè */}
            <li className="shrink-0">
              <Link
                href="/referral"
                className="py-3 md:py-[14px] block text-white hover:text-[#eb1c24] transition-colors uppercase font-bold"
              >
                GIỚI THIỆU BẠN BÈ
              </Link>
            </li>

            {/* Công cụ Test Dropdown */}
            <li className="relative shrink-0 group/test">
              <div className="py-3 md:py-[14px] flex items-center gap-1.5 cursor-pointer uppercase text-white hover:text-[#eb1c24] transition-colors select-none">
                <span>CÔNG CỤ TEST</span>
                <ChevronDown className="w-4 h-4 text-gray-300 transition-transform duration-300 group-hover/test:rotate-180" />
              </div>
              <div className="absolute top-full right-0 w-60 bg-white/95 backdrop-blur-xl text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-t-2 border-[#eb1c24] rounded-b-xl overflow-hidden z-50 transition-all duration-200 origin-top opacity-0 invisible group-hover/test:opacity-100 group-hover/test:visible pointer-events-none group-hover/test:pointer-events-auto">
                <ul className="py-2 text-[13px] font-bold">
                  <li>
                    <Link
                      href="/keyboard-test"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Test Bàn Phím
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/screen-test"
                      className="block px-5 py-3 hover:bg-red-50 hover:text-[#eb1c24] hover:pl-6 transition-all duration-300 border-b border-gray-100 uppercase"
                    >
                      Test Màn Hình
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/peripherals-test"
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
      {/* ========================================================= */}
      {/* MOBILE HAMBURGER NAVIGATION DRAWER / SIDEBAR */}
      {/* ========================================================= */}

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[100] transition-opacity duration-300 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[86%] max-w-[340px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <img
              src="https://zcomputer.vn/logo-main.png"
              alt="ZComputer Logo"
              className="h-8 w-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-tight">
                ZCOMPUTER
              </span>
              <span className="text-[9px] font-bold text-[#eb1c24] tracking-tight">
                PC & LAPTOP GAMING
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-200/70 hover:bg-red-50 text-gray-600 hover:text-[#eb1c24] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {/* User Auth Section */}
          <div className="p-4 bg-gradient-to-br from-red-50/40 via-white to-gray-50/50">
            {mounted && isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 min-w-0"
                >
                  <div className="w-10 h-10 rounded-full bg-[#eb1c24] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-gray-400 font-medium block">
                      Tài khoản của bạn
                    </span>
                    <span className="text-sm font-bold text-gray-900 block truncate">
                      {user?.name || "Người dùng"}
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-[#eb1c24] text-white text-xs font-bold rounded-xl text-center shadow-xs hover:bg-[#c9121a] transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 bg-white text-gray-700 text-xs font-bold rounded-xl text-center border border-gray-200 hover:border-red-400 transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Quick Access Badges Grid */}
          <div className="p-3 grid grid-cols-2 gap-2 bg-white">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100/70 text-[#eb1c24] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-800 block leading-tight">
                  Ưa thích & Giỏ
                </span>
                <span className="text-[10px] text-gray-400">
                  {mounted && totalItems > 0 ? `${totalItems} món` : "0 sản phẩm"}
                </span>
              </div>
            </Link>

            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-gray-50 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors border border-gray-100"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-gray-800 block leading-tight">
                  So sánh
                </span>
                <span className="text-[10px] text-gray-400">Cấu hình PC</span>
              </div>
            </Link>

            <Link
              href="/back-to-school"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-red-50/60 hover:bg-red-100/60 rounded-xl flex items-center gap-2.5 transition-colors border border-red-100 col-span-2"
            >
              <div className="w-8 h-8 rounded-lg bg-[#eb1c24] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#eb1c24] uppercase tracking-wide">
                    Ưu Đãi Học Sinh - Sinh Viên
                  </span>
                  <span className="text-[9px] font-black bg-[#eb1c24] text-white px-1.5 py-0.2 rounded-full">
                    HOT
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate">
                  Giảm thêm tới 500k + Quà tặng độc quyền
                </span>
              </div>
            </Link>
          </div>

          {/* Main Navigation & Categories Accordion */}
          <div className="p-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-2 block mb-2">
              Danh mục sản phẩm
            </span>

            {/* Link to all products */}
            <Link
              href="/product"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl font-bold text-xs text-[#eb1c24] bg-red-50/70 hover:bg-red-100 transition-colors mb-1.5"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#eb1c24]" />
                <span>TẤT CẢ SẢN PHẨM</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#eb1c24]" />
            </Link>

            {/* Category Accordion Items */}
            <div className="space-y-1">
              {NAV_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isExpanded = expandedCategory === cat.slug;

                return (
                  <div key={cat.slug} className="rounded-xl overflow-hidden">
                    <div
                      onClick={() => {
                        if (cat.hasSub) {
                          setExpandedCategory(isExpanded ? null : cat.slug);
                        } else {
                          setMobileMenuOpen(false);
                          router.push(`/product?category=${cat.slug}`);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        isExpanded
                          ? "bg-gray-100 text-[#eb1c24]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isExpanded ? "text-[#eb1c24]" : "text-gray-400"}`} />
                        <span>{cat.name}</span>
                      </div>
                      {cat.hasSub ? (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-[#eb1c24]" : ""
                          }`}
                        />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      )}
                    </div>

                    {/* Subcategories */}
                    {cat.hasSub && isExpanded && (
                      <div className="pl-9 pr-3 py-1.5 bg-gray-50/80 rounded-b-xl space-y-2 text-xs">
                        {cat.subGroups?.map((group) => (
                          <div key={group.title} className="py-1">
                            <Link
                              href={`/product?category=${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="font-bold text-gray-900 hover:text-[#eb1c24] text-[11px] uppercase block mb-1.5"
                            >
                              {group.title}
                            </Link>
                            <div className="grid grid-cols-2 gap-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item}
                                  href={`/product?search=${encodeURIComponent(item)}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="text-[11px] text-gray-600 hover:text-[#eb1c24] hover:bg-white px-2 py-1 rounded transition-colors"
                                >
                                  • {item}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dịch vụ & Chính sách */}
          <div className="p-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-2 block mb-2">
              Dịch vụ & Chính sách
            </span>

            <div className="space-y-1 text-xs font-semibold text-gray-700">
              <Link
                href="/trade-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  <span>Thu cũ đổi mới</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/referral"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Giới thiệu bạn bè</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/store-locations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Hệ thống Showroom</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/warranty-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span>Chính sách bảo hành</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/return-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Chính sách đổi trả</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/shipping-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Chính sách vận chuyển</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Chính sách bảo mật</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>

              <Link
                href="/payment-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 hover:text-[#eb1c24] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Chính sách thanh toán</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer / Hotline */}
        <div className="p-3.5 border-t border-gray-100 bg-gray-50/90 shrink-0">
          <a
            href="tel:0977334415"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#eb1c24] text-white rounded-xl font-bold text-xs shadow-xs hover:bg-[#c9121a] transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>HOTLINE: 0977 334 415</span>
          </a>
        </div>
      </aside>
    </header>
  );
}
