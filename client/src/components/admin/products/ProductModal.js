"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { useToast } from "@/components/common/ToastContext";

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
          const ctx = canvas.getContext("2d");
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

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Laptop",
    brand: "ASUS",
    price: "",
    oldPrice: "",
    stock: 10,
    status: "active",
  });

  // Array of image items: { id, file, preview, url, public_id, isNew, isUrl }
  const [imageItems, setImageItems] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        _id: initialData._id,
        name: initialData.name || "",
        sku: initialData.sku || "",
        category: initialData.category || "Laptop",
        brand: initialData.brand || "ASUS",
        price: initialData.price || "",
        oldPrice: initialData.oldPrice || "",
        stock: typeof initialData.stock === "number" ? initialData.stock : 10,
        status: initialData.status || "active",
      });

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
        category: categories[0]?.name || "Laptop",
        brand: brands[0] || "ASUS",
        price: "",
        oldPrice: "",
        stock: 10,
        status: "active",
      });
      setImageItems([]);
      setUrlInput("");
      setShowUrlInput(false);
    }
  }, [initialData, isOpen, categories, brands]);

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
                  <option value="Laptop">Laptop / Notebook</option>
                  <option value="Laptop Gaming">Laptop Gaming</option>
                  <option value="PC Gaming">PC Gaming / Workstation</option>
                  <option value="Màn hình máy tính">Màn hình máy tính</option>
                  <option value="VGA - Card màn hình">VGA - Card màn hình</option>
                  <option value="CPU - Bộ vi xử lý">CPU - Bộ vi xử lý</option>
                  <option value="Mainboard - Bo mạch chủ">Mainboard - Bo mạch chủ</option>
                  <option value="RAM - Bộ nhớ trong">RAM - Bộ nhớ trong</option>
                  <option value="Ổ cứng HDD - SSD">Ổ cứng HDD - SSD</option>
                  <option value="Linh kiện PC">Linh kiện & Phụ kiện Gaming</option>
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
                  <option value="ASUS">ASUS</option>
                  <option value="MSI">MSI</option>
                  <option value="GIGABYTE">GIGABYTE</option>
                  <option value="DELL">DELL</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Acer">Acer</option>
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                  <option value="Corsair">Corsair</option>
                  <option value="Kingston">Kingston</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Logitech">Logitech</option>
                  <option value="Razer">Razer</option>
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
              className={`group flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition cursor-pointer ${
                isDragging
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
                        className={`group relative rounded-xl border p-2 bg-white overflow-hidden shadow-2xs transition flex flex-col ${
                          isMain
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
