import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  TicketPercent,
  Backpack,
  Briefcase,
  Mouse,
  Layers,
  Wrench,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Back To School 2026 - Nâng Cấp Dễ Dàng, Tiết Kiệm Tối Đa | DUDI SOFTWARE",
  description: "Chương trình khuyến mãi Back To School cực khủng dành cho Học sinh - Sinh viên. Sắm PC, Laptop với giá siêu hời cùng nhiều quà tặng hấp dẫn.",
};

export default function BackToSchoolPage() {
  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans bg-[#030303] text-white selection:bg-red-600">
      <div className="w-full min-h-screen relative overflow-x-hidden">
        
        {/* Subtle Noise Texture Overlay */}
        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-screen z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative w-full pt-16 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24 flex items-center justify-center overflow-hidden">
          {/* Authentic High-Tech Gaming Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/hero-bg.webp')] bg-cover bg-center bg-no-repeat opacity-[0.3] mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/70 via-[#030303]/30 to-[#030303]" />
          </div>

          {/* Ambient Glows & Radiant Lights */}
          <div className="absolute top-0 right-0 w-72 sm:w-96 md:w-[500px] h-72 sm:h-96 md:h-[500px] bg-red-600/15 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 animate-pulse duration-[4000ms] pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-60 sm:w-80 md:w-[400px] h-60 sm:h-80 md:h-[400px] bg-red-900/20 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 blur-2xl -z-10 transform -skew-y-6 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center max-w-5xl">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-md mb-6 sm:mb-8 transform hover:scale-105 transition-all cursor-default shadow-[0_0_25px_rgba(220,38,38,0.2)] group">
              <Zap className="w-4 h-4 text-red-500 group-hover:animate-bounce" />
              <span className="font-extrabold text-xs sm:text-sm tracking-widest text-red-200 uppercase">
                Ưu Đãi Tựu Trường 2026
              </span>
            </div>

            {/* Title Typography */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.95] mb-5 sm:mb-6 relative select-none break-words">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-xl inline-block pr-2 sm:pr-4">
                BACK TO
              </span>{" "}
              <span className="relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-600 to-red-800 filter drop-shadow-[0_8px_30px_rgba(220,38,38,0.5)] inline-block pr-2 sm:pr-4">
                SCHOOL
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 font-medium max-w-2xl leading-relaxed mb-8 sm:mb-10">
              Trang thiết bị công nghệ <span className="text-white font-bold">chất lượng cao</span>. Sản phẩm{" "}
              <span className="text-white font-bold">chính hãng</span> - Dịch vụ{" "}
              <span className="text-white font-bold">chuyên nghiệp</span>.
            </p>

            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500/60 animate-bounce" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THREE BENEFIT PILLARS */}
        {/* ========================================================================= */}
        <section className="relative z-20 container mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 mb-16 sm:mb-20 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="group bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-red-500/40 p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center shadow-xl hover:shadow-[0_15px_40px_rgba(220,38,38,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10 group-hover:text-red-400 transition-colors">
                Sản Phẩm Chính Hãng
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed relative z-10">
                Phân phối các sản phẩm chính ngạch, đảm bảo nguồn gốc xuất xứ rõ ràng.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-red-500/40 p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center shadow-xl hover:shadow-[0_15px_40px_rgba(220,38,38,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden md:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10 group-hover:text-red-400 transition-colors">
                Bảo Hành Chuyên Nghiệp
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed relative z-10">
                Hỗ trợ kỹ thuật nhanh chóng, tiếp nhận bảo hành theo đúng tiêu chuẩn của hãng.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-zinc-950/70 backdrop-blur-xl border border-white/10 hover:border-red-500/40 p-6 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center shadow-xl hover:shadow-[0_15px_40px_rgba(220,38,38,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <ThumbsUp className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-2 relative z-10 group-hover:text-red-400 transition-colors">
                Chi Phí Tối Ưu
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed relative z-10">
                Cung cấp giải pháp công nghệ với mức chi phí hợp lý cùng các chương trình hỗ trợ HSSV.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PROMOTIONS & STUDENT POLICIES */}
        {/* ========================================================================= */}
        <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative max-w-5xl">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-900/30 to-transparent -z-10" />

          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-14 relative">
            <div className="inline-block bg-red-600/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-4">
              <span className="text-red-400 font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Chương Trình Khuyến Mãi
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-3 sm:mb-4 leading-tight">
              Chính Sách Hỗ Trợ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 border-b-2 sm:border-b-4 border-red-600 pb-1 inline-block">
                HỌC SINH - SINH VIÊN
              </span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium max-w-xl mx-auto">
              Áp dụng cho khách hàng có thẻ HSSV hoặc Giấy báo nhập học hợp lệ.
            </p>
          </div>

          {/* Main Huge Promotion Card */}
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 p-1 mb-12 sm:mb-16 shadow-[0_20px_60px_rgba(220,38,38,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-transparent to-red-600 opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative bg-zinc-950/90 backdrop-blur-2xl rounded-[1.4rem] p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden">
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 bg-gradient-to-br from-red-500 to-red-900 rounded-2xl flex items-center justify-center shadow-[0_0_35px_rgba(220,38,38,0.4)] border border-red-400/50 transform group-hover:rotate-3 transition-transform duration-500">
                <TicketPercent className="w-10 h-10 sm:w-14 sm:h-14 text-white drop-shadow-xl" />
              </div>

              <div className="flex-1 text-center sm:text-left z-10 space-y-3">
                <div className="inline-block px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-extrabold tracking-wider text-xs uppercase">
                  Hỗ Trợ Chi Phí Trực Tiếp
                </div>
                
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
                  Ưu Đãi{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    300.000Đ
                  </span>
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                  Khách hàng HSSV sẽ được giảm trừ trực tiếp vào hóa đơn khi mua Laptop hoặc PC. Mức chiết khấu được áp dụng linh hoạt dựa trên giá trị đơn hàng thực tế.
                </p>
                <div className="text-white font-bold bg-white/10 w-fit sm:mx-0 mx-auto px-3.5 py-1.5 rounded-lg text-xs">
                  Yêu cầu xuất trình thẻ HSSV chính chủ khi thanh toán.
                </div>
              </div>
            </div>
          </div>

          {/* 5 Gift Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {/* Gift 1 */}
            <div className="group bg-gradient-to-b from-zinc-900/90 to-[#0A0A0A] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-300 border border-white/5 shadow-inner">
                <Backpack className="w-6 h-6 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 tracking-wide">
                Balo Chuyên Dụng
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs border border-red-500/20">
                Trị giá 350.000đ
              </div>
            </div>

            {/* Gift 2 */}
            <div className="group bg-gradient-to-b from-zinc-900/90 to-[#0A0A0A] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-300 border border-white/5 shadow-inner">
                <Briefcase className="w-6 h-6 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 tracking-wide">
                Túi Chống Sốc
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs border border-red-500/20">
                Trị giá 200.000đ
              </div>
            </div>

            {/* Gift 3 */}
            <div className="group bg-gradient-to-b from-zinc-900/90 to-[#0A0A0A] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-300 border border-white/5 shadow-inner">
                <Mouse className="w-6 h-6 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 tracking-wide">
                Chuột Không Dây
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs border border-red-500/20">
                Trị giá 250.000đ
              </div>
            </div>

            {/* Gift 4 */}
            <div className="group bg-gradient-to-b from-zinc-900/90 to-[#0A0A0A] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-300 border border-white/5 shadow-inner">
                <Layers className="w-6 h-6 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 tracking-wide">
                Lót Chuột Cao Cấp
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-xs border border-red-500/20">
                Trị giá 150.000đ
              </div>
            </div>

            {/* Gift 5 */}
            <div className="col-span-2 sm:col-span-1 group bg-gradient-to-b from-zinc-900/90 to-[#0A0A0A] border border-white/5 p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-300 border border-white/5 shadow-inner">
                <Wrench className="w-6 h-6 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mb-1.5 tracking-wide">
                Dịch Vụ Trọn Đời
              </h4>
              <div className="bg-gradient-to-r from-red-500 to-red-800 text-white font-bold px-3 py-0.5 rounded-full text-[10.5px] sm:text-xs shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                Bảo Trì Miễn Phí
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden max-w-5xl mx-auto px-4 sm:px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-red-950/20 to-black z-0 pointer-events-none rounded-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[200px] bg-red-600/20 blur-[100px] rounded-full z-0 pointer-events-none" />

          <div className="text-center relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic mb-4 sm:mb-5 tracking-tight drop-shadow-xl">
              Đồng Hành Cùng Bạn
            </h2>
            
            <p className="text-zinc-300 text-xs sm:text-sm md:text-base mb-8 sm:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Khởi đầu chặng đường học tập với những sản phẩm công nghệ chất lượng nhất. Đội ngũ DUDI SOFTWARE luôn tận tâm đồng hành, sẵn sàng tư vấn giải pháp và cấu hình tối ưu, đáp ứng trọn vẹn mọi nhu cầu cá nhân của khách hàng.
            </p>

            <Link
              href="/tat-ca-san-pham"
              className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                <span>Xem Sản Phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
