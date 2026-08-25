"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useToast } from "@/components/common/ToastContext";
import { selectIsAuthenticated, selectIsAdmin } from "@/redux/slices/authSlice";
import OrderCheckoutModal from "@/components/cart/OrderCheckoutModal";

const ProductActions = ({ product }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenBuyModal = () => {
    if (!isAuthenticated) {
      showToast({
        title: "Yêu cầu đăng nhập",
        message: "Vui lòng đăng nhập để tiến hành đặt hàng.",
        type: "warning",
      });
      const currentUrl = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setIsBuyModalOpen(true);
  };

  return (
    <>
      {mounted && !isAdmin && (
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            onClick={handleOpenBuyModal}
            className="flex-1 bg-red-600 text-white min-h-14 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-md flex flex-col items-center justify-center cursor-pointer"
          >
            <span>MUA NGAY</span>
            <span className="text-xs font-normal opacity-90">
              Giao hàng tận nơi hoặc nhận tại cửa hàng
            </span>
          </button>

          <button
            onClick={handleOpenBuyModal}
            className="flex-1 bg-white text-red-600 border-2 border-red-600 min-h-14 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors shadow-sm flex flex-col items-center justify-center cursor-pointer"
          >
            <span>MUA TRẢ GÓP</span>
            <span className="text-xs font-normal text-slate-500">
              Duyệt hồ sơ nhanh chóng
            </span>
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-sm text-slate-500 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2">
          <span className="text-red-600">✓</span>
          Hỗ trợ 24/7
        </div>

        <div className="flex items-center gap-2">
          <span className="text-red-600">✓</span>
          Miễn phí ship nội thành
        </div>

        <div className="flex items-center gap-2">
          <span className="text-red-600">✓</span>
          Bảo hành siêu tốc
        </div>
      </div>

      <OrderCheckoutModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        prefilledProduct={product}
      />
    </>
  );
};

export default ProductActions;
