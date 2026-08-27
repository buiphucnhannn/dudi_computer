import Link from "next/link";
import {
  Monitor,
  Cpu,
  Zap,
  ShieldCheck,
  Award,
  Wrench,
  Users,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Headphones,
  Truck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

export const metadata = {
  title: "Giới Thiệu Về DUDI SOFTWARE - Chất Lượng Thực, Giá Trị Thực",
  description:
    "DUDI SOFTWARE chuyên cung cấp các dòng máy PC, Laptop Gaming, Workstation uy tín giá rẻ tại TP.HCM.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans bg-[#f8fafc] text-slate-800">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMB */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/80 py-2.5">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#eb1c24] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Giới thiệu DUDI SOFTWARE</span>
          </nav>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO HEADER SECTION (Vừa vặn, hiện đại, gọn gàng) */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19] text-white pt-10 pb-12 md:pt-14 md:pb-16 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-red-400 mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#eb1c24]" />
              <span className="tracking-wide uppercase">Thương Hiệu Công Nghệ Uy Tín Tại TP.HCM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-3.5">
              Chất Lượng Thực -{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb1c24] via-red-400 to-orange-400">
                Giá Trị Thực
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-xl mx-auto font-normal">
              Đồng hành cùng game thủ, sinh viên và doanh nghiệp với giải pháp PC Gaming, Laptop &amp; Máy trạm tối ưu hiệu năng trên từng đồng ngân sách.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              <Link
                href="/product"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#eb1c24] hover:text-white border border-white/10 hover:border-[#eb1c24] transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shadow-sm group"
              >
                <Monitor className="w-3.5 h-3.5 text-[#eb1c24] group-hover:text-white transition-colors" />
                <span>PC Gaming &amp; Đồ Họa</span>
              </Link>
              <Link
                href="/product"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#eb1c24] hover:text-white border border-white/10 hover:border-[#eb1c24] transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shadow-sm group"
              >
                <Cpu className="w-3.5 h-3.5 text-[#eb1c24] group-hover:text-white transition-colors" />
                <span>PC Workstation</span>
              </Link>
              <Link
                href="/product"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#eb1c24] hover:text-white border border-white/10 hover:border-[#eb1c24] transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shadow-sm group"
              >
                <Zap className="w-3.5 h-3.5 text-[#eb1c24] group-hover:text-white transition-colors" />
                <span>Laptop Like New</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Strip (Gọn gàng vừa khung) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-[#eb1c24] flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">100% Chính Hãng</p>
                <p className="text-slate-400 text-[11px] truncate">Linh kiện tuyển chọn</p>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Bảo Hành 1 Đổi 1</p>
                <p className="text-slate-400 text-[11px] truncate">Xử lý siêu tốc</p>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Giao Hỏa Tốc 2H</p>
                <p className="text-slate-400 text-[11px] truncate">Nội thành TP.HCM</p>
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-xs sm:text-sm truncate">Hỗ Trợ 24/7</p>
                <p className="text-slate-400 text-[11px] truncate">Kỹ thuật tận tâm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT STORY SECTION (Vừa vặn & Cân đối) */}
      {/* ========================================================================= */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#eb1c24] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Câu Chuyện Thương Hiệu</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                Về Chúng Tôi — <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                <strong className="text-slate-900 font-bold">DUDI SOFTWARE</strong> mang đến các giải pháp PC &amp; Laptop tối ưu với triết lý <strong className="text-[#eb1c24] font-bold">&quot;Chất lượng thực - Giá trị thực&quot;</strong>. Mỗi sản phẩm xuất xưởng đều được kiểm định phần cứng khắt khe và bảo hành chu đáo.
              </p>

              {/* 3 Visual Mini Feature Cards (Gọn gàng, trực quan, không bị dài dòng) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#eb1c24] flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Kiểm Định 24H</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Stress-test tải nặng &amp; linh kiện chuẩn 100%</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Đúng Ngân Sách</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">Tư vấn chuẩn nhu cầu, giá tốt nhất TP.HCM</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Hậu Mãi Trọn Đời</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">1 đổi 1 siêu tốc, miễn phí vệ sinh máy</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#eb1c24] hover:bg-[#d01720] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <span>Xem Tất Cả Sản Phẩm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span>Liên Hệ Tư Vấn</span>
                </Link>
              </div>
            </div>

            {/* Right Image Showcase Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
                <img
                  alt="DUDI SOFTWARE PC Showcase"
                  loading="lazy"
                  className="w-full h-[280px] sm:h-[320px] md:h-[340px] object-cover group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Highlight Card */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-100 text-[#eb1c24] flex items-center justify-center font-black text-sm">
                      ★
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-xs">50.000+ Khách Hàng</p>
                      <p className="text-slate-500 text-[10px]">Tin tưởng tại TP.HCM</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[11px]">
                    99.8% Hài Lòng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE VALUES SECTION (Gọn gàng, tỉ lệ chuẩn vừa màn hình) */}
      {/* ========================================================================= */}
      <section className="py-12 md:py-16 bg-[#f1f5f9] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 text-[#eb1c24] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Cam Kết Chất Lượng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Giá Trị Cốt Lõi Tại DUDI SOFTWARE
            </h2>
            <div className="w-16 h-1 bg-[#eb1c24] mx-auto mt-2 rounded-full" />
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              6 nguyên tắc vàng mang lại sự an tâm tuyệt đối và giá trị thực tế cho khách hàng
            </p>
          </div>

          {/* 6 Value Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-[#eb1c24] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-[#eb1c24] transition-colors">
                    #01
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#eb1c24] transition-colors mb-1.5">
                  Chất Lượng Đảm Bảo
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  100% sản phẩm bán ra đều trải qua quy trình kiểm tra phần cứng nghiêm ngặt để đảm bảo máy hoạt động ổn định và bền bỉ.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-red-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stress-Test Tải Nặng 24H</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-amber-500 transition-colors">
                    #02
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-1.5">
                  Giá Cả Cạnh Tranh
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Tối ưu hóa quy trình để mang đến mức giá cực kỳ tốt cho các sản phẩm PC và Laptop Like New tại thị trường TP.HCM.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Hỗ Trợ Trả Góp 0% Lãi Suất</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                    #03
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Hậu Mãi Tận Tâm
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Chế độ bảo hành dài hạn, hỗ trợ xử lý sự cố phần mềm và phần cứng chu đáo, giúp khách hàng yên tâm tuyệt đối sau khi mua.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bảo Hành 1 Đổi 1 Siêu Tốc</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
                    #04
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1.5">
                  Tư Vấn Trung Thực
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Đội ngũ nhân viên tư vấn đúng nhu cầu, đúng ngân sách, tuyệt đối không chèo kéo hay vẽ thêm chi phí không cần thiết.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đúng Nhu Cầu &amp; Ngân Sách</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-purple-500 transition-colors">
                    #05
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-1.5">
                  Kỹ Thuật Chuyên Nghiệp
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Kỹ thuật viên am hiểu sâu về máy tính, lắp ráp đi dây chuẩn mực và hỗ trợ nâng cấp linh kiện dễ dàng, nhanh gọn.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-purple-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lắp Ráp Giấu Cáp Chuẩn Đẹp</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-400 transition-all duration-300 group flex flex-col justify-between hover:-translate-y-0.5">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-rose-500 transition-colors">
                    #06
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors mb-1.5">
                  Đa Dạng Sản Phẩm
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed text-justify">
                  Cung cấp đầy đủ các cấu hình từ máy văn phòng cơ bản đến PC Gaming, Đồ họa chuyên nghiệp và Laptop các hãng nổi tiếng.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sẵn Hàng Mọi Phân Khúc</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION (Gọn gàng, tinh tế) */}
      {/* ========================================================================= */}
      <section className="py-12 md:py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#eb1c24]/20 via-transparent to-blue-600/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-red-400 text-xs font-bold uppercase tracking-wider mb-3 border border-white/10">
            <Sparkles className="w-3 h-3" />
            <span>Tư Vấn Cấu Hình Miễn Phí</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
            Bạn Cần Tìm Một Bộ Máy Tính Phù Hợp?
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 max-w-lg mx-auto font-normal">
            Hãy liên hệ ngay với đội ngũ chuyên viên tại DUDI SOFTWARE để được tư vấn cấu hình chuẩn xác, tối ưu hóa ngân sách và nhận nhiều quà tặng hấp dẫn!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="tel:0909163821"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#eb1c24] hover:bg-[#d01720] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-red-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Hotline: (+84) 909 163 821</span>
            </a>
            <a
              href="mailto:contact@dudisoftware.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs sm:text-sm transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-0.5"
            >
              <Mail className="w-4 h-4" />
              <span>Gửi Yêu Cầu Tư Vấn</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
