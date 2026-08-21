import { BadgeCheck, MessageCircle, PhoneCall } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-20 md:py-24">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-black uppercase text-gray-900 md:text-4xl">
          Liên Hệ Báo Giá Ngay
        </h2>

        <p className="mb-12 text-base leading-relaxed text-gray-500 md:text-lg">
          Gửi ngay thông tin cấu hình máy của bạn để nhận báo giá nhanh chóng và
          chính xác nhất từ đội ngũ chuyên viên định giá.
        </p>

        {/* Contact buttons */}
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          {/* Hotline */}
          <a
            href="tel:0909163821"
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-red-600 bg-white px-8 py-5 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] transition-all hover:bg-red-600 hover:text-white hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] sm:w-auto"
          >
            <PhoneCall
              size={28}
              className="transition-transform group-hover:animate-bounce"
            />

            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                Hotline Tư Vấn
              </span>

              <span className="mt-1 block text-2xl font-black leading-none">
                (+84) 909 163 821
              </span>
            </div>
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/0909163821"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#0068FF] px-8 py-5 text-white transition-colors hover:bg-[#0052cc] sm:w-auto"
          >
            <MessageCircle size={28} />

            <div className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                Nhắn Tin Qua
              </span>

              <span className="mt-1 block text-2xl font-black leading-none">
                ZALO NGAY
              </span>
            </div>
          </a>
        </div>

        {/* Note */}
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <BadgeCheck size={18} className="text-red-600" />
          Hỗ trợ tư vấn 24/7 - Hoàn toàn miễn phí
        </p>
      </div>
    </section>
  );
}
