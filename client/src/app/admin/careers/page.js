"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
  X,
  AlertTriangle,
  Building,
  Sparkles,
  Lock,
  Unlock,
  Clock,
  Mail,
  Phone,
  Flame,
  Award,
  Layers,
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

const DEPARTMENTS = [
  "Kỹ Thuật Phần Cứng",
  "Kinh Doanh & Bán Hàng",
  "Marketing & Media",
  "Chăm Sóc Khách Hàng",
  "Quản Lý & Vận Hành",
  "Kho Vận & Giao Nhận",
];

const LEVELS = [
  "Thực tập sinh",
  "Nhân viên",
  "Chuyên viên",
  "Trưởng nhóm (Leader)",
  "Quản lý (Manager)",
];

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentJob, setCurrentJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [toast, setToast] = useState(null);

  // Confirm Modal State
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xác nhận",
    type: "danger",
    onConfirm: null,
    loading: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    department: "Kỹ Thuật Phần Cứng",
    level: "Chuyên viên",
    location: "TP. Hồ Chí Minh",
    salary: "12 - 18 Triệu",
    type: "Toàn thời gian",
    experience: "1 năm kinh nghiệm",
    quantity: 2,
    skills: "Lắp ráp PC, Cài đặt phần mềm, Tư vấn kỹ thuật",
    workingHours: "8h30 - 17h30 (Thứ 2 - Thứ 6)",
    contactEmail: "tuyendung@dudisoftware.com",
    contactPhone: "0909 163 821",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "2026-12-31",
    isActive: true,
    isHot: false,
    order: 0,
  });

  // Đóng modal bằng phím ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen && !saving) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, saving]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `/jobs/admin/all?search=${encodeURIComponent(searchTerm)}`;
      if (selectedDept !== "all") url += `&department=${encodeURIComponent(selectedDept)}`;
      if (selectedStatus !== "all") url += `&isActive=${selectedStatus === "active"}`;

      const res = await apiClient.get(url);
      const json = res.data;
      if (json.statusCode === 200 || json.success) {
        const items = json.data?.items || (Array.isArray(json.data) ? json.data : []);
        setJobs(items);
      }
    } catch (error) {
      try {
        const publicRes = await apiClient.get("/jobs");
        const items = publicRes.data?.data?.items || (Array.isArray(publicRes.data?.data) ? publicRes.data.data : []);
        setJobs(items);
      } catch (e) {
        console.error("Lỗi tải tuyển dụng:", e);
        showToast("Không thể tải danh sách tuyển dụng!", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedDept, selectedStatus]);

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !isSlugManual ? generateSlug(title) : prev.slug,
    }));
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setCurrentJob(null);
    setIsSlugManual(false);
    setFormData({
      title: "",
      slug: "",
      department: "Kỹ Thuật Phần Cứng",
      level: "Chuyên viên",
      location: "TP. Hồ Chí Minh",
      salary: "12 - 18 Triệu",
      type: "Toàn thời gian",
      experience: "1 năm kinh nghiệm",
      quantity: 2,
      skills: "Lắp ráp PC, Cài đặt hệ thống, Tư vấn phần cứng",
      workingHours: "8h30 - 17h30 (Thứ 2 - Thứ 6)",
      contactEmail: "tuyendung@dudisoftware.com",
      contactPhone: "0909 163 821",
      description: "Chịu trách nhiệm tư vấn cấu hình, build PC gaming/workstation và xử lý sự cố phần cứng theo yêu cầu khách hàng.",
      requirements: "Am hiểu sâu về linh kiện máy tính (CPU, GPU, Mainboard, RAM, PSU)\nCó kỹ năng lắp ráp và đi dây máy tính thẩm mỹ\nNhiệt tình, trung thực và có trách nhiệm cao trong công việc",
      benefits: "Thu nhập cạnh tranh (Lương cứng + Thưởng hiệu suất doanh số)\nĐược đào tạo nâng cao tay nghề và cập nhật công nghệ mới liên tục\nThưởng các dịp Lễ, Tết, Lương tháng 13 và du lịch nghỉ dưỡng hàng năm",
      deadline: "2026-12-31",
      isActive: true,
      isHot: true,
      order: jobs.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setModalMode("edit");
    setCurrentJob(job);
    setIsSlugManual(true);
    setFormData({
      title: job.title || "",
      slug: job.slug || "",
      department: job.department || "Kỹ Thuật Phần Cứng",
      level: job.level || "Chuyên viên",
      location: job.location || "TP. Hồ Chí Minh",
      salary: job.salary || "Thương lượng",
      type: job.type || "Toàn thời gian",
      experience: job.experience || "1 năm kinh nghiệm",
      quantity: job.quantity || 1,
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      workingHours: job.workingHours || "8h30 - 17h30",
      contactEmail: job.contactEmail || "tuyendung@dudisoftware.com",
      contactPhone: job.contactPhone || "0909 163 821",
      description: job.description || "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements || "",
      benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits || "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
      isActive: job.isActive !== undefined ? job.isActive : true,
      isHot: job.isHot || false,
      order: job.order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("Vui lòng điền đầy đủ tiêu đề và mô tả công việc", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug.trim() || generateSlug(formData.title),
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        requirements: formData.requirements ? formData.requirements.split("\n").map((r) => r.trim()).filter(Boolean) : [],
        benefits: formData.benefits ? formData.benefits.split("\n").map((b) => b.trim()).filter(Boolean) : [],
      };

      const url = modalMode === "create" ? `/jobs` : `/jobs/${currentJob._id}`;

      if (modalMode === "create") {
        await apiClient.post(url, payload);
      } else {
        await apiClient.put(url, payload);
      }

      showToast(modalMode === "create" ? "Đăng tin tuyển dụng mới thành công!" : "Cập nhật tin tuyển dụng thành công!");
      setIsModalOpen(false);
      fetchJobs();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi lưu tin tuyển dụng", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await apiClient.patch(`/jobs/${id}/toggle`);
      showToast("Đã thay đổi trạng thái tuyển dụng!");
      fetchJobs();
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Lỗi cập nhật", "error");
    }
  };

  const handleDelete = (id, title) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa tin tuyển dụng?",
      message: `Bạn có chắc muốn xóa vị trí "${title}"? Tin này sẽ bị gỡ khỏi trang Tuyển dụng DUDI SOFTWARE.`,
      confirmText: "Xóa tin tuyển dụng",
      type: "danger",
      loading: false,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, loading: true }));
        try {
          await apiClient.delete(`/jobs/${id}`);
          showToast("Đã xóa tin tuyển dụng thành công!");
          setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }));
          fetchJobs();
        } catch (error) {
          showToast(error.message || "Lỗi xóa tin", "error");
          setConfirmState((prev) => ({ ...prev, loading: false }));
        }
      },
    });
  };

  // Tính toán số liệu thống kê nhanh
  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.isActive).length,
    expired: jobs.filter((j) => j.deadline && new Date(j.deadline) < new Date()).length,
    hot: jobs.filter((j) => j.isHot).length,
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
            <AlertTriangle className="w-5 h-5 text-red-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header with Quick Stat Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quản Lý Tuyển Dụng Việc Làm
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Đăng tin tìm kiếm nhân tài cho các vị trí kỹ thuật PC, bán hàng và vận hành hệ thống
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchJobs}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-2xs cursor-pointer"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng Tin Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="text-[11px] font-bold text-slate-500">Tổng Vị Trí</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.total}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-[11px] font-bold text-emerald-700">Đang Tuyển Dụng</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{stats.active}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-100">
            <div className="text-[11px] font-bold text-[#eb1c24]">Vị Trí Hot</div>
            <div className="text-xl font-black text-[#eb1c24] mt-0.5">{stats.hot}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="text-[11px] font-bold text-amber-700">Đã / Sắp Hết Hạn</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{stats.expired}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo chức danh, kỹ năng (Lắp ráp PC, Sale, Kế toán...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition shadow-2xs"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500 transition shadow-2xs"
          >
            <option value="all">Tất cả phòng ban</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500 transition shadow-2xs"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang tuyển</option>
            <option value="inactive">Tạm ngưng</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-12 text-center whitespace-nowrap">STT</th>
                <th className="py-3.5 px-4 min-w-[240px] whitespace-nowrap text-left">Vị Trí Tuyển Dụng</th>
                <th className="py-3.5 px-4 w-48 text-center whitespace-nowrap">Phòng Ban & Cấp Bậc</th>
                <th className="py-3.5 px-4 w-44 text-center whitespace-nowrap">Mức Lương & Địa Điểm</th>
                <th className="py-3.5 px-4 w-32 text-center whitespace-nowrap">Số Lượng</th>
                <th className="py-3.5 px-4 w-36 text-center whitespace-nowrap">Hạn Nộp</th>
                <th className="py-3.5 px-4 w-36 text-center whitespace-nowrap">Trạng Thái</th>
                <th className="py-3.5 px-4 w-28 text-center whitespace-nowrap">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Đang tải danh sách tuyển dụng...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Chưa có vị trí tuyển dụng nào phù hợp.
                  </td>
                </tr>
              ) : (
                jobs.map((job, idx) => {
                  const isExpired = job.deadline && new Date(job.deadline) < new Date();

                  return (
                    <tr key={job._id} className="hover:bg-slate-50/70 transition group">
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono font-medium whitespace-nowrap">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 text-left whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition text-xs sm:text-sm">
                            {job.title}
                          </div>
                          {job.isHot && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-100 text-[#eb1c24] text-[9.5px] font-black shrink-0">
                              <Flame className="w-3 h-3" />
                              HOT
                            </span>
                          )}
                        </div>
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.skills.slice(0, 3).map((sk, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                              >
                                {sk}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{job.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <div className="font-semibold text-slate-800 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{job.department}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>{job.level || "Chuyên viên"}</span>
                            <span className="text-slate-300">•</span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="font-black text-[#eb1c24] text-xs">
                          {job.salary || "Thỏa thuận"}
                        </div>
                        <div className="text-[10.5px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                          <Users className="w-3 h-3" />
                          {job.quantity || 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap text-slate-600 font-medium">
                        {job.deadline ? (
                          <>
                            <div className="text-[11.5px]">
                              {new Date(job.deadline).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="text-[10.5px]">
                              {isExpired ? (
                                <span className="text-red-500 font-bold">Đã hết hạn</span>
                              ) : (
                                <span className="text-emerald-600">Đang nhận CV</span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400">Liên tục</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(job._id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold transition cursor-pointer ${
                            job.isActive
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {job.isActive ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{job.isActive ? "Đang tuyển" : "Tạm ngưng"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(job)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id, job.title)}
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
      </div>

      {/* Modal Soạn Thảo / Chỉnh Sửa Tin Tuyển Dụng */}
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
            className="relative z-10 bg-white max-w-3xl w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {modalMode === "create" ? "Đăng Tin Tuyển Dụng Mới" : "Chỉnh Sửa Tin Tuyển Dụng"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ứng viên sẽ gửi hồ sơ trực tiếp về email tuyển dụng của công ty
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
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chức danh / Tiêu đề vị trí tuyển dụng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Kỹ Thuật Viên Lắp Ráp PC Gaming & Workstation..."
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden font-bold text-slate-900 text-sm"
                />
              </div>

              {/* Slug SEO Thông Minh */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5">
                    <span>Đường dẫn (URL Slug SEO)</span>
                    <span className="text-[10.5px] font-normal text-slate-400">
                      {isSlugManual ? "• Tùy chỉnh thủ công" : "• Tự động sinh"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSlugManual(!isSlugManual)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 font-bold text-[11px] transition cursor-pointer"
                  >
                    {isSlugManual ? <Unlock className="w-3 h-3 text-amber-500" /> : <Lock className="w-3 h-3 text-slate-400" />}
                    <span>{isSlugManual ? "Khóa tự động" : "Tùy chỉnh URL"}</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-xs shrink-0">/careers/</span>
                  <input
                    type="text"
                    required
                    readOnly={!isSlugManual}
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                    placeholder="duong-dan-tin-tuyen-dung"
                    className={`flex-1 px-3 py-1.5 rounded-xl border font-mono text-xs transition ${
                      isSlugManual
                        ? "bg-white border-blue-500 text-slate-900 font-bold focus:outline-hidden"
                        : "bg-slate-100 border-slate-200 text-slate-600 select-all"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cấp bậc
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Số lượng cần tuyển
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mức lương (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12 - 18 Triệu, Thỏa thuận..."
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Địa điểm làm việc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TP. Hồ Chí Minh..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kinh nghiệm yêu cầu
                  </label>
                  <input
                    type="text"
                    placeholder="1 năm, Không yêu cầu..."
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kỹ năng yêu cầu (Phân cách bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="Build PC, Xử lý lỗi, Giao tiếp tốt..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Thời gian làm việc
                  </label>
                  <input
                    type="text"
                    placeholder="8h30 - 17h30 (Thứ 2 - Thứ 6)..."
                    value={formData.workingHours}
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email nhận hồ sơ ứng tuyển
                  </label>
                  <input
                    type="email"
                    placeholder="tuyendung@dudisoftware.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hạn chót nộp hồ sơ
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả công việc chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả cụ thể nhiệm vụ và trách nhiệm hàng ngày..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Yêu cầu ứng viên (Mỗi dòng là một yêu cầu)
                </label>
                <textarea
                  rows={3}
                  placeholder="Yêu cầu về kỹ năng, thái độ, bằng cấp (nếu có)..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden text-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quyền lợi & Chế độ đãi ngộ (Mỗi dòng là một quyền lợi)
                </label>
                <textarea
                  rows={3}
                  placeholder="Lương thưởng, bảo hiểm, du lịch, cơ hội thăng tiến..."
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveJob"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isActiveJob" className="font-bold text-slate-800 cursor-pointer">
                    Đang tuyển dụng
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isHotJob"
                    checked={formData.isHot}
                    onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="isHotJob" className="font-bold text-[#eb1c24] cursor-pointer flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Đánh dấu vị trí nổi bật (HOT)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : modalMode === "create" ? (
                    "Đăng Tin Tuyển Dụng"
                  ) : (
                    "Lưu Thay Đổi"
                  )}
                </button>
              </div>
            </form>
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
