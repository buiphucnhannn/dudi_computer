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
      {
        source: "/tin-tuc",
        destination: "/news",
      },
      {
        source: "/tin-tuc/:slug*",
        destination: "/news/:slug*",
      },
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
      {
        source: "/gio-hang",
        destination: "/cart",
      },
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
        source: "/gioi-thieu-ban-be",
        destination: "/referral",
      },
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
      {
        source: "/cong-cu-test/ban-phim",
        destination: "/keyboard-test",
      },
      {
        source: "/test-ban-phim",
        destination: "/keyboard-test",
      },
      {
        source: "/cong-cu-test/man-hinh",
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
        source: "/huong-dan-tra-gop",
        destination: "/installment-guide",
      },
      {
        source: "/tra-gop",
        destination: "/installment-guide",
      },
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
      {
        source: "/thu-cu-doi-moi",
        destination: "/trade-in",
      },
      {
        source: "/thu-mua-cu",
        destination: "/trade-in",
      },
      {
        source: "/student-promotion",
        destination: "/back-to-school",
      },
    ];
  },
};

export default nextConfig;
