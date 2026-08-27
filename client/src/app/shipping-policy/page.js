import {
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  FileText,
  FileCheck,
  ShieldCheck,
  PackageCheck,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Chính Sách Vận Chuyển & Giao Hàng | DUDI SOFTWARE",
  description: "Chính sách vận chuyển, giao nhận hàng hóa của DUDI SOFTWARE.",
};

export default function ShippingPolicyPage() {
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
              <Truck className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 sm:mb-4">
              CHÍNH SÁCH VẬN CHUYỂN TẠI <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
              Giao hàng nhanh chóng, cẩn thận và đảm bảo an toàn tuyệt đối trên toàn quốc.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Card */}
      <div className="container mx-auto px-3 sm:px-4 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto overflow-hidden text-gray-700 text-xs sm:text-[14.5px] leading-relaxed">
          
          {/* Section 1 */}
          <div className="p-4 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <span className="w-7 h-7 sm:w-8 sm:h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-black shrink-0 shadow-xs">
                1
              </span>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#eb1c24]" />
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  Phạm vi áp dụng
                </h2>
              </div>
            </div>
            <div className="sm:ml-11 flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <p>
                Áp dụng cho <strong className="text-gray-900 font-bold">tất cả mọi tỉnh thành trên cả nước</strong>.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
                2
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#eb1c24]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Thời gian giao – nhận hàng
                </h2>
              </div>
            </div>
            <div className="sm:ml-11 space-y-4">
              {/* Red Alert Box */}
              <div className="flex items-start gap-3 p-4 bg-red-50/80 rounded-xl border-l-4 border-[#eb1c24]">
                <Clock className="w-5 h-5 text-[#eb1c24] shrink-0 mt-0.5" />
                <p className="text-gray-700 text-justify">
                  Đơn hàng sau khi được tiếp nhận xử lý xong sẽ được giao ngay trong vòng <strong className="text-gray-900 font-bold">24h</strong> hoặc theo tiến độ hợp đồng.
                </p>
              </div>

              {/* Blue Alert Box */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/80 rounded-xl border-l-4 border-blue-400">
                <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 text-justify">
                  Đối với khách hàng ở tỉnh xa, thời gian nhận hàng dự kiến từ <strong className="text-gray-900 font-bold">3 – 5 ngày</strong> sau khi tiếp nhận đơn. Tùy vào điều kiện thời tiết và hàng hóa, ngày nhận hàng có thể thay đổi.
                </p>
              </div>

              <p className="text-gray-600 text-justify">
                Thời gian giao hàng được tính từ lúc hoàn tất thủ tục đặt hàng với nhân viên tư vấn đến khi nhận được hàng.
              </p>

              {/* Yellow Alert Box with Lucide Icon */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-gray-700 text-justify">
                  <strong className="text-gray-900 font-bold">Lưu ý:</strong> Trường hợp phát sinh chậm trễ hoặc sản phẩm không được bán quá 10 ngày, khách hàng có thể hủy đơn mà <strong className="text-gray-900 font-bold">không chịu bất kỳ chi phí nào</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
                3
              </span>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#eb1c24]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Hình thức giao hàng
                </h2>
              </div>
            </div>
            <div className="sm:ml-11 space-y-4 text-gray-600">
              {/* Delivery Types 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3.5 border border-gray-100 hover:border-gray-200 transition">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Khách tỉnh xa</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Sử dụng dịch vụ giao hàng nhanh toàn quốc</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3.5 border border-gray-100 hover:border-gray-200 transition">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Khách nội/ngoại thành</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Giao tận nơi nhanh chóng trong ngày</p>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-[#eb1c24]" />
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  Phân định trách nhiệm về chứng từ hàng hóa:
                </h3>
              </div>
              <ul className="space-y-2.5 text-justify">
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <span>Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ hàng hóa trong quá trình giao nhận.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <span>dudisoftware.com có trách nhiệm cung cấp đầy đủ và chính xác các chứng từ liên quan đến hàng hóa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <span>Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi dudisoftware.com.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <span>Đơn vị vận chuyển giao hàng theo nguyên tắc &quot;Nguyên đai, nguyên kiện&quot;.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#eb1c24] shrink-0 mt-0.5" />
                  <span>Sau khi khách hàng xác nhận, DUDI SOFTWARE sẽ xuất hóa đơn điện tử và gửi qua email.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-[#eb1c24] text-white rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-xs">
                4
              </span>
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#eb1c24]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Chính sách kiểm hàng
                </h2>
              </div>
            </div>
            <div className="sm:ml-11 space-y-3.5 text-gray-600">
              {/* Green Box with Lucide CheckCircle2 */}
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium text-justify">
                  Khi nhận hàng, quý khách có quyền yêu cầu nhân viên giao hàng mở ra để kiểm tra trước khi nhận.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-justify">
                  <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                  <p>
                    Trường hợp giao sai loại sản phẩm, quý khách có quyền <strong className="text-gray-900 font-bold">trả hàng và không thanh toán</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2 text-justify">
                  <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                  <p>
                    Trường hợp đã thanh toán nhưng nhận hàng sai, quý khách yêu cầu hoàn tiền hoặc giao lại đúng đơn.
                  </p>
                </div>
              </div>

              {/* Support Contact Box */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 space-y-2.5">
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#eb1c24]" />
                  <span>Liên hệ hỗ trợ:</span>
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                  <a
                    href="mailto:contact@dudisoftware.com"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#eb1c24] transition group"
                  >
                    <Mail className="w-4 h-4 text-[#eb1c24] group-hover:scale-110 transition-transform" />
                    <span>Email: <span className="text-[#eb1c24] font-medium group-hover:underline">contact@dudisoftware.com</span></span>
                  </a>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#eb1c24]" />
                    <span>Hotline: <span className="text-[#eb1c24] font-bold">(+84) 909 163 821</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
