import { ArrowDown, Phone, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[440px] md:min-h-[500px] lg:min-h-[520px] w-full items-center overflow-hidden bg-[#f8f9fa] bg-cover bg-center bg-no-repeat py-8 sm:py-10 md:py-12"
      style={{
        backgroundImage: "url('/tradeinbg.webp')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-[#f8f9fa]/80" />

      {/* Background gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/95 to-transparent" />

      {/* Background image bên phải */}
      <div className="absolute inset-0 z-0 flex justify-end pointer-events-none">
        <img
          src="https://lh3.googleusercontent.com/aida/AP1WRLtMLMfeCGf63qqXlG_LVppdzNPWp7UMNo0gtnXzgKoyC53Znoq8iaw-3-oj7HXiFLHrxt618dG3UQnKbmBH5w7ulEt9p85skBLOkQMq-mIxrzUkYKvRrYqqIEQn_yl4M2znqVY8-syfZKtaA1QFlV_GOTrCveK3bYtji8gCK-nTTzK0C1z8NJ25ub4bLtDBIvDEt2pRxj3w2Lr2ococ5eUTNr0jo59q14hiThMDYDXJi4JAaSeeN8uh60DH"
          alt="ZComputer Gaming"
          className="h-full w-full object-cover opacity-75 md:w-2/3 lg:w-3/5"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa]/60 via-transparent to-[#f8f9fa]/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-3.5 sm:gap-4">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200/80 bg-red-50/80 px-3.5 py-1 shadow-2xs backdrop-blur-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
              CHƯƠNG TRÌNH THU CŨ ĐỔI MỚI
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black uppercase leading-tight tracking-tight text-slate-900 drop-shadow-2xs">
            Thu Mua{" "}
            <span className="text-[#eb1c24]">PC & Laptop Cũ</span>
            <br />
            <span className="text-slate-800">Thủ Tục Nhanh Gọn</span>
          </h1>

          {/* Description */}
          <p className="max-w-xl text-xs sm:text-sm md:text-[15px] font-normal leading-relaxed text-slate-600">
            ZComputer thu mua Laptop & PC Gaming cũ với{" "}
            <strong className="font-bold text-slate-900">giá cực tốt</strong>
            . Đặc biệt trợ giá lên đời thêm tới{" "}
            <strong className="font-extrabold text-red-600">
              2.000.000đ
            </strong>
            , thanh toán nhanh chóng chỉ trong 5 phút.
          </p>

          {/* Buttons */}
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-3">
            <a
              href="tel:0909163821"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:scale-95"
            >
              <Phone
                size={16}
                className="transition-transform group-hover:scale-110"
              />
              GỌI ĐỊNH GIÁ NGAY
            </a>

            <a
              href="#kham-pha"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white/90 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-800 backdrop-blur-xs transition-all hover:border-red-600 hover:text-red-600 hover:bg-red-50/50 cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>KHÁM PHÁ</span>
              <ArrowDown size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats Badges */}
      <div className="absolute bottom-6 right-6 lg:right-12 z-20 hidden md:flex items-center gap-3">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-md backdrop-blur-md">
          <span className="text-2xl font-black leading-none text-red-600">
            5P
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Test Nhanh
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-md backdrop-blur-md">
          <span className="text-2xl font-black leading-none text-red-600">
            100%
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Tiền Mặt / CK
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-md backdrop-blur-md">
          <span className="text-2xl font-black leading-none text-emerald-600">
            +2TR
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Trợ Giá Lên Đời
          </span>
        </div>
      </div>
    </section>
  );
}
