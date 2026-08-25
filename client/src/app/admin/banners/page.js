"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Image as ImageIcon,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Sparkles,
  RefreshCw,
  Sliders,
  X,
  LayoutGrid,
  BellRing,
  ShoppingBag,
} from "lucide-react";
import { bannerAPI, uploadAPI } from "@/lib/api";
import { useToast } from "@/components/common/ToastContext";

// Định nghĩa thông tin 4 vùng hiển thị cố định chuẩn trên website
const BANNER_ZONES = [
  {
    id: "hero_slider",
    name: "Slider Trang Chủ (Carousel)",
    shortName: "Slider Trang Chủ",
    icon: Sliders,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "Khối các tấm ảnh chạy xoay vòng lướt qua lại ở đầu trang chủ.",
    recommendedSize: "1920 x 800 px (hoặc 1920 x 1080 px)",
    aspectRatio: "21/9 hoặc 16/9",
    tip: "Nên dùng ảnh ngang chất lượng cao, nội dung chính nằm ở giữa ảnh để hiển thị đẹp trên cả điện thoại và máy tính.",
    slotLabel: (order) => `Slide #${order}`,
  },
  {
    id: "promo_grid",
    name: "3 Khung Khuyến Mãi Dưới Slider",
    shortName: "3 Khung Khuyến Mãi",
    icon: LayoutGrid,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    desc: "3 ô hình ảnh cố định nằm ngay bên dưới slider trang chủ.",
    recommendedSize: "600 x 400 px (Chuẩn tỉ lệ 3:2)",
    aspectRatio: "3/2",
    tip: "Hình ảnh nên có màu sắc nổi bật, chữ to rõ ràng (ví dụ: Back to school, Thu cũ đổi mới, Giới thiệu bạn bè).",
    slotLabel: (order) => {
      if (order === 1) return "Ô 1: Bên trái";
      if (order === 2) return "Ô 2: Ở giữa";
      return "Ô 3: Bên phải";
    },
  },
  {
    id: "popup",
    name: "Popup Quảng Cáo Khi Mở Web",
    shortName: "Popup Khuyến Mãi",
    icon: BellRing,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    desc: "Tấm ảnh to bật lên ở giữa màn hình khi khách hàng vừa truy cập vào website.",
    recommendedSize: "800 x 600 px (hoặc 900 x 600 px)",
    aspectRatio: "4/3",
    tip: "Dùng để thông báo chương trình siêu khuyến mãi, mini-game hoặc thông điệp quan trọng nhất của cửa hàng.",
    slotLabel: () => "Popup Chính",
  },
  {
    id: "product_top",
    name: "Banner Trang Tất Cả Sản Phẩm",
    shortName: "Banner Trang Sản Phẩm",
    icon: ShoppingBag,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "Tấm banner dải ngang nằm trên cùng của trang Tất cả sản phẩm (/tat-ca-san-pham).",
    recommendedSize: "1600 x 300 px (hoặc 1920 x 360 px)",
    aspectRatio: "16/3 hoặc 5/1",
    tip: "Nên dùng banner dạng dải ngang dài, phong cách công nghệ sang trọng, làm nổi bật bộ sưu tập sản phẩm.",
    slotLabel: () => "Banner Ngang",
  },
];

export default function BannersPage() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const uploadPromiseRef = useRef(null);

  // States
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeZone, setActiveZone] = useState("hero_slider");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("upload"); // 'upload' | 'url'
  const [imgMeta, setImgMeta] = useState(null);
  const [previewFit, setPreviewFit] = useState("cover"); // 'cover' | 'contain'

  // Form State (Controlled inputs always have fallback strings)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    publicId: "",
    link: "",
    position: "hero_slider",
    order: 1,
    isActive: true,
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Helper kiểm tra kích thước và tỉ lệ ảnh
  const inspectImage = async (src, zone) => {
    if (!src) {
      setImgMeta(null);
      return;
    }
    const targetZone = zone || activeZone;
    try {
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const ratio = width / (height || 1);

        let warning = null;
        let isGood = true;

        if (targetZone === "hero_slider") {
          if (width < 800) {
            warning = `Ảnh có độ phân giải hơi nhỏ (${width}x${height}px). Khuyến nghị từ 1600px trở lên để sắc nét trên màn hình lớn.`;
            isGood = false;
          } else if (ratio < 1.3) {
            warning = `Ảnh có tỉ lệ đứng/vuông (${width}x${height}px). Slider cần ảnh ngang 16:9 hoặc 21:9 để không bị cắt bớt nội dung.`;
            isGood = false;
          }
        } else if (targetZone === "promo_grid") {
          if (width < 400) {
            warning = `Ảnh hơi nhỏ (${width}x${height}px). Khuyến nghị từ 600px trở lên.`;
            isGood = false;
          } else if (ratio < 1.1 || ratio > 2.2) {
            warning = `Tỉ lệ ảnh (${ratio.toFixed(2)}:1) hơi lệch so với khung 3:2. Ảnh sẽ được tự động căn giữa để không bị méo hình.`;
            isGood = false;
          }
        } else if (targetZone === "popup") {
          if (width < 400) {
            warning = `Ảnh hơi nhỏ (${width}x${height}px). Khuyến nghị từ 600px trở lên.`;
            isGood = false;
          }
        } else if (targetZone === "product_top") {
          if (width < 800) {
            warning = `Ảnh hơi nhỏ (${width}x${height}px). Khuyến nghị từ 1600px trở lên.`;
            isGood = false;
          } else if (ratio < 2.0) {
            warning = `Banner trang sản phẩm là dải ngang dài. Ảnh hiện tại (${width}x${height}px, tỉ lệ ${ratio.toFixed(2)}:1) có thể bị cắt bớt phần trên/dưới.`;
            isGood = false;
          }
        }

        setImgMeta({ width, height, ratio, warning, isGood });
      };
      img.onerror = () => {
        setImgMeta(null);
      };
      img.src = src;
    } catch {
      setImgMeta(null);
    }
  };

  // Load Banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerAPI.getAll();
      if (res.data && Array.isArray(res.data.data)) {
        setBanners(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách banner:", error);
      showToast({
        title: "Lỗi tải dữ liệu",
        message: "Không thể lấy danh sách banner từ hệ thống.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Lấy thông tin vùng hiện tại
  const currentZoneInfo = useMemo(() => {
    return BANNER_ZONES.find((z) => z.id === activeZone) || BANNER_ZONES[0];
  }, [activeZone]);

  const zoneBanners = useMemo(() => {
    return banners
      .filter((b) => b.position === activeZone)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [banners, activeZone]);

  // Open Modal Edit (Thay ảnh cho khung banner cố định)
  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    uploadPromiseRef.current = null;
    const initialUrl = banner?.imageUrl ?? "";
    setFormData({
      title: banner?.title ?? "",
      imageUrl: initialUrl,
      publicId: banner?.publicId ?? "",
      link: banner?.link ?? "",
      position: banner?.position || activeZone,
      order: banner?.order ?? 1,
      isActive: Boolean(banner?.isActive ?? true),
      description: banner?.description ?? "",
    });
    setFormErrors({});
    setImageMode(initialUrl.startsWith("http") ? "url" : "upload");
    setPreviewFit("cover");
    inspectImage(initialUrl, banner?.position || activeZone);
    setModalOpen(true);
  };

  // Handle File Selection (Instant Local Preview + Background Pre-upload)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        title: "File không hợp lệ",
        message: "Vui lòng chọn file hình ảnh (JPG, PNG, WebP, GIF,...)",
        type: "warning",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast({
        title: "File quá lớn",
        message: "Dung lượng ảnh tối đa là 10MB. Vui lòng chọn ảnh nhẹ hơn.",
        type: "warning",
      });
      return;
    }

    // 1. Hiển thị Preview tức thì (0ms)
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl: localPreviewUrl,
    }));
    setFormErrors((prev) => ({ ...prev, imageUrl: "" }));
    inspectImage(localPreviewUrl, formData.position || activeZone);

    // 2. Chạy tải lên Cloudinary ngầm bất đồng bộ ngay trong lúc người dùng xem & nhập form
    uploadPromiseRef.current = uploadAPI
      .single(file, "banners")
      .then((res) => res.data?.data)
      .catch((err) => {
        console.error("Lỗi upload ngầm:", err);
        return null;
      });

    showToast({
      title: "Tải ảnh thành công",
      message: "Đã tải ảnh lên xem trước thành công!",
      type: "success",
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Toggle Active Status
  const handleToggleStatus = async (banner) => {
    try {
      const res = await bannerAPI.toggleStatus(banner._id);
      const updated = res.data?.data;
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, isActive: updated.isActive } : b))
      );
      showToast({
        title: "Cập nhật trạng thái",
        message: updated.isActive
          ? `Đã bật hiển thị "${banner.title}" trên website`
          : `Đã tạm ẩn "${banner.title}" trên website`,
        type: "info",
      });
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái banner:", error);
      showToast({
        title: "Thao tác thất bại",
        message: "Không thể đổi trạng thái banner.",
        type: "error",
      });
    }
  };

  // Save Banner Changes (Optimistic Instant Close & Asynchronous Background Sync)
  const handleSaveBanner = (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Vui lòng nhập tên hoặc tiêu đề banner";
    }
    if (!formData.imageUrl.trim()) {
      errors.imageUrl = "Vui lòng chọn ảnh hoặc dán link ảnh hợp lệ";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const currentBannerId = editingBanner?._id;
    const currentPayload = { ...formData };
    const uploadPromise = uploadPromiseRef.current;

    // 1. TỐI ƯU TRẢI NGHIỆM: Đóng Modal ngay lập tức & Cập nhật giao diện tức thì (0ms chờ)
    if (currentBannerId) {
      setBanners((prev) =>
        prev.map((b) => (b._id === currentBannerId ? { ...b, ...currentPayload } : b))
      );
    }
    setModalOpen(false);
    showToast({
      title: "Lưu thành công",
      message: `Đã cập nhật banner "${currentPayload.title}" thành công!`,
      type: "success",
    });

    // 2. ĐỒNG BỘ BẤT ĐỒNG BỘ NGẦM (Lấy link Cloudinary chính thức & lưu vào Database)
    (async () => {
      try {
        let finalImageUrl = currentPayload.imageUrl;
        let finalPublicId = currentPayload.publicId;

        if (uploadPromise) {
          const uploadData = await uploadPromise;
          if (uploadData?.url) {
            finalImageUrl = uploadData.url;
            finalPublicId = uploadData.public_id || "";
          }
        }

        const finalData = {
          ...currentPayload,
          imageUrl: finalImageUrl,
          publicId: finalPublicId,
        };

        if (currentBannerId) {
          const res = await bannerAPI.update(currentBannerId, finalData);
          const updated = res.data?.data;
          if (updated) {
            setBanners((prev) =>
              prev.map((b) => (b._id === currentBannerId ? updated : b))
            );
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ ngầm banner:", err);
      }
    })();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Management */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#eb1c24] to-[#ff4d4f] text-white flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Banner & Quảng cáo
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Dễ dàng thay đổi hình ảnh và đường dẫn cho các khung banner cố định trên website
            </p>
          </div>
        </div>

        <button
          onClick={fetchBanners}
          className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer flex items-center gap-2 text-xs font-bold self-start sm:self-auto"
          title="Tải lại dữ liệu"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* 2. Zone Selection Tabs (4 Vùng hiển thị cố định) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BANNER_ZONES.map((zone) => {
          const Icon = zone.icon;
          const isActive = activeZone === zone.id;
          const count = banners.filter((b) => b.position === zone.id).length;
          const activeCount = banners.filter((b) => b.position === zone.id && b.isActive).length;

          return (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`p-4 rounded-3xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? "bg-white border-red-500 shadow-md ring-2 ring-red-500/10"
                  : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isActive
                      ? "bg-red-500 text-white shadow-md shadow-red-500/25"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isActive
                      ? "bg-red-50 text-[#eb1c24] border-red-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {activeCount}/{count} đang bật
                </span>
              </div>

              <div>
                <h3
                  className={`text-sm font-black mb-1 ${
                    isActive ? "text-[#eb1c24]" : "text-slate-900"
                  }`}
                >
                  {zone.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                  {zone.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Guidance Box for Current Zone */}
      <div className="bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-orange-50/80 rounded-3xl p-5 border border-amber-200/80 flex items-start gap-3.5 shadow-2xs">
        <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20 shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black text-amber-950 uppercase tracking-tight">
              Hướng dẫn kích thước chuẩn: {currentZoneInfo.name}
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10.5px] font-extrabold">
              {currentZoneInfo.aspectRatio}
            </span>
          </div>
          <p className="text-xs text-amber-900/90 mt-1 font-medium leading-relaxed">
            👉 Kích thước khuyến nghị: <strong className="text-amber-950 font-bold">{currentZoneInfo.recommendedSize}</strong>. {currentZoneInfo.tip}
          </p>
        </div>
      </div>

      {/* 4. Banner List / Grid for Active Zone (Khung banner cố định) */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-xs">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách khung banner...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zoneBanners.map((banner, index) => {
            const slotTitle =
              typeof currentZoneInfo.slotLabel === "function"
                ? currentZoneInfo.slotLabel(banner.order || index + 1)
                : `Vị trí #${banner.order || index + 1}`;

            return (
              <div
                key={banner._id || index}
                className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  banner.isActive ? "border-slate-100" : "border-slate-200 opacity-75 bg-slate-50/50"
                }`}
              >
                {/* Banner Thumbnail Container */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden group">
                  <img
                    src={banner.imageUrl || "/banner.webp"}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/banner.webp";
                    }}
                  />

                  {/* Top Badges Bar (Flexbox prevents any overlap) */}
                  <div className="absolute top-0 inset-x-0 p-2.5 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
                    <span className="bg-slate-950/85 backdrop-blur-xs text-white text-[10.5px] font-black px-2.5 py-0.5 rounded-lg shadow-xs border border-white/20 shrink-0">
                      {slotTitle}
                    </span>

                    <span
                      className={`text-[9.5px] font-black px-2 py-0.5 rounded-lg backdrop-blur-xs shadow-xs border shrink-0 ${
                        banner.isActive
                          ? "bg-emerald-500/90 text-white border-emerald-300/40"
                          : "bg-amber-600/90 text-white border-amber-400/40"
                      }`}
                    >
                      {banner.isActive ? "Đang hiển thị" : "Dùng mặc định"}
                    </span>
                  </div>

                  {/* Click to Preview Destination Link */}
                  {banner.link && banner.link.trim() && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2.5 left-2.5 bg-white/90 hover:bg-white text-slate-800 text-[10.5px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-xs flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3 h-3 text-[#eb1c24]" />
                      <span className="truncate max-w-[180px]">{banner.link}</span>
                    </a>
                  )}
                </div>

                {/* Banner Info & Action Bar */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1" title={banner.title}>
                      {banner.title}
                    </h3>
                    {banner.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {banner.description}
                      </p>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        banner.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Hiển thị</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Tạm ẩn</span>
                        </>
                      )}
                    </button>

                    {/* Change Image Button */}
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="bg-red-50 hover:bg-red-100 text-[#eb1c24] border border-red-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Đổi ảnh / Sửa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. MODAL THAY ẢNH / CHỈNH SỬA BANNER */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              if (!saving && !uploading) setModalOpen(false);
            }}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#eb1c24] text-white flex items-center justify-center shadow-md">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Thay Đổi Hình Ảnh & Nội Dung Banner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Vùng: <strong className="text-white">{currentZoneInfo.name}</strong> • Khung #{formData.order}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                disabled={saving || uploading}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            {(() => {
              const safeTitle = formData?.title ?? "";
              const safeLink = formData?.link ?? "";
              const safeImageUrl = formData?.imageUrl ?? "";
              const safeDescription = formData?.description ?? "";
              const safeIsActive = Boolean(formData?.isActive ?? true);

              return (
                <form onSubmit={handleSaveBanner} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
                  {/* 1. Tên banner */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tên hoặc Tiêu đề banner <span className="text-red-500">*</span>
                    </label>
                    <input
                      key="banner-title-input"
                      type="text"
                      value={safeTitle}
                      onChange={(e) => {
                        const val = e.target.value ?? "";
                        setFormData((prev) => ({ ...prev, title: val }));
                        setFormErrors((prev) => ({ ...prev, title: "" }));
                      }}
                      placeholder="Ví dụ: Banner RTX 5090 Super, Khuyến Mãi Tựu Trường 2026..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
                        formErrors.title ? "border-red-500 bg-red-50/30" : "border-slate-200"
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  {/* 2. Link chuyển hướng */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Đường dẫn chuyển hướng (Để trống nếu không muốn click chuyển trang)
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        key="banner-link-input"
                        type="text"
                        value={safeLink}
                        onChange={(e) => {
                          const val = e.target.value ?? "";
                          setFormData((prev) => ({ ...prev, link: val }));
                        }}
                        placeholder="Ví dụ: /tat-ca-san-pham, /trade-in... (hoặc để trống)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  {/* 3. Hình ảnh Banner (Upload HOẶC Dán URL) */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                        Hình ảnh Banner <span className="text-red-500">*</span>
                      </span>

                      {/* Mode Selector */}
                      <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setImageMode("upload")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            imageMode === "upload"
                              ? "bg-red-500 text-white shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Tải ảnh từ máy
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode("url")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            imageMode === "url"
                              ? "bg-red-500 text-white shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Dán link ảnh URL
                        </button>
                      </div>
                    </div>

                    {imageMode === "upload" ? (
                      <div>
                        <input
                          key="banner-file-upload-input"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-slate-300 hover:border-red-400 bg-white hover:bg-red-50/30 rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 group disabled:opacity-50"
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2 text-slate-600">
                              <div className="w-8 h-8 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                              <span className="font-bold text-xs">Đang tải ảnh lên...</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#eb1c24] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block">
                                  Bấm để chọn file ảnh mới từ máy tính
                                </span>
                                <span className="text-[11px] text-slate-400 block mt-0.5">
                                  Hỗ trợ JPG, PNG, WebP (Tối đa 10MB)
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          key="banner-url-text-input"
                          type="text"
                          value={safeImageUrl}
                          onChange={(e) => {
                            const val = e.target.value ?? "";
                            setFormData((prev) => ({ ...prev, imageUrl: val }));
                            setFormErrors((prev) => ({ ...prev, imageUrl: "" }));
                            inspectImage(val, formData.position || activeZone);
                          }}
                          placeholder="Dán đường dẫn ảnh trực tiếp (https://...)"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
                        />
                      </div>
                    )}

                    {/* Live Image Preview & Scaling Controls */}
                    {safeImageUrl && (
                      <div className="space-y-2 mt-2">
                        {/* Header bar of Preview */}
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">Xem trước khung ảnh:</span>
                            {imgMeta && (
                              <span className="text-slate-500 font-mono text-[10.5px]">
                                {imgMeta.width} × {imgMeta.height} px
                              </span>
                            )}
                          </div>

                          {/* Scale mode toggle */}
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => setPreviewFit("cover")}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                previewFit === "cover"
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                              title="Tự động phóng đầy khung web (không méo hình)"
                            >
                              Phủ khung (Cover)
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewFit("contain")}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                                previewFit === "contain"
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                              title="Xem nguyên kích thước ảnh"
                            >
                              Nguyên bản (Contain)
                            </button>
                          </div>
                        </div>

                        {/* Preview Box with Zone's native aspect ratio */}
                        <div
                          className={`relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 w-full ${
                            currentZoneInfo.id === "promo_grid"
                              ? "aspect-[3/2]"
                              : currentZoneInfo.id === "popup"
                              ? "aspect-[4/3]"
                              : currentZoneInfo.id === "product_top"
                              ? "aspect-[16/4]"
                              : "aspect-[21/9]"
                          }`}
                        >
                          <img
                            src={safeImageUrl}
                            alt="Preview"
                            className={`w-full h-full ${
                              previewFit === "cover"
                                ? "object-cover object-center"
                                : "object-contain object-center"
                            }`}
                            onError={(e) => {
                              e.currentTarget.src = "/banner.webp";
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-black/75 text-white text-[9.5px] font-bold px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                            Khung {currentZoneInfo.shortName} ({currentZoneInfo.aspectRatio})
                          </div>
                        </div>

                        {/* Warning / Success status box */}
                        {imgMeta?.warning && (
                          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">⚠️</span>
                            <span>{imgMeta.warning}</span>
                          </div>
                        )}
                        {imgMeta?.isGood && (
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                            <span>✓</span>
                            <span>Kích thước & tỉ lệ ảnh lý tưởng cho vùng {currentZoneInfo.shortName}!</span>
                          </div>
                        )}
                      </div>
                    )}

                    {formErrors.imageUrl && (
                      <p className="text-[11px] text-red-500 font-bold mt-1">{formErrors.imageUrl}</p>
                    )}
                  </div>

                  {/* 4. Switch Bật / Tắt hiển thị */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">Hiển thị banner này</span>
                      <span className="text-[11px] text-slate-400 block">
                        Bật để banner xuất hiện trực tiếp trên website
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        key="banner-is-active-checkbox"
                        type="checkbox"
                        checked={safeIsActive}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* 5. Ghi chú mô tả */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ghi chú nội bộ (Tùy chọn)
                    </label>
                    <input
                      key="banner-description-input"
                      type="text"
                      value={safeDescription}
                      onChange={(e) => {
                        const val = e.target.value ?? "";
                        setFormData((prev) => ({ ...prev, description: val }));
                      }}
                      placeholder="Ghi chú nội bộ cho chiến dịch này..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="bg-[#eb1c24] hover:bg-[#d6131b] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-500/20 hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
