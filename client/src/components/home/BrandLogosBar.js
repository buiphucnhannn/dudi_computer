"use client";

const BRANDS = [
  { name: "ASUS", slug: "asus", color: "#00539B" },
  { name: "CORSAIR", slug: "corsair", color: "#E5C158" },
  { name: "INTEL", slug: "intel", color: "#0068B5" },
  { name: "AMD", slug: "amd", color: "#ED1C24" },
  { name: "NVIDIA", slug: "nvidia", color: "#76B900" },
  { name: "RAZER", slug: "razer", color: "#00FF00" },
  { name: "SAMSUNG", slug: "samsung", color: "#1428A0" },
  { name: "DELL", slug: "dell", color: "#007DB8" },
  { name: "HP", slug: "hp", color: "#0096D6" },
  { name: "LENOVO", slug: "lenovo", color: "#E2231A" },
  { name: "APPLE", slug: "apple", color: "#555555" },
];

export default function BrandLogosBar() {
  const brandList = [...BRANDS, ...BRANDS];

  return (
    <div className="bg-transparent py-6 md:py-10 overflow-hidden relative flex items-center mb-6 md:mb-10 w-full">
      {/* Left Gradient Fade Mask */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none" />

      {/* Infinite Seamless Scrolling Track (Does NOT stop on hover) */}
      <div className="flex w-max animate-marquee">
        {brandList.map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center px-6 md:px-12 group cursor-pointer w-[120px] md:w-[250px] justify-center gap-4 shrink-0"
            style={{ "--brand-color": brand.color }}
          >
            <img
              src={`https://cdn.simpleicons.org/${brand.slug}`}
              alt={brand.name}
              loading="lazy"
              width={100}
              height={56}
              className="h-8 md:h-12 w-auto opacity-30 group-hover:opacity-100 group-hover:scale-115 transition-all duration-500 drop-shadow-xs"
            />
            <span
              className="text-gray-400 font-extrabold tracking-widest uppercase opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 hidden md:block text-sm sm:text-base"
              style={{ color: brand.color }}
            >
              {brand.name}
            </span>
          </div>
        ))}
      </div>

      {/* Right Gradient Fade Mask */}
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none" />
    </div>
  );
}
