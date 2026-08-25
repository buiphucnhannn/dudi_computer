"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  RefreshCw,
  X,
  AlertTriangle,
  Percent,
  Tag,
  Package,
  FolderTree,
  Globe,
  Upload,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/lib/useDebounce";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentPromo, setCurrentPromo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef(null);

  // Dữ liệu hỗ trợ chọn sản phẩm / danh mục
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  const [toast, setToast] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    type: "danger",
    onConfirm: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
    discountType: "percentage",
    discountValue: 10,
    applyScope: "products",
    appliedCategories: [],
    appliedProducts: [],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "2026-12-31",
    isActive: true,
    isFlashSale: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen && !saving) setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, saving]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- Fetch ---
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      let url = `/promotions/admin/all?search=${encodeURIComponent(searchTerm)}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;
      const res = await apiClient.get(url);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setPromotions(items);
      }
    } catch (error) {
      try {
        const publicRes = await apiClient.get("/promotions");
        const items = publicRes.data?.data?.items || (Array.isArray(publicRes.data?.data) ? publicRes.data.data : []);
        setPromotions(items);
      } catch (e) {
        console.error("Lỗi tải khuyến mãi:", e);
        showToast("Không thể tải danh sách khuyến mãi!", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/products?limit=500");
      const json = res.data;
      const items = json.data?.products || json.data?.items || (Array.isArray(json.data) ? json.data : []);
      setAllProducts(Array.isArray(items) ? items : []);
    } catch {
      setAllProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get("/categories");
      const json = res.data;
      const items = Array.isArray(json.data) ? json.data : json.data?.categories || [];
      setAllCategories(Array.isArray(items) ? items : []);
    } catch {
      setAllCategories([]);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
    fetchCategories();
  }, []);

  const debouncedSearch = useDebounce(searchTerm, 1500);

  useEffect(() => {
    fetchPromotions();
    setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // --- Filter & Pagination ---
  const filteredPromotions = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return promotions;
    return promotions.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
    );
  }, [promotions, debouncedSearch]);

  const totalPages = Math.ceil(filteredPromotions.length / pageSize) || 1;
  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPromotions.slice(start, start + pageSize);
  }, [filteredPromotions, currentPage, pageSize]);

  // --- Handlers ---
  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentPromo(null);
    setProductSearchTerm("");
    setFormData({
      name: "",
      description: "",
      banner: "",
      discountType: "percentage",
      discountValue: 10,
      applyScope: "products",
      appliedCategories: [],
      appliedProducts: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-12-31",
      isActive: true,
      isFlashSale: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setModalMode("edit");
    setCurrentPromo(promo);
    setProductSearchTerm("");
    setFormData({
      name: promo.name || "",
      description: promo.description || "",
      banner: promo.banner || "",
      discountType: promo.discountType || "percentage",
      discountValue: promo.discountValue || 0,
      applyScope: promo.applyScope || "products",
      appliedCategories: (promo.appliedCategories || []).map((c) => c._id || c),
      appliedProducts: (promo.appliedProducts || []).map((p) => p._id || p),
      startDate: promo.startDate ? new Date(promo.startDate).toISOString().split("T")[0] : "",
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().split("T")[0] : "",
      isActive: promo.isActive !== undefined ? promo.isActive : true,
      isFlashSale: promo.isFlashSale !== undefined ? promo.isFlashSale : false,
    });
    setIsModalOpen(true);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, banner: localPreviewUrl }));
    setUploadingBanner(true);
    try {
      const data = new FormData();
      data.append("image", file);
      data.append("folder", "dudi_software/promotions");
      const uploadRes = await apiClient.post("/upload/image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = uploadRes.data?.data?.url || uploadRes.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, banner: url }));
        showToast("Tải ảnh banner thành công!");
      }
    } catch {
      showToast("Không thể tải ảnh lên", "error");
    } finally {
      setUploadingBanner(false);
    }
  };

  const toggleProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      appliedProducts: prev.appliedProducts.includes(productId)
        ? prev.appliedProducts.filter((id) => id !== productId)
        : [...prev.appliedProducts, productId],
    }));
  };

  const toggleCategory = (catId) => {
    setFormData((prev) => ({
      ...prev,
      appliedCategories: prev.appliedCategories.includes(catId)
        ? prev.appliedCategories.filter((id) => id !== catId)
        : [...prev.appliedCategories, catId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên chương trình", "error");
      return;
    }
    if (uploadingBanner) {
      showToast("Ảnh đang tải, vui lòng chờ...", "warning");
      return;
    }
    if (formData.applyScope === "products" && formData.appliedProducts.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 sản phẩm để áp dụng!", "error");
      return;
    }
    if (formData.applyScope === "category" && formData.appliedCategories.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 danh mục để áp dụng!", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: generateSlug(formData.name),
        discountValue: Number(formData.discountValue),
      };
      const url =
        modalMode === "create"
          ? `/promotions`
          : `/promotions/${currentPromo._id}`;

      if (modalMode === "create") {
        await apiClient.post(url, payload);
      } else {
        await apiClient.put(url, payload);
      }

      showToast(
        modalMode === "create"
          ? "Tạo chương trình khuyến mãi thành công!"
          : "Cập nhật thành công!"
      );
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi lưu khuyến mãi", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await apiClient.patch(`/promotions/${id}/toggle`);
      showToast("Đã thay đổi trạng thái khuyến mãi!");
      fetchPromotions();
    } catch (error) {
      showToast(error.response?.data?.message || "Lỗi cập nhật trạng thái", "error");
    }
  };

  const handleDelete = (id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa chương trình khuyến mãi?",
      message: `Bạn có chắc muốn xóa "${name}"? Giá sản phẩm sẽ được khôi phục về giá gốc.`,
      confirmText: "Xóa khuyến mãi",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/promotions/${id}`);
          showToast("Đã xóa và khôi phục giá gốc sản phẩm thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchPromotions();
        } catch (error) {
          showToast(error.response?.data?.message || "Lỗi xóa khuyến mãi", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  const getScopeLabel = (promo) => {
    if (promo.applyScope === "all") return "Tất cả sản phẩm";
    if (promo.applyScope === "category")
      return `${promo.appliedCategories?.length || 0} danh mục`;
    return `${promo.appliedProducts?.length || 0} sản phẩm`;
  };

  const getStatusInfo = (promo) => {
    const now = new Date();
    const isExpired = promo.endDate && new Date(promo.endDate) < now;
    const isUpcoming = promo.startDate && new Date(promo.startDate) > now;
    if (!promo.isActive) return { label: "Tạm dừng", class: "bg-slate-100 text-slate-500 border-slate-200" };
    if (isExpired) return { label: "Đã hết hạn", class: "bg-red-50 text-red-600 border-red-200" };
    if (isUpcoming) return { label: "Sắp diễn ra", class: "bg-blue-50 text-blue-600 border-blue-200" };
    return { label: "Đang chạy", class: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: true };
  };

  // Lọc sản phẩm trong modal chọn
  const filteredProducts = Array.isArray(allProducts)
    ? allProducts.filter(
        (p) =>
          p.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
          p.shortName?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(productSearchTerm.toLowerCase())
      )
    : [];

  const startItem = filteredPromotions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredPromotions.length);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-70 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : toast.type === "warning"
              ? "bg-amber-600 text-white"
              : "bg-slate-900 text-white border border-slate-700"
          }`}
        >
          {toast.type === "error" || toast.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-amber-200" />
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
            Khuyến mãi sản phẩm
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
            Tạo chiến dịch giảm giá, Flash Sale và áp dụng trực tiếp lên các sản phẩm hiện có tại DUDI SOFTWARE.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              fetchPromotions();
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-[#eb1c24]" : ""}`}
            />
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo chiến dịch</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch khuyến mãi..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
          />
        </div>
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-red-500 transition shadow-2xs"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang chạy</option>
            <option value="expired">Đã hết hạn</option>
            <option value="inactive">Tạm dừng</option>
          </select>
        </div>
      </div>

      {/* Table Đồng Bộ Độ Rộng Chuẩn Như Danh Mục & Thương Hiệu */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap text-left">Tên Chiến Dịch</th>
                <th className="py-3.5 px-4 w-52 text-center whitespace-nowrap">Mức Giảm</th>
                <th className="py-3.5 px-4 w-52 text-center whitespace-nowrap">Phạm Vi Áp Dụng</th>
                <th className="py-3.5 px-4 min-w-[200px] text-center whitespace-nowrap">Thời Hạn</th>
                <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Trạng Thái</th>
                <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody key={debouncedSearch + statusFilter + currentPage} className="divide-y divide-slate-100 text-xs animate-smooth-fade">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                    Đang tải danh sách khuyến mãi...
                  </td>
                </tr>
              ) : paginatedPromotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy chương trình khuyến mãi nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedPromotions.map((promo, idx) => {
                  const statusInfo = getStatusInfo(promo);
                  const itemIndex = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr key={promo._id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                        {itemIndex}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-left">
                        <div className="flex items-center gap-3">
                          {promo.banner ? (
                            <img
                              src={promo.banner}
                              alt={promo.name}
                              className="w-10 h-7 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                              <Flame className="w-3.5 h-3.5 text-[#eb1c24]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span
                              className="font-bold text-slate-900 text-sm group-hover:text-[#eb1c24] transition inline-block max-w-[280px] truncate"
                              title={promo.name}
                            >
                              {promo.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-black text-[#eb1c24] text-xs sm:text-sm">
                          {promo.discountType === "percentage" ? (
                            `% Giảm ${promo.discountValue}%`
                          ) : (
                            `-${promo.discountValue?.toLocaleString("vi-VN")}đ`
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-bold text-xs text-slate-700">
                          {promo.applyScope === "all" ? (
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                          ) : promo.applyScope === "category" ? (
                            <FolderTree className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <Package className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{getScopeLabel(promo)}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-600 font-medium whitespace-nowrap text-xs">
                        {formatDate(promo.startDate)} — {formatDate(promo.endDate)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggle(promo._id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-semibold text-xs border transition cursor-pointer ${statusInfo.class}`}
                        >
                          {statusInfo.icon && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                          <span>{statusInfo.label}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(promo)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Chỉnh sửa chi tiết"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(promo._id, promo.name)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Thanh Phân Trang Đồng Bộ */}
        {filteredPromotions.length > 0 && (
          <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị <strong className="text-slate-800 font-bold">{startItem}-{endItem}</strong> trong tổng số{" "}
              <strong className="text-slate-800 font-bold">{filteredPromotions.length}</strong> chiến dịch
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

      {/* === MODAL TẠO/SỬA CHIẾN DỊCH KHUYẾN MÃI === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              if (!saving) setIsModalOpen(false);
            }}
            aria-hidden="true"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-[#eb1c24]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {modalMode === "create"
                      ? "Tạo Chiến Dịch Khuyến Mãi"
                      : "Chỉnh Sửa Chiến Dịch"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Thiết lập mức giảm giá và chọn sản phẩm áp dụng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Tên chiến dịch */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên chương trình khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Flash Sale Cuối Tuần, Back To School 2026, Giảm giá Mùa Hè..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-900 font-bold text-sm"
                />
              </div>

              {/* Giảm giá */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="percentage">Giảm theo % (Phần trăm)</option>
                    <option value="fixed">Giảm số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Giá trị giảm ({formData.discountType === "percentage" ? "%" : "VNĐ"}){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-black text-slate-900 focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Thời gian */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:border-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Ảnh banner chiến dịch (Tuỳ chọn)
                  </label>
                  {uploadingBanner && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#eb1c24] animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Đang tải...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="URL ảnh banner..."
                    value={formData.banner}
                    onChange={(e) =>
                      setFormData({ ...formData, banner: e.target.value })
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs focus:border-red-500 focus:outline-hidden"
                  />
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={uploadingBanner}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] text-white font-bold transition shrink-0 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải lên</span>
                  </button>
                </div>
                {formData.banner && (
                  <img
                    src={formData.banner}
                    alt="Preview"
                    className="mt-2 h-16 rounded-xl border border-slate-200 object-cover"
                  />
                )}
              </div>

              {/* Phạm vi áp dụng */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-700">
                  Phạm vi áp dụng <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { value: "products", label: "Chọn sản phẩm", icon: Package },
                    { value: "category", label: "Theo danh mục", icon: FolderTree },
                    { value: "all", label: "Tất cả sản phẩm", icon: Globe },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, applyScope: opt.value })
                      }
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        formData.applyScope === opt.value
                          ? "bg-red-50 text-[#eb1c24] border-red-300 shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Chọn nhiều sản phẩm */}
                {formData.applyScope === "products" && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:border-red-500 focus:outline-hidden"
                        />
                      </div>
                      <span className="ml-3 text-[11px] font-bold text-[#eb1c24] shrink-0">
                        Đã chọn: {formData.appliedProducts.length} SP
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {filteredProducts.slice(0, 50).map((p) => {
                        const isSelected = formData.appliedProducts.includes(p._id);
                        return (
                          <label
                            key={p._id}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition ${
                              isSelected ? "bg-red-50/60" : "hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProduct(p._id)}
                              className="w-3.5 h-3.5 accent-red-600 rounded shrink-0 cursor-pointer"
                            />
                            <img
                              src={p.thumbnail || p.images?.[0] || ""}
                              alt=""
                              className="w-8 h-8 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-800 text-[11px] line-clamp-1">
                                {p.shortName || p.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {p.price?.toLocaleString("vi-VN")}đ
                                {p.sku ? ` • ${p.sku}` : ""}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                      {filteredProducts.length === 0 && (
                        <div className="py-6 text-center text-slate-400 text-xs">
                          Không tìm thấy sản phẩm nào
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chọn nhiều danh mục */}
                {formData.applyScope === "category" && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600">
                        Chọn danh mục áp dụng (Đã chọn:{" "}
                        <span className="text-[#eb1c24]">
                          {formData.appliedCategories.length}
                        </span>
                        )
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {allCategories.map((cat) => {
                        const isSelected = formData.appliedCategories.includes(cat._id);
                        return (
                          <label
                            key={cat._id}
                            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition ${
                              isSelected ? "bg-red-50/60" : "hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCategory(cat._id)}
                              className="w-3.5 h-3.5 accent-red-600 rounded shrink-0 cursor-pointer"
                            />
                            <span className="font-bold text-slate-800 text-xs">
                              {cat.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {formData.applyScope === "all" && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Chiến dịch sẽ áp dụng giảm giá cho{" "}
                      <strong>TẤT CẢ</strong> sản phẩm trong hệ thống (
                      {allProducts.length} sản phẩm)
                    </span>
                  </div>
                )}
              </div>

              {/* Mô tả */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả chương trình
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ngắn gọn về chiến dịch khuyến mãi..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-700"
                />
              </div>

              {/* Active + Actions */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActivePromo"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="isActivePromo"
                  className="font-bold text-slate-800 cursor-pointer"
                >
                  Kích hoạt ngay khi tạo
                </label>
              </div>

              {/* Flash Sale checkbox - Hiển thị trên trang chủ */}
              <div className="flex items-center gap-2 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <input
                  type="checkbox"
                  id="isFlashSalePromo"
                  checked={formData.isFlashSale}
                  onChange={(e) =>
                    setFormData({ ...formData, isFlashSale: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="isFlashSalePromo"
                  className="font-bold text-amber-900 cursor-pointer flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span>Đánh dấu là Flash Sale (hiển thị trên trang chủ)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingBanner}
                  className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : modalMode === "create" ? (
                    "Tạo Chiến Dịch"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
