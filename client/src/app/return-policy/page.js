import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Chính Sách Đổi Trả Sản Phẩm",
  description: "Quy định về đổi trả sản phẩm, hoàn tiền tại DUDI SOFTWARE.",
};

export default function ReturnPolicyPage() {
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
              <RefreshCw className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 sm:mb-4">
              CHÍNH SÁCH ĐỔI TRẢ TẠI <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Đảm bảo quyền lợi tối đa, hỗ trợ đổi trả linh hoạt và minh bạch cho khách hàng.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="container mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto p-6 sm:p-8 md:p-12 space-y-8 text-gray-700 text-sm sm:text-[14.5px] leading-relaxed text-justify">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
              <span>1. Điều kiện đổi trả</span>
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed text-justify">
              <li className="text-justify">
                Sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất trong vòng <strong className="text-gray-900 font-bold">07 ngày</strong> kể từ ngày nhận hàng.
              </li>
              <li className="text-justify">
                Sản phẩm còn nguyên vẹn, không bị móp méo, trầy xước, vào nước hay chập cháy do lỗi người dùng.
              </li>
              <li className="text-justify">
                Sản phẩm phải còn đầy đủ hộp, phụ kiện, sách hướng dẫn, và quà tặng kèm theo (nếu có).
              </li>
              <li className="text-justify">
                Phải có hóa đơn mua hàng hoặc phiếu bảo hành hợp lệ của DUDI SOFTWARE.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0" />
              <span>2. Trường hợp không được đổi trả</span>
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed text-justify">
              <li className="text-justify">Sản phẩm đã quá thời hạn 07 ngày đổi trả.</li>
              <li className="text-justify">Lỗi do người sử dụng (rơi vỡ, tự ý tháo ráp, sử dụng sai điện áp...).</li>
              <li className="text-justify">Sản phẩm mất hộp, thiếu phụ kiện, vỏ hộp rách nát.</li>
              <li className="text-justify">Sản phẩm là phần mềm bản quyền hoặc có tem niêm phong đã bị rách.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0" />
              <span>3. Quy trình thực hiện</span>
            </h2>
            <p className="text-gray-600 mb-4 text-justify">
              Quy trình xử lý đổi trả diễn ra trong 3 bước:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 1: Liên hệ hỗ trợ</p>
                <p className="text-gray-600 mt-1 text-justify">
                  Khách hàng gọi Hotline: <strong className="text-gray-900 font-bold">(+84) 909 163 821</strong> để thông báo tình trạng lỗi.
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 2: Gửi trả sản phẩm</p>
                <p className="text-gray-600 mt-1 text-justify">
                  Gửi sản phẩm kèm toàn bộ phụ kiện về địa chỉ cửa hàng DUDI SOFTWARE gần nhất.
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 3: Thẩm định và hoàn tất</p>
                <p className="text-gray-600 mt-1 text-justify">
                  Kỹ thuật viên kiểm tra lỗi (1-3 ngày làm việc) và tiến hành đổi sản phẩm mới hoặc hoàn tiền theo yêu cầu.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
