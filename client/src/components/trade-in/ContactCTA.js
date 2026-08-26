import { BadgeCheck, MessageCircle, PhoneCall } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50/80 py-10 sm:py-12 md:py-14 border-t border-slate-200/60">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-black uppercase tracking-wider text-red-600 mb-1 block">
          KẾT NỐI VỚI CHÚNG TÔI
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
          Liên Hệ Báo Giá Ngay
        </h2>

        <div className="mt-2 mb-3 mx-auto h-1 w-16 rounded-full bg-red-600 shadow-2xs" />

        <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-500 max-w-xl mx-auto">
          Gửi ngay thông tin cấu hình máy của bạn để nhận báo giá nhanh chóng và
          chính xác nhất từ đội ngũ chuyên viên định giá.
        </p>

        {/* Contact buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Hotline */}
          <a
            href="tel:0909163821"
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-red-600 bg-white px-6 py-3.5 text-red-600 shadow-sm transition-all hover:bg-red-600 hover:text-white hover:shadow-md cursor-pointer active:scale-95 sm:w-auto"
          >
            <PhoneCall
              size={20}
              className="transition-transform group-hover:scale-110"
            />

            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wider opacity-80">
                Hotline Tư Vấn
              </span>

              <span className="block text-lg font-black leading-none mt-0.5">
                0909 163 821
              </span>
            </div>
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/2871243904030074512"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0068FF] px-6 py-3.5 text-white transition-all hover:bg-[#0052cc] shadow-sm hover:shadow-md cursor-pointer active:scale-95 sm:w-auto"
          >
            <MessageCircle size={20} />

            <div className="text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wider opacity-80">
                Nhắn Tin Qua
              </span>

              <span className="block text-lg font-black leading-none mt-0.5">
                ZALO NGAY
              </span>
            </div>
          </a>
        </div>

        {/* Note */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <BadgeCheck size={16} className="text-emerald-600" />
          <span>Hỗ trợ định giá 24/7 - Hoàn toàn miễn phí</span>
        </p>
      </div>
    </section>
  );
}
