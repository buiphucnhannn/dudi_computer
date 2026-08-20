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

            <p className="text-[13px] text-white/70 leading-relaxed font-normal">
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
                    <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                      3.185 người theo dõi
                    </span>
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
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/pc-cu" className="hover:text-[#eb1c24] transition-colors">PC Cũ</Link></li>
              <li><Link href="/laptop-cu" className="hover:text-[#eb1c24] transition-colors">Laptop Cũ</Link></li>
              <li><Link href="/man-hinh" className="hover:text-[#eb1c24] transition-colors">Màn Hình Cũ</Link></li>
              <li><Link href="/san-pham" className="hover:text-[#eb1c24] transition-colors">Linh Kiện Cũ</Link></li>
              <li><Link href="/cong-cu-test" className="hover:text-[#eb1c24] transition-colors">Công Cụ Test</Link></li>
            </ul>
          </div>

          {/* Cột 3: CHÍNH SÁCH TỔNG HỢP */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              CHÍNH SÁCH TỔNG HỢP
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-[#eb1c24] transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-[#eb1c24] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-[#eb1c24] transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-[#eb1c24] transition-colors">Chính sách thanh toán</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="hover:text-[#eb1c24] transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="/huong-dan-tra-gop" className="hover:text-[#eb1c24] transition-colors">Hướng dẫn trả góp</Link></li>
            </ul>
          </div>

          {/* Cột 4: VỀ ZCOMPUTER */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              VỀ ZCOMPUTER
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/lien-he" className="hover:text-[#eb1c24] transition-colors">Liên Hệ</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-[#eb1c24] transition-colors">Tin Tức</Link></li>
              <li><Link href="/tuyen-dung" className="hover:text-[#eb1c24] transition-colors">Tuyển Dụng</Link></li>
              <li><Link href="/he-thong-showroom" className="hover:text-[#eb1c24] transition-colors">Hệ Thống Cửa Hàng</Link></li>
              <li><Link href="/gioi-thieu" className="hover:text-[#eb1c24] transition-colors">Giới Thiệu Về ZCOMPUTER</Link></li>
            </ul>
          </div>

          {/* Cột 5: HỖ TRỢ THANH TOÁN & TRẢ GÓP */}
          <div className="md:col-span-8 lg:col-span-3 space-y-6">
            {/* HỖ TRỢ THANH TOÁN (SVG Chính Hãng) */}
            <div>
              <h4 className="font-black uppercase mb-4 text-[14px] text-white tracking-wider">
                HỖ TRỢ THANH TOÁN
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {/* VISA */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 24 24" className="h-[20px] w-auto fill-[#1434CB]">
                    <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 100 60" className="h-[22px] w-auto">
                    <circle fill="#ea001b" cx="30" cy="30" r="30" />
                    <circle fill="#f79e1b" cx="70" cy="30" r="30" />
                    <path fill="#ff5f00" d="M50 52.4A30 30 0 0 1 50 7.6a30 30 0 0 0 0 44.8z" />
                  </svg>
                </div>

                {/* JCB */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] overflow-hidden hover:shadow-md transition-all">
                  <svg viewBox="0 0 100 70" className="h-[22px] w-auto">
                    <rect x="0" y="15" width="31" height="40" rx="4" fill="#003883" />
                    <rect x="34.5" y="15" width="31" height="40" rx="4" fill="#C11030" />
                    <rect x="69" y="15" width="31" height="40" rx="4" fill="#007F3E" />
                    <path fill="#fff" d="M22 28h-6v10c0 3-1.5 4-4 4s-4-1-4-4v-1H5v2c0 5 3 6 7 6 5 0 7-2 7-7V28zM57 39c-1 1-3 2-6 2-4 0-7-2-7-6s3-6 7-6c3 0 5 1 6 2l-2 3c-1-1-2-1-3-1-2 0-3 1-3 3 0 1 1 2 3 2 1 0 2 0 3-1l2 2zM91 35c2-1 3-2 3-4 0-3-2-4-5-4h-9v14h10c2 0 4-1 4-4 0-1-1-2-3-2zM83 30h4c1 0 2 1 2 2 0 1-1 2-2 2h-4v-4zm0 8v-4h4c1 0 2 0 2 2s-1 2-2 2h-4z" />
                  </svg>
                </div>

                {/* VNPAY QR */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] hover:shadow-md transition-all">
                  <span className="font-bold text-[14px] tracking-tighter text-[#ED1C24] font-sans">
                    VNPAY<sup className="text-[7px] font-black text-[#005BAB] ml-[1px]">QR</sup>
                  </span>
                </div>

                {/* Zalopay */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] hover:shadow-md transition-all">
                  <span className="font-bold text-[15px] tracking-tight font-sans">
                    <span className="text-[#0052CC]">Zalo</span>
                    <span className="text-[#00B14F]">pay</span>
                  </span>
                </div>

                {/* napas* */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center p-2 shadow-xs h-[42px] hover:shadow-md transition-all">
                  <span className="text-[#002776] font-black italic text-[16px] tracking-tighter flex items-center gap-[1px] font-sans">
                    napas
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#4E9C2D" className="mt-[-6px]">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* HỖ TRỢ TRẢ GÓP (Logo Ảnh Chính Hãng) */}
            <div>
              <h4 className="font-black uppercase mb-4 text-[14px] text-white tracking-wider">
                HỖ TRỢ TRẢ GÓP
              </h4>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* HD SAISON */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center shadow-xs h-[42px] hover:shadow-md transition-all overflow-hidden p-1.5">
                  <img
                    src="https://zcomputer.vn/HD_SAISON_logo.jpg"
                    alt="HD SAISON"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* MIRAE ASSET */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center shadow-xs h-[42px] hover:shadow-md transition-all overflow-hidden p-1.5">
                  <img
                    src="https://zcomputer.vn/Mirae-Asset-logo.png"
                    alt="MIRAE ASSET"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Kredivo */}
                <div className="bg-white border border-gray-100 rounded-md flex items-center justify-center shadow-xs h-[42px] hover:shadow-md transition-all overflow-hidden p-1.5">
                  <img
                    src="https://zcomputer.vn/Kredivo-logo.png"
                    alt="Kredivo"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* DMCA Badge */}
              <a
                href="https://www.dmca.com/Protection/Status.aspx"
                target="_blank"
                rel="noreferrer"
                className="inline-block hover:opacity-90 transition-opacity"
                title="DMCA.com Protection Status"
              >
                <img
                  src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-01.png"
                  alt="DMCA.com Protection Status"
                  className="h-[26px] w-auto object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Vùng chân trang Bản quyền & Pháp lý (Thuần NỀN ĐEN #050608, KHÔNG CÓ ÁNH XANH) */}
      <div className="w-full bg-[#050608] border-t border-white/5 py-8 text-center text-xs text-white/50 space-y-2 relative z-20">
        <div className="container mx-auto px-4 space-y-2">
          <h5 className="font-black text-white text-sm uppercase tracking-wide">
            CÔNG TY TNHH TM DV ZCOM
          </h5>
          <p className="text-[12.5px] text-white/60">
            <strong>Mã số GPKD:</strong> 0317130199 - Cấp bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh.
          </p>
          <p className="text-[12.5px] text-white/60">
            <strong>Địa chỉ Trụ Sở:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM.
          </p>
          <p className="text-[12.5px] text-white/60">
            <strong>Email:</strong> truong.zvncomputer@gmail.com | <strong>Hotline:</strong> 0977 334 415
          </p>
          <div className="pt-3 text-[12px] text-white/40">
            © 2026 <strong>ZCOMPUTER</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
