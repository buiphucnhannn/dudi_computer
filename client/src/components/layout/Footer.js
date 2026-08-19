import Link from "next/link";
import { Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-gray-300 pt-12 pb-8 mt-12 border-t-2 border-[#dc2626]">
      <div className="container mx-auto px-4">
        {/* Top Footer: Brand, Fanpage, Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800">
          {/* Col 1 & 2: Brand info + Facebook box */}
          <div className="lg:col-span-2 space-y-4">
            {/* White Logo Card */}
            <div className="bg-white px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-sm">
              <img
                src="https://zcomputer.vn/logo-main.png"
                alt="ZComputer Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="flex items-center font-serif tracking-tight select-none">
                <span className="text-[#dc2626] text-[34px] font-black leading-none pb-[2px]">
                  Z
                </span>
                <div className="flex flex-col justify-center ml-1 font-sans">
                  <span className="text-[#0B1527] text-[18px] font-black leading-[0.8]">
                    COMPUTER
                  </span>
                  <span className="text-[5.5px] font-black text-[#dc2626] uppercase mt-1">
                    PC GAMING - LAPTOP - WORKSTATION
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              ZCOMPUTER - Hệ thống chuyên cung cấp PC, Laptop Cũ / Like New uy
              tín, chất lượng cao với mức giá tốt nhất tại khu vực TP.HCM.
            </p>

            {/* Fanpage Widget */}
            <div className="space-y-2 max-w-md">
              <span className="text-[10.5px] font-black uppercase text-gray-400 block tracking-wider">
                THEO DÕI ZCOMPUTER TẠI
              </span>
              <div className="bg-gray-800/90 p-3 rounded-xl border border-gray-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center font-bold">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-tight">
                      Z Computer : Gaming.Nox.Office
                    </h5>
                    <span className="text-[10px] text-gray-400">
                      All for your PC
                    </span>
                  </div>
                </div>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold rounded-md transition-colors"
                >
                  Theo dõi
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Danh Mục Cũ / Like New */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-l-2 border-[#dc2626] pl-2.5">
              DANH MỤC CŨ/ LIKE NEW
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  href="/pc-cu"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  PC Cũ
                </Link>
              </li>
              <li>
                <Link
                  href="/laptop-cu"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Laptop Cũ
                </Link>
              </li>
              <li>
                <Link
                  href="/man-hinh"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Màn Hình Cũ
                </Link>
              </li>
              <li>
                <Link
                  href="/product"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Linh Kiện Cũ
                </Link>
              </li>
              <li>
                <Link
                  href="/cong-cu-test/ban-phim"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Công Cụ Test
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Chính Sách Tổng Hợp */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-l-2 border-[#dc2626] pl-2.5">
              CHÍNH SÁCH TỔNG HỢP
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link
                  href="/chinh-sach-doi-tra"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-thanh-toan"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Chính sách thanh toán
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-van-chuyen"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/huong-dan-tra-gop"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Hướng dẫn trả góp
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Về ZComputer & Payment */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-l-2 border-[#dc2626] pl-2.5">
              VỀ ZCOMPUTER
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 mb-5">
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link
                  href="/tuyen-dung"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/he-thong-showroom"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Hệ Thống Cửa Hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu"
                  className="hover:text-[#dc2626] transition-colors"
                >
                  Giới Thiệu Về ZCOMPUTER
                </Link>
              </li>
            </ul>

            {/* HỖ TRỢ THANH TOÁN */}
            <h5 className="text-[11px] font-black text-white uppercase mb-2">
              HỖ TRỢ THANH TOÁN
            </h5>
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
            <h5 className="text-[11px] font-black text-white uppercase mb-2">
              HỖ TRỢ TRẢ GÓP
            </h5>
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
          <div className="font-bold text-white text-sm">
            CÔNG TY TNHH TM DV ZCOM
          </div>
          <div>
            <strong>Mã số GPKD:</strong> 0317130199 - Cấp bởi Sở Kế Hoạch và Đầu
            Tư TP. Hồ Chí Minh.
          </div>
          <div>
            <strong>Địa chỉ Trụ Sở:</strong> 23 Đường số 1, Khu phố 61, Phường
            Linh Xuân, TP. Thủ Đức, TP.HCM.
          </div>
          <div>
            <strong>Email:</strong> truong.zvncomputer@gmail.com |{" "}
            <strong>Hotline:</strong> 0977 334 415
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
