import Link from "next/link";
import { formatVND } from "@/lib/utils";

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
            const thumbnail =
              product.thumbnail ||
              product.images?.[0] ||
              "https://zcomputer.vn/logo-main.png";
            const href = `/product-detail?slug=${encodeURIComponent(
              product.slug || product._id,
            )}`;

            return (
              <div
                key={product._id || product.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-red-600/50 transition-all duration-300 group"
              >
                <Link
                  href={href}
                  className="aspect-square overflow-hidden bg-slate-100 relative block"
                >
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                  />

                  {product.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-mono font-bold">
                      -{product.discountPercent}%
                    </div>
                  )}
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
