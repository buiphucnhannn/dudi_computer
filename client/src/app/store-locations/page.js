import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Hệ Thống Showroom Cửa Hàng",
  description:
    "Ghé thăm trực tiếp các showroom của ZCOMPUTER để trải nghiệm tận tay những dàn PC siêu khủng và các thiết bị công nghệ hiện đại nhất.",
};

const STORES = [
  {
    id: "thu-duc",
    name: "Chi nhánh Thủ Đức",
    address:
      "23 Đường số 1, Khu phố 61, Phường Linh Xuân (Phường Linh Tây cũ), TP.Hồ Chí Minh",
    mapQuery: "https://maps.google.com/?q=23+Đường+số+1+Linh+Xuân+Thủ+Đức",
    hotline: "0977 334 415",
    workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4658576162583!2d106.74981366590865!3d10.852128230492767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2sus!4v1781670020621!5m2!1svi!2sus",
  },
  {
    id: "binh-thanh",
    name: "Chi nhánh Bình Thạnh",
    address:
      "47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP. Hồ Chí Minh",
    mapQuery:
      "https://maps.google.com/?q=47/86B+Bùi+Đình+Tuý+Phường+14+Bình+Thạnh",
    hotline: "0977 334 415",
    workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.072361586463!2d106.70468187588394!3d10.805769858649997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529000263c50f%3A0x1694f4d065ba8f53!2zWkNPTVBVVEVSLULDjE5IIFRI4bqgTkg!5e0!3m2!1svi!2sus!4v1782088223445!5m2!1svi!2sus",
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
            HỆ THỐNG <span className="text-[#eb1c24]">ZCOMPUTER</span>
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
                        className="text-xs sm:text-[13px] text-[#eb1c24] font-bold hover:underline inline-flex items-center gap-1 mt-1.5 transition-colors"
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
                      <p className="text-sm sm:text-base text-gray-900 font-bold mt-0.5">
                        {store.hotline}
                      </p>
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
