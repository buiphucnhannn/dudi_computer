import {
  CreditCard,
  ShieldCheck,
  FileText,
  Clock,
  CircleAlert,
  CircleCheckBig,
} from "lucide-react";

export const metadata = {
  title: "Hướng Dẫn Trả Góp 0% Lãi Suất",
  description: "Hướng dẫn chi tiết thủ tục mua máy tính, laptop trả góp 0% qua thẻ tín dụng và công ty tài chính tại DUDI SOFTWARE.",
};

export default function InstallmentGuidePage() {
  return (
    <main className="flex-1 w-full overflow-x-hidden">
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="mx-auto px-4 w-full max-w-[880px]">
          {/* Header Banner */}
          <div className="bg-gray-800 text-white rounded-2xl p-6 sm:p-7 mb-7 flex items-center gap-5 sm:gap-6 shadow-sm">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Hướng dẫn trả góp
              </h1>
            </div>
          </div>

          {/* White Content Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 space-y-10">
            
            {/* ========================================================= */}
            {/* SECTION I: CÁC ĐỐI TÁC TÀI CHÍNH UY TÍN */}
            {/* ========================================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#cc2222]/10 text-[#cc2222] rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">
                  I. CÁC ĐỐI TÁC TÀI CHÍNH UY TÍN
                </h2>
              </div>

              <p className="text-gray-600 mb-6 md:ml-[52px]">
                DUDI SOFTWARE hợp tác cùng các công ty tài chính hàng đầu để mang đến cho khách hàng dịch vụ trả góp tốt nhất với lãi suất cực kỳ cạnh tranh và thủ tục xét duyệt siêu tốc.
              </p>

              <div className="grid md:grid-cols-2 gap-6 md:ml-[52px]">
                {/* HD SAISON */}
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-blue-500 hover:shadow-lg transition-all">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img
                      src="https://zcomputer.vn/HD_SAISON_logo.jpg"
                      alt="HD SAISON"
                      className="h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Trả góp qua HD SAISON
                  </h3>
                  <ul className="text-sm text-gray-600 text-left space-y-2 w-full">
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Duyệt hồ sơ nhanh chóng trong 15-30 phút.</span>
                    </li>
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Trả trước chỉ từ 20% giá trị sản phẩm.</span>
                    </li>
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Kỳ hạn linh hoạt 6, 9, 12 tháng.</span>
                    </li>
                  </ul>
                </div>

                {/* MIRAE ASSET */}
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-blue-500 hover:shadow-lg transition-all">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img
                      src="https://zcomputer.vn/Mirae_Asset_Logo.jpg"
                      alt="Mirae Asset"
                      className="h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Trả góp qua MIRAE ASSET
                  </h3>
                  <ul className="text-sm text-gray-600 text-left space-y-2 w-full">
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Hạn mức vay cao, thủ tục đơn giản.</span>
                    </li>
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Tỉ lệ duyệt hồ sơ thành công cao.</span>
                    </li>
                    <li className="flex gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Đa dạng gói vay phù hợp với nhiều đối tượng.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION II: ĐIỀU KIỆN VÀ GIẤY TỜ CẦN THIẾT */}
            {/* ========================================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#cc2222]/10 text-[#cc2222] rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">
                  II. ĐIỀU KIỆN VÀ GIẤY TỜ CẦN THIẾT
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl md:ml-[52px]">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">
                  1. Điều kiện chung:
                </h3>

                {/* HD SAISON */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
                  <h4 className="font-bold text-[#cc2222] mb-3 border-b pb-2">
                    Đăng ký qua HD SAISON
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>
                        Khách hàng là công dân Việt Nam có độ tuổi từ 19 đến 60 tuổi (nếu không mua bảo hiểm khoản vay), và 19 - 70 tuổi (nếu có mua bảo hiểm).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>
                        Tại thời điểm vay, khách hàng không có khoản nợ xấu tại bất kỳ tổ chức tín dụng nào.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>
                        Có thu nhập ổn định hàng tháng, đảm bảo đủ khả năng thanh toán khoản trả góp.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* MIRAE ASSET */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                  <h4 className="font-bold text-blue-600 mb-3 border-b pb-2">
                    Đăng ký qua MIRAE ASSET
                  </h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>Khách hàng là công dân Việt Nam không có nợ xấu.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CircleCheckBig className="text-green-500 shrink-0 mt-0.5 w-4 h-4" />
                      <span>
                        Độ tuổi quy định: <strong className="text-gray-900 ml-1">Nam từ 21 - 60 tuổi</strong> <span className="mx-2">|</span> <strong className="text-gray-900">Nữ từ 18 - 60 tuổi</strong>.
                      </span>
                    </li>
                  </ul>
                </div>

                <h3 className="font-bold text-gray-800 mb-4 text-lg">
                  2. Giấy tờ bắt buộc (Chỉ cần bản gốc để đối chiếu):
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="font-bold text-[#cc2222] mb-2">
                      Giấy tờ tùy thân:
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 text-sm">
                      <CircleCheckBig className="text-green-500 w-4 h-4 shrink-0" />
                      <span>Căn cước công dân (CCCD) gắn chip hợp lệ.</span>
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="font-bold text-[#cc2222] mb-2">
                      Và 1 trong các giấy tờ sau:
                    </p>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CircleCheckBig className="text-green-500 w-4 h-4 shrink-0" />
                        <span>Bằng lái xe</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CircleCheckBig className="text-green-500 w-4 h-4 shrink-0" />
                        <span>Sổ hộ khẩu</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CircleCheckBig className="text-green-500 w-4 h-4 shrink-0" />
                        <span>Bảo hiểm y tế</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CircleCheckBig className="text-green-500 w-4 h-4 shrink-0" />
                        <span>Giấy đăng ký kết hôn (nếu có)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION III: QUY TRÌNH MUA HÀNG TRẢ GÓP */}
            {/* ========================================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#cc2222]/10 text-[#cc2222] rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">
                  III. QUY TRÌNH MUA HÀNG TRẢ GÓP
                </h2>
              </div>

              <div className="md:ml-[52px] relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {/* 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#cc2222] text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Chọn sản phẩm &amp; gói trả góp
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Quý khách chọn sản phẩm ưng ý tại website DUDI SOFTWARE. Chọn &quot;Mua trả góp&quot;, lựa chọn công ty tài chính, mức trả trước và số tháng trả góp phù hợp.
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Đăng ký &amp; Tư vấn
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Liên hệ nhân viên tư vấn của DUDI SOFTWARE để được hỗ trợ hồ sơ và giải đáp thắc mắc cho quý khách.
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Xét duyệt hồ sơ
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Khách hàng mang giấy tờ bản gốc đến trực tiếp cửa hàng DUDI SOFTWARE. Quá trình xét duyệt diễn ra rất nhanh chóng từ 15-30 phút.
                    </p>
                  </div>
                </div>

                {/* 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    4
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Nhận sản phẩm
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Sau khi hồ sơ được duyệt và hoàn tất thủ tục thanh toán trả trước, quý khách sẽ nhận ngay sản phẩm tại cửa hàng.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION IV: MỘT SỐ LƯU Ý KHÁC */}
            {/* ========================================================= */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                  <CircleAlert className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">
                  IV. MỘT SỐ LƯU Ý KHÁC
                </h2>
              </div>

              <ul className="space-y-4 text-gray-600 md:ml-[52px]">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cc2222] mt-2 shrink-0"></div>
                  <span>
                    Công ty tài chính <strong>chỉ kiểm tra giấy tờ gốc</strong> và trả lại ngay, không giữ bất kỳ giấy tờ nào của khách hàng.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cc2222] mt-2 shrink-0"></div>
                  <span>
                    Giá sản phẩm khi mua trả góp là giá niêm yết được áp dụng tại thời điểm khách hàng ký hợp đồng.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cc2222] mt-2 shrink-0"></div>
                  <span>
                    Khách hàng có thể thanh lý sớm hợp đồng (thanh toán hết số tiền còn lại) bất cứ lúc nào, tuy nhiên có thể phát sinh phí phạt trước hạn theo quy định của công ty tài chính.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#cc2222] mt-2 shrink-0"></div>
                  <span>
                    Để được hỗ trợ chi tiết, quý khách vui lòng liên hệ Hotline:{" "}
                    <strong className="text-[#cc2222]">(+84) 909 163 821</strong>
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
