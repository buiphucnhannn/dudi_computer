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
} from "lucide-react";
import { initAuthFromStorage, logoutUser } from "@/redux/slices/authSlice";

export default function AdminRouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initAuthFromStorage());
    setMounted(true);
  }, [dispatch]);

  const handleSwitchAdminAccount = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  // 1. Trong quá trình khởi tạo (SSR -> Hydration): Hiển thị trạng thái kiểm tra an toàn
  if (!mounted) {
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
              Đang xác thực chứng chỉ quản trị viên...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Chưa đăng nhập: Chuyển hướng về trang đăng nhập
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
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-red-500 selection:text-white">
        <div className="max-w-lg w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-red-950/50 backdrop-blur-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Warning Icon */}
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/40 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-black uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>403 - Forbidden Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            QUYỀN TRUY CẬP BỊ TỪ CHỐI
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto">
            Khu vực này được bảo vệ nghiêm ngặt và chỉ dành riêng cho
            <br className="hidden sm:block" />{" "}
            <strong className="text-slate-200 font-bold inline-block">
              Ban Quản Trị Hệ Thống (Admin)
            </strong>{" "}
            của DUDI SOFTWARE.
          </p>

          {/* User Info Box */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Tài khoản đang đăng nhập:</span>
              <span className="font-bold text-slate-200 truncate max-w-[200px]">
                {user.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="text-slate-400">Email:</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cấp bậc tài khoản:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-[10px] uppercase">
                Khách hàng (User)
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-[11px] text-left leading-relaxed">
            🛡️ <strong>Cảnh báo an ninh:</strong> Mọi nỗ lực truy cập trái phép đều được hệ thống ghi lại nhật ký IP và báo cáo tới quản trị viên.
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về Trang Bán Hàng</span>
            </Link>

            <button
              type="button"
              onClick={handleSwitchAdminAccount}
              className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Đổi Tài Khoản Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Đúng quyền Admin: Render toàn bộ hệ thống Admin an toàn
  return <>{children}</>;
}
