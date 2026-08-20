import { RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Chính sách đổi trả - ZCOMPUTER",
  description: "Quy định về đổi trả sản phẩm, hoàn tiền tại ZCOMPUTER.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-14">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 sm:p-8 mb-8 flex items-center gap-5 sm:gap-6 shadow-md">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
            <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              CHÍNH SÁCH ĐỔI TRẢ
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium">
              Đảm bảo quyền lợi tối đa cho khách hàng mua sắm tại ZCOMPUTER
            </p>
          </div>
        </div>

        {/* Content Card with 3 Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8 text-gray-700 text-sm sm:text-[14.5px] leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 shrink-0" />
              <span>1. Điều kiện đổi trả</span>
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed">
              <li>
                Sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất trong vòng <strong className="text-gray-900 font-bold">07 ngày</strong> kể từ ngày nhận hàng.
              </li>
              <li>
                Sản phẩm còn nguyên vẹn, không bị móp méo, trầy xước, vào nước hay chập cháy do lỗi người dùng.
              </li>
              <li>
                Sản phẩm phải còn đầy đủ hộp, phụ kiện, sách hướng dẫn, và quà tặng kèm theo (nếu có).
              </li>
              <li>
                Phải có hóa đơn mua hàng hoặc phiếu bảo hành hợp lệ của ZCOMPUTER.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0" />
              <span>2. Trường hợp không được đổi trả</span>
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed">
              <li>Sản phẩm đã quá thời hạn 07 ngày đổi trả.</li>
              <li>Lỗi do người sử dụng (rơi vỡ, tự ý tháo ráp, sử dụng sai điện áp...).</li>
              <li>Sản phẩm mất hộp, thiếu phụ kiện, vỏ hộp rách nát.</li>
              <li>Sản phẩm là phần mềm bản quyền hoặc có tem niêm phong đã bị rách.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0" />
              <span>3. Quy trình thực hiện</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Quy trình xử lý đổi trả diễn ra trong 3 bước:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 1: Liên hệ hỗ trợ</p>
                <p className="text-gray-600 mt-1">
                  Khách hàng gọi Hotline: <strong className="text-gray-900 font-bold">0977 334 415</strong> để thông báo tình trạng lỗi.
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 2: Gửi trả sản phẩm</p>
                <p className="text-gray-600 mt-1">
                  Gửi sản phẩm kèm toàn bộ phụ kiện về địa chỉ cửa hàng ZCOMPUTER gần nhất.
                </p>
              </div>

              <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-900">Bước 3: Thẩm định và hoàn tất</p>
                <p className="text-gray-600 mt-1">
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
