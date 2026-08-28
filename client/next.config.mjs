/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3001",
    "localhost:3002",
    "127.0.0.1:3000",
    "127.0.0.1:3001",
    "192.168.1.27:3000",
    "192.168.1.27:3001",
    "192.168.1.27",
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@reduxjs/toolkit", "clsx"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zcomputer.vn",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@reduxjs/toolkit",
      "clsx",
      "tailwind-merge",
    ],
  },
  async rewrites() {
    return [
      // 1. Tin tức
      {
        source: "/tin-tuc",
        destination: "/news",
      },
      {
        source: "/tin-tuc/:slug*",
        destination: "/news/:slug*",
      },

      // 2. Chính sách & Quy định
      {
        source: "/chinh-sach-bao-hanh",
        destination: "/warranty-policy",
      },
      {
        source: "/chinh-sach-bao-mat",
        destination: "/privacy-policy",
      },
      {
        source: "/chinh-sach-van-chuyen",
        destination: "/shipping-policy",
      },
      {
        source: "/chinh-sach-doi-tra",
        destination: "/return-policy",
      },
      {
        source: "/chinh-sach-thanh-toan",
        destination: "/payment-policy",
      },

      // 3. Giỏ hàng & Thanh toán
      {
        source: "/gio-hang",
        destination: "/cart",
      },

      // 4. Tài khoản & Xác thực
      {
        source: "/dang-nhap",
        destination: "/login",
      },
      {
        source: "/dang-ky",
        destination: "/register",
      },
      {
        source: "/quen-mat-khau",
        destination: "/forgot-password",
      },
      {
        source: "/tai-khoan",
        destination: "/profile",
      },
      {
        source: "/thong-tin-tai-khoan",
        destination: "/profile",
      },

      // 5. Giới thiệu bạn bè
      {
        source: "/gioi-thieu-ban-be",
        destination: "/referral",
      },

      // 6. Hệ thống Showroom & Cửa hàng
      {
        source: "/he-thong-cua-hang",
        destination: "/store-locations",
      },
      {
        source: "/showroom",
        destination: "/store-locations",
      },
      {
        source: "/he-thong-showroom",
        destination: "/store-locations",
      },

      // 7. Công cụ kiểm tra phần cứng (Test Tools)
      {
        source: "/cong-cu-test/ban-phim",
        destination: "/keyboard-test",
      },
      {
        source: "/test-ban-phim",
        destination: "/keyboard-test",
      },
      {
        source: "/kiem-tra-ban-phim",
        destination: "/keyboard-test",
      },
      {
        source: "/cong-cu-test/man-hinh",
        destination: "/screen-test",
      },
      {
        source: "/test-man-hinh",
        destination: "/screen-test",
      },
      {
        source: "/kiem-tra-man-hinh",
        destination: "/screen-test",
      },
      {
        source: "/cong-cu-test/loa-micro-webcam",
        destination: "/peripherals-test",
      },
      {
        source: "/test-loa-micro-webcam",
        destination: "/peripherals-test",
      },
      {
        source: "/kiem-tra-ngoai-vi",
        destination: "/peripherals-test",
      },

      // 8. Hướng dẫn trả góp
      {
        source: "/huong-dan-tra-gop",
        destination: "/installment-guide",
      },
      {
        source: "/tra-gop",
        destination: "/installment-guide",
      },

      // 9. Liên hệ, Tuyển dụng & Giới thiệu
      {
        source: "/lien-he",
        destination: "/contact",
      },
      {
        source: "/tuyen-dung",
        destination: "/careers",
      },
      {
        source: "/ve-chung-toi",
        destination: "/about",
      },
      {
        source: "/gioi-thieu",
        destination: "/about",
      },

      // 10. Thu cũ đổi mới
      {
        source: "/thu-cu-doi-moi",
        destination: "/trade-in",
      },
      {
        source: "/thu-mua-cu",
        destination: "/trade-in",
      },

      // 11. Chương trình Back to school
      {
        source: "/student-promotion",
        destination: "/back-to-school",
      },
      {
        source: "/uu-dai-hoc-sinh-sinh-vien",
        destination: "/back-to-school",
      },

      // 12. So sánh sản phẩm
      {
        source: "/so-sanh",
        destination: "/compare",
      },

      // 13. Sản phẩm & Chi tiết sản phẩm
      {
        source: "/tat-ca-san-pham",
        destination: "/product",
      },
      {
        source: "/san-pham",
        destination: "/product",
      },
      {
        source: "/all",
        destination: "/product",
      },
      {
        source: "/chi-tiet-san-pham",
        destination: "/product-detail",
      },

      // 14. Backend API Proxy (Hỗ trợ truy cập qua mạng LAN / IP Network 192.168.x.x trên điện thoại)
      {
        source: "/api/v1/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:5000"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
