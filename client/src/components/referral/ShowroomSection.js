import { MapPin, ArrowRight } from "lucide-react";

const showrooms = [
  {
    name: "Showroom Thủ Đức",
    address: "123 Kha Vạn Cân, Phường Linh Trung, TP. Thủ Đức",
    location: "Kha Vạn Cân, Thủ Đức, Ho Chi Minh City",
    image: "thuDucImage.webp",
    mapUrl:
      "https://www.google.com/maps?ll=10.852127,106.753852&z=15&t=m&hl=vi&gl=US&mapclient=embed&cid=480909348043455982",
  },
  {
    name: "Showroom Bình Thạnh",
    address: "456 Phan Văn Trị, Phường 7, Quận Bình Thạnh",
    location: "Phan Van Tri, Binh Thanh, Ho Chi Minh City",
    image: "binhThanhImage.webp",
    mapUrl:
      "https://www.google.com/maps?ll=10.805765,106.707257&z=15&t=m&hl=vi&gl=US&mapclient=embed&cid=1627194541284691795",
  },
];

const ShowroomSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        {/* Title */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-bold uppercase">Hệ Thống Showroom</h2>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Showrooms */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {showrooms.map((showroom) => (
            <div
              key={showroom.name}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:flex-row"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden sm:h-auto sm:w-2/5">
                <img
                  src={showroom.image}
                  alt={showroom.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-6 sm:w-3/5">
                <h3 className="mb-2 text-lg font-semibold">{showroom.name}</h3>

                <p className="mb-4 flex items-start gap-2 text-sm leading-5 text-slate-500">
                  <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-700" />

                  {showroom.address}
                </p>

                {/* Google Maps */}
                <a
                  href={showroom.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex self-start items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-700 transition-colors hover:text-red-800"
                >
                  Xem Bản Đồ
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowroomSection;
