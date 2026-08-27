"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Plus,
  Save,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Layers,
  UploadCloud,
  Link as LinkIcon,
  Trash2,
  Star,
  Check,
  RotateCcw,
  Loader2,
  CloudUpload,
  Cpu,
  HardDrive,
  Monitor,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  CircuitBoard,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/common/ToastContext";
import { categoryAPI, brandAPI } from "@/lib/api";
import { handleImageError } from "@/lib/imageFallback";

/**
 * Tối ưu nén ảnh trước khi tải lên (Client-side compression)
 * Giảm dung lượng 90-95% (từ 5MB xuống ~150KB) giúp đồng bộ Cloudinary cực nhanh trong vài trăm mili-giây
 */
const compressImageFile = async (file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) => {
  if (!file || !file.type || !file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d", { alpha: true });
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                resolve(file);
              } else {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".webp"),
                  {
                    type: "image/webp",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              }
            },
            "image/webp",
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    } catch {
      resolve(file);
    }
  });
};

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories = [],
  brands = [],
}) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [internalCategories, setInternalCategories] = useState([]);
  const [internalBrands, setInternalBrands] = useState([]);

  // Fetch from DB if categories or brands props are empty
  useEffect(() => {
    if (!isOpen) return;

    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.allSettled([
          categories.length === 0 ? categoryAPI.getAll() : Promise.resolve(null),
          brands.length === 0 ? brandAPI.getAll() : Promise.resolve(null),
        ]);

        if (catRes.status === "fulfilled" && catRes.value) {
          const list = catRes.value.data?.data || catRes.value.data || [];
          if (Array.isArray(list)) {
            setInternalCategories(list.filter((c) => c.isActive !== false));
          }
        }

        if (brandRes.status === "fulfilled" && brandRes.value) {
          const list = brandRes.value.data?.data || brandRes.value.data || [];
          if (Array.isArray(list)) {
            setInternalBrands(list.filter((b) => b.isActive !== false));
          }
        }
      } catch (e) {
        console.warn("Lỗi load categories / brands trong modal:", e);
      }
    };

    fetchMeta();
  }, [isOpen, categories.length, brands.length]);

  // Combine passed props and internal fetched list
  const activeCategoriesSource = categories.length > 0 ? categories : internalCategories;
  const activeBrandsSource = brands.length > 0 ? brands : internalBrands;

  const categoryOptions = useMemo(() => {
    const list = [];
    const seen = new Set();

    activeCategoriesSource.forEach((c) => {
      const name = typeof c === "string" ? c.trim() : (c?.name || "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        list.push({
          id: typeof c === "object" ? c._id || c.id || name : name,
          name: name,
        });
      }
    });

    if (initialData?.category || initialData?.categoryName) {
      const initialCat = (
        initialData.categoryName ||
        (typeof initialData.category === "object"
          ? initialData.category?.name
          : initialData.category) ||
        ""
      ).trim();
      if (initialCat && !seen.has(initialCat.toLowerCase())) {
        list.unshift({ id: `initial-${initialCat}`, name: initialCat });
      }
    }

    return list;
  }, [activeCategoriesSource, initialData]);

  const brandOptions = useMemo(() => {
    const list = [];
    const seen = new Set();

    activeBrandsSource.forEach((b) => {
      const name = typeof b === "string" ? b.trim() : (b?.name || "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        list.push({
          id: typeof b === "object" ? b._id || b.id || name : name,
          name: name,
        });
      }
    });

    if (initialData?.brand) {
      const initialBrand = (initialData.brand || "").trim();
      if (initialBrand && !seen.has(initialBrand.toLowerCase())) {
        list.unshift({ id: `initial-${initialBrand}`, name: initialBrand });
      }
    }

    return list;
  }, [activeBrandsSource, initialData]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Laptop",
    brand: "ASUS",
    price: "",
    oldPrice: "",
    stock: 10,
    status: "active",
    warranty: "Bảo hành 3 - 12 Tháng",
    condition: "Mới 100%",
    specs: {
      cpu: "",
      ram: "",
      storage: "",
      gpu: "",
      screen: "",
      mainboard: "",
      psu: "",
    },
    specifications: [],
  });

  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);

  // Array of image items: { id, file, preview, url, public_id, isNew, isUrl }
  const [imageItems, setImageItems] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const selectedCategory =
        initialData.categoryName ||
        (typeof initialData.category === "object"
          ? initialData.category?.name
          : initialData.category) ||
        categoryOptions[0]?.name ||
        "Laptop";
      const selectedBrand =
        initialData.brand || brandOptions[0]?.name || "ASUS";

      const rawSpecs = initialData.specs || {};
      setFormData({
        id: initialData.id,
        _id: initialData._id,
        name: initialData.name || "",
        sku: initialData.sku || "",
        category: selectedCategory,
        brand: selectedBrand,
        price: initialData.price || "",
        oldPrice: initialData.oldPrice || initialData.originalPrice || "",
        stock: typeof initialData.stock === "number" ? initialData.stock : 10,
        status: initialData.status || "active",
        warranty: initialData.warranty || "Bảo hành 3 - 12 Tháng",
        condition: initialData.condition || "Mới 100%",
        specs: {
          cpu: rawSpecs.cpu || "",
          ram: rawSpecs.ram || "",
          storage: rawSpecs.storage || rawSpecs.ssd || "",
          gpu: rawSpecs.gpu || rawSpecs.vga || "",
          screen: rawSpecs.screen || rawSpecs.display || "",
          mainboard: rawSpecs.mainboard || "",
          psu: rawSpecs.psu || "",
        },
        specifications: Array.isArray(initialData.specifications)
          ? initialData.specifications
          : [],
      });

      if (rawSpecs.screen || initialData.warranty || (initialData.specifications && initialData.specifications.length > 0)) {
        setShowAdvancedSpecs(true);
      }

      // Parse existing images
      const initialImages = [];
      if (Array.isArray(initialData.images) && initialData.images.length > 0) {
        initialData.images.forEach((img, idx) => {
          if (typeof img === "object" && img?.url) {
            initialImages.push({
              id: `db-${idx}-${Date.now()}`,
              url: img.url,
              public_id: img.public_id || "",
              preview: img.url,
              isNew: false,
            });
          } else if (typeof img === "string" && img.trim()) {
            initialImages.push({
              id: `db-${idx}-${Date.now()}`,
              url: img,
              public_id: "",
              preview: img,
              isNew: false,
            });
          }
        });
      } else if (initialData.thumbnail || initialData.image) {
        const thumb = initialData.thumbnail || initialData.image;
        initialImages.push({
          id: `thumb-${Date.now()}`,
          url: thumb,
          public_id: "",
          preview: thumb,
          isNew: false,
        });
      }

      setImageItems(initialImages);
      setUrlInput("");
      setShowUrlInput(false);
    } else {
      setFormData({
        name: "",
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categoryOptions[0]?.name || "Laptop",
        brand: brandOptions[0]?.name || "ASUS",
        price: "",
        oldPrice: "",
        stock: 10,
        status: "active",
        warranty: "Bảo hành 3 - 12 Tháng",
        condition: "Mới 100%",
        specs: {
          cpu: "",
          ram: "",
          storage: "",
          gpu: "",
          screen: "",
          mainboard: "",
          psu: "",
        },
        specifications: [],
      });
      setImageItems([]);
      setUrlInput("");
      setShowUrlInput(false);
      setShowAdvancedSpecs(false);
    }
  }, [initialData, isOpen, categoryOptions, brandOptions]);

  const handleSpecChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: value,
      },
    }));
  };

  const handlePresetClick = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [field]: prev.specs?.[field] === value ? "" : value,
      },
    }));
  };

  const handleAddCustomSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { name: "", value: "" }],
    }));
  };

  const handleCustomSpecChange = (index, key, val) => {
    setFormData((prev) => {
      const list = [...(prev.specifications || [])];
      list[index] = { ...list[index], [key]: val };
      return { ...prev, specifications: list };
    });
  };

  const handleRemoveCustomSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
  };

  // Magic auto-extract specs from product name
  const handleAutoExtractSpecs = () => {
    const name = (formData.name || "").trim();
    if (!name) {
      showToast({
        title: "Chưa có tên sản phẩm",
        message: "Vui lòng nhập tên sản phẩm trước khi tự động nhận diện thông số!",
        type: "warning",
      });
      return;
    }

    const isM1 = name.match(/\b(Apple\s*)?M[1234]\b/i) && !name.match(/\bM1[4-9]\b/i) && !name.match(/Zephyrus/i);
    const cpu = isM1
      ? "Apple M1"
      : name.match(/\b(i[3579][-\s]\d+\w*|Ryzen\s*[3579]\s*\w+|Apple\s*M[1234]|Core\s*Ultra\s*\d\w*|Xeon\s*\w+)\b/i)?.[0] ||
      name.match(/Core\s*i[3579]\s*\w+/i)?.[0] ||
      "";
    const ram =
      name.match(/\b(\d+GB)\s*(RAM|DDR[45])?\b/i)?.[1]?.toUpperCase() ||
      name.match(/\b(\d+GB)\b/i)?.[0]?.toUpperCase() ||
      "";
    const storage =
      name.match(/(SSD\s*\d+(GB|TB)|\d+(GB|TB)\s*SSD|NVMe\s*\d+(GB|TB)|\d+(GB|TB)\s*NVMe)/i)?.[0]?.toUpperCase() ||
      (name.includes("256GB") ? "SSD 256GB" : name.includes("1TB") ? "SSD 1TB" : name.includes("512GB") ? "SSD 512GB" : "");
    const gpu =
      name.match(/(RTX\s*\d{4}(\s*Ti|\s*Super|\s*\d+GB)?|GTX\s*\d{4}(\s*Super)?|RX\s*\d{4}(\s*XT)?|Intel\s*Iris\s*Xe|Iris\s*Xe|Apple\s*GPU|Radeon\s*Graphics)/i)?.[0] ||
      "";

    // Monitor specs
    const size = name.match(/\b(\d+(\.\d+)?\s*(inch|['"]))\b/i)?.[1]?.replace(/['"]/g, " inch") || "";
    const res = name.match(/\b(4K\s*UHD|2K\s*WQHD|2K\s*QHD|2K|WQHD|QHD|FHD|1080p)\b/i)?.[0]?.toUpperCase() || "";
    const hz = name.match(/\b(\d{2,3}\s*Hz)\b/i)?.[0] || "";
    const panel = name.match(/\b(Fast\s*IPS|OLED|IPS|VA|TN)\b/i)?.[0] || "";

    // PSU specs
    const wattage = name.match(/\b(\d{3,4}\s*W)\b/i)?.[1] || "";
    const efficiency = name.match(/\b(80\s*Plus\s*(Gold|Bronze|Platinum|Silver)|80\s*Plus)\b/i)?.[0] || "";

    // Mainboard specs
    const chipset = name.match(/\b(Z790|B760M?|B650M?|H610M?|X670M?|B550M?|A620M?)\b/i)?.[0]?.toUpperCase() || "";
    const socket = name.match(/\b(LGA\s*1700|AM5|LGA\s*1200|AM4)\b/i)?.[0] || (chipset.includes("650") || chipset.includes("670") ? "AM5" : chipset ? "LGA 1700" : "");

    // Screen
    const screen = name.match(/15\.6|14|16|13\.3|17\.3/)?.[0]
      ? `${name.match(/15\.6|14|16|13\.3|17\.3/)[0]} inch FHD`
      : "";

    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        ...(cpu ? { cpu } : {}),
        ...(ram ? { ram } : {}),
        ...(storage ? { storage } : {}),
        ...(gpu ? { gpu } : {}),
        ...(size ? { size } : {}),
        ...(res ? { resolution: res } : {}),
        ...(hz ? { refreshRate: hz } : {}),
        ...(panel ? { panel } : {}),
        ...(wattage ? { wattage } : {}),
        ...(efficiency ? { efficiency } : {}),
        ...(chipset ? { chipset } : {}),
        ...(socket ? { socket } : {}),
        ...(screen ? { screen } : {}),
      },
    }));

    showToast({
      title: "Đã nhận diện thành công",
      message: "Các thuộc tính phù hợp đã được trích xuất tự động từ tên sản phẩm!",
      type: "success",
    });
  };

  if (!isOpen) return null;

  // Handle local files selection (Single or Multiple)
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      showToast({
        title: "Tệp không hợp lệ",
        message: "Vui lòng chọn các tệp hình ảnh (PNG, JPG, WebP, GIF, SVG)",
        type: "error",
      });
      return;
    }

    const newItems = validFiles.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      file: file,
      preview: URL.createObjectURL(file),
      url: "",
      public_id: "",
      isNew: true,
      name: file.name,
      size: (file.size / 1024).toFixed(0) + " KB",
    }));

    setImageItems((prev) => [...prev, ...newItems]);
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    // Reset file input so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Add image via URL
  const handleAddUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    const url = urlInput.trim();
    setImageItems((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        url: url,
        public_id: "",
        preview: url,
        isNew: false,
        isUrl: true,
      },
    ]);
    setUrlInput("");
    setShowUrlInput(false);
  };

  // Remove an image from the list
  const handleRemoveImage = (index) => {
    setImageItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Set an image as Main Thumbnail (moves it to index 0)
  const handleSetAsMain = (index) => {
    if (index === 0) return;
    setImageItems((prev) => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      return [selected, ...updated];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast({
        title: "Thiếu thông tin bắt buộc",
        message: "Vui lòng điền tên sản phẩm và giá bán hợp lệ!",
        type: "error",
      });
      return;
    }

    if (imageItems.length === 0) {
      showToast({
        title: "Chưa có hình ảnh",
        message: "Vui lòng thêm ít nhất 1 hình ảnh đại diện cho sản phẩm!",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Existing images to keep in DB
      const existingImages = imageItems
        .filter((item) => !item.isNew)
        .map((item) => ({
          url: item.url || item.preview,
          public_id: item.public_id || "",
        }));

      // Nén ảnh nhanh ở client trước khi gửi lên Cloudinary để tốc độ upload đạt cực đại (< 0.5s)
      const rawNewFiles = imageItems
        .filter((item) => item.isNew && item.file)
        .map((item) => item.file);

      const newFiles = await Promise.all(
        rawNewFiles.map((file) => compressImageFile(file))
      );

      await onSave({
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
        stock: Number(formData.stock),
        specs: formData.specs,
        warranty: formData.warranty,
        condition: formData.condition,
        specifications: (formData.specifications || []).filter(
          (s) => s.name?.trim() && s.value?.trim()
        ),
        existingImages,
        newFiles,
        thumbnail: imageItems[0]?.url || imageItems[0]?.preview || "",
      });

      onClose();
    } catch (err) {
      console.error("Lỗi khi lưu sản phẩm:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 text-[#eb1c24] border border-red-100 rounded-xl">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? "Chỉnh sửa thông tin sản phẩm" : "Thêm sản phẩm mới vào kho"}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {initialData
                  ? `Đang sửa mã: ${formData.sku}`
                  : "Điền đầy đủ thông tin, giá bán và hình ảnh sản phẩm"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section: Thông tin cơ bản */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Tên sản phẩm *</span>
                  <span className="text-[10.5px] font-normal text-slate-400">Bắt buộc</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Laptop ASUS ROG Strix SCAR 16 G634JZ"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mã SKU / Model</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-1001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <span>Danh mục sản phẩm</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
                >
                  {categoryOptions.length > 0 ? (
                    categoryOptions.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option value="Laptop">Đang tải danh mục...</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  <span>Thương hiệu</span>
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
                >
                  {brandOptions.length > 0 ? (
                    brandOptions.map((b) => (
                      <option key={b.id || b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))
                  ) : (
                    <option value="ASUS">Đang tải thương hiệu...</option>
                  )}
                </select>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  <span>Giá bán (VNĐ) *</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="15000000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-black text-red-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Giá niêm yết cũ (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                  placeholder="18000000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-500 line-through focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số lượng tồn kho *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                />
              </div>
            </div>
          </div>

          {/* Section: Thuộc tính & Thông số kỹ thuật (Tự động thích ứng theo Danh mục đã chọn) */}
          {(() => {
            const catLower = (formData.category || "").toLowerCase();
            const isMonitor = catLower.includes("màn hình") || catLower.includes("monitor");
            const isPsu = catLower.includes("nguồn") || catLower.includes("psu");
            const isMainboard = catLower.includes("mainboard") || catLower.includes("bo mạch");
            const isVga = catLower.includes("vga") || catLower.includes("card màn hình") || catLower.includes("card đồ họa");
            const isGear = catLower.includes("bàn phím") || catLower.includes("chuột") || catLower.includes("gear") || catLower.includes("tai nghe");

            let categoryBadgeType = "Laptop & Máy tính PC";
            let attributeConfigs = [];

            if (isMonitor) {
              categoryBadgeType = "Màn hình máy tính";
              attributeConfigs = [
                {
                  field: "size",
                  label: "Kích thước màn hình",
                  example: "VD: 24 inch, 27 inch",
                  icon: Monitor,
                  placeholder: "24 inch, 27 inch, 32 inch...",
                  presets: ["24 inch", "24.5 inch", "27 inch", "32 inch", "34 inch Cong"],
                },
                {
                  field: "resolution",
                  label: "Độ phân giải",
                  example: "VD: FHD 1080p, 2K QHD",
                  icon: Sparkles,
                  placeholder: "FHD (1920x1080), 2K QHD, 4K UHD...",
                  presets: ["FHD (1920x1080)", "2K QHD (2560x1440)", "4K UHD (3840x2160)", "WFHD (2560x1080)"],
                },
                {
                  field: "refreshRate",
                  label: "Tần số quét",
                  example: "VD: 100Hz, 165Hz",
                  icon: Zap,
                  placeholder: "75Hz, 144Hz, 165Hz, 240Hz...",
                  presets: ["75Hz", "100Hz", "144Hz", "165Hz", "180Hz", "240Hz", "360Hz"],
                },
                {
                  field: "panel",
                  label: "Tấm nền & Tốc độ",
                  example: "VD: Fast IPS 1ms",
                  icon: Layers,
                  placeholder: "Fast IPS 1ms, OLED, VA...",
                  presets: ["Fast IPS 1ms", "IPS 100% sRGB", "OLED 0.03ms", "VA Cong 1500R", "Rapid IPS"],
                },
              ];
            } else if (isPsu) {
              categoryBadgeType = "Nguồn máy tính (PSU)";
              attributeConfigs = [
                {
                  field: "wattage",
                  label: "Công suất danh định",
                  example: "VD: 650W, 750W",
                  icon: Zap,
                  placeholder: "550W, 650W, 750W, 850W...",
                  presets: ["550W", "650W", "750W", "850W", "1000W", "1200W"],
                },
                {
                  field: "efficiency",
                  label: "Chứng nhận hiệu suất",
                  example: "VD: 80 Plus Gold",
                  icon: ShieldCheck,
                  placeholder: "80 Plus Bronze, 80 Plus Gold...",
                  presets: ["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium", "80 Plus White"],
                },
                {
                  field: "storage",
                  label: "Kiểu thiết kế dây cáp",
                  example: "VD: Full Modular",
                  icon: Layers,
                  placeholder: "Full Modular, Semi-Modular, Dây bọc lưới...",
                  presets: ["Full Modular", "Semi-Modular", "Dây cáp bọc lưới", "Cáp dẹt đen Flat"],
                },
                {
                  field: "gpu",
                  label: "Chuẩn nguồn hỗ trợ",
                  example: "VD: ATX 3.0 & PCIe 5.0",
                  icon: CircuitBoard,
                  placeholder: "ATX 3.0 & PCIe 5.0 (Cáp 12VHPWR)...",
                  presets: ["ATX 3.0 & PCIe 5.0", "Chuẩn ATX 12V V2.52", "Chuẩn SFX"],
                },
              ];
            } else if (isMainboard) {
              categoryBadgeType = "Bo mạch chủ (Mainboard)";
              attributeConfigs = [
                {
                  field: "chipset",
                  label: "Chipset Mainboard",
                  example: "VD: Intel B760, AMD B650",
                  icon: Cpu,
                  placeholder: "Intel B760, Intel Z790, AMD B650...",
                  presets: ["Intel B760", "Intel Z790", "AMD B650", "Intel H610", "AMD X670", "AMD B550"],
                },
                {
                  field: "socket",
                  label: "Socket CPU tương thích",
                  example: "VD: LGA 1700, AM5",
                  icon: CircuitBoard,
                  placeholder: "LGA 1700, Socket AM5, LGA 1200...",
                  presets: ["LGA 1700 (Gen 12,13,14)", "Socket AM5 (Ryzen 7000/9000)", "LGA 1200", "Socket AM4"],
                },
                {
                  field: "ram",
                  label: "Chuẩn & Khe cắm RAM",
                  example: "VD: 4 Khe DDR5",
                  icon: Layers,
                  placeholder: "4 Khe DDR5, 4 Khe DDR4...",
                  presets: ["4 Khe DDR5 (Dual Channel)", "4 Khe DDR4 (Up to 3600MHz)", "2 Khe DDR4", "2 Khe DDR5"],
                },
                {
                  field: "size",
                  label: "Kích thước chuẩn (Form Factor)",
                  example: "VD: Micro-ATX (mATX)",
                  icon: Sliders,
                  placeholder: "Micro-ATX (mATX), ATX...",
                  presets: ["Micro-ATX (mATX)", "ATX Standard", "Mini-ITX", "E-ATX"],
                },
              ];
            } else if (isVga) {
              categoryBadgeType = "Card màn hình (VGA)";
              attributeConfigs = [
                {
                  field: "gpu",
                  label: "Chipset đồ họa (GPU)",
                  example: "VD: RTX 4060, RTX 4070",
                  icon: Monitor,
                  placeholder: "RTX 4060, RTX 4070 Super, RX 6600...",
                  presets: ["RTX 4060", "RTX 4060 Ti", "RTX 4070 Super", "RTX 4080 Super", "RTX 3060 12GB", "RX 6600 8GB"],
                },
                {
                  field: "ram",
                  label: "Dung lượng & Chuẩn VRAM",
                  example: "VD: 8GB GDDR6",
                  icon: Layers,
                  placeholder: "8GB GDDR6, 12GB GDDR6X...",
                  presets: ["8GB GDDR6 (128-bit)", "12GB GDDR6X (192-bit)", "16GB GDDR6X", "12GB GDDR6", "6GB GDDR6"],
                },
                {
                  field: "cooler",
                  label: "Hệ thống tản nhiệt",
                  example: "VD: 2 Quạt (Dual Fan)",
                  icon: Sparkles,
                  placeholder: "2 Quạt (Dual Fan), 3 Quạt...",
                  presets: ["2 Quạt (Dual Fan)", "3 Quạt (Triple Fan)", "1 Quạt (Single Fan)", "Tản nước AIO 240"],
                },
                {
                  field: "storage",
                  label: "Cổng xuất hình & Nguồn phụ",
                  example: "VD: 3x DP + 1x HDMI",
                  icon: CircuitBoard,
                  placeholder: "3x DP 1.4a + 1x HDMI 2.1a...",
                  presets: ["3x DP 1.4a + 1x HDMI 2.1a", "1x 8-pin PCIe", "1x 16-pin 12VHPWR"],
                },
              ];
            } else if (isGear) {
              categoryBadgeType = "Bàn phím & Chuột (Gaming Gear)";
              attributeConfigs = [
                {
                  field: "cpu",
                  label: "Loại Switch / Cảm biến",
                  example: "VD: Red Switch, Focus Pro 30K",
                  icon: Cpu,
                  placeholder: "Red Switch, Blue Switch, Focus Pro 30K...",
                  presets: ["Red Switch (Linear êm)", "Blue Switch (Clicky giòn)", "Brown Switch (Tactile)", "Cảm biến Focus Pro 30K", "Hero 25K"],
                },
                {
                  field: "ram",
                  label: "Chuẩn kết nối",
                  example: "VD: 3 Mode (Wireless / Bluetooth)",
                  icon: Zap,
                  placeholder: "Không dây 3 mode, 2.4GHz, Type-C...",
                  presets: ["3 Mode (Bluetooth 5.1 / 2.4GHz / Type-C)", "Không dây Wireless 2.4GHz", "Dây cáp Type-C tháo rời"],
                },
                {
                  field: "storage",
                  label: "Hệ thống LED",
                  example: "VD: RGB 16.8 triệu màu",
                  icon: Sparkles,
                  placeholder: "RGB 16.8M màu, LED Đơn sắc...",
                  presets: ["RGB 16.8 triệu màu Per-Key", "LED Đơn sắc Trắng", "Không LED", "LED ARGB đa hiệu ứng"],
                },
                {
                  field: "gpu",
                  label: "Chất liệu / Trọng lượng",
                  example: "VD: Khung nhôm CNC, Siêu nhẹ 54g",
                  icon: Layers,
                  placeholder: "Khung nhôm CNC, Keycap PBT, Siêu nhẹ 54g...",
                  presets: ["Khung nhôm CNC, Keycap PBT", "Vỏ nhựa ABS cao cấp", "Siêu nhẹ 54g", "Trọng lượng 60g"],
                },
              ];
            } else {
              categoryBadgeType = "Laptop & Máy tính PC";
              attributeConfigs = [
                {
                  field: "cpu",
                  label: "CPU / Bộ vi xử lý",
                  example: "VD: I5 12450HX, I7 13700H",
                  icon: Cpu,
                  placeholder: "I5 12450HX, Ryzen 5 7600X, Apple M3...",
                  presets: ["I5 12450HX", "I7 13700H", "I5 13400F", "I7 14700K", "Ryzen 5 7600", "Core Ultra 7", "Apple M3"],
                },
                {
                  field: "ram",
                  label: "RAM / Bộ nhớ trong",
                  example: "VD: 12GB, 16GB",
                  icon: Layers,
                  placeholder: "8GB, 12GB, 16GB, 32GB DDR5...",
                  presets: ["8GB", "12GB", "16GB", "32GB", "64GB", "16GB DDR5", "32GB DDR5"],
                },
                {
                  field: "storage",
                  label: "Ổ cứng (SSD / HDD)",
                  example: "VD: SSD 512GB",
                  icon: HardDrive,
                  placeholder: "SSD 256GB, SSD 512GB, SSD 1TB...",
                  presets: ["SSD 256GB", "SSD 512GB", "SSD 1TB", "SSD 2TB", "512GB NVMe", "1TB NVMe"],
                },
                {
                  field: "gpu",
                  label: "Card đồ họa / VGA (GPU)",
                  example: "VD: RTX 3050",
                  icon: Monitor,
                  placeholder: "RTX 3050, RTX 4060, Intel Iris Xe...",
                  presets: ["RTX 3050", "RTX 4050", "RTX 4060", "RTX 4070", "GTX 1650", "Intel Iris Xe", "Onboard"],
                },
              ];
            }

            return (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg">
                      <Sliders className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900">
                          Thuộc tính & Thông số cấu hình
                        </h4>
                        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                          {categoryBadgeType}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500">
                        Tự động hiển thị các thuộc tính phù hợp theo danh mục <strong className="text-slate-700">{formData.category}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Adaptive Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {attributeConfigs.map((attr) => {
                    const IconComp = attr.icon;
                    const currentValue = formData.specs?.[attr.field] || "";
                    return (
                      <div key={attr.field} className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <IconComp className="h-3.5 w-3.5 text-[#eb1c24]" />
                            <span>{attr.label}</span>
                          </label>
                          <span className="text-[10px] text-slate-400 font-mono">{attr.example}</span>
                        </div>
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => handleSpecChange(attr.field, e.target.value)}
                          placeholder={attr.placeholder}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
                        />
                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {attr.presets.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handlePresetClick(attr.field, val)}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition cursor-pointer ${currentValue === val
                                ? "bg-red-600 text-white border-red-600 shadow-2xs font-bold"
                                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900"
                                }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Collapsible Section: Additional Specs & Custom Attributes */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedSpecs((prev) => !prev)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    <span>{showAdvancedSpecs ? "Thu gọn thông số bổ sung" : "Mở rộng thông số bổ sung (Màn hình, Bảo hành, Tình trạng, Tùy chỉnh...)"}</span>
                    {showAdvancedSpecs ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {showAdvancedSpecs && (
                    <div className="mt-3 space-y-4 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-slate-400" />
                            <span>Màn hình / Kích thước</span>
                          </label>
                          <input
                            type="text"
                            value={formData.specs?.screen || ""}
                            onChange={(e) => handleSpecChange("screen", e.target.value)}
                            placeholder='15.6" FHD 144Hz IPS...'
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-slate-400" />
                            <span>Bảo hành</span>
                          </label>
                          <input
                            type="text"
                            value={formData.warranty || ""}
                            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                            placeholder="Bảo hành 3 - 12 Tháng"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <Tag className="h-3 w-3 text-slate-400" />
                            <span>Tình trạng</span>
                          </label>
                          <input
                            type="text"
                            value={formData.condition || ""}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                            placeholder="Mới 100%, Like New 99%..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                          />
                        </div>
                      </div>

                      {/* Custom Key-Value Specification Pairs */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700">
                            Thuộc tính tùy chỉnh mở rộng:
                          </span>
                          <button
                            type="button"
                            onClick={handleAddCustomSpec}
                            className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Thêm dòng thuộc tính</span>
                          </button>
                        </div>

                        {formData.specifications && formData.specifications.length > 0 ? (
                          <div className="space-y-2">
                            {formData.specifications.map((spec, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={spec.name}
                                  onChange={(e) => handleCustomSpecChange(sIdx, "name", e.target.value)}
                                  placeholder="Tên thuộc tính (VD: Trọng lượng)"
                                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                                />
                                <input
                                  type="text"
                                  value={spec.value}
                                  onChange={(e) => handleCustomSpecChange(sIdx, "value", e.target.value)}
                                  placeholder="Giá trị (VD: 1.8 kg)"
                                  className="w-1/2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCustomSpec(sIdx)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
                                  title="Xóa dòng"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10.5px] text-slate-400 italic">
                            Chưa có thuộc tính mở rộng nào. Nhấn &quot;Thêm dòng thuộc tính&quot; để bổ sung thêm thông số nếu cần.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Section: Upload ảnh Cloudinary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <CloudUpload className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Hình ảnh sản phẩm (Cloudinary)
                  </h4>
                  <p className="text-[10.5px] text-slate-500">
                    Chọn nhiều ảnh cùng lúc, ảnh đầu tiên sẽ làm ảnh đại diện chính
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Chọn ảnh từ máy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((prev) => !prev)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Dán URL</span>
                </button>
              </div>
            </div>

            {/* Hidden multi-file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* URL Input Bar */}
            {showUrlInput && (
              <div className="flex gap-2 p-2 bg-white rounded-xl border border-slate-200 animate-in fade-in duration-150">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Dán đường dẫn ảnh URL (https://...)"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Thêm
                </button>
              </div>
            )}

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition cursor-pointer ${isDragging
                ? "border-red-500 bg-red-50/50"
                : "border-slate-300 bg-white hover:border-red-500 hover:bg-red-50/20"
                }`}
            >
              <div className="p-2.5 bg-slate-100 group-hover:bg-red-50 text-slate-500 group-hover:text-red-600 rounded-2xl transition mb-1.5">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Kéo thả nhiều ảnh vào đây hoặc nhấp để chọn tệp
              </p>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                Hỗ trợ PNG, JPG, WebP, GIF (Sẽ được tải lên Cloudinary an toàn)
              </p>
            </div>

            {/* Images Grid Preview */}
            {imageItems.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>
                    Danh sách ảnh đã chọn ({imageItems.length})
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Nhấp vào biểu tượng ⭐ để chọn ảnh làm ảnh đại diện
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageItems.map((item, idx) => {
                    const isMain = idx === 0;
                    return (
                      <div
                        key={item.id || idx}
                        className={`group relative rounded-xl border p-2 bg-white overflow-hidden shadow-2xs transition flex flex-col ${isMain
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10"
                          : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                          {isMain ? (
                            <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs uppercase tracking-wider">
                              <Star className="h-3 w-3 fill-white" />
                              <span>Ảnh chính</span>
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
                              #{idx + 1}
                            </span>
                          )}

                          {item.isNew && (
                            <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                              Mới
                            </span>
                          )}
                        </div>

                        {/* Image Preview Box */}
                        <div className="relative aspect-square w-full rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                          <img
                            src={item.preview || item.url}
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-contain"
                            onError={handleImageError}
                          />

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {!isMain && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetAsMain(idx);
                                }}
                                className="p-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-amber-500 transition cursor-pointer"
                                title="Đặt làm ảnh đại diện chính"
                              >
                                <Star className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="p-1.5 rounded-lg bg-white/20 hover:bg-red-600 text-white transition cursor-pointer"
                              title="Xóa ảnh này"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* File info footer */}
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 truncate px-0.5">
                          <span className="truncate max-w-[100px]">
                            {item.name || (item.url ? "Link ảnh" : `Ảnh ${idx + 1}`)}
                          </span>
                          {item.size && (
                            <span className="text-slate-400">{item.size}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic text-center py-2">
                Chưa có hình ảnh nào. Vui lòng tải ảnh từ máy tính hoặc dán link URL.
              </p>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-150">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/20 transition cursor-pointer active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{initialData ? "Đang lưu thay đổi..." : "Đang tạo sản phẩm..."}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{initialData ? "Lưu thay đổi" : "Thêm vào danh sách"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
