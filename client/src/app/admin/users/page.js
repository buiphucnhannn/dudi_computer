"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  Eye,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCog,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/lib/useDebounce";
import { selectCurrentUser, getAdminRoleInfo } from "@/redux/slices/authSlice";

export default function AdminUsersPage() {
  const currentUser = useSelector(selectCurrentUser);
  const isSuperAdmin = currentUser?.role === "admin" || currentUser?.role === "admin_super";

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    googleCount: 0,
    localCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authTypeFilter, setAuthTypeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    type: "warning",
    onConfirm: null,
    loading: false,
  });

  // Hỗ trợ đóng Modal khi nhấn phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDetailModalOpen) {
        setIsDetailModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailModalOpen]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const debouncedSearch = useDebounce(searchTerm, 1500);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let url = `/users?search=${encodeURIComponent(debouncedSearch)}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      if (authTypeFilter !== "all") url += `&authType=${authTypeFilter}`;
      if (roleFilter !== "all") url += `&role=${roleFilter}`;

      const res = await apiClient.get(url);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setCustomers(items);
      }

      // Lấy thống kê
      const statRes = await apiClient.get("/users/stats");
      const statJson = statRes.data;
      if (statJson.statusCode === 200 || statJson.success) {
        setStats(statJson.data || {});
      }
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
      showToast("Không thể tải danh sách tài khoản!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, authTypeFilter, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  // Cập nhật vai trò / phân quyền người dùng (Dành cho Super Admin)
  const handleRoleChange = async (userId, targetRole, userName) => {
    if (!isSuperAdmin) {
      showToast("Chỉ Admin Toàn Quyền mới có quyền thay đổi vai trò tài khoản", "error");
      return;
    }

    try {
      await apiClient.patch(`/users/${userId}/role`, { role: targetRole });
      const targetRoleInfo = getAdminRoleInfo(targetRole);
      showToast(`Đã phân quyền tài khoản "${userName}" thành "${targetRoleInfo.label}" thành công!`);
      fetchCustomers();
    } catch (error) {
      showToast(error.response?.data?.message || "Lỗi khi phân quyền tài khoản", "error");
    }
  };

  // Phân trang
  const totalPages = Math.ceil(customers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customers.slice(start, start + pageSize);
  }, [customers, currentPage, pageSize]);

  // Mở Custom Modal xác nhận Khóa / Mở khóa
  const handleToggleStatus = (id, currentStatus, name) => {
    const nextStatus = currentStatus === "banned" ? "active" : "banned";
    const actionText = nextStatus === "banned" ? "khóa" : "mở khóa";

    setConfirmState({
      isOpen: true,
      title: nextStatus === "banned" ? "Khóa tài khoản khách hàng?" : "Mở khóa tài khoản khách hàng?",
      message:
        nextStatus === "banned"
          ? `Bạn có chắc chắn muốn khóa tài khoản "${name}"? Khách hàng sẽ không thể đăng nhập hoặc tiến hành đặt hàng trên website.`
          : `Bạn có chắc chắn muốn mở khóa tài khoản "${name}"? Khách hàng sẽ có thể đăng nhập và mua hàng bình thường.`,
      confirmText: nextStatus === "banned" ? "Khóa tài khoản" : "Mở khóa",
      type: nextStatus === "banned" ? "warning" : "success",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.patch(`/users/${id}/status`, { status: nextStatus });
          showToast(`Đã ${actionText} tài khoản khách hàng thành công!`);
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchCustomers();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi cập nhật trạng thái", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const handleOpenDetail = async (id) => {
    try {
      const res = await apiClient.get(`/users/${id}`);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        setSelectedCustomer(json.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      showToast("Không thể lấy chi tiết khách hàng", "error");
    }
  };

  // Mở Custom Modal xác nhận xóa khách hàng
  const handleDeleteCustomer = (id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa vĩnh viễn khách hàng?",
      message: `Hành động này không thể hoàn tác. Toàn bộ hồ sơ và dữ liệu giỏ hàng của "${name}" sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu.`,
      confirmText: "Xóa khách hàng",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/users/${id}`);
          showToast("Đã xóa tài khoản khách hàng!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchCustomers();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi xóa khách hàng", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-70 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-slate-900 text-white border border-slate-700"
          }`}
        >
          {toast.type === "error" ? (
            <XCircle className="w-5 h-5 text-white" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
            Quản lý khách hàng
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
            Theo dõi danh sách người dùng, kiểm soát trạng thái hoạt động và lịch sử mua sắm của khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchCustomers}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#eb1c24]" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tổng Khách Hàng
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-[#eb1c24]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.total || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Toàn bộ hồ sơ trên hệ thống</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đang Hoạt Động
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {stats.active || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đủ điều kiện mua sắm</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bị Khóa / Hạn Chế
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">
            {stats.banned || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tài khoản vi phạm chính sách</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Đăng Nhập Google
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {stats.googleCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Tài khoản liên kết Google OAuth</div>
        </div>
      </div>

      {/* Filters & Search Form */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, email hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-red-500 transition shadow-2xs font-semibold cursor-pointer"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">Khách hàng (User)</option>
            <option value="admin_sales">Admin Thương Mại & Bán Hàng</option>
            <option value="admin_content">Admin Nội Dung & Tuyển Dụng</option>
            <option value="admin_customer">Admin Quản Lý Khách Hàng</option>
          </select>
        </div>

        <div className="sm:col-span-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-red-500 transition shadow-2xs font-semibold cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động (Active)</option>
            <option value="banned">Đang bị khóa (Banned)</option>
          </select>
        </div>

        <div className="sm:col-span-2.5">
          <select
            value={authTypeFilter}
            onChange={(e) => setAuthTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-red-500 transition shadow-2xs font-semibold cursor-pointer"
          >
            <option value="all">Tất cả hình thức</option>
            <option value="google">Google OAuth</option>
            <option value="local">Email / Pass</option>
          </select>
        </div>
      </form>

      {/* Customer List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center whitespace-nowrap">STT</th>
                <th className="py-3.5 px-4 min-w-[220px] whitespace-nowrap text-left">Tài Khoản & Người Dùng</th>
                <th className="py-3.5 px-4 min-w-[200px] text-center whitespace-nowrap">Liên Hệ</th>
                <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Vai Trò / Phân Quyền</th>
                <th className="py-3.5 px-4 w-32 text-center whitespace-nowrap">Hình Thức</th>
                <th className="py-3.5 px-4 w-32 text-center whitespace-nowrap">Trạng Thái</th>
                <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody key={debouncedSearch + statusFilter + authTypeFilter + roleFilter + currentPage} className="divide-y divide-slate-100 text-xs animate-smooth-fade">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                    Đang tải danh sách tài khoản...
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c, idx) => {
                  const roleObj = getAdminRoleInfo(c.role);
                  return (
                    <tr key={c._id} className="hover:bg-slate-50/70 transition group">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 text-left whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-xs shrink-0 bg-red-50 text-[#eb1c24] border border-red-100">
                            {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 group-hover:text-[#eb1c24] transition truncate max-w-[180px] flex items-center gap-1.5">
                              <span>{c.name}</span>
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-mono">
                              ID: {c._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <div className="flex items-center gap-1 text-slate-700 font-medium truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.phone || "Chưa cập nhật"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role column / Dropdown for Super Admin */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isSuperAdmin ? (
                          <select
                            value={c.role || "user"}
                            onChange={(e) => handleRoleChange(c._id, e.target.value, c.name)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                              c.role === "admin_sales"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : c.role === "admin_content"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : c.role === "admin_customer"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            <option value="user">Khách hàng (User)</option>
                            <option value="admin_sales">Admin Bán Hàng</option>
                            <option value="admin_content">Admin Nội Dung</option>
                            <option value="admin_customer">Admin Khách Hàng</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg border font-bold text-[10.5px] ${roleObj.badgeBg}`}
                          >
                            {roleObj.label}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {c.authType === "google" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10.5px]">
                            Google OAuth
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10.5px]">
                            Email / Pass
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {c.status === "banned" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 border border-red-200 font-bold text-[10.5px]">
                            <Ban className="w-3 h-3" />
                            Đã bị khóa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-[10.5px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Hoạt động
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(c._id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Xem chi tiết & đơn hàng"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(c._id, c.status, c.name)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              c.status === "banned"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                            }`}
                            title={c.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                          >
                            {c.status === "banned" ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>

                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteCustomer(c._id, c.name)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                              title="Xóa vĩnh viễn khách hàng"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh Phân Trang */}
        {customers.length > 0 && (
          <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị{" "}
              <strong className="text-slate-800 font-bold">
                {customers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, customers.length)}
              </strong>{" "}
              trong tổng số{" "}
              <strong className="text-slate-800 font-bold">{customers.length}</strong> khách hàng
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Trang trước"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                    page === currentPage
                      ? "bg-[#eb1c24] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                title="Trang sau"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Khách Hàng (Hỗ trợ Click Outside & Phím ESC) */}
      {isDetailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Layer riêng biệt - Bấm bất kỳ đâu ra ngoài để đóng ngay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setIsDetailModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Card Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#eb1c24] text-white flex items-center justify-center font-black text-lg shadow-md shadow-red-600/20">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium block">Số điện thoại:</span>
                  <span className="font-bold text-slate-800">{selectedCustomer.phone || "Chưa có"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Vai trò tài khoản:</span>
                  <span className="font-bold text-slate-800">{getAdminRoleInfo(selectedCustomer.role).label}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Hình thức đăng ký:</span>
                  <span className="font-bold text-slate-800 uppercase">{selectedCustomer.authType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Trạng thái:</span>
                  <span className={`font-bold ${selectedCustomer.status === "banned" ? "text-red-600" : "text-emerald-600"}`}>
                    {selectedCustomer.status === "banned" ? "Bị khóa" : "Hoạt động"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium block">Địa chỉ giao hàng:</span>
                  <span className="font-medium text-slate-800">{selectedCustomer.address || "Chưa cập nhật địa chỉ"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4 text-[#eb1c24]" />
                  <span>Đơn hàng gần đây ({selectedCustomer.recentOrders?.length || 0})</span>
                </h4>

                {selectedCustomer.recentOrders?.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCustomer.recentOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-slate-900">Mã đơn: #{ord._id.slice(-6)}</div>
                          <div className="text-[11px] text-slate-400">
                            {formatDate(ord.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#eb1c24]">
                            {ord.totalAmount?.toLocaleString("vi-VN")}đ
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-slate-400">
                    Khách hàng chưa có đơn hàng nào trên hệ thống.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] text-white font-bold text-xs shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
        loading={confirmState.loading}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
}
