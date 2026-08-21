"use client";

import { parseProductSpecs, PRODUCT_TYPES, detectProductType } from "@/lib/specParser";
import { ShieldCheck, CheckCircle2, Award, Zap, ThumbsUp } from "lucide-react";

const ProductSpecifications = ({ product }) => {
  if (!product) return null;

  const specsData = parseProductSpecs(product);
  const items = specsData.items || [];
  const type = detectProductType(product);
  const name = product.name || "Sản phẩm DUDI SOFTWARE";

  return (
    <div className="space-y-6">
      {/* 1. BẢNG THÔNG SỐ KỸ THUẬT CHI TIẾT */}
      <div
        id="specifications"
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200"
      >
        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-2 h-7 bg-[#eb1c24] rounded-sm" />
          <span>THÔNG SỐ KỸ THUẬT CHI TIẾT</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-slate-50/80">
                <th className="py-3.5 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/3">
                  Thuộc tính
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/2">
                  Chi tiết cấu hình
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/6 text-right">
                  Bảo hành
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-600 divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-800 text-xs sm:text-sm">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {item.detail}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs font-mono font-bold text-[#eb1c24]">
                    {item.warranty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. BÀI VIẾT ĐÁNH GIÁ & MÔ TẢ CHI TIẾT SẢN PHẨM */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200 text-slate-700 leading-relaxed space-y-5">
        <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
          <span className="w-2 h-7 bg-[#eb1c24] rounded-sm" />
          <span>MÔ TẢ VÀ ĐÁNH GIÁ CHI TIẾT</span>
        </h2>

        {product.description ? (
          <div
            className="product-description-content text-sm sm:text-[15px] leading-relaxed text-slate-700 space-y-3 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-900 [&>h3]:mt-4 [&>h3]:mb-2 [&>h4]:text-base [&>h4]:font-bold [&>h4]:text-slate-900 [&>h4]:mt-3 [&>h4]:mb-1.5 [&>p]:mb-2.5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul>li]:text-slate-600 [&>ul>li>strong]:text-slate-900"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : (
          <div className="space-y-4 text-sm sm:text-[15px]">
            <p className="font-semibold text-slate-900 text-base">
              {name} là sự lựa chọn hoàn hảo trong phân khúc, đáp ứng trọn vẹn nhu cầu làm việc chuyên nghiệp, sáng tạo nội dung và giải trí đỉnh cao.
            </p>

            {type === PRODUCT_TYPES.LAPTOP && (
              <>
                <p>
                  Sở hữu thiết kế hiện đại, bền bỉ cùng hệ thống phần cứng mạnh mẽ được kiểm định kỹ lưỡng 24 bước tiêu chuẩn tại DUDI SOFTWARE. Khả năng đa nhiệm mượt mà, tốc độ xử lý nhanh chóng giúp bạn hoàn thành mọi tác vụ từ văn phòng, lập trình cho đến đồ họa và chơi game một cách trơn tru nhất.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1c24]" />
                    <span>Ưu điểm nổi trội:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li>Hiệu năng xử lý tối ưu, kiểm soát nhiệt độ mát mẻ.</li>
                    <li>Màn hình hiển thị sắc nét, góc nhìn rộng, độ chuẩn màu cao.</li>
                    <li>Bàn phím độ nảy tốt, touchpad cảm ứng đa điểm mượt mà.</li>
                    <li>Thời lượng pin tối ưu, thiết kế di động thuận tiện mang theo.</li>
                  </ul>
                </div>
              </>
            )}

            {type === PRODUCT_TYPES.PC && (
              <>
                <p>
                  Bộ máy tính được đội ngũ kỹ thuật viên DUDI SOFTWARE tuyển chọn linh kiện tương thích 100%, đi dây thẩm mỹ và tối ưu luồng gió làm mát. Cỗ máy sẵn sàng cân tốt các tựa game đình đám (PUBG, Valorant, CS2, GTA V, Black Myth: Wukong) cũng như các phần mềm thiết kế đồ họa 2D/3D (Photoshop, Premiere, AutoCAD, SolidWorks).
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1c24]" />
                    <span>Ưu điểm cấu hình:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li>Linh kiện chính hãng 100%, độ bền và độ ổn định cao qua nhiều năm.</li>
                    <li>Khả năng nâng cấp linh hoạt trong tương lai (RAM, SSD, VGA, CPU).</li>
                    <li>Hệ thống tản nhiệt khí / tản AIO vận hành êm ái, mát mẻ liên tục.</li>
                    <li>Được test kỹ lưỡng bằng phần mềm chuyên dụng trước khi bàn giao.</li>
                  </ul>
                </div>
              </>
            )}

            {type === PRODUCT_TYPES.MONITOR && (
              <>
                <p>
                  Màn hình mang lại không gian hiển thị rộng rãi cùng chất lượng hình ảnh sống động, độ phân giải cao và tần số quét vượt trội. Công nghệ chống chói và khử nhấp nháy Flicker-Free giúp bảo vệ mắt khi làm việc hoặc chơi game trong thời gian dài.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1c24]" />
                    <span>Điểm nổi bật:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li>Góc nhìn siêu rộng 178°/178° không biến đổi màu sắc khi nhìn nghiêng.</li>
                    <li>Tần số quét cao kết hợp tốc độ phản hồi 1ms loại bỏ hoàn toàn hiện tượng xé hình.</li>
                    <li>Đầy đủ cổng kết nối hiện đại (DisplayPort, HDMI, Audio Out).</li>
                  </ul>
                </div>
              </>
            )}

            {type === PRODUCT_TYPES.PSU && (
              <>
                <p>
                  Bộ nguồn cung cấp dòng điện liên tục, ổn định và an toàn tuyệt đối cho toàn bộ linh kiện hệ thống. Đạt chứng nhận hiệu suất 80 Plus giúp tiết kiệm điện năng tiêu thụ và giảm thiểu tỏa nhiệt tối đa.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1c24]" />
                    <span>Tính năng an toàn:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li>Hệ thống bảo vệ mạch đa lớp (OVP, OPP, SCP, OCP, UVP, OTP).</li>
                    <li>Quạt làm mát thông minh tự điều tốc theo nhiệt độ tải.</li>
                    <li>Hệ thống dây cáp bố trí khoa học, thuận tiện lắp đặt và giấu dây.</li>
                  </ul>
                </div>
              </>
            )}

            {type === PRODUCT_TYPES.MAINBOARD && (
              <>
                <p>
                  Bo mạch chủ thế hệ mới sở hữu dàn VRM cấp nguồn mạnh mẽ, hỗ trợ các dòng vi xử lý mới nhất với hiệu suất tối đa. Thiết kế tản nhiệt kim loại dày dặn bao phủ khu vực Mosfet và khe M.2 NVMe giúp hệ thống luôn duy trì trạng thái mát mẻ.
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#eb1c24]" />
                    <span>Khả năng mở rộng:</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                    <li>Hỗ trợ RAM xung nhịp cao và công nghệ ép xung XMP / EXPO tiện lợi.</li>
                    <li>Trang bị khe PCIe bọc thép gia cố chống xệ card đồ họa nặng.</li>
                    <li>Hỗ trợ đầy đủ các cổng kết nối ngoại vi tốc độ cao và cổng xuất hình 4K.</li>
                  </ul>
                </div>
              </>
            )}

            {/* Cam kết DUDI SOFTWARE */}
            <div className="p-4 bg-red-50/70 rounded-xl border border-red-200/80 mt-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#eb1c24] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                <span className="font-bold text-[#eb1c24] block">CAM KẾT CHẤT LƯỢNG TẠI DUDI SOFTWARE:</span>
                <p>
                  100% sản phẩm được kiểm tra kỹ thuật nghiêm ngặt trước khi giao hàng. Hỗ trợ 1 đổi 1 trong thời gian đầu nếu phát sinh lỗi phần cứng, bảo hành chu đáo tận tâm và hỗ trợ kỹ thuật trọn đời máy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
