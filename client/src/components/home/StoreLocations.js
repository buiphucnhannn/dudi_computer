import { MapPin, Phone, Mail, ChevronRight, ExternalLink } from "lucide-react";

export default function StoreLocations() {
  return (
    <div
      id="he-thong-showroom"
      className="mb-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden group transition-all duration-500 text-white"
    >
      {/* Hiệu ứng đỏ mờ khi hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#eb1c24]/20 via-[#eb1c24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10">
        {/* Cột trái: Thông tin showroom */}
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-6 flex items-center gap-3 tracking-tight">
            <span>HỆ THỐNG CỬA HÀNG DUDI SOFTWARE</span>
            {/* SVG Máy bay giấy xoay 45 độ */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#eb1c24] transform rotate-45 shrink-0 inline-block"
            >
              <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
            </svg>
          </h3>

          <div className="text-[14px] sm:text-[15px] space-y-3.5 text-white/70">
            {/* Showroom 1 */}
            <p className="flex items-start gap-3">
              <MapPin className="text-[#eb1c24] fill-[#eb1c24]/20 mt-1 shrink-0 w-4 h-4" />
              <span>
                <strong className="text-white font-bold">Showroom 1:</strong> 49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh
              </span>
            </p>

            {/* Showroom 2 */}
            <p className="flex items-start gap-3">
              <MapPin className="text-[#eb1c24] fill-[#eb1c24]/20 mt-1 shrink-0 w-4 h-4" />
              <span>
                <strong className="text-white font-bold">Showroom 2:</strong> 232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh
              </span>
            </p>

            {/* Giờ làm việc */}
            <p className="flex items-center gap-3">
              <ChevronRight className="text-[#eb1c24] text-[10px] w-4 h-4 shrink-0" />
              <span>Làm việc từ 9:00 - 19:00 tất cả các ngày trong tuần.</span>
            </p>

            {/* Hotline */}
            <p className="flex items-center gap-3">
              <Phone className="text-[#eb1c24] fill-[#eb1c24]/20 w-4 h-4 shrink-0" />
              <span>
                Hotline Hỗ Trợ:{" "}
                <a
                  href="tel:0909163821"
                  className="text-[#eb1c24] hover:text-white font-bold text-lg ml-1 transition-colors underline-offset-4 hover:underline cursor-pointer"
                >
                  (+84) 909 163 821
                </a>
              </span>
            </p>

            {/* Email */}
            <p className="flex items-center gap-3">
              <Mail className="text-[#eb1c24] fill-[#eb1c24]/20 w-4 h-4 shrink-0" />
              <span>
                Email:{" "}
                <a
                  href="mailto:contact@dudisoftware.com"
                  className="text-white ml-1 font-semibold hover:text-[#eb1c24] transition-colors"
                >
                  contact@dudisoftware.com
                </a>
              </span>
            </p>
          </div>
        </div>

        {/* Cột phải: 2 bản đồ chi nhánh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Map 1: Chi nhánh Thủ Đức */}
          <div className="group/map">
            <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#eb1c24] animate-pulse"></div>
              <span>Chi nhánh Thủ Đức</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-[#eb1c24]/50 transition-colors relative aspect-[16/10] bg-gray-900">
              <a
                href="https://maps.google.com/?q=49/2+Đường+14+Phường+Thủ+Đức+TP+Hồ+Chí+Minh"
                target="_blank"
                rel="noreferrer"
                className="absolute top-2.5 left-2.5 z-20 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <iframe
                title="Bản đồ chỉ đường đến chi nhánh Thủ Đức"
                src="https://maps.google.com/maps?q=49/2%20%C4%90%C6%B0%E1%BB%9Dng%2014,%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20TP.H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-500 group-hover/map:scale-105 w-full h-full"
              />
            </div>
          </div>

          {/* Map 2: Chi nhánh Nguyễn Thị Minh Khai */}
          <div className="group/map">
            <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#eb1c24] animate-pulse"></div>
              <span>Chi nhánh Nguyễn Thị Minh Khai</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-[#eb1c24]/50 transition-colors relative aspect-[16/10] bg-gray-900">
              <a
                href="https://maps.google.com/?q=232+Đường+Nguyễn+Thị+Minh+Khai+Phường+Xuân+Hòa+TP+Hồ+Chí+Minh"
                target="_blank"
                rel="noreferrer"
                className="absolute top-2.5 left-2.5 z-20 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <iframe
                title="Bản đồ chỉ đường đến chi nhánh Nguyễn Thị Minh Khai"
                src="https://maps.google.com/maps?q=232%20%C4%90%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai,%20Ph%C6%B0%E1%BB%9Dng%20Xu%C3%A2n%20H%C3%B2a,%20TP.H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-500 group-hover/map:scale-105 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
