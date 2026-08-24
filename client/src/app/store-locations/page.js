import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Hệ Thống Showroom Cửa Hàng",
  description:
    "Ghé thăm trực tiếp các showroom của DUDI SOFTWARE để trải nghiệm tận tay những dàn PC siêu khủng và các thiết bị công nghệ hiện đại nhất.",
};

const STORES = [
  {
    id: "thu-duc",
    name: "Chi nhánh Thủ Đức",
    address:
      "49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh",
    mapQuery: "https://maps.google.com/?q=49/2+Đường+14+Phường+Thủ+Đức+TP+Hồ+Chí+Minh",
    hotline: "(+84) 909 163 821",
    workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
    embedUrl:
      "https://maps.google.com/maps?q=49/2%20%C4%90%C6%B0%E1%BB%9Dng%2014,%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c,%20TP.H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "xuan-hoa",
    name: "Chi nhánh Nguyễn Thị Minh Khai",
    address:
      "232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh",
    mapQuery:
      "https://maps.google.com/?q=232+Đường+Nguyễn+Thị+Minh+Khai+Phường+Xuân+Hòa+TP+Hồ+Chí+Minh",
    hotline: "(+84) 909 163 821",
    workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
    embedUrl:
      "https://maps.google.com/maps?q=232%20%C4%90%C6%B0%E1%BB%9Dng%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Minh%20Khai,%20Ph%C6%B0%E1%BB%9Dng%20Xu%C3%A2n%20H%C3%B2a,%20TP.H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
];

export default function StoreLocationsPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-280px)] py-7 sm:py-9 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1360px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-[13px] text-gray-500 font-medium mb-6 flex items-center gap-1.5 select-none">
          <Link
            href="/"
            className="hover:text-[#eb1c24] transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-bold">Hệ thống cửa hàng</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-[36px] lg:text-[40px] font-black text-gray-900 uppercase tracking-tight">
            HỆ THỐNG <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
          </h1>
          <p className="text-sm sm:text-[15px] text-gray-600 mt-2.5 max-w-2xl mx-auto leading-relaxed font-medium">
            Ghé thăm trực tiếp các showroom của chúng tôi để trải nghiệm tận tay
            những dàn PC siêu khủng và các thiết bị công nghệ hiện đại nhất.
          </p>
        </div>

        {/* 2-Column Store Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {STORES.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl shadow-xs border border-gray-100/80 p-6 sm:p-8 flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all duration-300 group"
            >
              {/* Top: Branch Details */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <span>{store.name}</span>
                </h2>

                {/* Info List */}
                <div className="space-y-4 pt-1">
                  {/* Địa chỉ */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 text-[#eb1c24] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        Địa chỉ
                      </span>
                      <p className="text-[13px] sm:text-[14.5px] text-gray-800 font-medium mt-0.5 leading-relaxed">
                        {store.address}
                      </p>
                      <a
                        href={store.mapQuery}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs sm:text-[13px] text-[#eb1c24] font-bold hover:underline inline-flex items-center gap-1 mt-1.5 transition-colors cursor-pointer"
                      >
                        <span>Mở Google Maps</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Hotline tư vấn */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        Hotline tư vấn
                      </span>
                      <a
                        href="tel:0909163821"
                        className="text-sm sm:text-base text-gray-900 hover:text-[#eb1c24] font-bold mt-0.5 block transition-colors cursor-pointer"
                      >
                        {store.hotline}
                      </a>
                    </div>
                  </div>

                  {/* Giờ làm việc */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[11px] sm:text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                        Giờ làm việc
                      </span>
                      <p className="text-[13px] sm:text-[14.5px] text-gray-700 font-medium mt-0.5">
                        {store.workingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Embedded Google Maps */}
              <div className="mt-7 rounded-xl overflow-hidden border border-gray-200/70 h-[260px] sm:h-[300px] w-full bg-gray-100 relative group-hover:border-red-200 transition-colors">
                <iframe
                  title={`Bản đồ ${store.name}`}
                  src={store.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
