import Link from "next/link";
import { Sparkles, ArrowRight, ChevronsDown } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[600px] h-[80vh] w-full items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCywp-MDJ3FU_TQlbcl76u006NjvYU83v4B-SvlAQqe_pg8OMYsXZQORRSfN77kC2sE9YpzS3cjP4oQQg9DZftm_9LOsE5mCFbiuegH4QAfJHEs96TS_eg1dlkJqsbR4d1NNNaPe1tAVRHoNHUANa_evyUQEcKPqt8MeI0b8oUcKjOQ50EqT3JG3ccxCAfIZ-j4imH1v6xemM3f5dg7cEMvzWigDPnYTE8mFia_31-OT1nynviHYG7UJ3N0iEhkVrNemTs"
                    alt="Back to School"
                    className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-4 text-center lg:px-10">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#b70011]/50 bg-black/50 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    <Sparkles className="h-3.5 w-3.5 text-[#b70011]" />
                    <span>Ưu Đãi Tựu Trường 2026</span>
                </div>

                {/* Title */}
                <h1 className="mb-4 text-[48px] font-extrabold italic uppercase leading-none tracking-tighter text-white md:text-[64px] lg:text-[80px]">
                    BACK TO
                    <br />
                    <span className="text-[#b70011]">SCHOOL</span>
                </h1>

                {/* Description */}
                <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90">
                    Trang thiết bị công nghệ{" "}
                    <span className="font-bold">chất lượng cao</span>.
                    Sản phẩm{" "}
                    <span className="font-bold">chính hãng</span> -
                    Dịch vụ{" "}
                    <span className="font-bold">chuyên nghiệp</span>.
                </p>

                {/* CTA */}
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href="/product"
                        className="group relative flex items-center gap-2 overflow-hidden rounded-md bg-[#b70011] px-10 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#93000b] hover:shadow-[0_0_20px_rgba(183,0,17,0.6)]"
                    >
                        <span className="relative z-10">
                            Khám Phá Ngay
                        </span>

                        <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />

                        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>

                    <ChevronsDown className="mt-8 h-6 w-6 animate-bounce text-white/50" />
                </div>
            </div>
        </section>
    );
}