import { Truck, Clock, AlertTriangle, CheckSquare, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Chính Sách Vận Chuyển & Giao Hàng",
  description: "Chính sách vận chuyển, giao nhận hàng hóa của DUDI SOFTWARE.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-6 sm:py-14 pb-28 sm:pb-20">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header Card (Red Background) */}
        <div className="bg-[#eb1c24] text-white rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 flex items-center gap-4 sm:gap-6 shadow-lg relative overflow-hidden">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0 border border-white/25">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
              CHÍNH SÁCH VẬN CHUYỂN
            </h1>
            <p className="text-white/80 text-[11px] sm:text-sm mt-0.5 sm:mt-1 font-medium">
              Áp dụng cho tất cả đơn hàng tại DUDI SOFTWARE
            </p>
          </div>
        </div>

        {/* Content Card with 4 Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-gray-700 text-xs sm:text-[14.5px] leading-relaxed">
          
          {/* Section 1 */}
          <div className="p-4 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-black shrink-0">
                1
              </span>
              <h2 className="text-base sm:text-xl font-bold text-gray-900">
                Phạm vi áp dụng
              </h2>
            </div>
            <p className="text-gray-600 sm:ml-11">
              Áp dụng cho <strong className="text-gray-900 font-bold">tất cả mọi tỉnh thành trên cả nước</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Thời gian giao – nhận hàng
              </h2>
            </div>
            <div className="sm:ml-11 space-y-4">
              {/* Red/Pink Alert Box */}
              <div className="flex items-start gap-3 p-4 bg-red-50/80 rounded-xl border-l-4 border-[#eb1c24]">
                <Clock className="w-5 h-5 text-[#eb1c24] shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Đơn hàng sau khi được tiếp nhận xử lý xong sẽ được giao ngay trong vòng <strong className="text-gray-900 font-bold">24h</strong> hoặc theo tiến độ hợp đồng.
                </p>
              </div>

              {/* Blue Alert Box */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/80 rounded-xl border-l-4 border-blue-400">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  Đối với khách hàng ở tỉnh xa, thời gian nhận hàng dự kiến từ <strong className="text-gray-900 font-bold">3 – 5 ngày</strong> sau khi tiếp nhận đơn. Tùy vào điều kiện thời tiết và hàng hóa, ngày nhận hàng có thể thay đổi.
                </p>
              </div>

              <p className="text-gray-600">
                Thời gian giao hàng được tính từ lúc hoàn tất thủ tục đặt hàng với nhân viên tư vấn đến khi nhận được hàng.
              </p>

              {/* Yellow Alert Box */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm">
                <p className="text-gray-700">
                  ⚠️ <strong className="text-gray-900 font-bold">Lưu ý:</strong> Trường hợp phát sinh chậm trễ hoặc sản phẩm không được bán quá 10 ngày, khách hàng có thể hủy đơn mà <strong className="text-gray-900 font-bold">không chịu bất kỳ chi phí nào</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Hình thức giao hàng
              </h2>
            </div>
            <div className="sm:ml-11 space-y-4 text-gray-600">
              {/* Delivery Types 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3.5 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Khách tỉnh xa</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Sử dụng dịch vụ giao hàng</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3.5 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Khách nội/ngoại thành</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Sử dụng dịch vụ giao hàng</p>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">
                Phân định trách nhiệm về chứng từ hàng hóa:
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#eb1c24] font-bold">–</span>
                  <span>Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ hàng hóa trong quá trình giao nhận.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#eb1c24] font-bold">–</span>
                  <span>dudisoftware.com có trách nhiệm cung cấp đầy đủ và chính xác các chứng từ liên quan đến hàng hóa.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#eb1c24] font-bold">–</span>
                  <span>Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi dudisoftware.com.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#eb1c24] font-bold">–</span>
                  <span>Đơn vị vận chuyển giao hàng theo nguyên tắc &quot;Nguyên đai, nguyên kiện&quot;.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#eb1c24] font-bold">–</span>
                  <span>Sau khi khách hàng xác nhận, DUDI SOFTWARE sẽ xuất hóa đơn điện tử và gửi qua email.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Chính sách kiểm hàng
              </h2>
            </div>
            <div className="sm:ml-11 space-y-3.5 text-gray-600">
              {/* Green Box */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-gray-800 font-medium">
                  ✅ Khi nhận hàng, quý khách có quyền yêu cầu nhân viên giao hàng mở ra để kiểm tra trước khi nhận.
                </p>
              </div>

              <p>
                Trường hợp giao sai loại sản phẩm, quý khách có quyền <strong className="text-gray-900 font-bold">trả hàng và không thanh toán</strong>.
              </p>
              <p>
                Trường hợp đã thanh toán nhưng nhận hàng sai, quý khách yêu cầu hoàn tiền hoặc giao lại đúng đơn.
              </p>

              {/* Support Contact Box */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 space-y-2">
                <p className="font-bold text-gray-900">Liên hệ hỗ trợ:</p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  📧 Email:{" "}
                  <a href="mailto:contact@dudisoftware.com" className="text-[#eb1c24] font-medium hover:underline">
                    contact@dudisoftware.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  📞 Hotline:{" "}
                  <span className="text-[#eb1c24] font-medium">
                    (+84) 909 163 821
                  </span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
