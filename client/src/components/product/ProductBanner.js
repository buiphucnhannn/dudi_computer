export default function ProductBanner() {
  return (
    <section className="px-4 py-6 lg:px-8 xl:px-10">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl">
        <img
          src={tradeinbg}
          alt="Back to school"
          className="
      w-full
      h-auto
      min-h-48
      sm:min-h-64
      lg:min-h-80
      object-cover
      object-center
    "
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        <div className="absolute left-6 top-1/2 -translate-y-1/2 sm:left-10">
          <h1 className="text-3xl font-black text-white sm:text-5xl lg:text-6xl">
            BACK TO SCHOOL
          </h1>

          <p className="mt-2 text-sm font-semibold text-red-400 sm:text-lg">
            Ưu đãi cực khủng - Sẵn sàng bứt phá
          </p>
        </div>
      </div>
    </section>
  );
}
