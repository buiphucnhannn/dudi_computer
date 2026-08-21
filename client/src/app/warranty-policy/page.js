import { ShieldCheck, RefreshCw, FileText, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Hành",
  description: "Chính sách và quy định bảo hành, đổi trả sản phẩm tại ZCOMPUTER.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* 1. Hero Dark Banner */}
      <div className="bg-[#111111] py-14 sm:py-16 relative overflow-hidden">
        {/* Glow Effects: Hào quang đỏ rực rỡ góc phải */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="absolute -top-12 -right-12 w-[420px] h-[420px] bg-[#eb1c24] rounded-full blur-[110px] opacity-90 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#ff3b30]/70 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-inner border border-white/10">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
              QUY ĐỊNH BẢO HÀNH TẠI <span className="text-[#eb1c24]">ZCOMPUTER</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Đảm bảo quyền lợi tối đa cho khách hàng khi mua sắm tại ZComputer.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12 space-y-10 sm:space-y-12">
            
            {/* Section I: THỜI GIAN VÀ PHẠM VI BẢO HÀNH */}
            <section>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-10 h-10 bg-red-50 text-[#eb1c24] rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
                  I. THỜI GIAN VÀ PHẠM VI BẢO HÀNH
                </h2>
              </div>
              <ul className="space-y-4 text-gray-600 sm:ml-[52px] text-sm sm:text-[15px] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Bảo hành Toàn Diện (01 Tháng):</strong>{" "}
                    Bảo hành toàn bộ linh kiện phần cứng bao gồm: Màn hình, bàn phím, touchpad, ổ cứng (SSD), RAM, loa, webcam, các cổng kết nối và pin.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Bảo hành Bo Mạch & Nguồn (03 Tháng):</strong>{" "}
                    Bảo hành mainboard (bo mạch chủ), IC nguồn, và các lỗi phần cứng trên bo mạch khiến máy không lên nguồn.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Đặc quyền máy cũ:</strong> * Tặng 02 lần vệ sinh máy, tra keo tản nhiệt miễn phí (áp dụng trong vòng 12 tháng kể từ ngày mua).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Bao test đổi máy:</strong> Trong vòng 03 ngày đầu nếu không ưng ý (yêu cầu máy giữ nguyên tình trạng ngoại hình ban đầu). Khách hàng có thể đổi sang dòng máy khác bằng tiền hoặc cao tiền hơn và bù thêm khoản chênh lệch.
                  </span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Section II: ĐIỀU KIỆN TIẾP NHẬN BẢO HÀNH */}
            <section>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
                  II. ĐIỀU KIỆN TIẾP NHẬN BẢO HÀNH
                </h2>
              </div>
              <ul className="space-y-4 text-gray-600 sm:ml-[52px] text-sm sm:text-[15px] leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>
                    Máy còn nguyên vẹn tem bảo hành của cửa hàng, không có dấu hiệu bị rách, tẩy xóa, dán đè hoặc bong tróc.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>
                    Số Serial / Tag máy trên phiếu bảo hành phải trùng khớp với số Serial hiển thị trên máy (hoặc trong BIOS).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>
                    Máy được xác định lỗi do linh kiện, không có tác động phá hoại hay tai nạn từ bên ngoài.
                  </span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Section III: CÁC TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH */}
            <section>
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
                  III. CÁC TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH
                </h2>
              </div>
              <p className="text-gray-500 mb-5 sm:mb-6 sm:ml-[52px] italic text-xs sm:text-sm">
                (Khách hàng lưu ý) Z Computer xin phép từ chối bảo hành đối với các trường hợp:
              </p>
              <ul className="space-y-4 text-gray-600 sm:ml-[52px] text-sm sm:text-[15px] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-[#eb1c24] mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Lỗi ngoại quan sau khi rời cửa hàng:</strong>{" "}
                    Máy bị rơi rớt, va đập, cấn móp, nứt vỡ vỏ, trầy xước nặng so với tình trạng bàn giao ban đầu.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-[#eb1c24] mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Sự cố màn hình do tác động lực:</strong>{" "}
                    Màn hình bị vỡ, chảy mực, bị sọc màn hoặc đốm trắng/đen phát sinh sau khi mua (đây là lỗi do cấn đè hoặc ngoại lực trong quá trình di chuyển).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-[#eb1c24] mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Vấn đề về Pin:</strong>{" "}
                    Hao mòn tự nhiên (pin chai dần theo thời gian sử dụng). Cửa hàng chỉ bảo hành pin trong tháng đầu nếu pin chết hẳn, không sạc vào điện hoặc sụt nguồn đột ngột dưới 1 tiếng.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-[#eb1c24] mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Sự cố chất lỏng & Môi trường:</strong>{" "}
                    Máy bị đổ nước, bia, chất lỏng vào; máy bị ẩm rỉ mạch do môi trường hoặc có côn trùng (gián, kiến...) chui vào gây chập cháy.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-5 h-5 text-[#eb1c24] mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-bold">Sử dụng sai cách & Can thiệp phần cứng:</strong>{" "}
                    Chập cháy do dùng sai dòng điện, dùng sạc lô sai công suất; Khách hàng tự ý tháo máy, tự nâng cấp linh kiện hoặc rách tem niêm phong mà không có sự xác nhận của cửa hàng.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer Note */}
          <div className="bg-gray-50 border-t border-gray-100 p-5 sm:p-6 text-center text-gray-500 text-xs sm:text-sm font-medium">
            <i>(Vui lòng giữ phiếu này cẩn thận để đối chiếu khi đến bảo hành).</i>
          </div>
        </div>
      </div>
    </div>
  );
}
