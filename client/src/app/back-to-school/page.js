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
  title: "Back To School 2026 - Nâng Cấp Dễ Dàng, Tiết Kiệm Tối Đa",
  description: "Chương trình khuyến mãi Back To School cực khủng dành cho Học sinh - Sinh viên. Sắm PC, Laptop với giá siêu hời cùng nhiều quà tặng hấp dẫn.",
};

export default function BackToSchoolPage() {
  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans">
      <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 font-sans overflow-x-hidden relative">
        
        {/* Subtle Noise Texture Overlay */}
        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ========================================================================= */}
        {/* 1. HERO SECTION - GIANT IMPACTFUL BACK TO SCHOOL BANNER */}
        {/* ========================================================================= */}
        <section className="relative w-full pt-28 pb-20 md:pt-40 md:pb-32 flex items-center justify-center overflow-hidden min-h-[90vh]">
          {/* Authentic High-Tech Gaming Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center bg-no-repeat opacity-[0.35] mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-[#030303]/20 to-[#030303]" />
          </div>

          {/* Ambient Glows & Radiant Lights */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/15 blur-[200px] rounded-full translate-x-1/4 -translate-y-1/4 animate-pulse duration-[4000ms] pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/20 blur-[150px] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 blur-3xl -z-10 transform -skew-y-12 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 backdrop-blur-md mb-10 transform hover:scale-105 transition-all cursor-default shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] group">
              <Zap className="w-5 h-5 text-red-500 group-hover:animate-bounce" />
              <span className="font-extrabold text-sm md:text-base tracking-widest text-red-200 uppercase">
                Ưu Đãi Tựu Trường 2026
              </span>
            </div>

            {/* Giant Title Typography */}
            <h1 className="text-6xl md:text-8xl lg:text-[150px] font-black italic tracking-tighter uppercase leading-[0.85] mb-8 relative select-none">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500 drop-shadow-2xl inline-block transform hover:scale-105 transition-transform duration-700 pr-4 sm:pr-8 md:pr-12">
                BACK TO
              </span>
              <br />
              <span className="relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-600 to-red-800 filter drop-shadow-[0_10px_50px_rgba(220,38,38,0.6)] inline-block transform hover:-translate-y-2 transition-transform duration-700 pr-4 sm:pr-8 md:pr-12">
                SCHOOL
              </span>
              <span className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-20 blur-xl pointer-events-none">
                BACK TO SCHOOL
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl lg:text-3xl text-zinc-400 font-medium max-w-3xl leading-relaxed mb-16">
              Trang thiết bị công nghệ <span className="text-white font-bold">chất lượng cao</span>. Sản phẩm{" "}
              <span className="text-white font-bold">chính hãng</span> - Dịch vụ{" "}
              <span className="text-white font-bold">chuyên nghiệp</span>.
            </p>

            <ChevronDown className="w-10 h-10 text-red-500/50 animate-bounce" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. THREE BENEFIT PILLARS */}
        {/* ========================================================================= */}
        <section className="relative z-20 container mx-auto px-4 -mt-16 sm:-mt-20 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Pillar 1 */}
            <div className="group bg-zinc-950/60 backdrop-blur-2xl border border-white/10 hover:border-red-500/40 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3 relative z-10 group-hover:text-red-400 transition-colors">
                Sản Phẩm Chính Hãng
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed relative z-10">
                Phân phối các sản phẩm chính ngạch, đảm bảo nguồn gốc xuất xứ rõ ràng.
              </p>
            </div>

            {/* Pillar 2 (Slightly elevated) */}
            <div className="group bg-zinc-950/60 backdrop-blur-2xl border border-white/10 hover:border-red-500/40 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden transform md:-translate-y-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3 relative z-10 group-hover:text-red-400 transition-colors">
                Bảo Hành Chuyên Nghiệp
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed relative z-10">
                Hỗ trợ kỹ thuật nhanh chóng, tiếp nhận bảo hành theo đúng tiêu chuẩn của hãng.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group bg-zinc-950/60 backdrop-blur-2xl border border-white/10 hover:border-red-500/40 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl hover:shadow-[0_20px_60px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:border-red-500/50 transition-all shadow-inner relative z-10">
                <ThumbsUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3 relative z-10 group-hover:text-red-400 transition-colors">
                Chi Phí Tối Ưu
              </h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed relative z-10">
                Cung cấp giải pháp công nghệ với mức chi phí hợp lý cùng các chương trình hỗ trợ HSSV.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PROMOTIONS & STUDENT POLICIES */}
        {/* ========================================================================= */}
        <section className="container mx-auto px-4 py-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900/30 to-transparent -z-10" />

          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20 relative">
            <div className="inline-block bg-red-600/10 border border-red-500/20 px-5 py-2 rounded-full mb-6">
              <span className="text-red-400 font-bold tracking-widest uppercase text-xs sm:text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Chương Trình Khuyến Mãi
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-tight">
              Chính Sách Hỗ Trợ <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 border-b-4 border-red-600 pb-2">
                HỌC SINH - SINH VIÊN
              </span>
            </h2>
            
            <p className="text-zinc-400 text-base md:text-xl font-medium max-w-2xl mx-auto">
              Áp dụng cho khách hàng có thẻ HSSV hoặc Giấy báo nhập học hợp lệ.
            </p>
          </div>

          {/* Main Huge Promotion Card */}
          <div className="relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden bg-[#0A0A0A] border border-white/10 p-1 md:p-2 mb-20 shadow-[0_30px_100px_rgba(220,38,38,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-transparent to-red-600 opacity-20 group-hover:opacity-50 animate-pulse transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative bg-zinc-950/80 backdrop-blur-3xl rounded-[2rem] p-8 md:p-14 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden">
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 shrink-0 bg-gradient-to-br from-red-500 to-red-900 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.4)] border border-red-400/50 transform group-hover:rotate-6 transition-transform duration-500">
                <TicketPercent className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-2xl" />
              </div>

              <div className="flex-1 text-center md:text-left z-10 space-y-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-black tracking-widest text-xs sm:text-sm uppercase shadow-inner">
                  Hỗ Trợ Chi Phí Trực Tiếp
                </div>
                
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
                  Ưu Đãi <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                    300.000Đ
                  </span>
                </h3>
                
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-medium">
                  Khách hàng HSSV sẽ được giảm trừ trực tiếp vào hóa đơn khi mua Laptop hoặc PC. Mức chiết khấu được áp dụng linh hoạt dựa trên giá trị đơn hàng thực tế.
                  <span className="block mt-4 text-white font-bold bg-white/10 w-fit md:mx-0 mx-auto px-4 py-2 rounded-lg text-xs sm:text-sm">
                    Yêu cầu xuất trình thẻ HSSV chính chủ khi thanh toán.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 5 Gift Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-[90rem] mx-auto">
            {/* Gift 1 */}
            <div className="group bg-gradient-to-b from-zinc-900 to-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-500 border border-white/5 group-hover:border-red-500/50 shadow-inner">
                <Backpack className="w-8 h-8 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-wide">
                Balo Chuyên Dụng
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-3.5 py-1 rounded-full text-xs md:text-sm border border-red-500/20">
                Trị giá 350.000đ
              </div>
            </div>

            {/* Gift 2 */}
            <div className="group bg-gradient-to-b from-zinc-900 to-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] relative overflow-hidden lg:translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-500 border border-white/5 group-hover:border-red-500/50 shadow-inner">
                <Briefcase className="w-8 h-8 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-wide">
                Túi Chống Sốc
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-3.5 py-1 rounded-full text-xs md:text-sm border border-red-500/20">
                Trị giá 200.000đ
              </div>
            </div>

            {/* Gift 3 */}
            <div className="group bg-gradient-to-b from-zinc-900 to-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-500 border border-white/5 group-hover:border-red-500/50 shadow-inner">
                <Mouse className="w-8 h-8 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-wide">
                Chuột Không Dây
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-3.5 py-1 rounded-full text-xs md:text-sm border border-red-500/20">
                Trị giá 250.000đ
              </div>
            </div>

            {/* Gift 4 */}
            <div className="group bg-gradient-to-b from-zinc-900 to-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] relative overflow-hidden lg:translate-y-4">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-500 border border-white/5 group-hover:border-red-500/50 shadow-inner">
                <Layers className="w-8 h-8 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-wide">
                Lót Chuột Cao Cấp
              </h4>
              <div className="bg-red-500/10 text-red-400 font-bold px-3.5 py-1 rounded-full text-xs md:text-sm border border-red-500/20">
                Trị giá 150.000đ
              </div>
            </div>

            {/* Gift 5 */}
            <div className="group bg-gradient-to-b from-zinc-900 to-[#0A0A0A] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col items-center text-center hover:border-red-500/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br from-red-900 to-black transition-all duration-500 border border-white/5 group-hover:border-red-500/50 shadow-inner">
                <Wrench className="w-8 h-8 text-zinc-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h4 className="text-lg md:text-xl font-black text-white mb-2 tracking-wide">
                Dịch Vụ Trọn Đời
              </h4>
              <div className="bg-gradient-to-r from-red-500 to-red-800 text-white font-bold px-5 py-1 rounded-full text-xs md:text-sm shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                Bảo Trì Miễn Phí
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CALL TO ACTION - ĐỒNG HÀNH CÙNG BẠN */}
        {/* ========================================================================= */}
        <section className="relative py-28 md:py-36 mt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-red-950/20 to-black z-0 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-red-600/20 blur-[150px] rounded-[100%] z-0 pointer-events-none" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic mb-6 tracking-tighter drop-shadow-xl">
              Đồng Hành Cùng Bạn
            </h2>
            
            <p className="text-zinc-300 text-base sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Khởi đầu chặng đường học tập với những sản phẩm công nghệ chất lượng nhất. Đội ngũ DUDI SOFTWARE luôn tận tâm đồng hành, sẵn sàng tư vấn giải pháp và cấu hình tối ưu, đáp ứng trọn vẹn mọi nhu cầu cá nhân của khách hàng.
            </p>

            <Link
              href="/tat-ca-san-pham"
              className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-sm sm:text-base uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                <span>Xem Sản Phẩm</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
