import { MapPin, ArrowRight } from "lucide-react";

const showrooms = [
  {
    name: "Showroom Thủ Đức",
    address: "49/2 Đường 14, Phường Thủ Đức, TP. Thủ Đức",
    location: "Kha Vạn Cân, Thủ Đức, Ho Chi Minh City",
    image: "/images/dudi/dudi_showroom_hero.webp",
    mapUrl:
      "https://maps.google.com/?q=49/2+Đường+14+Phường+Thủ+Đức+TP+Hồ+Chí+Minh",
  },
  {
    name: "Showroom Bình Thạnh",
    address: "232 Đường Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.Hồ Chí Minh",
    location: "Nguyen Thi Minh Khai, Ho Chi Minh City",
    image: "/images/dudi/dudisoftware3.webp",
    mapUrl:
      "https://maps.google.com/?q=232+Đường+Nguyễn+Thị+Minh+Khai+Phường+Xuân+Hòa+TP+Hồ+Chí+Minh",
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
                  width={300}
                  height={200}
                  loading="lazy"
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
