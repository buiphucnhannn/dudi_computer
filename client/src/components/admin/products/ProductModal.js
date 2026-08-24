"use client";

import { useState, useEffect } from "react";
import { X, Plus, Save, Package, Image as ImageIcon, Tag, DollarSign, Layers } from "lucide-react";
import { useToast } from "@/components/common/ToastContext";

export default function ProductModal({ isOpen, onClose, onSave, initialData, categories = [], brands = [] }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Laptop",
    brand: "ASUS",
    price: "",
    oldPrice: "",
    stock: 10,
    badge: "",
    status: "active",
    image: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        sku: initialData.sku || "",
        category: initialData.category || "Laptop",
        brand: initialData.brand || "ASUS",
        price: initialData.price || "",
        oldPrice: initialData.oldPrice || "",
        stock: typeof initialData.stock === "number" ? initialData.stock : 10,
        badge: initialData.badge || "",
        status: initialData.status || "active",
        image: initialData.image || initialData.thumbnail || "",
      });
    } else {
      setFormData({
        name: "",
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories[0]?.name || "Laptop",
        brand: brands[0] || "ASUS",
        price: "",
        oldPrice: "",
        stock: 10,
        badge: "MỚI",
        status: "active",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      });
    }
  }, [initialData, isOpen, categories, brands]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast({
        title: "Thiếu thông tin bắt buộc",
        message: "Vui lòng điền tên sản phẩm và giá bán hợp lệ!",
        type: "error",
      });
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock),
      image: formData.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? "Chỉnh sửa thông tin sản phẩm" : "Thêm sản phẩm mới vào kho"}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {initialData ? `Đang sửa mã: ${formData.sku}` : "Điền đầy đủ thông số kỹ thuật và hình ảnh sản phẩm"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Name & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Tên sản phẩm *
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Mã SKU / Model
              </label>
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                <span>Giá khuyến mãi (VNĐ) *</span>
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Giá niêm yết cũ (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                placeholder="18000000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-500 line-through focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Số lượng tồn kho *
              </label>
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

          {/* Badge & Image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Huy hiệu nổi bật
              </label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition cursor-pointer"
              >
                <option value="">Không có</option>
                <option value="MỚI">MỚI</option>
                <option value="-15%">-15%</option>
                <option value="-20%">-20%</option>
                <option value="HOT">HOT SALE</option>
                <option value="BEST SELLER">BEST SELLER</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Đường dẫn ảnh sản phẩm (URL)</span>
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
              />
            </div>
          </div>

          {/* Image preview */}
          {formData.image && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 bg-slate-50">
              <div className="w-16 h-16 rounded-lg bg-white overflow-hidden border border-slate-200 flex items-center justify-center p-1 shrink-0">
                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate">
                Xem trước ảnh minh họa sản phẩm
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-150">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-slate-800 transition cursor-pointer active:scale-98"
            >
              <Save className="h-4 w-4" />
              <span>{initialData ? "Lưu thay đổi" : "Thêm vào danh sách"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
