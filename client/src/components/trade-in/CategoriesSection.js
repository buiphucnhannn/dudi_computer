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
    <section className="w-full border-y border-gray-200 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 text-3xl font-black uppercase text-gray-900 md:text-4xl">
            Thu Mua Đa Dạng
          </h2>

          <div className="h-1 w-24 bg-red-600" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category) => (
            <article
              key={category.title}
              className="group relative h-64 overflow-hidden rounded border border-gray-200 bg-gray-100"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 transition-all duration-500 group-hover:scale-105 group-hover:opacity-70"
                style={{
                  backgroundImage: `url("${category.image}")`,
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h4 className="text-lg font-bold text-white transition-colors group-hover:text-red-400">
                  {category.title}
                </h4>

                <div className="mt-2 h-0.5 w-0 bg-red-600 transition-all duration-300 group-hover:w-12" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
