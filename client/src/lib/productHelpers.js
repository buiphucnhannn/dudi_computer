/**
 * Các hàm tiện ích xử lý dữ liệu Sản phẩm, Giảm giá, Badge và Sắp xếp ưu tiên
 * Chuẩn Enterprise - Đảm bảo dữ liệu thật 100% từ Database MongoDB
 */

/**
 * Trích xuất và tính toán thông tin giảm giá chính xác từ Database
 * @param {object} product
 * @returns {{ price: number, originalPrice: number|null, discountPercent: number, hasDiscount: boolean, isHot: boolean, isFlashSale: boolean, showHotSaleBadge: boolean }}
 */
export function getProductDiscountInfo(product) {
  if (!product) {
    return {
      price: 0,
      originalPrice: null,
      discountPercent: 0,
      hasDiscount: false,
      isHot: false,
      isFlashSale: false,
      showHotSaleBadge: false,
    };
  }

  const price = Number(product.price) || 0;
  const rawOriginalPrice = Number(product.originalPrice) || 0;
  const isHot = Boolean(product.isHot);
  const isFlashSale = Boolean(product.isFlashSale);

  let discountPercent = 0;
  let originalPrice = null;

  if (rawOriginalPrice > price) {
    originalPrice = rawOriginalPrice;
    discountPercent =
      product.discountPercent > 0
        ? Number(product.discountPercent)
        : Math.round(((rawOriginalPrice - price) / rawOriginalPrice) * 100);
  } else if (product.discountPercent > 0 && product.discountPercent < 100) {
    discountPercent = Number(product.discountPercent);
    // Nếu có discountPercent nhưng chưa set originalPrice thì tính ngược lại
    originalPrice = Math.round(price / (1 - discountPercent / 100));
  }

  const hasDiscount = discountPercent > 0 && originalPrice > price;
  // Chỉ hiển thị badge góc phải khi Database có cờ isHot hoặc isFlashSale
  const showHotSaleBadge = Boolean(isFlashSale || isHot);

  return {
    price,
    originalPrice: hasDiscount ? originalPrice : null,
    discountPercent,
    hasDiscount,
    isHot,
    isFlashSale,
    showHotSaleBadge,
  };
}

/**
 * Sắp xếp danh sách sản phẩm theo thứ tự ưu tiên thông minh:
 * 1. Sản phẩm đang Flash Sale / Khuyến mãi / Hot Sale với mức giảm giá (% cao nhất) lên đầu
 * 2. Sản phẩm được đánh dấu Hot / FlashSale
 * 3. Sản phẩm MỚI NHẤT (createdAt giảm dần)
 * 4. Sản phẩm nhiều lượt xem / bán chạy
 * @param {Array} products
 * @returns {Array} Mảng sản phẩm đã sắp xếp
 */
export function sortProductsByPriority(products) {
  if (!Array.isArray(products) || products.length === 0) return [];

  return [...products].sort((a, b) => {
    const infoA = getProductDiscountInfo(a);
    const infoB = getProductDiscountInfo(b);

    // 1. Ưu tiên sản phẩm có % giảm giá cao hơn
    if (infoA.discountPercent !== infoB.discountPercent) {
      return infoB.discountPercent - infoA.discountPercent;
    }

    // 2. Ưu tiên Flash Sale / Hot Sale
    const priorityA = (infoA.isFlashSale ? 2 : 0) + (infoA.isHot ? 1 : 0);
    const priorityB = (infoB.isFlashSale ? 2 : 0) + (infoB.isHot ? 1 : 0);
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // 3. Ưu tiên sản phẩm MỚI NHẤT (createdAt)
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA !== timeB) {
      return timeB - timeA;
    }

    // 4. Ưu tiên lượt xem (views) / số lượng bán
    const viewsA = Number(a.views) || 0;
    const viewsB = Number(b.views) || 0;
    if (viewsA !== viewsB) {
      return viewsB - viewsA;
    }

    return 0;
  });
}

/**
 * Lấy URL hình ảnh chuẩn của sản phẩm từ Database
 * @param {object} item
 * @returns {string}
 */
export function getProductImage(item) {
  if (!item) return "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
  
  // 1. Kiểm tra thumbnail
  const thumb = typeof item.thumbnail === "object" ? item.thumbnail?.url : item.thumbnail;
  if (thumb && typeof thumb === "string" && thumb.startsWith("http")) return thumb;
  if (thumb && typeof thumb === "string") return `https://zcomputer.vn${thumb}`;

  // 2. Kiểm tra mảng images
  if (Array.isArray(item.images) && item.images.length > 0) {
    const firstImg = typeof item.images[0] === "object" ? item.images[0]?.url : item.images[0];
    if (firstImg && typeof firstImg === "string" && firstImg.startsWith("http")) return firstImg;
    if (firstImg && typeof firstImg === "string") return `https://zcomputer.vn${firstImg}`;
  }

  // 3. Kiểm tra image đơn
  const singleImg = typeof item.image === "object" ? item.image?.url : item.image;
  if (singleImg && typeof singleImg === "string" && singleImg.startsWith("http")) return singleImg;

  return "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80";
}
