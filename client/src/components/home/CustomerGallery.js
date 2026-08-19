"use client";

export default function CustomerGallery() {
  const photos = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  ];

  return (
    <section className="bg-[#111111] py-14 sm:py-16 border-t border-gray-800 rounded-3xl overflow-hidden my-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with authentic thank-you quote */}
        <div className="text-center max-w-4xl mx-auto mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            LỜI CẢM ƠN TỪ <span className="text-[#eb1c24]">ZCOMPUTER</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#eb1c24] mx-auto mb-6 rounded-full shadow-[0_0_12px_rgba(235,28,36,0.6)]"></div>
          <p className="text-gray-300 text-sm sm:text-base md:text-[16.5px] leading-7 sm:leading-8 italic font-medium">
            &ldquo;ZCOMPUTER trân trọng từng khoảnh khắc được đồng hành cùng quý khách. Sự tin tưởng và ủng hộ của bạn chính là động lực to lớn giúp chúng tôi không ngừng hoàn thiện, mang đến những sản phẩm và dịch vụ chất lượng nhất. Hy vọng ZCOMPUTER sẽ luôn là địa chỉ uy tín, gắn bó lâu dài cùng đam mê công nghệ của quý khách. Chân thành cảm ơn bạn đã lựa chọn chúng tôi!&rdquo;
          </p>
        </div>

        {/* 10 Customer Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {photos.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md group cursor-pointer"
            >
              <img
                src={src}
                alt={`Khách hàng ZComputer Showroom ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-[11px] font-bold text-white tracking-wide">
                  Showroom ZComputer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
