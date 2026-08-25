"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Eye,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { contactAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/lib/useDebounce";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("pending");
  const [modalNote, setModalNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
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

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        contactAPI.getAll({
          search: debouncedSearch,
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: 1,
          limit: 200,
        }),
        contactAPI.getStats(),
      ]);

      if (listRes.data?.statusCode === 200 || listRes.data?.success) {
        const items = listRes.data?.data?.items || listRes.data?.data || [];
        setContacts(items);
      }

      if (statsRes.data?.statusCode === 200 || statsRes.data?.success) {
        setStats(statsRes.data?.data || {});
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách liên hệ & góp ý:", err);
      showToast("Không thể tải danh sách liên hệ & góp ý.", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // Client-side pagination
  const totalPages = Math.ceil(contacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return contacts.slice(start, start + pageSize);
  }, [contacts, currentPage]);

  const handleOpenDetail = (contact) => {
    setSelectedContact(contact);
    setModalStatus(contact.status || "pending");
    setModalNote(contact.note || "");
    setIsDetailModalOpen(true);
  };

  const handleSaveDetail = async () => {
    if (!selectedContact) return;
    setUpdatingStatus(true);
    try {
      const res = await contactAPI.updateStatus(selectedContact._id, {
        status: modalStatus,
        note: modalNote,
      });

      if (res.data?.statusCode === 200 || res.data?.success) {
        const updated = res.data?.data;
        setContacts((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setSelectedContact(updated);
        showToast("Đã cập nhật trạng thái & ghi chú thành công!");
        setIsDetailModalOpen(false);

        // Refresh stats
        const statsRes = await contactAPI.getStats();
        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      showToast(
        err.response?.data?.message || "Không thể cập nhật liên hệ.",
        "error"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = (contact) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa thông tin liên hệ / góp ý",
      message: `Bạn có chắc chắn muốn xóa phản hồi từ khách hàng "${contact.fullName}" (${contact.phone})? Thao tác này không thể hoàn tác.`,
      confirmText: "Xóa ngay",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await contactAPI.delete(contact._id);
          setContacts((prev) => prev.filter((c) => c._id !== contact._id));
          showToast(`Đã xóa phản hồi của ${contact.fullName} thành công.`);
          setConfirmState((prev) => ({ ...prev, isOpen: false }));

          // Refresh stats
          const statsRes = await contactAPI.getStats();
          if (statsRes.data?.data) {
            setStats(statsRes.data.data);
          }
        } catch (err) {
          console.error("Lỗi xóa liên hệ:", err);
          showToast("Không thể xóa thông tin liên hệ.", "error");
        } finally {
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold backdrop-blur-md ${
              toast.type === "error"
                ? "bg-red-500/90 text-white border-red-400"
                : "bg-emerald-600/90 text-white border-emerald-500"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
            Quản lý liên hệ & góp ý
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
            Xem và xử lý các yêu cầu tư vấn, báo giá và đóng góp ý kiến từ khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer disabled:opacity-50"
            title="Làm mới toàn bộ dữ liệu"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-[#eb1c24]" : ""}`}
            />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (4 cards: Total, Pending, Contacted, Resolved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div
          onClick={() => setStatusFilter("all")}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center justify-between ${
            statusFilter === "all"
              ? "border-[#eb1c24] ring-2 ring-[#eb1c24]/15 bg-red-50/10"
              : "border-slate-100 hover:border-slate-200"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng liên hệ & góp ý</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total || 0}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Tất cả tương tác</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100">
            <MessageSquare className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        {/* Card 2: Pending (Chờ xử lý) */}
        <div
          onClick={() => setStatusFilter("pending")}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center justify-between ${
            statusFilter === "pending"
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
              : "border-amber-100/80 hover:border-amber-200"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-amber-700">Chờ xử lý (Mới)</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending || 0}</p>
            <p className="text-[11px] text-amber-600/70 mt-0.5">Cần liên hệ phản hồi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/50">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Contacted (Đang liên hệ) */}
        <div
          onClick={() => setStatusFilter("contacted")}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center justify-between ${
            statusFilter === "contacted"
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
              : "border-blue-100/80 hover:border-blue-200"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-blue-700">Đang liên hệ</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{stats.contacted || 0}</p>
            <p className="text-[11px] text-blue-600/70 mt-0.5">Đang trao đổi, tư vấn</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/50">
            <Phone className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Resolved (Đã giải quyết) */}
        <div
          onClick={() => setStatusFilter("resolved")}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-sm flex items-center justify-between ${
            statusFilter === "resolved"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
              : "border-emerald-100/80 hover:border-emerald-200"
          }`}
        >
          <div>
            <p className="text-xs font-semibold text-emerald-700">Đã giải quyết</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.resolved || 0}</p>
            <p className="text-[11px] text-emerald-600/70 mt-0.5">Hoàn tất xử lý phản hồi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/50">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, SĐT, email, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#eb1c24] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-red-500/15 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#eb1c24] focus:ring-2 focus:ring-red-500/15 cursor-pointer"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý (Mới)</option>
          <option value="contacted">Đang liên hệ</option>
          <option value="resolved">Đã giải quyết</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Người gửi</th>
                <th className="py-3.5 px-4">Nội dung tin nhắn / góp ý</th>
                <th className="py-3.5 px-3">Thời gian</th>
                <th className="py-3.5 px-3">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody
              key={`${debouncedSearch}-${statusFilter}-${currentPage}`}
              className="divide-y divide-slate-100 text-xs text-slate-700 animate-smooth-fade"
            >
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-2 border-[#eb1c24] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium text-slate-500">
                        Đang tải danh sách liên hệ & góp ý...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="w-10 h-10 text-slate-300" />
                      <span className="text-sm font-bold text-slate-700">
                        Không tìm thấy thông tin liên hệ nào
                      </span>
                      <span className="text-xs text-slate-400 max-w-sm">
                        Chưa có khách hàng nào gửi góp ý hoặc yêu cầu phù hợp với bộ lọc hiện tại.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((contact) => {
                  const isPending = contact.status === "pending" || !contact.status;
                  const isContacted = contact.status === "contacted";
                  const isResolved = contact.status === "resolved";

                  return (
                    <tr
                      key={contact._id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(contact)}
                    >
                      {/* Column 1: Người gửi */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200/60">
                            {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : "K"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{contact.fullName}</span>
                              {isPending && (
                                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                              )}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <a
                                href={`tel:${contact.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-[#eb1c24] font-semibold flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{contact.phone}</span>
                              </a>
                              {contact.email && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="truncate max-w-[150px] text-slate-400" title={contact.email}>
                                    {contact.email}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Nội dung */}
                      <td className="py-3.5 px-4 max-w-sm md:max-w-lg">
                        <p className="text-slate-800 line-clamp-2 leading-relaxed text-xs">
                          {contact.message}
                        </p>
                        {contact.note && (
                          <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1 font-medium border border-amber-200/40">
                            Ghi chú: {contact.note}
                          </p>
                        )}
                      </td>

                      {/* Column 3: Thời gian */}
                      <td className="py-3.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(contact.createdAt || new Date())}</span>
                        </div>
                      </td>

                      {/* Column 4: Trạng thái */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Chờ xử lý</span>
                          </span>
                        )}
                        {isContacted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 text-[11px] font-bold">
                            <Phone className="w-3 h-3" />
                            <span>Đang liên hệ</span>
                          </span>
                        )}
                        {isResolved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã giải quyết</span>
                          </span>
                        )}
                      </td>

                      {/* Column 5: Thao tác */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(contact);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Xóa phản hồi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {contacts.length > pageSize && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Hiển thị{" "}
              <span className="font-bold text-slate-800">
                {Math.min((currentPage - 1) * pageSize + 1, contacts.length)}
              </span>{" "}
              -{" "}
              <span className="font-bold text-slate-800">
                {Math.min(currentPage * pageSize, contacts.length)}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-bold text-slate-800">{contacts.length}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Xem Chi Tiết & Xử Lý Liên Hệ / Góp Ý */}
      {isDetailModalOpen && selectedContact && (
        <div
          onClick={() => setIsDetailModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 sm:p-7 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto space-y-6"
          >
            {/* Close button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pr-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20 shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Chi tiết Liên hệ & Góp ý
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gửi lúc: {formatDate(selectedContact.createdAt)}
                </p>
              </div>
            </div>

            {/* Sender Info Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Họ và tên khách hàng
                </span>
                <span className="text-sm font-bold text-slate-900 block">
                  {selectedContact.fullName}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Số điện thoại liên hệ
                </span>
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="text-sm font-bold text-[#eb1c24] hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedContact.phone}</span>
                </a>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Địa chỉ Email
                </span>
                {selectedContact.email ? (
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-xs font-semibold text-slate-800 hover:text-[#eb1c24] flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedContact.email}</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Không cung cấp địa chỉ Email
                  </span>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Nội dung tin nhắn / đóng góp ý kiến
              </span>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>

            {/* Admin Action & Status Update */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Trạng thái xử lý
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalStatus("pending")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalStatus === "pending"
                        ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Chờ xử lý</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalStatus("contacted")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalStatus === "contacted"
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Đang liên hệ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalStatus("resolved")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalStatus === "resolved"
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã giải quyết</span>
                  </button>
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ghi chú nội bộ của Quản trị viên
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập ghi chú phản hồi, nội dung đã tư vấn hoặc kết quả xử lý..."
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#eb1c24] rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-red-500/15 transition resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleDelete(selectedContact);
                }}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              >
                Xóa phản hồi này
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetail}
                  disabled={updatingStatus}
                  className="px-5 py-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] text-white text-xs font-bold shadow-md shadow-red-600/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updatingStatus ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        type={confirmState.type}
        loading={confirmState.loading}
      />
    </div>
  );
}
