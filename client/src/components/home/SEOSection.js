"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SEOSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xs text-xs sm:text-[13.5px] text-gray-600 leading-relaxed relative overflow-hidden space-y-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight border-b pb-3 border-gray-100">
        ZCOMPUTER - Điểm đến tin cậy cho PC Gaming, Laptop &amp; Workstation
      </h2>

      <div
        className={`space-y-4 transition-all duration-500 overflow-hidden ${
          isExpanded ? "max-h-[2000px]" : "max-h-[160px]"
        }`}
      >
        <p>
          Chào mừng bạn đến với <strong className="text-gray-900 font-bold">ZCOMPUTER</strong> - địa chỉ uy tín chuyên cung cấp các giải pháp máy tính toàn diện tại TP. Hồ Chí Minh. Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực lắp ráp{" "}
          <strong className="text-[#eb1c24] font-bold">PC Gaming</strong>, phân phối{" "}
          <strong className="text-[#eb1c24] font-bold">Laptop</strong> chính hãng và các hệ thống{" "}
          <strong className="text-[#eb1c24] font-bold">Workstation</strong> chuyên dụng cho đồ họa, render 3D và các tác vụ nặng. Với nhiều năm kinh nghiệm, ZCOMPUTER cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất với mức giá cực kỳ cạnh tranh.
        </p>
        <p>
          Dù bạn là một game thủ đang tìm kiếm cấu hình <em>máy tính cũ giá rẻ HCM</em> để cày cuốc các tựa game eSports, hay một chuyên gia thiết kế cần một bộ máy tính trạm mạnh mẽ, <em>cửa hàng PC Gaming Thủ Đức</em> và <em>Bình Thạnh</em> của chúng tôi luôn có sẵn hàng trăm mã linh kiện đa dạng (CPU Intel, AMD, VGA NVIDIA, AMD Radeon, SSD, RAM...) để tư vấn và build máy theo đúng nhu cầu và ngân sách của bạn.
        </p>
        <p>
          Tại ZCOMPUTER, chúng tôi đặt <strong>chất lượng và uy tín</strong> lên hàng đầu. Tất cả sản phẩm bán ra đều được kiểm tra kỹ lưỡng, đảm bảo hiệu năng ổn định. Cùng với đó là chính sách bảo hành dài hạn, hỗ trợ trả góp 0% và dịch vụ giao hàng tận nơi siêu tốc. Hãy đến với ZCOMPUTER ngay hôm nay để trải nghiệm những công nghệ tiên tiến nhất với dịch vụ chăm sóc khách hàng chuyên nghiệp, tận tâm!
        </p>
      </div>

      {/* Fade overlay when collapsed */}
      {!isExpanded && (
        <div className="absolute bottom-12 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      )}

      {/* Expand / Collapse Button */}
      <div className="pt-2 flex justify-center relative z-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-[#eb1c24] border border-gray-200 hover:border-red-200 font-bold text-xs px-6 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <span>{isExpanded ? "Thu gọn nội dung" : "Xem thêm nội dung"}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
}
