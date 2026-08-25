"use client";

import { useState, useEffect } from "react";
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
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/common/ToastContext";
import { productAPI } from "@/lib/api";

export default function CreateOrderModal({ isOpen, onClose, onSubmitOrder }) {
  const { showToast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD (Thanh toán khi nhận)");
  const [status, setStatus] = useState("processing");

  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const [items, setItems] = useState([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Tải danh sách sản phẩm thật từ Database khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    const fetchRealProducts = async () => {
      setLoadingCatalog(true);
      try {
        const res = await productAPI.getAll({ limit: 100 });
        const prods = res.data?.data?.products || res.data?.products || [];
        if (Array.isArray(prods) && prods.length > 0) {
          const mapped = prods.map((p) => ({
            _id: p._id,
            id: p._id || p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id || "GEN"}`,
            price: Number(p.price) || 0,
            stock: typeof p.stock === "number" ? p.stock : 10,
            image: p.thumbnail || p.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
          }));
          setCatalogProducts(mapped);

          // Nếu danh sách items đang trống, khởi tạo bằng sản phẩm thật đầu tiên
          setItems((prev) => {
            if (prev.length === 0 && mapped.length > 0) {
              return [
                {
                  id: Date.now(),
                  _id: mapped[0]._id,
                  name: mapped[0].name,
                  sku: mapped[0].sku,
                  price: mapped[0].price,
                  quantity: 1,
                  image: mapped[0].image,
                },
              ];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục sản phẩm:", err);
      } finally {
        setLoadingCatalog(false);
      }
    };

    fetchRealProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleAddItemFromCatalog = (identifier) => {
    if (!identifier) return;
    const prod = catalogProducts.find(
      (p) => p._id === identifier || p.sku === identifier || p.id === identifier
    );
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        _id: prod._id,
        name: prod.name,
        sku: prod.sku,
        price: prod.price,
        quantity: 1,
        image: prod.image,
      },
    ]);
    setSelectedCatalogId("");
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
          _id: it._id,
          productId: it._id,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop Layer - Bấm ra ngoài để đóng */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#eb1c24] border border-red-100 shrink-0 shadow-2xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Tạo đơn hàng mới
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Chọn sản phẩm trực tiếp từ kho hàng và nhập thông tin khách
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

          {/* Section 1: Customer Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Thông tin người nhận
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

          {/* Section 2: Products from Database */}
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
                  value={selectedCatalogId}
                  onChange={(e) => handleAddItemFromCatalog(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none cursor-pointer max-w-[260px] truncate"
                >
                  <option value="">
                    {loadingCatalog ? "Đang tải sản phẩm..." : `+ Chọn từ kho (${catalogProducts.length})`}
                  </option>
                  {catalogProducts.map((p) => (
                    <option key={p._id || p.sku} value={p._id || p.sku}>
                      {p.name} — {p.price.toLocaleString("vi-VN")}₫ (Tồn: {p.stock})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tự nhập</span>
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
                        className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold shrink-0 cursor-pointer"
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
                        className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold shrink-0 cursor-pointer"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition ml-auto cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Price Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-150">
              <span className="text-xs font-bold text-slate-600">Tổng tiền hàng:</span>
              <span className="text-base font-black text-red-600">
                {totalAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          {/* Section 3: Payment & Order Status */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Phương thức & Trạng thái đơn hàng
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phương thức thanh toán</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  <option value="cod">COD (Thanh toán khi nhận hàng)</option>
                  <option value="bank_transfer">Chuyển khoản VietQR / Ngân hàng</option>
                  <option value="installment">Trả góp 0% qua thẻ tín dụng</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Trạng thái khởi tạo</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  <option value="processing">Đang xử lý (Chờ xác nhận)</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao thành công</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              className="flex items-center gap-2 rounded-xl bg-[#eb1c24] hover:bg-[#d6131b] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/20 transition cursor-pointer uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tạo đơn...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Xác nhận tạo đơn hàng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
