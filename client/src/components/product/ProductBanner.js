"use client";

export default function ProductBanner() {
  return (
    <div className="mb-5 overflow-hidden rounded-2xl shadow-xs border border-slate-700/40 bg-gradient-to-r from-[#0a0c10] via-[#141824] to-[#0a0c10] relative select-none">
      {/* Showroom background with dark gradient overlay */}
      <img
        src="/images/dudi/dudi_showroom_hero.webp"
        alt="DUDI SOFTWARE Showroom"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-25 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10] via-[#0a0c10]/80 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-32 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-5 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img
            src="/images/dudi/dudisoftware4.webp"
            alt="DUDI SOFTWARE Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md rounded-2xl shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                DUDI SOFTWARE
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-extrabold border border-red-500/30 uppercase tracking-wider">
                CHÍNH HÃNG 100%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 line-clamp-1">
              Bộ sưu tập Laptop Gaming, PC Workstation, Linh kiện & Gaming Gear cao cấp
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-semibold mt-1.5">
              <span>⚡ Bảo hành 1 đổi 1 siêu tốc</span>
              <span>•</span>
              <span>🚚 Giao hàng hỏa tốc toàn quốc</span>
              <span>•</span>
              <span>💰 Hỗ trợ trả góp 0% lãi suất</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
              HOTLINE TƯ VẤN 24/7
            </span>
            <span className="text-sm font-black text-red-400 tracking-wide">
              (+84) 909 163 821
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
