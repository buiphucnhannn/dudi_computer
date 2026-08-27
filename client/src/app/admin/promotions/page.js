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
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useDebounce } from "@/lib/useDebounce";
import { useToast } from "@/components/common/ToastContext";
import { handleImageError, DEFAULT_FALLBACK_IMAGE } from "@/lib/imageFallback";

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

  // Dữ liệu hỗ trợ chọn sản phẩm / danh mục
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const { showToast } = useToast();

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

  // Phân cấp cây danh mục (Root & Children)
  const categoryTree = useMemo(() => {
    const roots = allCategories
      .filter((c) => !c.parent)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return roots.map((root) => {
      const children = allCategories
        .filter((c) => {
          const parentId = c.parent?._id || c.parent;
          return parentId && parentId.toString() === root._id.toString();
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return { root, children };
    });
  }, [allCategories]);

  const toggleProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      appliedProducts: prev.appliedProducts.includes(productId)
        ? prev.appliedProducts.filter((id) => id !== productId)
        : [...prev.appliedProducts, productId],
    }));
  };

  // Chọn / Bỏ chọn danh mục gốc -> Tự động cascade áp dụng toàn bộ danh mục con
  const toggleRootCategory = (rootCat, children) => {
    const rootId = rootCat._id;
    const childIds = children.map((c) => c._id);
    const allGroupIds = [rootId, ...childIds];

    // Chỉ tính là đã chọn khi tất cả danh mục con đều được tick
    const isAllChecked =
      children.length === 0
        ? formData.appliedCategories.includes(rootId)
        : childIds.length > 0 && childIds.every((id) => formData.appliedCategories.includes(id));

    if (isAllChecked) {
      // Đang chọn hết toàn bộ -> Bỏ chọn cả nhóm
      setFormData((prev) => ({
        ...prev,
        appliedCategories: prev.appliedCategories.filter(
          (id) => !allGroupIds.includes(id)
        ),
      }));
    } else {
      // Chưa chọn hết -> Chọn tất cả danh mục trong nhóm (cha + toàn bộ con)
      setFormData((prev) => ({
        ...prev,
        appliedCategories: Array.from(
          new Set([...prev.appliedCategories, ...allGroupIds])
        ),
      }));
    }
  };

  // Chọn / Bỏ chọn riêng danh mục con
  const toggleChildCategory = (childId, rootCat, siblingChildren) => {
    const isCurrentlySelected = formData.appliedCategories.includes(childId);
    let newSelected = isCurrentlySelected
      ? formData.appliedCategories.filter((id) => id !== childId)
      : [...formData.appliedCategories, childId];

    // Chỉ khi tất cả con trong nhóm đều được chọn thì mới tick danh mục cha
    const allSiblingIds = siblingChildren.map((c) => c._id);
    const areAllChildrenSelected =
      allSiblingIds.length > 0 &&
      allSiblingIds.every((id) => newSelected.includes(id));

    if (areAllChildrenSelected) {
      newSelected = Array.from(new Set([...newSelected, rootCat._id]));
    } else {
      newSelected = newSelected.filter((id) => id !== rootCat._id);
    }

    setFormData((prev) => ({
      ...prev,
      appliedCategories: newSelected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Vui lòng nhập tên chương trình khuyến mãi", "error");
      return;
    }
    if (!formData.startDate) {
      showToast("Vui lòng chọn ngày bắt đầu khuyến mãi", "error");
      return;
    }
    if (!formData.endDate) {
      showToast("Vui lòng chọn ngày kết thúc khuyến mãi", "error");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showToast("Ngày kết thúc phải diễn ra sau hoặc cùng ngày với ngày bắt đầu!", "error");
      return;
    }
    if (formData.isActive) {
      const endOfDay = new Date(formData.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (endOfDay < new Date()) {
        showToast(
          "Không thể kích hoạt chương trình có ngày kết thúc trong quá khứ! Vui lòng chọn ngày kết thúc từ hôm nay trở đi.",
          "error"
        );
        return;
      }
    }
    if (formData.applyScope === "products" && formData.appliedProducts.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 sản phẩm để áp dụng!", "error");
      return;
    }
    if (formData.applyScope === "category" && formData.appliedCategories.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 danh mục để áp dụng!", "error");
      return;
    }

    // Kiểm tra ràng buộc: Chỉ duy nhất 1 chiến dịch Flash Sale hoạt động tại một thời điểm
    if (formData.isFlashSale && formData.isActive) {
      const otherActiveFlash = promotions.find(
        (p) =>
          p.isFlashSale &&
          p.isActive &&
          (modalMode === "create" || (currentPromo && p._id !== currentPromo._id))
      );
      if (otherActiveFlash) {
        showToast(
          `Hệ thống chỉ cho phép duy nhất một chiến dịch Flash Sale hoạt động tại một thời điểm. Chiến dịch "${otherActiveFlash.name}" hiện đang là Flash Sale. Vui lòng tắt chiến dịch đó trước khi kích hoạt Flash Sale cho chiến dịch này!`,
          "error"
        );
        return;
      }
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
                        <span
                          className="font-bold text-slate-900 text-sm group-hover:text-[#eb1c24] transition inline-block max-w-[340px] truncate"
                          title={promo.name}
                        >
                          {promo.name}
                        </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ngày bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    max={formData.endDate || undefined}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        startDate: newStart,
                        endDate: prev.endDate && prev.endDate < newStart ? newStart : prev.endDate,
                      }));
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-red-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Thời điểm chiến dịch bắt đầu có hiệu lực</p>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ngày kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-red-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Ngày kết thúc phải từ {formData.startDate || "hôm nay"} trở đi
                  </p>
                </div>
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
                              src={p.thumbnail || p.images?.[0] || DEFAULT_FALLBACK_IMAGE}
                              alt=""
                              className="w-8 h-8 object-cover rounded-lg border border-slate-200 shrink-0"
                              onError={handleImageError}
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

                {/* Chọn nhiều danh mục theo phân cấp cha - con */}
                {formData.applyScope === "category" && (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <FolderTree className="w-3.5 h-3.5 text-red-500" />
                        <span>
                          Chọn danh mục áp dụng (Đã chọn:{" "}
                          <span className="text-[#eb1c24] font-black">
                            {formData.appliedCategories.length}
                          </span>
                          )
                        </span>
                      </span>
                      {formData.appliedCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, appliedCategories: [] }))
                          }
                          className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition cursor-pointer"
                        >
                          Bỏ chọn tất cả
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5">
                      {categoryTree.map(({ root, children }) => {
                        const rootId = root._id;
                        const childIds = children.map((c) => c._id);
                        const selectedChildrenCount = childIds.filter((id) =>
                          formData.appliedCategories.includes(id)
                        ).length;

                        // Chỉ tick danh mục cha khi CHỌN HẾT tất cả danh mục con (hoặc gốc không có con)
                        const isRootChecked =
                          children.length === 0
                            ? formData.appliedCategories.includes(rootId)
                            : childIds.length > 0 && selectedChildrenCount === childIds.length;

                        const hasAnyChildSelected = selectedChildrenCount > 0;

                        return (
                          <div
                            key={root._id}
                            className={`rounded-xl border transition overflow-hidden ${
                              isRootChecked
                                ? "border-red-200 bg-red-50/25"
                                : hasAnyChildSelected
                                ? "border-slate-200 bg-slate-50/30"
                                : "border-slate-100 bg-white"
                            }`}
                          >
                            {/* Dòng Danh mục Gốc (Cha) */}
                            <div
                              onClick={() => toggleRootCategory(root, children)}
                              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition select-none ${
                                isRootChecked
                                  ? "bg-red-50/70 text-slate-900"
                                  : "hover:bg-slate-50 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isRootChecked}
                                  onChange={() => {}} // Đã xử lý tại div cha
                                  className="w-4 h-4 accent-red-600 rounded shrink-0 cursor-pointer"
                                />
                                <span className="font-bold text-xs">
                                  {root.name}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isRootChecked
                                    ? "bg-red-100 text-[#eb1c24] font-black"
                                    : hasAnyChildSelected
                                    ? "bg-slate-100 text-slate-700 font-semibold"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                              >
                                {children.length > 0
                                  ? `${selectedChildrenCount}/${children.length} mục con`
                                  : "Danh mục gốc"}
                              </span>
                            </div>

                            {/* Danh sách các Danh mục Con (Cấp 2) */}
                            {children.length > 0 && (
                              <div className="pl-6 pr-3 py-1.5 bg-slate-50/50 border-t border-slate-100/80 space-y-0.5">
                                {children.map((child) => {
                                  const isChildSelected = formData.appliedCategories.includes(child._id);
                                  return (
                                    <label
                                      key={child._id}
                                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer transition select-none ${
                                        isChildSelected
                                          ? "bg-red-100/50 text-[#eb1c24] font-bold"
                                          : "hover:bg-slate-100 text-slate-600 text-xs font-medium"
                                      }`}
                                    >
                                      <span className="text-slate-300 font-mono text-xs">└─</span>
                                      <input
                                        type="checkbox"
                                        checked={isChildSelected}
                                        onChange={() => toggleChildCategory(child._id, root, children)}
                                        className="w-3.5 h-3.5 accent-red-600 rounded shrink-0 cursor-pointer"
                                      />
                                      <span className="text-xs">
                                        {child.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {categoryTree.length === 0 && (
                        <div className="py-6 text-center text-slate-400 text-xs">
                          Không tìm thấy danh mục nào
                        </div>
                      )}
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
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      const otherActive = promotions.find(
                        (p) =>
                          p.isFlashSale &&
                          p.isActive &&
                          (modalMode === "create" || (currentPromo && p._id !== currentPromo._id))
                      );
                      if (otherActive) {
                        showToast(
                          `Lưu ý: Chiến dịch "${otherActive.name}" hiện đang là Flash Sale duy nhất hoạt động. Bạn cần tắt chiến dịch đó trước khi kích hoạt chiến dịch này!`,
                          "warning"
                        );
                      }
                    }
                    setFormData({ ...formData, isFlashSale: checked });
                  }}
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
                  disabled={saving}
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
