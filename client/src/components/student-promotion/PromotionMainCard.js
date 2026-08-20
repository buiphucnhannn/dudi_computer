import { Ticket } from "lucide-react";

export default function PromotionMainCard() {
    return (
        <div className="mx-auto mb-16 max-w-3xl">
            <div className="relative flex flex-col items-center gap-8 rounded-2xl border-2 border-[#b70011]/40 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(183,0,17,0.15)] transition-shadow duration-300 hover:shadow-[0_0_70px_rgba(183,0,17,0.25)] md:flex-row">
                {/* Icon */}
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#b70011] shadow-lg">
                    <Ticket className="h-16 w-16 text-white stroke-[1.5]" />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-4 inline-block rounded-full bg-[#b70011]/20 px-3 py-1 text-xs font-medium text-[#b70011]">
                        Hỗ trợ chi phí trực tiếp
                    </div>

                    <h3 className="mb-2 text-3xl font-extrabold text-white md:text-4xl">
                        ƯU ĐÃI{" "}
                        <span className="text-[#b70011]">
                            300.000Đ
                        </span>
                    </h3>

                    <p className="mb-6 text-sm leading-relaxed text-white/70">
                        Khách hàng HSSV sẽ được giảm trừ trực tiếp vào
                        hóa đơn khi mua Laptop hoặc PC. Mức chiết khấu
                        được áp dụng linh hoạt dựa trên giá trị đơn hàng
                        thực tế.
                    </p>

                    <div className="inline-block rounded border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/90">
                        Yêu cầu xuất trình thẻ HSSV chính chủ khi thanh toán.
                    </div>
                </div>
            </div>
        </div>
    );
}