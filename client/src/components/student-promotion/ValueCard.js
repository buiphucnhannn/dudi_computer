export default function ValueCard({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="group flex cursor-pointer flex-col items-center rounded-xl border border-[#b70011]/20 bg-[#0a0a0a] p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#b70011] hover:shadow-[0_10px_30px_-10px_rgba(183,0,17,0.5)]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#b70011]/50 text-[#b70011] transition-transform duration-300 group-hover:scale-110">
                {Icon && <Icon className="h-5 w-5" />}
            </div>

            <h3 className="mb-3 text-xl font-semibold uppercase tracking-tight text-white">
                {title}
            </h3>

            <p className="text-sm leading-relaxed text-white/50">
                {description}
            </p>
        </div>
    );
}