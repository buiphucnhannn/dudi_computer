import {
  Store,
  MapPin,
  Truck,
  CreditCard,
  BadgeCheck,
  Headphones,
  Phone,
} from "lucide-react";

const stores = [
  {
    name: "Chi nhánh Thủ Đức",
    address:
      "23 Đường số 1, Kp 61, P. Linh Xuân, Thủ Đức, TP.HCM",
    mapUrl:
      "https://www.google.com/maps?cid=480909348043455982&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=vi&source=embed",
  },
  {
    name: "Chi nhánh Bình Thạnh",
    address:
      "47/86B Bùi Đình Tuý, P. 14, Q. Bình Thạnh, TP.HCM",
    mapUrl:
      "https://www.google.com/maps?cid=1627194541284691795&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=vi&source=embed",
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Miễn Phí Ship Nội Thành",
    description: "Bán kính 5km từ cửa hàng.",
  },
  {
    icon: CreditCard,
    title: "Trả Góp Linh Động",
    description:
      "Hỗ trợ trả góp qua thẻ tín dụng, HD Saison, Kredivo, Mirae Asset.",
  },
  {
    icon: BadgeCheck,
    title: "Cam Kết Chất Lượng",
    description:
      "Hàng chính hãng 100%. Bảo hành siêu tốc.",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ 24/7",
    description:
      "Hỗ trợ tư vấn tận tình, nhanh chóng.",
  },
];

const StoreInfo = () => {
  return (
    <div className="flex flex-col gap-4 w-full">

      {/* =========================
          STORE ADDRESS
      ========================== */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <Store
              size={17}
              className="text-red-600"
            />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Địa chỉ cửa hàng
          </h3>
        </div>

        {/* STORES */}
        <div className="flex flex-col gap-4">
          {stores.map((store, index) => (
            <div key={store.name}>

              <a
                href={store.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex items-start gap-2.5">

                  {/* STORE ICON */}
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                    <MapPin
                      size={14}
                      className="text-red-600"
                    />
                  </div>

                  {/* ADDRESS */}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {store.name}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed mt-1 group-hover:text-slate-700">
                      {store.address}
                    </p>

                    <span className="inline-block text-[10px] text-red-600 font-semibold mt-1">
                      Xem trên Google Maps →
                    </span>
                  </div>
                </div>
              </a>

              {index !== stores.length - 1 && (
                <div className="h-px bg-slate-200 mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          BENEFITS
      ========================== */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">
            Chính sách & dịch vụ
          </h3>
        </div>

        <div className="p-3 flex flex-col">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-start gap-3 py-3 ${
                  index !== benefits.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                {/* ICON */}
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  <Icon
                    size={16}
                    className="text-red-600"
                  />
                </div>

                {/* CONTENT */}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          CONTACT
      ========================== */}
      <div className="bg-red-600 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">

        {/* DECORATION */}
        <div className="absolute -right-2 -top-2 opacity-10">
          <Headphones size={80} />
        </div>

        <div className="relative z-10">

          <div className="flex items-center gap-2 mb-2">
            <Headphones size={17} />

            <h3 className="text-sm font-bold">
              Cần tư vấn thêm?
            </h3>
          </div>

          <p className="text-[11px] leading-relaxed opacity-90 mb-3">
            Đội ngũ kỹ thuật viên DUDI SOFTWARE luôn sẵn sàng
            hỗ trợ bạn.
          </p>

          <a
            href="tel:0909163821"
            className="flex items-center justify-center gap-2 w-full bg-white text-red-600 rounded-lg py-2.5 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Phone size={14} />

            (+84) 909 163 821
          </a>
        </div>
      </div>

    </div>
  );
};

export default StoreInfo;