/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zcomputer.vn",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
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
    ];
  },
};

export default nextConfig;
