"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Phone,
  MessageCircle,
  MessageSquare,
  X,
} from "lucide-react";
import {
  selectCartItems,
  selectTotalPrice,
  selectTotalItems,
  updateQuantityAsync,
  removeFromCartAsync,
  clearCartAsync,
  loadCartFromStorage,
} from "@/redux/slices/cartSlice";
import { formatVND } from "@/lib/utils";

export default function CartWishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const totalItems = useSelector(selectTotalItems);

  useEffect(() => {
    setMounted(true);
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  // Đóng modal bằng phím Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showOrderModal) {
        setShowOrderModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOrderModal]);

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantityAsync({ productId: item._id, quantity: item.quantity - 1 })
      );
    } else {
      dispatch(removeFromCartAsync(item._id));
    }
  };

  const handleIncrease = (item) => {
    dispatch(
      updateQuantityAsync({ productId: item._id, quantity: item.quantity + 1 })
    );
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCartAsync(productId));
  };

  if (!mounted) {
    return (
      <div className="bg-[#f8f9fa] min-h-[65vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#dc2626] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8 sm:py-12">
      {/* Khung rộng vừa vặn max-w-[1180px] chuẩn đẹp */}
      <div className="w-full max-w-[1180px] mx-auto px-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#dc2626] bg-red-50 hover:bg-[#dc2626] hover:text-white px-3.5 py-1.5 rounded-md transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[28px] font-black text-gray-900 uppercase tracking-tight mb-7">
          SẢN PHẨM QUAN TÂM
        </h1>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-2xs border border-gray-200 py-16 sm:py-20 px-4 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Danh sách sản phẩm đang trống
            </h2>
            <p className="text-gray-500 text-sm mb-7 max-w-md mx-auto">
              Hãy tìm thêm những sản phẩm công nghệ bạn yêu thích nhé.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#dc2626] text-white px-8 py-2.5 rounded-md font-bold hover:bg-[#b91c1c] transition-colors uppercase tracking-wider text-xs sm:text-sm shadow-sm"
            >
              TIẾP TỤC MUA SẮM
            </Link>
          </div>
        ) : (
          /* Has Items: 2 Columns Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Product List (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-lg shadow-2xs border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 bg-gray-50/70 border-b border-gray-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-600">
                <span className="w-[50%]">Sản phẩm</span>
                <span className="w-[25%] text-center">Số lượng</span>
                <span className="w-[25%] text-right">Thành tiền</span>
              </div>

              {/* Product Rows */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 w-full sm:w-[50%]">
                      <div className="w-20 h-20 bg-white rounded-md border border-gray-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={
                            item.thumbnail ||
                            "https://zcomputer.vn/logo-main.png"
                          }
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/product-detail?slug=${encodeURIComponent(item.slug || item._id || item.id || "")}`}
                          className="text-xs sm:text-sm font-bold text-gray-800 hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs sm:text-sm font-bold text-[#dc2626] mt-1">
                          {formatVND(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-[25%]">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black font-bold text-sm transition-colors cursor-pointer"
                          aria-label="Giảm số lượng"
                        >
                          -
                        </button>
                        <span className="w-9 sm:w-10 text-center text-xs sm:text-sm font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-black font-bold text-sm transition-colors cursor-pointer"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium sm:mt-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="w-full sm:w-[25%] text-right flex sm:block justify-between items-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50">
                      <span className="sm:hidden text-xs text-gray-500 font-medium">
                        Tổng:
                      </span>
                      <strong className="text-sm sm:text-base font-bold text-gray-900">
                        {formatVND(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-lg shadow-2xs border border-gray-200 p-6 sticky top-24">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tạm tính</span>
                  <strong className="font-semibold text-gray-800">
                    {formatVND(totalPrice)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-700">Liên hệ</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    (Đã bao gồm VAT nếu có)
                  </p>
                </div>
                <span className="text-xl sm:text-2xl font-black text-[#dc2626]">
                  {formatVND(totalPrice)}
                </span>
              </div>

              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3.5 px-4 rounded-md font-bold uppercase tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 cursor-pointer mt-6"
              >
                <span>NHẬN BÁO GIÁ / ĐẶT HÀNG</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal: LIÊN HỆ ĐỂ MUA HÀNG */}
        {showOrderModal && (
          <div
            onClick={() => setShowOrderModal(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 cursor-default"
            >
              {/* Modal Red Header */}
              <div className="bg-[#dc2626] text-white px-5 py-3.5 flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-[15px] uppercase tracking-wide">
                  LIÊN HỆ ĐỂ MUA HÀNG
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                  aria-label="Đóng modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs sm:text-[13px] text-gray-600 text-center leading-relaxed">
                  Để mua hàng hoặc nhận báo giá chi tiết cho{" "}
                  <strong className="text-[#dc2626] font-bold">
                    {totalItems}
                  </strong>{" "}
                  sản phẩm bạn đã chọn, vui lòng liên hệ với chúng tôi qua các kênh
                  sau:
                </p>

                {/* Option 1: Hotline (Không kích hoạt cuộc gọi khi nhấn) */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3.5 select-none cursor-default">
                  <div className="w-10 h-10 bg-red-100 text-[#dc2626] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>  
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      GỌI HOTLINE
                    </span>
                    <strong className="text-sm font-black text-gray-900">
                      0977 334 415
                    </strong>
                  </div>
                </div>

                {/* Option 2: Zalo */}
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-gray-50 hover:bg-blue-50/60 rounded-lg border border-gray-200 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-100 text-[#0068ff] rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      CHAT ZALO NHẬN BÁO GIÁ
                    </span>
                    <strong className="text-sm font-black text-gray-900 group-hover:text-[#0068ff] transition-colors">
                      Gửi Cấu Hình
                    </strong>
                  </div>
                </a>

                {/* Option 3: Messenger */}
                <a
                  href="https://messenger.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-gray-50 hover:bg-blue-50/60 rounded-lg border border-gray-200 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-indigo-100 text-[#0084ff] rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      NHẮN TIN MESSENGER
                    </span>
                    <strong className="text-sm font-black text-gray-900 group-hover:text-[#0084ff] transition-colors">
                      Fanpage Facebook
                    </strong>
                  </div>
                </a>

                {/* Close link */}
                <div className="text-center pt-1.5">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                  >
                    Đóng cửa sổ này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
