const categories = [
  {
    title: "Laptop Văn Phòng",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ2pGb0oHAidB4W_dt-61udJeyjUBssDVqefKbZYclNHYPNfDYpWykOWyLsmVkYt_SCK6-hd-5Ty4e1P5pwt5pjp8cP_7bZyTHMK5VTcG_2kSLE-H8pM0ORysSEDQDLmvc7z33FQ_m8biYyphMAIA2ehgxsqQ0skUheGE1xKNQ5YIXQNa8iN-42tu_kzHdQ5R0R0AIYz7nrG2IJMe2AXhsBwF_U53rNVRoP_B5_m_hArGRADqBArrEuQ",
  },
  {
    title: "Laptop Gaming",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhSndE3giutyWU7IEj48TAqDrXct8bX2ci95NUDwvdQBwcFRfoZXEJd4cFJkYfndbUEzIshr8kc4dMbztf0sQR-6hcbOYuZp49vslbkHMNhJPe89oH2qrXzoyhlhEm081sxdFEsE-wDJ0Yziu_XZvZa1UmQ0fasMtvfV_4gKVWCIC_-YrvIptjbJpxc7zlVRLt9hDQqv4zFV9vbJn0CESJUS23lM-ndjX9KGruNkecWeXSppNU9bZygA",
  },
  {
    title: "PC Đồ Hoạ Render",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3n9-x1nPaQR8L60wsviNRLbTxoEbAbpZ59wSWPyo3Ez0L9aHsNuRdNswYgDx1C2OJuKWOZhatHCtGJceH2pJandU7L2gwVPntECqd7iwZvP5ZuCihIAGk-2uKoevWIBVQq36hxASib_d08rrdWF44aIlnI5NwXFqMOAD-G5YKCCaBmNHeIbX_uCGS7RXr0Q-OjBu-7EbOAelhVNT_BT6wFvLG9ZETzeKaiiRnqwgfRzN27Wm-bSSQFw",
  },
  {
    title: "PC Workstation",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wxTGhZsNT7BTnHJJiVVpU1efIxr3Br1SPAsqLs5lryupelrztq0hl82VaaKDqnMxZE4w6FBAPjsHG3nZxnwgCRwU8F6BlCNCRmFBPPwK757vknEP3SzOSABwD7y7AfC1hqCbTFUdSdjsgX5Qb8alkby-a2kdE-GEKf9KO8bKZGYjYoOdobMsFCuCCnDAWS2t2DDKVTil_pp5-yda67PEirKUrbOFWosUz2mdjyKMTQBgBlLWCqRULw",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full border-y border-slate-200/80 bg-white py-10 sm:py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 sm:mb-10 flex flex-col items-center text-center">
          <span className="text-xs font-black uppercase tracking-wider text-red-600 mb-1">
            ĐA DẠNG DÒNG MÁY
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
            Thu Mua Đa Dạng
          </h2>

          <div className="mt-2 h-1 w-16 rounded-full bg-red-600 shadow-2xs" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group relative h-44 sm:h-48 md:h-52 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-65 transition-all duration-500 group-hover:scale-108 group-hover:opacity-85"
                style={{
                  backgroundImage: `url("${category.image}")`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h4 className="text-xs sm:text-sm font-bold text-white transition-colors group-hover:text-red-400">
                  {category.title}
                </h4>

                <div className="mt-1.5 h-0.5 w-0 bg-red-600 transition-all duration-300 group-hover:w-10" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
