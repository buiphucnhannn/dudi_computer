export default function ProductBanner() {
  return (
    <section className="px-4 py-4 sm:py-6 lg:px-8 xl:px-10">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl shadow-xs border border-slate-200/80 bg-white">
        <img
          src="/banner.webp"
          alt="DUDI SOFTWARE - Khuyến mãi Back To School"
          className="block w-full h-auto aspect-[16/9] object-cover object-center"
        />
      </div>
    </section>
  );
}
