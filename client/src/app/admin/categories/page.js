"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Cpu,
  RefreshCw,
  X,
  AlertTriangle,
  Laptop,
  Monitor,
  HardDrive,
  Keyboard,
  Mouse,
  Fan,
  Box,
  Zap,
  CornerDownRight,
  Globe,
  ExternalLink,
  Package,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { apiClient } from "@/lib/api";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Map icon sinh động theo slug hoặc pcPartType
const getCategoryIcon = (cat) => {
  const slug = cat.slug || "";
  const part = cat.pcPartType || "none";

  if (slug.includes("laptop") || slug.includes("macbook")) return Laptop;
  if (slug.includes("pc") && !slug.includes("linh-kien")) return Monitor;
  if (part === "cpu") return Cpu;
  if (part === "vga") return Zap;
  if (part === "ssd" || part === "hdd") return HardDrive;
  if (part === "cooler") return Fan;
  if (part === "case") return Box;
  if (part === "monitor") return Monitor;
  if (slug.includes("ban-phim")) return Keyboard;
  if (slug.includes("chuot")) return Mouse;
  return FolderTree;
};

// Danh sách các loại linh kiện Build PC
const PC_PARTS = [
  { value: "none", label: "Không (Sản phẩm nguyên chiếc / Phụ kiện)" },
  { value: "cpu", label: "CPU - Bộ vi xử lý" },
  { value: "mainboard", label: "Mainboard - Bo mạch chủ" },
  { value: "ram", label: "RAM - Bộ nhớ trong" },
  { value: "vga", label: "VGA - Card màn hình" },
  { value: "ssd", label: "SSD - Ổ cứng thể rắn" },
  { value: "hdd", label: "HDD - Ổ cứng cơ" },
  { value: "psu", label: "PSU - Nguồn máy tính" },
  { value: "case", label: "CASE - Vỏ máy tính" },
  { value: "cooler", label: "Tản nhiệt CPU / Nước" },
  { value: "monitor", label: "Màn hình máy tính" },
  { value: "gear", label: "Gaming Gear (Phím / Chuột / Tai nghe)" },
];

export default function AdminCategoriesAndBrandsPage() {
  // --- Main Tab: 'categories' | 'brands' ---
  const [mainTab, setMainTab] = useState("categories");

  // ==========================================
  // TAB 1: DANH MỤC SẢN PHẨM (CATEGORIES)
  // ==========================================
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("all");
  const [categoryPage, setCategoryPage] = useState(1);
  const categoryPageSize = 6;

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    parent: "",
    pcPartType: "none",
    isActive: true,
  });

  // ==========================================
  // TAB 2: THƯƠNG HIỆU / NHÃN HÀNG (BRANDS)
  // ==========================================
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [brandStatusFilter, setBrandStatusFilter] = useState("all");
  const [brandPage, setBrandPage] = useState(1);
  const brandPageSize = 8;

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandModalMode, setBrandModalMode] = useState("create");
  const [currentBrand, setCurrentBrand] = useState(null);
  const [savingBrand, setSavingBrand] = useState(false);

  const [brandForm, setBrandForm] = useState({
    name: "",
    origin: "Hoa Kỳ",
    description: "",
    website: "",
    isActive: true,
  });

  // ==========================================
  // SHARED STATES
  // ==========================================
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

  // Phím ESC đóng modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isCategoryModalOpen && !savingCategory) setIsCategoryModalOpen(false);
        if (isBrandModalOpen && !savingBrand) setIsBrandModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCategoryModalOpen, isBrandModalOpen, savingCategory, savingBrand]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- FETCH DATA ---
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await apiClient.get("/categories");
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        setCategories(json.data || []);
      }
    } catch (error) {
      showToast("Không thể tải danh sách danh mục!", "error");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      let url = `/brands/admin/all?search=${encodeURIComponent(brandSearchTerm)}`;
      if (brandStatusFilter !== "all") url += `&status=${brandStatusFilter}`;
      const res = await apiClient.get(url);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        setBrands(Array.isArray(json.data) ? json.data : []);
      }
    } catch (error) {
      try {
        const publicRes = await apiClient.get("/brands");
        const list = Array.isArray(publicRes.data?.data) ? publicRes.data.data : [];
        setBrands(list);
      } catch (e) {
        console.error("Lỗi tải danh sách nhãn hàng:", e);
        showToast("Không thể tải danh sách nhãn hàng!", "error");
      }
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (mainTab === "brands") {
      fetchBrands();
    }
  }, [brandStatusFilter]);

  // =========================================================================
  // HANDLERS: CATEGORIES
  // =========================================================================
  const handleOpenCreateCategory = () => {
    setCategoryModalMode("create");
    setCurrentCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      parent: "",
      pcPartType: "none",
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setCategoryModalMode("edit");
    setCurrentCategory(cat);
    setCategoryForm({
      name: cat.name || "",
      description: cat.description || "",
      parent: cat.parent?._id || cat.parent || "",
      pcPartType: cat.pcPartType || "none",
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast("Vui lòng nhập tên danh mục", "error");
      return;
    }

    setSavingCategory(true);
    try {
      const payload = {
        ...categoryForm,
        slug: generateSlug(categoryForm.name),
        parent: categoryForm.parent ? categoryForm.parent : null,
      };

      if (categoryModalMode === "create") {
        await apiClient.post("/categories", payload);
      } else {
        await apiClient.put(`/categories/${currentCategory._id}`, payload);
      }

      showToast(categoryModalMode === "create" ? "Tạo danh mục mới thành công!" : "Cập nhật danh mục thành công!");
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi xử lý danh mục", "error");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = (id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa danh mục sản phẩm?",
      message: `Bạn có chắc muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này sẽ cần được gán lại.`,
      confirmText: "Xóa danh mục",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/categories/${id}`);
          showToast("Đã xóa danh mục thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchCategories();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi xóa danh mục", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // =========================================================================
  // HANDLERS: BRANDS
  // =========================================================================
  const handleOpenCreateBrand = () => {
    setBrandModalMode("create");
    setCurrentBrand(null);
    setBrandForm({
      name: "",
      origin: "Hoa Kỳ",
      description: "",
      website: "",
      isActive: true,
    });
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brand) => {
    setBrandModalMode("edit");
    setCurrentBrand(brand);
    setBrandForm({
      name: brand.name || "",
      origin: brand.origin || "Đang cập nhật",
      description: brand.description || "",
      website: brand.website || "",
      isActive: brand.isActive !== undefined ? brand.isActive : true,
    });
    setIsBrandModalOpen(true);
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) {
      showToast("Vui lòng nhập tên nhãn hàng", "error");
      return;
    }

    setSavingBrand(true);
    try {
      const payload = {
        ...brandForm,
        slug: generateSlug(brandForm.name),
      };

      if (brandModalMode === "create") {
        await apiClient.post("/brands", payload);
      } else {
        await apiClient.put(`/brands/${currentBrand._id}`, payload);
      }

      showToast(brandModalMode === "create" ? "Thêm nhãn hàng thành công!" : "Cập nhật nhãn hàng thành công!");
      setIsBrandModalOpen(false);
      fetchBrands();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi lưu nhãn hàng", "error");
    } finally {
      setSavingBrand(false);
    }
  };

  const handleDeleteBrand = (id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa thương hiệu / nhãn hàng?",
      message: `Bạn có chắc muốn xóa thương hiệu "${name}" khỏi hệ thống?`,
      confirmText: "Xóa thương hiệu",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/brands/${id}`);
          showToast("Đã xóa thương hiệu thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchBrands();
        } catch (error) {
          showToast(error.response?.data?.message || error.message || "Lỗi xóa thương hiệu", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // --- Helpers: Cây Phân Cấp ---
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parent).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  const categoryTree = useMemo(() => {
    const query = categorySearchTerm.toLowerCase().trim();

    return rootCategories
      .filter((root) => {
        if (selectedGroupFilter !== "all" && root.slug !== selectedGroupFilter) return false;
        return true;
      })
      .map((root) => {
        const children = categories
          .filter((c) => {
            const parentId = c.parent?._id || c.parent;
            return parentId && parentId.toString() === root._id.toString();
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        if (query) {
          const matchRoot = root.name?.toLowerCase().includes(query);
          const filteredChildren = children.filter((c) => c.name?.toLowerCase().includes(query));

          if (matchRoot) return { root, children };
          if (filteredChildren.length > 0) return { root, children: filteredChildren };
          return null;
        }

        return { root, children };
      })
      .filter(Boolean);
  }, [rootCategories, categories, selectedGroupFilter, categorySearchTerm]);

  const totalCategoryPages = Math.ceil(categoryTree.length / categoryPageSize) || 1;
  const paginatedCategoryTree = useMemo(() => {
    const start = (categoryPage - 1) * categoryPageSize;
    return categoryTree.slice(start, start + categoryPageSize);
  }, [categoryTree, categoryPage, categoryPageSize]);

  const filteredBrands = useMemo(() => {
    const query = brandSearchTerm.toLowerCase().trim();
    return brands.filter((b) => {
      if (brandStatusFilter !== "all") {
        if (brandStatusFilter === "active" && !b.isActive) return false;
        if (brandStatusFilter === "inactive" && b.isActive) return false;
      }
      if (query) {
        const matchName = b.name?.toLowerCase().includes(query);
        const matchOrigin = b.origin?.toLowerCase().includes(query);
        if (!matchName && !matchOrigin) return false;
      }
      return true;
    });
  }, [brands, brandSearchTerm, brandStatusFilter]);

  const totalBrandPages = Math.ceil(filteredBrands.length / brandPageSize) || 1;
  const paginatedBrands = useMemo(() => {
    const start = (brandPage - 1) * brandPageSize;
    return filteredBrands.slice(start, start + brandPageSize);
  }, [filteredBrands, brandPage, brandPageSize]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-70 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold shadow-2xl animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white shadow-emerald-950/30"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-red-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-100 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
            Danh mục & Thương hiệu
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
            Tổ chức phân cấp gọn gàng theo cây thư mục và quản lý thương hiệu sản phẩm của DUDI SOFTWARE.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              fetchCategories();
              fetchBrands();
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            title="Làm mới toàn bộ"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loadingCategories || loadingBrands ? "animate-spin text-[#eb1c24]" : ""
              }`}
            />
            <span>Làm mới</span>
          </button>
          {mainTab === "categories" ? (
            <button
              onClick={handleOpenCreateCategory}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm danh mục</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateBrand}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm nhãn hàng</span>
            </button>
          )}
        </div>
      </div>

      {/* 2 Tab Switcher */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setMainTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            mainTab === "categories"
              ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Danh Mục Sản Phẩm</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              mainTab === "categories" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {categories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("brands")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            mainTab === "brands"
              ? "bg-[#eb1c24] text-white shadow-md shadow-red-600/20"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Thương Hiệu / Nhãn Hàng</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              mainTab === "brands" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {brands.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CÂY DANH MỤC SẢN PHẨM (HIERARCHY TREE VIEW)                        */}
      {/* ========================================================================= */}
      {mainTab === "categories" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Thanh tìm kiếm & Lọc Nhóm */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhanh danh mục theo tên..."
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              />
            </div>

            <div className="sm:col-span-5">
              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              >
                <option value="all">Tất cả 4 Nhóm Gốc</option>
                <option value="laptop">💻 Nhóm Laptop & Macbook</option>
                <option value="pc">🖥️ Nhóm Máy Tính Để Bàn (PC)</option>
                <option value="linh-kien-pc">⚙️ Nhóm Linh Kiện Máy Tính</option>
                <option value="man-hinh-gear">🖱️ Nhóm Màn Hình & Gear</option>
              </select>
            </div>
          </div>

          {/* Bảng Danh Mục Căn Chỉnh Cân Đối Hài Hòa */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                    <th className="py-3.5 px-4 min-w-[280px] whitespace-nowrap text-left">Tên Danh Mục</th>
                    <th className="py-3.5 px-4 w-56 text-center whitespace-nowrap">Loại Linh Kiện (Build PC)</th>
                    <th className="py-3.5 px-4 w-60 text-center whitespace-nowrap">Cấp Bậc & Phân Loại</th>
                    <th className="py-3.5 px-4 w-40 text-center whitespace-nowrap">Trạng Thái</th>
                    <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingCategories ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                        Đang tải danh mục...
                      </td>
                    </tr>
                  ) : paginatedCategoryTree.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Không tìm thấy danh mục nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategoryTree.map((group, groupIdx) => {
                      const root = group.root;
                      const children = group.children;
                      const RootIcon = getCategoryIcon(root);
                      const actualIdx = (categoryPage - 1) * categoryPageSize + groupIdx + 1;

                      return (
                        <Fragment key={root._id}>
                          {/* 1. DÒNG DANH MỤC GỐC */}
                          <tr className="bg-gradient-to-r from-red-50/50 via-slate-50/70 to-white border-y border-red-100/70 font-bold hover:bg-red-50/70 transition">
                            <td className="py-3.5 px-4 text-center text-[#eb1c24] font-mono font-black whitespace-nowrap">
                              #{actualIdx}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-left">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#eb1c24] text-white shadow-xs flex items-center justify-center shrink-0">
                                  <RootIcon className="w-4 h-4" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-slate-900 tracking-tight">
                                    {root.name}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-[#eb1c24] text-[10px] font-bold shrink-0">
                                    {children.length} mục con
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className="text-slate-400 text-xs font-medium">—</span>
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-[#eb1c24] border border-red-100 font-bold text-xs">
                                🌟 Danh Mục Gốc
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Hiển thị</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditCategory(root)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                                  title="Chỉnh sửa danh mục gốc"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(root._id, root.name)}
                                  className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Xóa danh mục gốc"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* 2. CÁC DÒNG DANH MỤC CON */}
                          {children.map((child, cIdx) => {
                            const ChildIcon = getCategoryIcon(child);

                            return (
                              <tr
                                key={child._id}
                                className="hover:bg-slate-50/80 transition group border-b border-slate-100 last:border-b-0"
                              >
                                <td className="py-3 px-4 text-center text-slate-400 font-mono font-medium text-[11px] whitespace-nowrap">
                                  {actualIdx}.{cIdx + 1}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap text-left">
                                  <div className="flex items-center gap-2 pl-6">
                                    <CornerDownRight className="w-4 h-4 text-slate-300 shrink-0" />
                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                                      <ChildIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-bold text-slate-800 group-hover:text-[#eb1c24] transition text-xs sm:text-[13px]">
                                      {child.name}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  {child.pcPartType && child.pcPartType !== "none" ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-black text-[10.5px] uppercase tracking-wide">
                                      <Cpu className="w-3 h-3" />
                                      {child.pcPartType}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-xs">Sản phẩm nguyên chiếc</span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                    ↳ Thuộc {root.name}
                                  </span>
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  {child.isActive ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>Hiển thị</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
                                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span>Tạm ẩn</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-center whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleOpenEditCategory(child)}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(child._id, child.name)}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                      title="Xóa"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Thanh Phân Trang Danh Mục Đồng Bộ */}
            {categoryTree.length > 0 && (
              <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Hiển thị{" "}
                  <strong className="text-slate-800 font-bold">
                    {categoryTree.length === 0 ? 0 : (categoryPage - 1) * categoryPageSize + 1}-
                    {Math.min(categoryPage * categoryPageSize, categoryTree.length)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-slate-800 font-bold">{categoryTree.length}</strong> nhóm danh mục
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalCategoryPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCategoryPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                        page === categoryPage
                          ? "bg-[#eb1c24] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={categoryPage === totalCategoryPages}
                    onClick={() => setCategoryPage((prev) => Math.min(prev + 1, totalCategoryPages))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang sau"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: THƯƠNG HIỆU / NHÃN HÀNG (BRANDS)                                  */}
      {/* ========================================================================= */}
      {mainTab === "brands" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhãn hàng theo tên, quốc gia..."
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={brandStatusFilter}
                onChange={(e) => setBrandStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-red-500 transition shadow-2xs"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hợp tác</option>
                <option value="inactive">Dừng hợp tác</option>
              </select>
            </div>
          </div>

          {/* Brands Table Căn Giữa Cân Đối & Trạng Thái Chuẩn */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 w-14 text-center whitespace-nowrap">STT</th>
                    <th className="py-3.5 px-4 min-w-[240px] whitespace-nowrap text-left">Thương Hiệu / Nhãn Hàng</th>
                    <th className="py-3.5 px-4 w-52 text-center whitespace-nowrap">Quốc Gia Xuất Xứ</th>
                    <th className="py-3.5 px-4 w-52 text-center whitespace-nowrap">Sản Phẩm Trong Kho</th>
                    <th className="py-3.5 px-4 min-w-[200px] text-center whitespace-nowrap">Website Chính Thức</th>
                    <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Trạng Thái Hợp Tác</th>
                    <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loadingBrands ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#eb1c24] mb-2" />
                        Đang tải danh sách nhãn hàng...
                      </td>
                    </tr>
                  ) : filteredBrands.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy thương hiệu nào phù hợp.
                      </td>
                    </tr>
                  ) : paginatedBrands.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy thương hiệu nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    paginatedBrands.map((b, idx) => (
                      <tr key={b._id} className="hover:bg-slate-50/80 transition group">
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                          {(brandPage - 1) * brandPageSize + idx + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-left">
                          <span className="font-bold text-slate-900 group-hover:text-[#eb1c24] transition text-sm">
                            {b.name}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{b.origin || "Đang cập nhật"}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                            <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>{b.productCount || 0} sản phẩm</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {b.website ? (
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-slate-700 hover:text-[#eb1c24] hover:underline text-xs font-medium"
                            >
                              <span>{b.website.replace("https://", "")}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {b.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Đang hợp tác</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
                              <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Dừng hợp tác</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBrand(b)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(b._id, b.name)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Thanh Phân Trang Nhãn Hàng Đồng Bộ */}
            {filteredBrands.length > 0 && (
              <div className="p-4 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500 font-medium">
                  Hiển thị{" "}
                  <strong className="text-slate-800 font-bold">
                    {filteredBrands.length === 0 ? 0 : (brandPage - 1) * brandPageSize + 1}-
                    {Math.min(brandPage * brandPageSize, filteredBrands.length)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-slate-800 font-bold">{filteredBrands.length}</strong> nhãn hàng
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={brandPage === 1}
                    onClick={() => setBrandPage((prev) => Math.max(prev - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang trước"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalBrandPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setBrandPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                        page === brandPage
                          ? "bg-[#eb1c24] text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={brandPage === totalBrandPages}
                    onClick={() => setBrandPage((prev) => Math.min(prev + 1, totalBrandPages))}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
                    title="Trang sau"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: THÊM / SỬA DANH MỤC                                              */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              if (!savingCategory) setIsCategoryModalOpen(false);
            }}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-[#eb1c24]">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {categoryModalMode === "create" ? "Thêm Danh Mục Mới" : "Chỉnh Sửa Danh Mục"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Thiết lập phân cấp và cấu hình linh kiện Build PC</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Laptop Gaming, Card màn hình (VGA)..."
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden font-bold text-slate-900 text-sm"
                />
              </div>

              {/* Chọn Danh Mục Cha */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thuộc danh mục cha (Phân cấp)</label>
                <select
                  value={categoryForm.parent}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parent: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-red-500 focus:outline-hidden"
                >
                  <option value="">— Không chọn (Đây là Danh Mục Gốc) —</option>
                  {rootCategories
                    .filter((rc) => !currentCategory || rc._id !== currentCategory._id)
                    .map((rc) => (
                      <option key={rc._id} value={rc._id}>
                        ⭐ {rc.name} (Danh mục gốc)
                      </option>
                    ))}
                </select>
              </div>

              {/* Cấu hình loại linh kiện Build PC */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Loại linh kiện (Dành cho tính năng Build PC)</label>
                <select
                  value={categoryForm.pcPartType}
                  onChange={(e) => setCategoryForm({ ...categoryForm, pcPartType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-red-500 focus:outline-hidden"
                >
                  {PC_PARTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả về các dòng sản phẩm trong danh mục này..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCat"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="isActiveCat" className="font-bold text-slate-800 cursor-pointer">
                  Hiển thị trên website
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {savingCategory ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : categoryModalMode === "create" ? (
                    "Thêm Danh Mục"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: THÊM / SỬA NHÃN HÀNG                                             */}
      {/* ========================================================================= */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => {
              if (!savingBrand) setIsBrandModalOpen(false);
            }}
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-[#eb1c24]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {brandModalMode === "create" ? "Thêm Thương Hiệu / Nhãn Hàng" : "Chỉnh Sửa Nhãn Hàng"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Quản lý các hãng sản xuất và liên kết với sản phẩm</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBrand} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: ASUS, Dell, Lenovo, Apple, Intel..."
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden font-bold text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quốc gia / Xuất xứ</label>
                <input
                  type="text"
                  placeholder="Hoa Kỳ, Đài Loan, Hàn Quốc..."
                  value={brandForm.origin}
                  onChange={(e) => setBrandForm({ ...brandForm, origin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Website chính thức (URL)</label>
                <input
                  type="url"
                  placeholder="https://www.asus.com..."
                  value={brandForm.website}
                  onChange={(e) => setBrandForm({ ...brandForm, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả về nhãn hàng</label>
                <textarea
                  rows={2}
                  placeholder="Giới thiệu các dòng sản phẩm tiêu biểu của hãng..."
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveBrand"
                  checked={brandForm.isActive}
                  onChange={(e) => setBrandForm({ ...brandForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="isActiveBrand" className="font-bold text-slate-800 cursor-pointer">
                  Đang hợp tác với thương hiệu này
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={savingBrand}
                  className="px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#c9121a] text-white font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {savingBrand ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : brandModalMode === "create" ? (
                    "Thêm Nhãn Hàng"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Confirm Modal */}
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
