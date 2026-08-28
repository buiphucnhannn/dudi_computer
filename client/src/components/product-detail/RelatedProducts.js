import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { optimizeImageUrl } from "@/lib/imageOptimizer";

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="w-full bg-white py-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-10">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-red-600 rounded-sm" />
          Sản phẩm tương tự
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const rawThumbnail =
              product.thumbnail ||
              product.images?.[0] ||
              "/images/dudi/dudisoftware1.webp";
            const thumbnail = optimizeImageUrl(rawThumbnail, { width: 350 });
            const href = `/product-detail?slug=${encodeURIComponent(
              product.slug || product._id,
            )}`;

            return (
              <div
                key={product._id || product.slug}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:border-red-400/80 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <Link
                  href={href}
                  className="aspect-square overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 border-b border-slate-100 p-5 relative flex items-center justify-center"
                >
                  <img
                    src={thumbnail}
                    alt={product.name}
                    width={280}
                    height={280}
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {product.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-rose-500 text-white px-2.5 py-0.5 rounded-lg text-xs font-black shadow-sm">
                      -{product.discountPercent}%
                    </div>
                  )}

                  {/* Watermark */}
                  <div className="absolute bottom-1.5 left-2 pointer-events-none opacity-85 z-20">
                    <span className="inline-block bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8.5px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
                      DUDI SOFTWARE
                    </span>
                  </div>
                </Link>

                <div className="p-5 flex flex-col gap-4">
                  <Link href={href}>
                    <h3 className="font-semibold text-base text-slate-900 line-clamp-2 h-12 leading-snug hover:text-red-600">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex flex-col gap-1">
                    <span className="text-red-600 font-extrabold text-[22px]">
                      {formatVND(product.price)}
                    </span>

                    {product.originalPrice > product.price && (
                      <span className="text-slate-500 text-sm line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={href}
                    className="w-full mt-3 py-3 border-2 border-red-600 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors text-center"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
