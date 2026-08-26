import { CreditCard, Banknote, Landmark } from "lucide-react";

export const metadata = {
  title: "Chính Sách Thanh Toán",
  description: "Các phương thức thanh toán an toàn và tiện lợi tại DUDI SOFTWARE.",
};

export default function PaymentPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-28 sm:pb-20">
      {/* 1. Hero Dark Banner */}
      <div className="bg-[#111111] py-10 sm:py-16 relative overflow-hidden">
        {/* Glow Effects: Hào quang đỏ rực rỡ góc phải */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute -top-12 -right-12 w-[420px] h-[420px] bg-[#eb1c24] rounded-full blur-[110px] opacity-90 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#ff3b30]/70 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner border border-white/10">
              <CreditCard className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 sm:mb-4">
              CHÍNH SÁCH THANH TOÁN TẠI <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Đa dạng hình thức thanh toán tiện lợi, nhanh chóng và bảo mật tuyệt đối.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="container mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto p-6 sm:p-8 md:p-12 space-y-8 text-gray-700 text-sm sm:text-[14.5px] leading-relaxed text-justify">
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              I. PHƯƠNG THỨC THANH TOÁN
            </h2>

            <div className="space-y-8">
              {/* Cash on Delivery (Ship COD) */}
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    * Thanh toán bằng tiền mặt:
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    Khách hàng thanh toán bằng tiền mặt trực tiếp khi nhận hàng (Ship COD).
                  </p>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="w-full">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    * Thanh toán bằng hình thức chuyển khoản:
                  </h3>

                  {/* Bank Details Table Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 mt-3">
                    <ul className="space-y-3.5 text-gray-700">
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2.5">
                        <span className="text-xs sm:text-sm text-gray-500 w-32 font-medium shrink-0">
                          Tên tài khoản:
                        </span>
                        <strong className="text-sm sm:text-base md:text-lg text-gray-900 font-bold">
                          CÔNG TY TNHH GIẢI PHÁP PHẦN MỀM DUDI
                        </strong>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2.5">
                        <span className="text-xs sm:text-sm text-gray-500 w-32 font-medium shrink-0">
                          Ngân hàng:
                        </span>
                        <span className="font-medium text-gray-800">
                          Ngân hàng thương mại Á Châu (ACB) – Chi nhánh Thủ Đức, HCM
                        </span>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2.5">
                        <span className="text-xs sm:text-sm text-gray-500 w-32 font-medium shrink-0">
                          Số tài khoản:
                        </span>
                        <strong className="text-xl sm:text-2xl text-[#eb1c24] font-black tracking-wider">
                          923925888
                        </strong>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-1 sm:gap-4 pt-1">
                        <span className="text-xs sm:text-sm text-gray-500 w-32 font-medium shrink-0">
                          Nội dung CK:
                        </span>
                        <span className="inline-block font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-xs sm:text-sm border border-yellow-200">
                          Số điện thoại mua hàng + mã đơn hàng
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Notification Note */}
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-xs sm:text-sm text-blue-800 font-medium leading-relaxed text-justify">
                      Quý khách vui lòng kiểm tra kỹ thông tin số tài khoản và nội dung chuyển khoản trước khi xác nhận thanh toán. DUDI SOFTWARE sẽ xác nhận đơn hàng ngay khi tiền vào tài khoản.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
