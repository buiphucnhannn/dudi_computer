import { X, Phone, MessageCircle } from "lucide-react";

const BuyContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#E52320] px-6 py-4 text-white">
          <h2 className="text-lg font-bold uppercase tracking-wide sm:text-xl">
            Liên hệ để mua hàng
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-full p-1 transition-colors hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <p className="text-center leading-relaxed text-gray-500">
            Để mua hàng hoặc nhận báo giá chi tiết cho sản phẩm bạn đã chọn,
            vui lòng liên hệ với chúng tôi qua các kênh sau:
          </p>

          <div className="flex flex-col gap-4">
            {/* Hotline */}
            <a
              href="tel:0977334415"
              className="group flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Phone className="h-6 w-6 text-red-600" />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Gọi Hotline
                </div>

                <div className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#E52320]">
                  0977 334 415
                </div>
              </div>
            </a>

            {/* Zalo */}
            <a
              href="#"
              className="group flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Chat Zalo nhận báo giá
                </div>

                <div className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  Gửi cấu hình
                </div>
              </div>
            </a>

            {/* Messenger */}
            <a
              href="#"
              className="group flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Nhắn tin Messenger
                </div>

                <div className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  Fanpage Facebook
                </div>
              </div>
            </a>
          </div>

          {/* Footer */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="font-medium text-gray-500 underline decoration-gray-400 underline-offset-2 transition-colors hover:text-gray-900"
            >
              Đóng cửa sổ này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyContactModal;