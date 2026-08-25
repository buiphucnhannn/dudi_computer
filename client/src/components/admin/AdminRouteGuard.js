"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  LogIn,
  AlertTriangle,
  UserCheck,
  LayoutDashboard,
  ShieldBan,
} from "lucide-react";
import {
  initAuthFromStorage,
  logoutUser,
  isAdminRole,
  getAdminRoleInfo,
  hasAdminModulePermission,
} from "@/redux/slices/authSlice";

const getRouteModuleKey = (pathname) => {
  if (
    pathname.startsWith("/admin/products") ||
    pathname.startsWith("/admin/categories") ||
    pathname.startsWith("/admin/orders") ||
    pathname.startsWith("/admin/promotions") ||
    pathname.startsWith("/admin/statistics")
  ) {
    return "commerce";
  }
  if (
    pathname.startsWith("/admin/news") ||
    pathname.startsWith("/admin/careers")
  ) {
    return "content";
  }
  if (pathname.startsWith("/admin/users")) {
    return "customers";
  }
  if (pathname.startsWith("/admin/settings")) {
    return "settings";
  }
  return "overview";
};

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    dispatch(initAuthFromStorage());
    setMounted(true);
  }, [dispatch]);

  const handleSwitchAdminAccount = () => {
    setIsRedirecting(true);
    dispatch(logoutUser());
    window.location.replace("/login");
  };

  // 1. Trong quá trình khởi tạo hoặc đang chuyển hướng: Hiển thị trạng thái kiểm tra an toàn
  if (!mounted || isRedirecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center animate-pulse">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-white font-bold text-base tracking-wide">
              HỆ THỐNG BẢO MẬT DUDI SOFTWARE
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Đang xác thực và chuyển hướng an toàn...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Chưa đăng nhập: Hiển thị màn hình Yêu Cầu Đăng Nhập
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            YÊU CẦU ĐĂNG NHẬP
          </h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Bạn cần đăng nhập bằng tài khoản Quản trị viên (Admin) để có quyền truy cập vào cổng quản trị hệ thống.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập ngay</span>
            </Link>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ cửa hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Đã đăng nhập nhưng KHÔNG PHẢI ADMIN (User thường): Chặn tuyệt đối với màn hình 403 Forbidden
  if (!isAdminRole(user?.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
        <div className="max-w-xl w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-red-950/60 backdrop-blur-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Warning Icon */}
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-red-500/20">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-3.5">
            <AlertTriangle className="w-4 h-4" />
            <span>403 - Forbidden Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            QUYỀN TRUY CẬP BỊ TỪ CHỐI
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto">
            Khu vực này được bảo vệ nghiêm ngặt và chỉ dành riêng cho
            <br className="hidden sm:block" />{" "}
            <strong className="text-white font-bold inline-block">
              Ban Quản Trị Hệ Thống (Admin)
            </strong>{" "}
            của DUDI SOFTWARE.
          </p>

          {/* User Info Box */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-[13px] border-b border-slate-800/80 pb-2.5">
              <span className="text-slate-400">Tài khoản đang đăng nhập:</span>
              <span className="font-bold text-slate-100 truncate max-w-[240px]">
                {user.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-[13px] border-b border-slate-800/80 pb-2.5">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-slate-300 truncate max-w-[240px]">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-[13px]">
              <span className="text-slate-400">Cấp bậc tài khoản:</span>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25 font-bold text-[11px] uppercase tracking-wider">
                Khách hàng (User)
              </span>
            </div>
          </div>

          {/* Security Alert */}
          <div className="mt-4 p-4 rounded-2xl bg-red-950/40 border border-red-500/20 text-red-300 flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="flex-1 text-justify text-justify-inter-word text-xs sm:text-[12.5px] text-red-200/90 leading-relaxed m-0">
              <strong className="text-red-400 font-bold mr-1">Cảnh báo an ninh:</strong>
              Mọi nỗ lực truy cập trái phép đều được hệ thống ghi lại nhật ký IP và báo cáo tới quản trị viên.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Link
              href="/"
              className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Bán Hàng</span>
            </Link>

            <button
              type="button"
              onClick={handleSwitchAdminAccount}
              className="py-3 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Đổi Tài Khoản Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Kiểm tra phân quyền sub-route cụ thể cho Admin Role
  const requiredModule = getRouteModuleKey(pathname);
  const hasPermission = hasAdminModulePermission(user?.role, requiredModule);
  const roleInfo = getAdminRoleInfo(user?.role);

  if (!hasPermission) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldBan className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            Không đủ quyền hạn
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            Mục này không thuộc phạm vi phân quyền
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
            Tài khoản của bạn đang có vai trò{" "}
            <strong className="text-slate-800 font-bold">{roleInfo?.label}</strong>, không được phân quyền truy cập chức năng này.
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs mb-6 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Tài khoản:</span>
              <span className="font-bold text-slate-800">{user?.name} ({user?.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Quyền hạn:</span>
              <span className="font-bold text-amber-700">{roleInfo?.label}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/admin"
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Về Trang Tổng Quan</span>
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang trước</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Đúng quyền Admin & đúng phân quyền chức năng: Render hệ thống an toàn
  return <>{children}</>;
}
