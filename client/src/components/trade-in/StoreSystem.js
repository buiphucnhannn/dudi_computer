import {
  Send,
  MapPin,
  ChevronRight,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";

const StoreSystem = ({
  thuDucImage = "/images/dudi/dudi_showroom_hero.webp",
  binhThanhImage = "/images/dudi/dudisoftware3.webp",
  thuDucMapUrl = "https://maps.google.com/?q=49/2+Đường+14+Phường+Thủ+Đức+TP+Hồ+Chí+Minh",
  binhThanhMapUrl = "https://maps.google.com/?q=232+Đường+Nguyễn+Thị+Minh+Khai+Phường+Xuân+Hòa+TP+Hồ+Chí+Minh",
}) => {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* ================= CARD ================= */}
        <div
          className="
            group/card
            relative
            overflow-hidden
            p-8 md:p-12
            flex flex-col
            lg:flex-row
            gap-12

            bg-gradient-to-br
            from-[#3a2022]
            via-[#302022]
            via-60%
            to-[#202127]

            border border-[#713034]/70

            shadow-[0_20px_60px_rgba(0,0,0,0.22)]

            transition-all
            duration-500
            ease-out

            hover:-translate-y-1
            hover:border-[#b91c1c]/70
            hover:shadow-[0_25px_80px_rgba(185,28,28,0.20)]
          "
        >
          {/* ================= DECORATIVE GRADIENT ================= */}

          <div
            className="
              pointer-events-none
              absolute
              -top-40
              -right-32
              w-[420px]
              h-[420px]
              rounded-full
              bg-[#b91c1c]/10
              blur-[100px]
              transition-opacity
              duration-500
              group-hover/card:bg-[#b91c1c]/15
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-48
              -left-40
              w-[450px]
              h-[450px]
              rounded-full
              bg-[#7f1d1d]/15
              blur-[110px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[300px]
              h-[300px]
              rounded-full
              bg-white/[0.02]
              blur-[90px]
            "
          />

          {/* ==================== LEFT: CONTACT INFO ==================== */}

          <div className="relative z-10 flex-1 flex flex-col gap-8">
            {/* Title */}
            <div className="flex items-center gap-3">
              <h2
                className="
                  text-headline-lg-mobile
                  md:text-headline-lg
                  font-bold
                  text-white
                  uppercase
                  tracking-tight
                "
              >
                Hệ thống cửa hàng DUDI SOFTWARE
              </h2>

              <Send
                size={30}
                strokeWidth={2.5}
                className="
                  text-[#b91c1c]
                  rotate-[-45deg]
                  shrink-0
                  drop-shadow-[0_0_8px_rgba(185,28,28,0.5)]
                  transition-transform
                  duration-300
                  group-hover/card:scale-110
                "
              />
            </div>

            {/* Decorative line */}
            <div
              className="
                w-20
                h-1
                rounded-full
                bg-gradient-to-r
                from-[#b91c1c]
                to-[#ef4444]
                shadow-[0_0_10px_rgba(185,28,28,0.35)]
              "
            />

            {/* Contact information */}
            <div className="space-y-6">
              {/* Showroom 1 */}
              <div className="group flex items-start gap-4">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-lg
                    bg-[#b91c1c]/10
                    border
                    border-[#b91c1c]/20
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:bg-[#b91c1c]/20
                    group-hover:border-[#b91c1c]/50
                    group-hover:shadow-[0_0_15px_rgba(185,28,28,0.18)]
                  "
                >
                  <MapPin
                    size={21}
                    strokeWidth={2.4}
                    className="
                      text-[#b91c1c]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <p className="text-body-lg text-gray-200 leading-relaxed">
                  <strong className="text-white font-semibold">
                    Showroom 1:
                  </strong>{" "}
                  49/2 Đường 14, Phường Thủ Đức, TP.Hồ Chí Minh
                </p>
              </div>

              {/* Showroom 2 */}
              <div className="group flex items-start gap-4">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-lg
                    bg-[#b91c1c]/10
                    border
                    border-[#b91c1c]/20
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:bg-[#b91c1c]/20
                    group-hover:border-[#b91c1c]/50
                    group-hover:shadow-[0_0_15px_rgba(185,28,28,0.18)]
                  "
                >
                  <MapPin
                    size={21}
                    strokeWidth={2.4}
                    className="
                      text-[#b91c1c]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <p className="text-body-lg text-gray-200 leading-relaxed">
                  <strong className="text-white font-semibold">
                    Showroom 2:
                  </strong>{" "}
                  232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh
                </p>
              </div>

              {/* Working time */}
              <div className="group flex items-start gap-4">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-lg
                    bg-[#b91c1c]/10
                    border
                    border-[#b91c1c]/20
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:bg-[#b91c1c]/20
                    group-hover:border-[#b91c1c]/50
                  "
                >
                  <ChevronRight
                    size={21}
                    strokeWidth={2.5}
                    className="
                      text-[#b91c1c]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </div>

                <p className="text-body-lg text-gray-200 leading-relaxed">
                  Làm việc từ{" "}
                  <span className="text-white font-semibold">9:00 - 19:00</span>{" "}
                  tất cả các ngày trong tuần.
                </p>
              </div>

              {/* Hotline */}
              <div className="group flex items-center gap-4">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-lg
                    bg-[#b91c1c]/10
                    border
                    border-[#b91c1c]/20
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:bg-[#b91c1c]/20
                    group-hover:border-[#b91c1c]/50
                  "
                >
                  <Phone
                    size={21}
                    strokeWidth={2.4}
                    className="
                      text-[#b91c1c]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <p className="text-body-lg text-gray-200">
                  Hotline Hỗ Trợ:
                  <a
                    href="tel:0909163821"
                    className="
                      text-[#dc2626]
                      hover:text-white
                      font-bold
                      text-xl
                      ml-2
                      drop-shadow-[0_0_8px_rgba(220,38,38,0.25)]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    (+84) 909 163 821
                  </a>
                </p>
              </div>

              {/* Email */}
              <div className="group flex items-center gap-4">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-lg
                    bg-[#b91c1c]/10
                    border
                    border-[#b91c1c]/20
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:bg-[#b91c1c]/20
                    group-hover:border-[#b91c1c]/50
                  "
                >
                  <Mail
                    size={21}
                    strokeWidth={2.4}
                    className="
                      text-[#b91c1c]
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                <p className="text-body-lg text-gray-200">
                  Email:
                  <span className="text-white font-semibold ml-2 break-all">
                    contact@dudisoftware.com
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT: MAPS ==================== */}

          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            {/* ================= MAP THỦ ĐỨC ================= */}

            <div className="flex flex-col gap-4">
              {/* Map title */}
              <div className="flex items-center gap-2">
                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#b91c1c]
                    shrink-0
                    shadow-[0_0_10px_rgba(185,28,28,0.7)]
                  "
                />

                <span className="text-title-md font-bold text-white">
                  Chi nhánh Thủ Đức
                </span>
              </div>

              {/* Map card */}
              <div
                className="
                  group/map
                  relative
                  w-full
                  md:w-64
                  h-48
                  overflow-hidden
                  rounded-xl
                  bg-black
                  border
                  border-white/10
                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-1
                  hover:border-[#b91c1c]/70
                  hover:shadow-[0_15px_35px_rgba(185,28,28,0.25)]
                "
              >
                <img
                  src={thuDucImage}
                  className="
                    w-full
                    h-full
                    object-cover
                    opacity-75
                    transition-all
                    duration-700
                    ease-out
                    group-hover/map:scale-110
                    group-hover/map:opacity-100
                  "
                  alt="Map Thủ Đức"
                />

                {/* Hover overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/25
                    transition-all
                    duration-500
                    group-hover/map:bg-[#7f1d1d]/10
                  "
                />

                {/* Red gradient */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-transparent
                    to-transparent
                    pointer-events-none
                  "
                />

                {/* Maps button */}
                <div className="absolute top-4 left-4">
                  <a
                    href={thuDucMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      bg-white
                      text-[#991b1b]
                      px-3
                      py-1.5
                      rounded-md
                      flex
                      items-center
                      gap-1
                      text-body-sm
                      font-bold
                      shadow-md

                      transition-all
                      duration-300

                      hover:bg-[#b91c1c]
                      hover:text-white
                      hover:scale-105
                      hover:shadow-[0_5px_15px_rgba(185,28,28,0.35)]
                    "
                  >
                    Maps
                    <ExternalLink size={14} strokeWidth={2.5} />
                  </a>
                </div>

                {/* Hover label */}
                <div
                  className="
                    absolute
                    bottom-3
                    left-4
                    right-4
                    opacity-0
                    translate-y-2
                    transition-all
                    duration-300
                    group-hover/map:opacity-100
                    group-hover/map:translate-y-0
                  "
                >
                  <span className="text-xs font-semibold text-white">
                    Xem vị trí trên Google Maps
                  </span>
                </div>
              </div>
            </div>

            {/* ================= MAP BÌNH THẠNH ================= */}

            <div className="flex flex-col gap-4">
              {/* Map title */}
              <div className="flex items-center gap-2">
                <span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#b91c1c]
                    shrink-0
                    shadow-[0_0_10px_rgba(185,28,28,0.7)]
                  "
                />

                <span className="text-title-md font-bold text-white">
                  Chi nhánh Nguyễn Thị Minh Khai
                </span>
              </div>

              {/* Map card */}
              <div
                className="
                  group/map
                  relative
                  w-full
                  md:w-64
                  h-48
                  overflow-hidden
                  rounded-xl
                  bg-black
                  border
                  border-white/10
                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-1
                  hover:border-[#b91c1c]/70
                  hover:shadow-[0_15px_35px_rgba(185,28,28,0.25)]
                "
              >
                <img
                  src={binhThanhImage}
                  className="
                    w-full
                    h-full
                    object-cover
                    opacity-75
                    transition-all
                    duration-700
                    ease-out
                    group-hover/map:scale-110
                    group-hover/map:opacity-100
                  "
                  alt="Map Bình Thạnh"
                />

                {/* Hover overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/25
                    transition-all
                    duration-500
                    group-hover/map:bg-[#7f1d1d]/10
                  "
                />

                {/* Red gradient */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/60
                    via-transparent
                    to-transparent
                    pointer-events-none
                  "
                />

                {/* Maps button */}
                <div className="absolute top-4 left-4">
                  <a
                    href={binhThanhMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      bg-white
                      text-[#991b1b]
                      px-3
                      py-1.5
                      rounded-md
                      flex
                      items-center
                      gap-1
                      text-body-sm
                      font-bold
                      shadow-md

                      transition-all
                      duration-300

                      hover:bg-[#b91c1c]
                      hover:text-white
                      hover:scale-105
                      hover:shadow-[0_5px_15px_rgba(185,28,28,0.35)]
                    "
                  >
                    Maps
                    <ExternalLink size={14} strokeWidth={2.5} />
                  </a>
                </div>

                {/* Hover label */}
                <div
                  className="
                    absolute
                    bottom-3
                    left-4
                    right-4
                    opacity-0
                    translate-y-2
                    transition-all
                    duration-300
                    group-hover/map:opacity-100
                    group-hover/map:translate-y-0
                  "
                >
                  <span className="text-xs font-semibold text-white">
                    Xem vị trí trên Google Maps
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreSystem;
