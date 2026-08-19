import { MapPin, Phone, Mail, ChevronRight, ExternalLink } from "lucide-react";

export default function StoreLocations() {
  return (
    <section className="bg-[#111827] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              HỆ THỐNG CỬA HÀNG ZCOMPUTER 📌
            </h3>
            <div className="w-20 h-1 bg-[#dc2626] rounded-full mt-2"></div>
          </div>

          <div className="space-y-3 text-xs sm:text-[13px] text-gray-300">
            {/* Showroom 1 */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#dc2626] shrink-0 mt-1" />
              <div>
                <strong className="text-white font-bold">Showroom 1:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM
              </div>
            </div>

            {/* Showroom 2 */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#dc2626] shrink-0 mt-1" />
              <div>
                <strong className="text-white font-bold">Showroom 2:</strong> 47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP.HCM
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2.5">
              <ChevronRight className="w-4 h-4 text-[#dc2626] shrink-0" />
              <span>Làm việc từ 9:00 - 19:00 tất cả các ngày trong tuần.</span>
            </div>

            {/* Hotline */}
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#dc2626] shrink-0" />
              <div>
                <span>Hotline Hỗ Trợ: </span>
                <a href="tel:0977334415" className="font-black text-[#dc2626] text-sm hover:underline">
                  0977.334.415
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#dc2626] shrink-0" />
              <div>
                <span>Email: </span>
                <strong className="text-white">truong.zvncomputer@gmail.com</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Map Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Map 1: Thu Duc */}
          <div className="bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/80 p-3 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span> Chi nhánh Thủ Đức
              </span>
              <a
                href="https://maps.google.com/?q=23+Đường+số+1+Linh+Xuân+Thủ+Đức"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 relative">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&auto=format&fit=crop&q=80"
                alt="Bản đồ Thủ Đức"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-[#dc2626] text-white p-2 rounded-full shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Map 2: Binh Thanh */}
          <div className="bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-700/80 p-3 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span> Chi nhánh Bình Thạnh
              </span>
              <a
                href="https://maps.google.com/?q=47/86B+Bùi+Đình+Tuý+Phường+14+Bình+Thạnh"
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
              >
                <span>Maps</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="rounded-xl overflow-hidden aspect-[4/3] bg-gray-900 relative">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80"
                alt="Bản đồ Bình Thạnh"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-[#dc2626] text-white p-2 rounded-full shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
