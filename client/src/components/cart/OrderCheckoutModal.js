"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  X,
  CheckCircle2,
  Phone,
  MessageCircle,
  CreditCard,
  Truck,
  QrCode,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { orderAPI } from "@/lib/api";
import { formatVND } from "@/lib/utils";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";

export default function OrderCheckoutModal({
  isOpen,
  onClose,
  items = [],
  onOrderSuccess,
  prefilledProduct = null,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Determine the active product list
  const activeItems = prefilledProduct
    ? [
        {
          _id: prefilledProduct._id || prefilledProduct.id,
          id: prefilledProduct._id || prefilledProduct.id,
          product: prefilledProduct._id || prefilledProduct.id,
          name: prefilledProduct.name,
          slug: prefilledProduct.slug,
          price: prefilledProduct.price || 0,
          thumbnail: prefilledProduct.thumbnail || (prefilledProduct.images && prefilledProduct.images[0]) || "",
          quantity: prefilledProduct.quantity || 1,
        },
      ]
    : items;

  const totalAmount = activeItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // Autofill user info if logged in or redirect to login if unauthenticated
  useEffect(() => {
    if (isOpen) {
      if (!isAuthenticated) {
        showToast({
          title: "Yêu cầu đăng nhập",
          message: "Vui lòng đăng nhập để tiến hành đặt hàng.",
          type: "warning",
        });
        onClose();
        const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/cart";
        router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      setCreatedOrder(null);
      setErrors({});
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser?.name || prev.fullName || "",
        phone: currentUser?.phone || prev.phone || "",
        email: currentUser?.email || prev.email || "",
        address: currentUser?.address || prev.address || "",
      }));
    }
  }, [isOpen, currentUser, isAuthenticated]);

  if (!isOpen || !isAuthenticated) return null;

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+ ]{9,15}$/.test(formData.phone.trim())) {
      errs.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.address.trim()) errs.address = "Vui lòng nhập địa chỉ nhận hàng";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      showToast({
        title: "Yêu cầu đăng nhập",
        message: "Vui lòng đăng nhập để tiến hành đặt hàng.",
        type: "warning",
      });
      onClose();
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
      return;
    }

    if (!validate()) return;
    if (activeItems.length === 0) return;

    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        customerName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        note: formData.note.trim(),
        paymentMethod: formData.paymentMethod,
        items: activeItems.map((it) => ({
          product: it._id || it.id || it.product,
          _id: it._id || it.id || it.product,
          slug: it.slug,
          name: it.name,
          price: it.price,
          quantity: it.quantity || 1,
          thumbnail: it.thumbnail || it.image || "",
        })),
        totalAmount,
      };

      const res = await orderAPI.create(payload);
      const newOrder = res.data?.data;

      if (newOrder) {
        setCreatedOrder(newOrder);
        if (onOrderSuccess) {
          onOrderSuccess(newOrder);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      const apiMsg = err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!";
      setErrors({ api: apiMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdOrder?.orderCode) {
      navigator.clipboard.writeText(createdOrder.orderCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const paymentOptions = [
    {
      id: "cod",
      title: "Thanh toán khi nhận hàng (COD)",
      desc: "Kiểm tra hàng trước khi thanh toán tiền mặt",
      icon: Truck,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "banking",
      title: "Chuyển khoản QR (VietQR / Internet Banking)",
      desc: "Xác nhận nhanh 24/7 qua mã QR ngân hàng",
      icon: QrCode,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 cursor-default my-6 max-h-[92vh] flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#dc2626] text-white rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base uppercase tracking-wide">
                {createdOrder ? "ĐẶT HÀNG THÀNH CÔNG" : "TIẾN HÀNH ĐẶT HÀNG"}
              </h2>
              <p className="text-[11px] text-slate-300 font-medium">
                {createdOrder
                  ? "Đơn hàng của bạn đã được ghi nhận vào hệ thống"
                  : `Đang xử lý ${activeItems.length} sản phẩm`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800 text-xs sm:text-sm">
          {!createdOrder ? (
            /* ================= STEP 1: CHECKOUT FORM ================= */
            <form onSubmit={handleCreateOrder} className="space-y-5">
              {errors.api && (
                <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium text-xs">
                  {errors.api}
                </div>
              )}

              {/* 1. Items Preview */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Sản phẩm đặt mua ({activeItems.length})
                </span>

                <div className="divide-y divide-slate-200/80 max-h-48 overflow-y-auto pr-1">
                  {activeItems.map((item, idx) => (
                    <div
                      key={item._id || item.id || idx}
                      className="py-2 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                          <img
                            src={item.thumbnail || "/images/dudi/dudisoftware1.png"}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 truncate max-w-[280px] sm:max-w-md">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Số lượng: <strong>x{item.quantity || 1}</strong>
                          </span>
                        </div>
                      </div>

                      <span className="font-black text-slate-900 shrink-0">
                        {formatVND((item.price || 0) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Customer Information Form */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Thông tin nhận hàng
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Họ và tên người nhận <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? "border-red-400 focus:ring-red-500/20"
                          : "border-slate-200 focus:ring-slate-900/10"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 font-medium mt-0.5">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Số điện thoại <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Ví dụ: 0901234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? "border-red-400 focus:ring-red-500/20"
                          : "border-slate-200 focus:ring-slate-900/10"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 font-medium mt-0.5">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Email nhận thông báo đơn hàng (không bắt buộc)
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Địa chỉ nhận hàng chi tiết <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 ${
                      errors.address
                        ? "border-red-400 focus:ring-red-500/20"
                        : "border-slate-200 focus:ring-slate-900/10"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-600 font-medium mt-0.5">{errors.address}</p>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Ghi chú cho shipper / Yêu cầu lắp ráp
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              {/* 3. Payment Method Options */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Phương thức thanh toán
                </span>

                <div className="space-y-2">
                  {paymentOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = formData.paymentMethod === opt.id;

                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-slate-900 bg-slate-50/80 ring-2 ring-slate-900/10 shadow-xs"
                            : "border-slate-200 hover:bg-slate-50/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, paymentMethod: opt.id })}
                          className="mt-1 text-slate-900 focus:ring-slate-900"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {opt.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Total Price & Action Button */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Tạm tính:</span>
                  <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Phí vận chuyển:</span>
                  <span className="font-bold text-emerald-600">Miễn phí</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-150">
                  <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-[#dc2626]">
                    {formatVND(totalAmount)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-slate-300 text-white py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-98 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <span>XÁC NHẬN ĐẶT HÀNG</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ================= STEP 2: ORDER SUCCESS SCREEN ================= */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="text-center py-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  ĐẶT HÀNG THÀNH CÔNG!
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Đơn hàng của quý khách đã được lưu vào hệ thống và đang được xử lý.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      MÃ ĐƠN HÀNG
                    </span>
                    <strong className="text-sm font-black text-slate-900">
                      #{createdOrder.orderCode}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Đang xử lý
                    </span>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Người nhận:</span>
                    <span className="font-bold text-slate-900">
                      {createdOrder.customerInfo?.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Số điện thoại:</span>
                    <span className="font-bold text-slate-900">
                      {createdOrder.customerInfo?.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-500 font-medium shrink-0">Địa chỉ giao:</span>
                    <span className="font-medium text-slate-800 text-right">
                      {createdOrder.customerInfo?.address}
                    </span>
                  </div>
                </div>

                {/* Items & Total */}
                <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Chi tiết sản phẩm
                  </span>

                  {createdOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-medium">
                      <span className="truncate max-w-[280px] text-slate-700">
                        {it.name} <strong className="text-slate-900">x{it.quantity}</strong>
                      </span>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatVND(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Tổng tiền:</span>
                    <span className="text-base sm:text-lg font-black text-[#dc2626]">
                      {formatVND(createdOrder.finalAmount || createdOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* VietQR Bank Transfer Guide if Banking */}
              {createdOrder.paymentMethod === "banking" && (
                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>Hướng dẫn thanh toán chuyển khoản VietQR</span>
                  </div>
                  <div className="space-y-1 text-slate-700 font-medium">
                    <p>• Ngân hàng: <strong>MB BANK (Quân Đội)</strong></p>
                    <p>• Số tài khoản: <strong>0909 163 821</strong></p>
                    <p>• Chủ tài khoản: <strong>ZCOMPUTER - DUDI SOFTWARE</strong></p>
                    <p>• Nội dung chuyển khoản: <strong>{createdOrder.orderCode}</strong></p>
                  </div>
                </div>
              )}

              {/* Post-Order Support (Zalo / Hotline) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-slate-900 block">
                    Cần hỗ trợ gấp về đơn hàng?
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Đội ngũ kỹ thuật viên ZComputer sẵn sàng hỗ trợ bạn 24/7.
                  </span>
                </div>

                <a
                  href={`https://zalo.me/2871243904030074512?text=${encodeURIComponent(
                    `Xin chào ZComputer, tôi muốn kiểm tra tình trạng đơn hàng #${createdOrder.orderCode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-[#0068ff] hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hỗ trợ qua Zalo</span>
                </a>
              </div>

              {/* Close / Continue Shopping Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition cursor-pointer"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
