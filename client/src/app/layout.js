import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWidgets from "@/components/layout/FloatingWidgets";
import ReduxProvider from "@/redux/provider";
import { ToastProvider } from "@/components/common/ToastContext";

export const metadata = {
  title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
  description:
    "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ tại TP.HCM. Hàng chính hãng, bảo hành chu đáo, hỗ trợ trả góp 0%.",
  icons: {
    icon: "https://zcomputer.vn/logo-main.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col antialiased bg-[#f8f9fa] text-gray-900 selection:bg-[#dc2626] selection:text-white"
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <FloatingWidgets />
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
