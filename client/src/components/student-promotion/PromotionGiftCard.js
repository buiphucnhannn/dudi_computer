export default function PromotionGiftCard({
    icon: Icon,
    title,
    value,
}) {
    return (
        <div className="group flex cursor-pointer flex-col items-center rounded-xl border border-white/10 bg-[#0a0a0a] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#b70011]/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors duration-300 group-hover:text-[#b70011]">
                {Icon && <Icon className="h-5 w-5" />}
            </div>

            <h4 className="mb-3 text-sm font-bold text-white">
                {title}
            </h4>

            <span className="rounded bg-[#b70011] px-2 py-0.5 text-[10px] font-bold text-white">
                {value}
            </span>
        </div>
    );
}