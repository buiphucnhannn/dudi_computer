import { Shield, MapPin, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Mật",
  description: "Chính sách bảo mật thông tin khách hàng của DUDI SOFTWARE.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 sm:py-14">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 sm:p-8 mb-8 flex items-center gap-5 sm:gap-6 shadow-md">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              CHÍNH SÁCH BẢO MẬT
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium">
              Bảo vệ thông tin cá nhân của khách hàng
            </p>
          </div>
        </div>

        {/* Content Card with 6 Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-gray-700 text-sm sm:text-[14.5px] leading-relaxed text-justify">
          
          {/* Section 1 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Mục đích thu thập thông tin cá nhân
              </h2>
            </div>
            <div className="sm:ml-11 space-y-2 text-gray-600">
              <p className="mb-3 text-justify">Mục đích của việc thu thập thông tin khách hàng nhằm phục vụ cho:</p>
              <ul className="space-y-2 text-justify">
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Hỗ trợ khách hàng: mua hàng, thanh toán, giao hàng.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Cung cấp thông tin sản phẩm, dịch vụ và hỗ trợ theo yêu cầu của khách hàng.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Gửi thông báo các chương trình, sản phẩm mới nhất.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Giải quyết vấn đề phát sinh khi mua hàng.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                2
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Phạm vi thu thập thông tin
              </h2>
            </div>
            <div className="sm:ml-11">
              <p className="text-gray-600 mb-4 text-justify">
                Chúng tôi thu thập thông tin cá nhân khi khách hàng đặt hàng trên website, bao gồm:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center text-sm font-semibold text-gray-700 border border-gray-200">
                  Họ tên
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center text-sm font-semibold text-gray-700 border border-gray-200">
                  Địa chỉ email
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center text-sm font-semibold text-gray-700 border border-gray-200">
                  Số điện thoại
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center text-sm font-semibold text-gray-700 border border-gray-200">
                  Địa chỉ
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                3
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Thời gian lưu trữ thông tin
              </h2>
            </div>
            <div className="sm:ml-11">
              <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <p className="text-gray-700 text-justify">
                  Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân khách hàng sẽ được bảo mật trên máy chủ của dudisoftware.com
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Những người hoặc tổ chức có thể được tiếp cận với thông tin đó
              </h2>
            </div>
            <div className="sm:ml-11 space-y-3 text-gray-600">
              <ul className="space-y-2 text-justify">
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Đối với các bên vận chuyển, sẽ cung cấp các thông tin để phục vụ cho việc giao nhận hàng hóa như Tên, địa chỉ và số điện thoại.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Đối với nhân viên công ty sẽ có các bộ phận chuyên trách để phục vụ việc chăm sóc khách hàng trong quá trình sử dụng sản phẩm.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Các chương trình có tính liên kết, đồng thực hiện, thuê ngoài cho các mục đích được nêu tại Mục 1 và luôn áp dụng các yêu cầu bảo mật thông tin cá nhân.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-800 font-bold">–</span>
                  <span className="text-justify">Yêu cầu pháp lý: Chúng tôi có thể tiết lộ các thông tin cá nhân nếu điều đó do luật pháp yêu cầu và việc tiết lộ như vậy là cần thiết một cách hợp lý để tuân thủ các quy trình pháp lý.</span>
                </li>
              </ul>
              <p className="pt-1 text-justify">
                Chuyển giao kinh doanh (nếu có): trong trường hợp sáp nhập, hợp nhất toàn bộ hoặc một phần với công ty khác, người mua sẽ có quyền truy cập thông tin được chúng tôi lưu trữ, duy trì trong đó bao gồm cả thông tin cá nhân.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                5
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Địa chỉ của đơn vị thu thập và quản lý thông tin
              </h2>
            </div>
            <div className="sm:ml-11 space-y-2.5 text-gray-600 text-justify">
              <p>
                <strong className="text-gray-900 font-bold">Tên doanh nghiệp:</strong> CÔNG TY TNHH GIẢI PHÁP PHẦN MỀM DUDI
              </p>
              <p className="text-justify">
                <strong className="text-gray-900 font-bold">Thông tin:</strong> Thành lập và hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp / Mã số thuế số 0319641544 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp
              </p>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <span>
                    <strong className="text-gray-900 font-bold">Showroom 1:</strong> 49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh
                  </span>
                  <span>
                    <strong className="text-gray-900 font-bold">Showroom 2:</strong> 232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">
                6
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu
              </h2>
            </div>
            <div className="sm:ml-11 space-y-4 text-gray-600">
              <p className="text-justify">
                Nếu quý khách có bất cứ về yêu cầu nào về việc tiếp cận và chỉnh sửa thông tin cá nhân đã cung cấp, quý khách có thể:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#eb1c24] shrink-0" />
                  <span>
                    Gọi điện trực tiếp về số điện thoại:{" "}
                    <a href="tel:0909163821" className="text-gray-900 font-bold hover:text-[#eb1c24] transition-colors">
                      (+84) 909 163 821
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#eb1c24] shrink-0" />
                  <span>
                    Gửi mail:{" "}
                    <a href="mailto:contact@dudisoftware.com" className="text-gray-900 font-bold hover:text-[#eb1c24] transition-colors">
                      contact@dudisoftware.com
                    </a>
                  </span>
                </li>
              </ul>

              {/* Khiếu nại cơ chế */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <h3 className="font-bold text-[#eb1c24] uppercase text-sm tracking-wide">
                  * Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng
                </h3>
                <p className="text-justify">
                  Liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo:
                </p>
                <p className="text-justify">
                  Tại dudisoftware.com, việc bảo vệ thông tin cá nhân của bạn là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng tôi sẽ được bảo mật. dudisoftware.com cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác. dudisoftware.com cam kết chỉ sử dụng các thông tin của bạn vào các trường hợp sau:
                </p>
                <ul className="space-y-2 pl-2 text-justify">
                  <li className="flex gap-2">
                    <span className="text-gray-800 font-bold">–</span>
                    <span className="text-justify">Nâng cao chất lượng dịch vụ dành cho khách hàng</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-800 font-bold">–</span>
                    <span className="text-justify">Giải quyết các tranh chấp, khiếu nại trong vòng 3 ngày sau khi nhận được thông tin.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-800 font-bold">–</span>
                    <span className="text-justify">Khi cơ quan pháp luật có yêu cầu.</span>
                  </li>
                </ul>
                <p className="text-justify">
                  dudisoftware.com hiểu rằng quyền lợi của bạn trong việc bảo vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo mật của dudisoftware.com, và liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo vui lòng liên hệ qua số hotline <strong className="text-gray-900 font-bold">(+84) 909 163 821</strong> hoặc email: <strong className="text-gray-900 font-bold">contact@dudisoftware.com</strong> để xử lý và làm việc trực tiếp với khách hàng.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
