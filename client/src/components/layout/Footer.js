import Link from "next/link";
import StoreLocations from "@/components/home/StoreLocations";

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0f19] text-white/80 font-sans mt-0 border-t border-white/10 overflow-hidden">
      {/* 2 Khối ánh sáng mờ hậu cảnh: Đỏ góc trên trái + Xanh Sapphire góc dưới phải */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#eb1c24]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-4 right-1/10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hệ thống cửa hàng Showroom */}
        <StoreLocations />

        {/* 5 Cột Footer chuẩn 100% zcomputer.vn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 relative z-10 pt-10 border-t border-white/10">
          {/* Cột 1: Thông tin thương hiệu + Fanpage Facebook Widget */}
          <div className="md:col-span-6 lg:col-span-3 pr-0 lg:pr-4 space-y-4">
            {/* Logo trắng bo góc */}
            <Link href="/" className="inline-block bg-white px-5 py-3 rounded-2xl shadow-md hover:opacity-95 transition-opacity">
              <div className="flex items-center gap-2.5 select-none">
                <img
                  src="https://zcomputer.vn/logo-main.png"
                  alt="ZCOMPUTER Logo"
                  className="h-11 w-auto object-contain"
                />
                <div className="flex items-center font-serif tracking-tight select-none">
                  <span className="text-[#eb1c24] text-[36px] font-black leading-none pb-[2px]">
                    Z
                  </span>
                  <div className="flex flex-col justify-center ml-1 font-sans">
                    <span className="text-[#0B1527] text-[19px] font-black leading-[0.8]">
                      COMPUTER
                    </span>
                    <span className="text-[6px] font-black text-[#eb1c24] uppercase mt-1 tracking-tight">
                      PC GAMING - LAPTOP - WORKSTATION
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              ZCOMPUTER - Hệ thống chuyên cung cấp PC, Laptop Cũ / Like New uy tín, chất lượng cao với mức giá tốt nhất tại khu vực TP.HCM.
            </p>

            {/* Fanpage Facebook Card Widget */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase text-white/80 block tracking-wider">
                THEO DÕI ZCOMPUTER TẠI
              </span>
              <div className="bg-white text-gray-900 p-3.5 rounded-2xl shadow-md border border-gray-100 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://zcomputer.vn/logo-main.png"
                    alt="ZComputer Avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 p-0.5 object-contain shrink-0"
                  />
                  <div>
                    <h5 className="text-[12.5px] font-bold text-gray-900 leading-tight">
                      Z Computer : Gaming.Nox.Office - All for your PC
                    </h5>
                    <span className="text-[10px] text-gray-400">All for your PC</span>
                  </div>
                </div>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-max bg-[#f0f2f5] hover:bg-[#e4e6eb] text-[#050505] font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Theo dõi Trang</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: DANH MỤC CŨ/ LIKE NEW */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              DANH MỤC CŨ/ LIKE NEW
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/pc-cu" className="hover:text-[#dc2626] transition-colors">PC Cũ</Link></li>
              <li><Link href="/laptop-cu" className="hover:text-[#dc2626] transition-colors">Laptop Cũ</Link></li>
              <li><Link href="/man-hinh" className="hover:text-[#dc2626] transition-colors">Màn Hình Cũ</Link></li>
              <li><Link href="/san-pham" className="hover:text-[#dc2626] transition-colors">Linh Kiện Cũ</Link></li>
              <li><Link href="/cong-cu-test/ban-phim" className="hover:text-[#dc2626] transition-colors">Công Cụ Test</Link></li>
            </ul>
          </div>

          {/* Cột 3: CHÍNH SÁCH TỔNG HỢP */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              CHÍNH SÁCH TỔNG HỢP
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-[#dc2626] transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-[#dc2626] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-[#dc2626] transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-[#dc2626] transition-colors">Chính sách thanh toán</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="hover:text-[#dc2626] transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="/huong-dan-tra-gop" className="hover:text-[#dc2626] transition-colors">Hướng dẫn trả góp</Link></li>
            </ul>
          </div>

          {/* Cột 4: VỀ ZCOMPUTER */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              VỀ ZCOMPUTER
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 mb-5">
              <li><Link href="/lien-he" className="hover:text-[#dc2626] transition-colors">Liên Hệ</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-[#dc2626] transition-colors">Tin Tức</Link></li>
              <li><Link href="/tuyen-dung" className="hover:text-[#dc2626] transition-colors">Tuyển Dụng</Link></li>
              <li><Link href="/he-thong-showroom" className="hover:text-[#dc2626] transition-colors">Hệ Thống Cửa Hàng</Link></li>
              <li><Link href="/gioi-thieu" className="hover:text-[#dc2626] transition-colors">Giới Thiệu Về ZCOMPUTER</Link></li>
            </ul>

            {/* HỖ TRỢ THANH TOÁN */}
            <h5 className="text-[11px] font-black text-white uppercase mb-2">HỖ TRỢ THANH TOÁN</h5>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              <div className="bg-white text-gray-900 rounded p-1 text-center font-black text-[10px] flex items-center justify-center">
                VISA
              </div>
              <div className="bg-white text-red-600 rounded p-1 text-center font-black text-[10px] flex items-center justify-center">
                mastercard
              </div>
              <div className="bg-white text-blue-600 rounded p-1 text-center font-black text-[10px] flex items-center justify-center">
                JCB
              </div>
              <div className="bg-white text-red-600 rounded p-1 text-center font-black text-[9px] flex items-center justify-center">
                VNPAY<span className="text-blue-600">QR</span>
              </div>
              <div className="bg-white text-sky-600 rounded p-1 text-center font-black text-[9px] flex items-center justify-center">
                Zalo<span className="text-blue-700">pay</span>
              </div>
              <div className="bg-white text-blue-700 rounded p-1 text-center font-black text-[9px] flex items-center justify-center">
                napas
              </div>
            </div>

            {/* HỖ TRỢ TRẢ GÓP */}
            <h5 className="text-[11px] font-black text-white uppercase mb-2">HỖ TRỢ TRẢ GÓP</h5>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-white text-red-700 rounded p-1 text-center font-bold text-[8px] flex items-center justify-center">
                HD SAISON
              </div>
              <div className="bg-white text-orange-600 rounded p-1 text-center font-bold text-[8px] flex items-center justify-center">
                MIRAE ASSET
              </div>
              <div className="bg-white text-sky-500 rounded p-1 text-center font-bold text-[8px] flex items-center justify-center">
                Kredivo
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Info */}
        <div className="pt-6 text-xs text-gray-400 space-y-1.5 leading-relaxed">
          <div className="font-bold text-white text-sm">CÔNG TY TNHH TM DV ZCOM</div>
          <div>
            <strong>Mã số GPKD:</strong> 0317130199 - Cấp bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh.
          </div>
          <div>
            <strong>Địa chỉ Trụ Sở:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM.
          </div>
          <div>
            <strong>Email:</strong> truong.zvncomputer@gmail.com | <strong>Hotline:</strong> 0977 334 415
          </div>
          <div className="pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
            <p>© 2026 ZCOMPUTER. All rights reserved.</p>
            <p>Thiết kế clone giao diện chuẩn xác 100% zcomputer.vn.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
