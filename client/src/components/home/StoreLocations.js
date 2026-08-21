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
                <strong className="text-white font-bold">Showroom 1:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM
              </span>
            </p>

            {/* Showroom 2 */}
            <p className="flex items-start gap-3">
              <MapPin className="text-[#eb1c24] fill-[#eb1c24]/20 mt-1 shrink-0 w-4 h-4" />
              <span>
                <strong className="text-white font-bold">Showroom 2:</strong> 47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP.HCM
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
                <span className="text-[#eb1c24] font-bold text-lg ml-1">
                  (+84) 909 163 821
                </span>
              </span>
            </p>

            {/* Email */}
            <p className="flex items-center gap-3">
              <Mail className="text-[#eb1c24] fill-[#eb1c24]/20 w-4 h-4 shrink-0" />
              <span>
                Email: <strong className="text-white ml-1 font-semibold">contact@dudisoftware.com</strong>
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
                href="https://maps.google.com/?q=23+Đường+số+1+Linh+Xuân+Thủ+Đức"
                target="_blank"
                rel="noreferrer"
                className="absolute top-2.5 left-2.5 z-20 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <iframe
                title="Bản đồ chỉ đường đến chi nhánh Thủ Đức"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4658576162583!2d106.74981366590865!3d10.852128230492767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2sus!4v1781670020621!5m2!1svi!2sus"
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

          {/* Map 2: Chi nhánh Bình Thạnh */}
          <div className="group/map">
            <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#eb1c24] animate-pulse"></div>
              <span>Chi nhánh Bình Thạnh</span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-[#eb1c24]/50 transition-colors relative aspect-[16/10] bg-gray-900">
              <a
                href="https://maps.google.com/?q=47/86B+Bùi+Đình+Tuý+Phường+14+Bình+Thạnh"
                target="_blank"
                rel="noreferrer"
                className="absolute top-2.5 left-2.5 z-20 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <iframe
                title="Bản đồ chỉ đường đến chi nhánh Bình Thạnh"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.072361586463!2d106.70468187588394!3d10.805769858649997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529000263c50f%3A0x1694f4d065ba8f53!2zWkNPTVBVVEVSLULDjE5IIFRI4bqgTkg!5e0!3m2!1svi!2sus!4v1782088223445!5m2!1svi!2sus"
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
