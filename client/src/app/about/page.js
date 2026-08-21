import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

export const metadata = {
  title: "Giới Thiệu Về ZCOMPUTER - Chất Lượng Thực, Giá Trị Thực",
  description: "ZCOMPUTER chuyên cung cấp các dòng máy PC, Laptop Gaming, Workstation uy tín giá rẻ tại TP.HCM.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 w-full overflow-x-hidden font-sans">
      <div className="bg-gray-50 min-h-screen">
        
        {/* ========================================================================= */}
        {/* 1. HERO HEADER SECTION (Dark Tech Theme with Glowing Aura) */}
        {/* ========================================================================= */}
        <section className="bg-[#0b0e14] pt-16 md:pt-24 relative overflow-hidden">
          {/* Background Ambient Lights */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
          <div className="absolute -top-24 -right-16 w-[550px] h-[550px] bg-gradient-to-bl from-[#eb1c24]/40 via-[#eb1c24]/20 to-transparent rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[110px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg leading-tight md:leading-[1.15] flex flex-col items-center">
                <span className="text-center">
                  Hệ thống cung cấp <span className="inline-block">PC &amp; Laptop</span>
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb1c24] via-red-500 to-orange-400 text-center mt-2 drop-shadow-md">
                  UY TÍN HÀNG ĐẦU TP.HCM
                </span>
              </h1>
              
              <p className="text-gray-300 text-base md:text-lg mb-8 font-medium max-w-2xl mx-auto leading-relaxed">
                Chất lượng thực - Giá trị thực. Đồng hành cùng bạn trên mọi nẻo đường công nghệ.
              </p>

              {/* 3 Categories Pills */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 md:mb-16">
                <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                  <Monitor className="w-4 sm:w-5 h-4 sm:h-5 text-[#eb1c24]" />
                  <span>PC GAMING</span>
                </div>
                <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                  <Cpu className="w-4 sm:w-5 h-4 sm:h-5 text-[#eb1c24]" />
                  <span>PC WORKSTATION</span>
                </div>
                <div className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-full text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                  <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-[#eb1c24]" />
                  <span>LAPTOP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storefront Hero Showcase Image */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[550px] lg:h-[650px] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0b0e14] to-transparent z-10 pointer-events-none" />
            <img
              alt="ZCOMPUTER Storefront Showroom"
              src="/storefront-hero.jpg"
              className="w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ABOUT STORY SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-[1120px]">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
              {/* Left Column: Story Content */}
              <div className="space-y-6 flex-1 max-w-[530px] w-full">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black text-gray-900 uppercase leading-tight tracking-tight mb-3">
                    Về ZCOMPUTER
                  </h2>
                  <div className="w-24 h-1.5 bg-[#eb1c24] rounded-full shadow-[0_0_12px_rgba(235,28,36,0.6)]" />
                </div>
                
                <p className="text-gray-700 text-base md:text-[17.5px] leading-[1.8] text-justify">
                  <strong className="text-gray-900 font-bold">ZCOMPUTER</strong> được thành lập với mục tiêu mang đến cho khách hàng những sản phẩm PC và Laptop chất lượng cao với mức giá vô cùng hợp lý. Chúng tôi tự hào là điểm đến tin cậy của học sinh, sinh viên, dân văn phòng và anh em game thủ tại khu vực TP.HCM.
                </p>
                
                <p className="text-gray-700 text-base md:text-[17.5px] leading-[1.8] text-justify">
                  Với phương châm <strong className="text-gray-900 font-bold">&quot;Chất lượng thực - Giá trị thực&quot;</strong>, ZCOMPUTER chuyên cung cấp các dòng máy PC, Laptop Cũ / Like New được kiểm định kỹ thuật khắt khe. Chúng tôi hiểu rằng, một chiếc máy tính tốt không nhất thiết phải đắt tiền nhất, mà là chiếc máy tính đáp ứng hoàn hảo nhất nhu cầu và ngân sách của bạn.
                </p>
              </div>

              {/* Right Column: High Quality PC Showcase Image */}
              <div className="relative flex-1 max-w-[530px] w-full flex justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#eb1c24]/25 to-transparent rounded-3xl transform translate-x-3 translate-y-3 pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white w-full h-[400px] md:h-[450px] bg-gray-900">
                  <img
                    alt="ZComputer Store PC Showcase"
                    loading="lazy"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CORE VALUES (GIÁ TRỊ CỐT LÕI) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#0b0e14] text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#eb1c24]/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight inline-block relative">
                Giá Trị Cốt Lõi
                <div className="w-24 h-1 bg-gradient-to-r from-[#eb1c24] to-orange-500 mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(235,28,36,0.6)]" />
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Chất lượng đảm bảo</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  100% sản phẩm bán ra đều trải qua quy trình kiểm tra phần cứng nghiêm ngặt để đảm bảo máy hoạt động ổn định và bền bỉ.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Giá cả cạnh tranh</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Tối ưu hóa quy trình để mang đến mức giá cực kỳ tốt cho các sản phẩm PC và Laptop Like New tại thị trường TP.HCM.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Hậu mãi tận tâm</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Chế độ bảo hành dài hạn, hỗ trợ xử lý sự cố phần mềm và phần cứng chu đáo, giúp khách hàng yên tâm tuyệt đối sau khi mua.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Tư vấn trung thực</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Đội ngũ nhân viên tư vấn đúng nhu cầu, đúng ngân sách, tuyệt đối không chèo kéo hay vẽ thêm chi phí không cần thiết.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Kỹ thuật chuyên nghiệp</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Kỹ thuật viên am hiểu sâu về máy tính, lắp ráp đi dây chuẩn mực và hỗ trợ nâng cấp linh kiện dễ dàng, nhanh gọn.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 text-[#eb1c24] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Monitor className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Đa dạng sản phẩm</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  Cung cấp đầy đủ các cấu hình từ máy văn phòng cơ bản đến PC Gaming, Đồ họa chuyên nghiệp và Laptop các hãng nổi tiếng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. SHOWROOMS (HỆ THỐNG SHOWROOM) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                Hệ thống showroom
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Trực tiếp trải nghiệm sức mạnh công nghệ tại các chi nhánh của ZCOMPUTER
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Showroom 1 */}
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-300 group relative overflow-hidden bg-white flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-[#eb1c24] text-white rounded-full flex items-center justify-center font-black text-xl shadow-md shadow-red-500/30">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Chi nhánh 1 (Trụ sở)</h3>
                  </div>
                  <p className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    <MapPin className="w-5 h-5 text-[#eb1c24] shrink-0 mt-1" />
                    <span>23 Đường số 1, Khu phố 61, Phường Linh Xuân (Phường Linh Tây cũ), TP.Thủ Đức, TP.Hồ Chí Minh</span>
                  </p>
                </div>
                
                {/* Map 1 */}
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner h-[180px] w-full relative">
                  <iframe
                    title="Bản đồ chỉ đường đến Chi nhánh Thủ Đức"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4658576162583!2d106.74981366590865!3d10.852128230492767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2sus!4v1781670020621!5m2!1svi!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Showroom 2 */}
              <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-300 group relative overflow-hidden bg-white flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-[#eb1c24] text-white rounded-full flex items-center justify-center font-black text-xl shadow-md shadow-red-500/30">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Chi nhánh 2</h3>
                  </div>
                  <p className="flex items-start gap-3 text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    <MapPin className="w-5 h-5 text-[#eb1c24] shrink-0 mt-1" />
                    <span>47/86B Bùi Đình Tuý, Phường 14, Quận Bình Thạnh, TP.Hồ Chí Minh</span>
                  </p>
                </div>
                
                {/* Map 2 */}
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-inner h-[180px] w-full relative">
                  <iframe
                    title="Bản đồ chỉ đường đến Chi nhánh Bình Thạnh"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.072361586463!2d106.70468187588394!3d10.805769858649997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529000263c50f%3A0x1694f4d065ba8f53!2zWkNPTVBVVEVSLULDjE5IIFRI4bqgTkg!5e0!3m2!1svi!2sus!4v1782088223445!5m2!1svi!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CALL TO ACTION (BẠN CẦN TÌM MỘT BỘ MÁY TÍNH PHÙ HỢP?) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-[780px]">
            <div className="bg-gradient-to-r from-[#eb1c24] via-[#d01720] to-[#b91c1c] rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-black mb-3 relative z-10 uppercase tracking-tight leading-tight">
                Bạn cần tìm một bộ máy tính phù hợp?
              </h2>
              <p className="text-white/90 text-sm sm:text-base mb-8 max-w-xl mx-auto relative z-10 leading-relaxed font-normal">
                Hãy liên hệ ngay với ZCOMPUTER để được tư vấn cấu hình tối ưu nhất cho nhu cầu học tập, làm việc và giải trí của bạn.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <div
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#eb1c24] rounded-xl font-black text-base shadow-lg select-none cursor-default"
                >
                  <Phone className="w-5 h-5" />
                  <span>0977 334 415</span>
                </div>
                <a
                  href="mailto:truong.zvncomputer@gmail.com"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 bg-black/25 text-white rounded-xl font-bold text-base hover:bg-black/40 transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5" />
                  <span>Gửi Email Cho Chúng Tôi</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
