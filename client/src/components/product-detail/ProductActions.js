"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";

const ProductActions = ({ product }) => {
  const dispatch = useDispatch();

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-red-600 text-white min-h-14 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-md flex flex-col items-center justify-center cursor-pointer"
        >
          <span>MUA NGAY</span>

          <span className="text-xs font-normal opacity-90">
            Giao hàng tận nơi hoặc nhận tại cửa hàng
          </span>
        </button>

        <button className="flex-1 bg-white text-red-600 border-2 border-red-600 min-h-14 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors shadow-sm flex flex-col items-center justify-center">
          <span>MUA TRẢ GÓP</span>

          <span className="text-xs font-normal text-slate-500">
            Duyệt hồ sơ nhanh chóng
          </span>
        </button>
      </div>

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
    </>
  );
};

export default ProductActions;
