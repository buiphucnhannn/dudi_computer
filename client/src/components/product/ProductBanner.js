export default function ProductBanner() {
  return (
    <section className="px-4 py-4 sm:py-6 lg:px-8 xl:px-10">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl shadow-xs">
        <img
          src="/banner.webp"
          alt="ZComputer - Khuyến mãi sản phẩm"
          className="block h-[140px] w-full object-cover object-center sm:h-[200px] md:h-[260px] lg:h-[300px]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />

        <div className="absolute left-6 top-1/2 -translate-y-1/2 sm:left-10 md:left-14 z-10">
          <h1 className="text-2xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight uppercase">
            BACK TO SCHOOL
          </h1>

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-base md:text-lg font-semibold text-red-400">
            Ưu đãi cực khủng - Sẵn sàng bứt phá
          </p>
        </div>
      </div>
    </section>
  );
}
