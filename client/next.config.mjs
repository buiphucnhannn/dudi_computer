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
    ];
  },
};

export default nextConfig;
