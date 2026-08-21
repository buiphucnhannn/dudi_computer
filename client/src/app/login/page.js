import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Đăng Nhập Tài Khoản",
  description: "Đăng nhập tài khoản DUDI SOFTWARE để quản lý đơn hàng và nhận nhiều ưu đãi đặc quyền.",
};

export default function LoginPage() {
  return <LoginForm />;
}
