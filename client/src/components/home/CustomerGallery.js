"use client";

export default function CustomerGallery() {
  const customerPhotos = Array.from({ length: 10 }).map(
    (_, idx) => `https://zcomputer.vn/images/customers/customer-${idx + 1}.jpg`
  );

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#111111] py-16 border-t border-gray-800 mt-12 overflow-hidden text-white mb-0">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with authentic thank-you quote */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-14 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            LỜI CẢM ƠN TỪ <span className="text-[#eb1c24]">ZCOMPUTER</span>
          </h2>
          <div className="w-24 h-1 bg-[#eb1c24] mx-auto mb-6 rounded-full shadow-[0_0_12px_rgba(235,28,36,0.6)]"></div>
          <p className="text-gray-300 text-sm sm:text-base md:text-[16px] leading-7 sm:leading-8 md:leading-9 italic font-medium">
            &ldquo;ZCOMPUTER trân trọng từng khoảnh khắc được đồng hành cùng quý khách. Sự tin tưởng và ủng hộ của bạn chính là động lực to lớn giúp chúng tôi không ngừng hoàn thiện, mang đến những sản phẩm và dịch vụ chất lượng nhất. Hy vọng ZCOMPUTER sẽ luôn là địa chỉ uy tín, gắn bó lâu dài cùng đam mê công nghệ của quý khách. Chân thành cảm ơn bạn đã lựa chọn chúng tôi!&rdquo;
          </p>
        </div>

        {/* 10 Real ZComputer Customer Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-3.5">
          {customerPhotos.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-lg border border-gray-800 bg-[#1a1a1a] cursor-pointer"
            >
              <img
                src={src}
                alt={`ZComputer Customer ${idx + 1}`}
                className="w-full h-full object-cover p-1.5 sm:p-2 rounded-xl group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
