"use client";

import Image from "next/image";
import { handleImageError } from "@/lib/imageFallback";

const GALLERY_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=480&q=75",
    title: "Dàn PC Gaming lắp ráp tại DUDI",
  },
  {
    url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=480&q=75",
    title: "Góc làm việc & Setup công nghệ",
  },
  {
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=480&q=75",
    title: "Không gian Gaming & Setup rực rỡ",
  },
  {
    url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=480&q=75",
    title: "Kỹ thuật lắp ráp & cân chỉnh phần cứng",
  },
  {
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=480&q=75",
    title: "Hệ thống linh kiện máy tính cao cấp",
  },
  {
    url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=480&q=75",
    title: "Workstation đồ họa & Render chuyên nghiệp",
  },
  {
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=480&q=75",
    title: "Trải nghiệm Laptop cao cấp chính hãng",
  },
  {
    url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=480&q=75",
    title: "Bàn phím cơ & Phụ kiện Gaming Gear",
  },
  {
    url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=480&q=75",
    title: "Hệ thống tản nhiệt & Case PC hiện đại",
  },
  {
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=480&q=75",
    title: "Đồng hành công nghệ cùng quý khách hàng",
  },
];

export default function CustomerGallery() {
  return (
    <section className="w-full bg-[#111111] py-16 border-t border-gray-800 mt-12 overflow-hidden text-white mb-0">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with authentic thank-you quote */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-14 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            LỜI CẢM ƠN TỪ <span className="text-[#eb1c24]">DUDI SOFTWARE</span>
          </h2>
          <div className="w-24 h-1 bg-[#eb1c24] mx-auto mb-6 rounded-full shadow-[0_0_12px_rgba(235,28,36,0.6)]"></div>
          <p className="text-gray-300 text-sm sm:text-base md:text-[16px] leading-7 sm:leading-8 md:leading-9 italic font-medium">
            &ldquo;DUDI SOFTWARE trân trọng từng khoảnh khắc được đồng hành cùng quý khách. Sự tin tưởng và ủng hộ của bạn chính là động lực to lớn giúp chúng tôi không ngừng hoàn thiện, mang đến những sản phẩm và dịch vụ chất lượng nhất. Hy vọng DUDI SOFTWARE sẽ luôn là địa chỉ uy tín, gắn bó lâu dài cùng đam mê công nghệ của quý khách. Chân thành cảm ơn bạn đã lựa chọn chúng tôi!&rdquo;
          </p>
        </div>

        {/* 10 Tech & Showroom Setup Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-3.5">
          {GALLERY_PHOTOS.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-lg border border-gray-800 bg-[#1a1a1a]"
              title={item.title}
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                className="object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={handleImageError}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
