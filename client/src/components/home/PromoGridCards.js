import Link from "next/link";

export default function PromoGridCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-2.5 sm:gap-3 items-stretch">
      {/* Cột trái (Khớp chính xác chiều rộng 260px với CategorySidebar ở trên): Card Tư vấn BUILD PC GAMING */}
      <div className="bg-gradient-to-br from-[#eb1c24] to-[#b91c1c] text-white p-5 rounded-2xl shadow-xs flex flex-col justify-between group h-full min-h-[160px]">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-red-100">
              Tư vấn miễn phí 24/7
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black leading-tight mb-2 text-white drop-shadow-xs">
            BUILD PC GAMING
            <br />
            <span className="text-yellow-300">NHẬN QUÀ KHỦNG</span>
          </h2>
        </div>
        <a
          href="https://m.me/dudisoftware"
          target="_blank"
          rel="noreferrer"
          className="bg-white text-[#eb1c24] font-bold text-xs px-4 py-2 rounded-lg w-fit shadow-xs group-hover:bg-yellow-400 group-hover:text-red-900 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4 text-[#1877F2] fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Nhắn tin Fanpage</span>
        </a>
      </div>

      {/* Cột phải (1fr): 3 Banner con được chia đều 3 cột */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Card 2: BACK TO SCHOOL */}
        <Link
          href="/back-to-school"
          className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 h-full min-h-[160px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://zcomputer.vn/uploads/image-1783241558898-515012004.webp"
            alt="Back to school"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Card 3: THU CŨ ĐỔI MỚI */}
        <Link
          href="/trade-in"
          className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 h-full min-h-[160px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://zcomputer.vn/uploads/image-1783241574331-418008867.webp"
            alt="Thu cũ đổi mới"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Card 4: GIỚI THIỆU BẠN BÈ */}
        <Link
          href="/referral"
          className="rounded-2xl overflow-hidden shadow-xs hover:opacity-95 transition-transform hover:scale-[1.01] block bg-gray-100 h-full min-h-[160px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://zcomputer.vn/uploads/image-1783241586922-863037014.webp"
            alt="Giới thiệu bạn bè"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
