import "./globals.css";
import ReduxProvider from "@/redux/provider";
import { ToastProvider } from "@/components/common/ToastContext";
import { CompareProvider } from "@/components/common/CompareContext";
import SessionWatcher from "@/components/common/SessionWatcher";
import AppLayoutWrapper from "@/components/layout/AppLayoutWrapper";

export const metadata = {
  title: {
    default: "DUDI SOFTWARE - PC Gaming, Laptop, Workstation",
    template: "%s | DUDI SOFTWARE",
  },
  description:
    "DUDI SOFTWARE chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ tại TP.HCM. Hàng chính hãng, bảo hành chu đáo, hỗ trợ trả góp 0%.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://zcomputer.vn" />
        <link rel="dns-prefetch" href="https://zcomputer.vn" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="preload"
          as="image"
          href="https://zcomputer.vn/uploads/image-1784730915598-869631355.webp"
          fetchPriority="high"
          type="image/webp"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased bg-[#f8f9fa] text-gray-900 selection:bg-[#dc2626] selection:text-white"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ToastProvider>
            <CompareProvider>
              <SessionWatcher />
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
            </CompareProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
