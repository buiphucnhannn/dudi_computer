import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Đăng Nhập Tài Khoản",
  description: "Đăng nhập tài khoản DUDI SOFTWARE để quản lý đơn hàng và nhận nhiều ưu đãi đặc quyền.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
