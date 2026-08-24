"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Package,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/components/common/ToastContext";

export const CATALOG_PRODUCTS = [
  {
    sku: "ROG-STRIX-4090",
    name: "Card ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC",
    price: 54900000,
    image: "https://dlcdnwebimgs.asus.com/gain/9EFB3AE5-86A5-4299-8D75-9AC4FDF2FFC9/w800",
  },
  {
    sku: "BX8071514900K",
    name: "CPU Intel Core i9-14900K 24 nhân 32 luồng up to 6.0GHz",
    price: 14500000,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "AMD-7800X3D",
    name: "CPU AMD Ryzen 7 7800X3D 3D V-Cache 96MB",
    price: 9900000,
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "LAPMSI-892",
    name: "Laptop MSI Titan GT77 HX 13VI (Core i9 / 64GB / RTX 4090)",
    price: 119990000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "ASU-TUF-A15",
    name: "Laptop Asus TUF Gaming A15 FA507NV (Ryzen 7 / 16GB / RTX 4060)",
    price: 24990000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "PCGAMING-001",
    name: "PC Gaming DUDI Master Core i5 13400F / RTX 4060 8GB",
    price: 18590000,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "SAM-G5-G50D",
    name: "Màn hình Gaming Samsung Odyssey G5 G50D 27 inch 2K 180Hz",
    price: 5690000,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80",
  },
  {
    sku: "LOG-GPX-SL2",
    name: "Chuột Gaming Không Dây Logitech G Pro X Superlight 2",
    price: 3200000,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
  },
];

export default function CreateOrderModal({ isOpen, onClose, onSubmitOrder }) {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD (Thanh toán khi nhận)");
  const [status, setStatus] = useState("processing");

  const [items, setItems] = useState([
    {
      id: Date.now(),
      name: CATALOG_PRODUCTS[5].name,
      sku: CATALOG_PRODUCTS[5].sku,
      price: CATALOG_PRODUCTS[5].price,
      quantity: 1,
      image: CATALOG_PRODUCTS[5].image,
    },
  ]);

  const [selectedCatalogSku, setSelectedCatalogSku] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleAddItemFromCatalog = (sku) => {
    if (!sku) return;
    const prod = CATALOG_PRODUCTS.find((p) => p.sku === sku);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: prod.name,
        sku: prod.sku,
        price: prod.price,
        quantity: 1,
        image: prod.image,
      },
    ]);
    setSelectedCatalogSku("");
  };

  const handleAddCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: "",
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        price: 1000000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
      },
    ]);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      showToast({
        title: "Không thể xóa",
        message: "Đơn hàng phải có ít nhất 1 sản phẩm!",
        type: "error",
      });
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Vui lòng điền họ tên khách hàng!");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Vui lòng điền số điện thoại khách hàng!");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Vui lòng điền địa chỉ nhận hàng!");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 sản phẩm vào đơn hàng!");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].name.trim()) {
        setErrorMsg(`Sản phẩm thứ ${i + 1} chưa có tên sản phẩm!`);
        return;
      }
      if (Number(items[i].price) < 0) {
        setErrorMsg(`Đơn giá sản phẩm thứ ${i + 1} không hợp lệ!`);
        return;
      }
      if (Number(items[i].quantity) < 1) {
        setErrorMsg(`Số lượng sản phẩm thứ ${i + 1} phải từ 1 trở lên!`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        note: note.trim(),
        paymentMethod,
        status,
        items: items.map((it) => ({
          name: it.name.trim(),
          sku: it.sku || "SKU-GEN",
          price: Number(it.price),
          quantity: Number(it.quantity) || 1,
          image: it.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
        })),
        totalAmount,
      };

      await onSubmitOrder?.(orderPayload);
      onClose();
    } catch (err) {
      console.error("Failed to submit order:", err);
      setErrorMsg("Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0 shadow-2xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Tạo đơn hàng mới (Admin tự điền)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Nhập thông tin khách hàng, cấu hình sản phẩm và giá trị đơn hàng
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Thông tin người nhận hàng
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>Họ tên khách hàng <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Anh Quân"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>Số điện thoại <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>Email (tuỳ chọn)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ví dụ: customer@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>Địa chỉ giao hàng <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: 123 Nguyễn Thị Minh Khai, Q.1, TP.HCM"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span>Ghi chú đơn hàng</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          {/* Section 2: Products */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  2. Danh sách sản phẩm ({items.length})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCatalogSku}
                  onChange={(e) => handleAddItemFromCatalog(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="">+ Chọn từ kho mẫu</option>
                  {CATALOG_PRODUCTS.map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} ({p.price.toLocaleString("vi-VN")}₫)
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm dòng</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 shrink-0 w-5">
                    #{idx + 1}
                  </span>

                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Item Name */}
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        required
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, "name", e.target.value)}
                        placeholder="Tên sản phẩm / Linh kiện *"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="10000"
                          value={item.price}
                          onChange={(e) =>
                            handleUpdateItem(item.id, "price", Number(e.target.value))
                          }
                          placeholder="Đơn giá"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 focus:bg-white focus:outline-none"
                        />
                        <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">
                          ₫
                        </span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateItem(item.id, "quantity", Math.max(1, (Number(item.quantity) || 1) - 1))
                        }
                        className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold shrink-0"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, "quantity", Math.max(1, Number(e.target.value)))
                        }
                        className="w-12 text-center rounded-lg border border-slate-200 py-1.5 text-xs font-bold text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateItem(item.id, "quantity", (Number(item.quantity) || 1) + 1)
                        }
                        className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold shrink-0"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center shrink-0 ml-auto"
                        title="Xóa sản phẩm này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Status & Payment Method */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Thanh toán & Trạng thái khởi tạo
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="COD (Thanh toán khi nhận)">COD (Thanh toán khi nhận)</option>
                  <option value="Chuyển khoản QR (VietQR)">Chuyển khoản QR (VietQR)</option>
                  <option value="Tiền mặt tại quầy">Tiền mặt tại quầy</option>
                  <option value="VNPay Online">VNPay Online</option>
                  <option value="Thẻ tín dụng Visa/Mastercard">Thẻ tín dụng Visa/Mastercard</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Trạng thái đơn hàng</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="processing">Chờ xử lý (Chờ xác nhận)</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grand Total Summary */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Tổng số lượng mặt hàng:</span>
              <span className="font-bold text-slate-800">
                {items.reduce((s, i) => s + (Number(i.quantity) || 1), 0)} sản phẩm
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tổng giá trị đơn hàng:
              </span>
              <span className="text-xl font-black text-red-600">
                {totalAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>{isSubmitting ? "Đang tạo đơn..." : "Xác nhận tạo đơn hàng"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
