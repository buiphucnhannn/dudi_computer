import { ArrowDown, Phone } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative flex h-[600px] w-full items-center overflow-hidden bg-[#f8f9fa] bg-cover bg-center bg-no-repeat md:h-[700px]"
      style={{
        backgroundImage: "url('/tradeinbg.webp')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-[#f8f9fa]/75" />

      {/* Background gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/90 to-transparent" />

      {/* Background image bên phải */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <img
          src="https://lh3.googleusercontent.com/aida/AP1WRLtMLMfeCGf63qqXlG_LVppdzNPWp7UMNo0gtnXzgKoyC53Znoq8iaw-3-oj7HXiFLHrxt618dG3UQnKbmBH5w7ulEt9p85skBLOkQMq-mIxrzUkYKvRrYqqIEQn_yl4M2znqVY8-syfZKtaA1QFlV_GOTrCveK3bYtji8gCK-nTTzK0C1z8NJ25ub4bLtDBIvDEt2pRxj3w2Lr2ococ5eUTNr0jo59q14hiThMDYDXJi4JAaSeeN8uh60DH"
          alt="DUDI SOFTWARE Gaming"
          className="h-full w-full object-cover opacity-80 md:w-3/4"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa]/40 via-transparent to-[#f8f9fa]/40" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-6">
          {/* Badge */}
          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />

            <span className="text-xs font-bold uppercase tracking-widest text-red-600">
              Chương Trình Đặc Biệt
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-black uppercase leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Thu Mua{" "}
            <span className="block text-red-600 md:inline">PC & Laptop Cũ</span>
            <br />
            <span className="text-gray-800">Thủ Tục Nhanh Gọn</span>
          </h1>

          {/* Description */}
          <p className="mt-2 max-w-lg text-lg font-light leading-relaxed text-gray-600">
            DUDI SOFTWARE thu mua Laptop & PC Gaming cũ với{" "}
            <strong className="font-semibold text-gray-900">giá cực tốt</strong>
            . Đặc biệt trợ giá lên đời thêm tới{" "}
            <strong className="text-xl font-bold text-red-600">
              2.000.000đ
            </strong>
            .
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="tel:0909163821"
              className="group inline-flex items-center justify-center gap-2 rounded bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
            >
              <Phone
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              GỌI ĐỊNH GIÁ NGAY
            </a>

            <a
              href="#kham-pha"
              className="inline-flex items-center justify-center gap-2 rounded border border-gray-300 px-8 py-4 text-sm font-bold uppercase tracking-wide text-gray-900 transition-all hover:border-red-600 hover:text-red-600"
            >
              KHÁM PHÁ
              <ArrowDown size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-10 right-10 z-20 hidden gap-4 md:flex">
        <div className="flex flex-col items-center justify-center rounded border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
          <span className="text-3xl font-black leading-none text-red-600">
            5P
          </span>

          <span className="mt-1 text-xs font-bold uppercase text-gray-500">
            Test Nhanh
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded border border-gray-200 bg-white/70 p-4 shadow-sm backdrop-blur-md">
          <span className="text-3xl font-black leading-none text-red-600">
            100%
          </span>

          <span className="mt-1 text-xs font-bold uppercase text-gray-500">
            Bảo Mật
          </span>
        </div>
      </div>
    </section>
  );
}
