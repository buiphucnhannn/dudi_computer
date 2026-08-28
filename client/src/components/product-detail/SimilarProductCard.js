"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Cpu,
  Layers,
  HardDrive,
  CircuitBoard,
  Monitor,
  Maximize2,
  Zap,
  Sparkles,
  ShieldCheck,
  Wifi,
  Clock,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  removeFromCartAsync,
  selectCartItems,
} from "@/redux/slices/cartSlice";
import { selectIsAdmin } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";
import { handleImageError } from "@/lib/imageFallback";
import { optimizeImageUrl } from "@/lib/imageOptimizer";
import { getProductCardBadges } from "@/lib/specParser";
import { formatViews } from "@/lib/productHelpers";

const formatPrice = (price) => {
  if (!price) return "";
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
};

// Trích xuất tên thương hiệu chuẩn (loại bỏ ObjectId và fallback thông minh)
const getDisplayBrand = (product) => {
  if (!product) return "DUDI SOFTWARE";

  const brand = typeof product.brand === "object" ? product.brand?.name : product.brand;
  if (brand && typeof brand === "string" && !/^[0-9a-fA-F]{24}$/.test(brand.trim())) {
    return brand.trim().toUpperCase();
  }

  if (product.brandName && typeof product.brandName === "string" && !/^[0-9a-fA-F]{24}$/.test(product.brandName.trim())) {
    return product.brandName.trim().toUpperCase();
  }

  // Tự động nhận diện thương hiệu từ tên sản phẩm
  const name = String(product.name || product.title || "");
  const matched = name.match(
    /\b(ASUS|ROG|TUF|MSI|GIGABYTE|AORUS|DELL|ALIENWARE|HP|VICTUS|OMEN|LENOVO|LEGION|LOQ|THINKPAD|ACER|PREDATOR|NITRO|APPLE|MACBOOK|SAMSUNG|LG|CORSAIR|LOGITECH|RAZER|VIEWSONIC|AOC|PHILIPS|ZOWIE|BENQ|KINGSTON|XPG|FSP|COOLER MASTER|THERMALTAKE|NZXT|LIAN LI|DEEPCOOL|GALAX|PALIT|ZOTAC|INNO3D|COLORFUL|AMD|INTEL|DAREU|AKKO|KEYCHRON)\b/i
  );
  if (matched) {
    return matched[0].toUpperCase();
  }

  const categoryName = typeof product.category === "object" ? product.category?.name : product.categoryName;
  if (categoryName && typeof categoryName === "string" && !/^[0-9a-fA-F]{24}$/.test(categoryName.trim())) {
    return categoryName.trim().toUpperCase();
  }

  return "DUDI SOFTWARE";
};

export default function SimilarProductCard({ product }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems) || [];
  const isAdmin = useSelector(selectIsAdmin);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const productId = product.id || product._id || product.slug;
  const isCart = cartItems.some(
    (item) => item.id === productId || item._id === productId || item.slug === product.slug
  );

  const href = `/product-detail?slug=${encodeURIComponent(
    product.slug || productId
  )}`;

  const isOutOfStock = typeof product.stock === "number" ? product.stock <= 0 : Boolean(product.outOfStock);

  const handleToggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      showToast({
        title: "Sản phẩm đã hết hàng",
        message: `Sản phẩm "${product.name}" hiện đã hết hàng trong kho.`,
        type: "warning",
      });
      return;
    }

    dispatch(
      addToCartAsync({
        product: {
          _id: productId,
          id: productId,
          name: product.name,
          price: product.price,
          originalPrice: product.oldPrice || product.originalPrice,
          image: product.image || product.thumbnail,
          thumbnail: product.image || product.thumbnail,
          slug: product.slug,
          stock: product.stock,
        },
        quantity: 1,
      })
    );
    showToast({
      title: "Đã thêm vào giỏ hàng",
      message: `Đã thêm "${product.name}" vào giỏ hàng (+1)!`,
      type: "success",
    });
  };

  const discount = product.discount || product.discountPercent || 0;
  const displayBrand = getDisplayBrand(product);
  const badges = getProductCardBadges(product);

  const renderBadgeIcon = (iconName) => {
    const props = { className: "w-3.5 h-3.5 text-slate-400 shrink-0" };
    switch (iconName) {
      case "Cpu": return <Cpu {...props} />;
      case "Layers": return <Layers {...props} />;
      case "HardDrive": return <HardDrive {...props} />;
      case "CircuitBoard": return <CircuitBoard {...props} />;
      case "Monitor": return <Monitor {...props} />;
      case "Maximize2": return <Maximize2 {...props} />;
      case "Zap": return <Zap {...props} />;
      case "Sparkles": return <Sparkles {...props} />;
      case "ShieldCheck": return <ShieldCheck {...props} />;
      case "Wifi": return <Wifi {...props} />;
      case "Clock": return <Clock {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-red-400/80 shadow-xs"
    >
      {/* ── TOP BADGES & ACTIONS ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-slate-50/30 p-4 border-b border-slate-100 flex items-center justify-center">
        <Link href={href} className="block w-full h-full flex items-center justify-center">
          <img
            src={optimizeImageUrl(product.image || product.thumbnail, { width: 350 })}
            alt={product.name}
            width={280}
            height={280}
            loading="lazy"
            className={`
              h-full w-full object-contain mix-blend-multiply
              transition-transform duration-500 ease-out
              ${product.outOfStock
                ? "grayscale opacity-60"
                : "group-hover:scale-108"
              }
            `}
            onError={handleImageError}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
            Giảm {discount}%
          </span>
        )}

        {/* Flash Sale Badge & Cart Toggle Button */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
          {product.isFlashSale && (
            <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 pointer-events-none">
              <Zap className="w-3 h-3 fill-white text-white" />
              <span>FLASH SALE</span>
            </span>
          )}

          {mounted && !isAdmin && !isOutOfStock && (
            <button
              type="button"
              aria-label="Thêm vào giỏ hàng"
              onClick={handleToggleCart}
              className={`
                flex h-8 w-8 items-center justify-center
                rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-100
                transition-all duration-200 hover:scale-110 cursor-pointer
                ${isCart
                  ? "bg-red-600 text-white shadow-sm border-red-600"
                  : "text-slate-600 hover:text-red-600 hover:bg-red-50"
                }
              `}
              title={isCart ? "Đã có trong giỏ hàng (Bấm để bỏ)" : "Thêm vào giỏ hàng"}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Watermark */}
        <div className="absolute bottom-1.5 left-2 pointer-events-none opacity-85 z-20">
          <span className="inline-block bg-white/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8.5px] font-black text-[#eb1c24] tracking-wider uppercase border border-red-100/60 shadow-2xs">
            DUDI SOFTWARE
          </span>
        </div>

        {/* Out of stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/30 backdrop-blur-[2px]">
            <div className="rounded-lg border border-red-200 bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-red-600 shadow-md">
              Tạm Hết Hàng
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Condition */}
        <div className="mb-1.5 flex items-center justify-between gap-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 truncate">
            {displayBrand}
          </span>
          {product.condition && (
            <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
              {product.condition}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link href={href} className="block mb-2">
          <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-bold leading-5 text-slate-800 transition-colors group-hover:text-red-600" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* 4 Specs Badges Grid */}
        {badges && badges.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-1.5 sm:p-2 grid grid-cols-2 gap-1 sm:gap-1.5 text-[9.5px] sm:text-[10px] text-slate-600 mb-3 border border-slate-100 min-h-[52px]">
            {badges.map((b, idx) => (
              <div key={idx} className="flex items-center gap-1 truncate" title={b.title || b.label}>
                {renderBadgeIcon(b.icon)}
                <span className="truncate font-medium text-slate-700">{b.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Section */}
        <div className="mb-3.5 mt-auto">
          {product.contactPrice ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Giá bán:
              </span>
              <span className="text-base font-extrabold text-red-600">
                {product.contactPrice}
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-red-600">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs font-medium text-slate-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Views & CTA */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatViews(product.views)}</span>
          </div>

          <Link
            href={href}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          >
            <span>Chi tiết</span>
            <span className="font-sans">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}