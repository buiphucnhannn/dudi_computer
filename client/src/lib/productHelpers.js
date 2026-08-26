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

/**
 * Kiểm tra xem một sản phẩm có thuộc về một danh mục / danh mục con cụ thể hay không
 * Phục vụ lọc chính xác 100% cho cả Trang chủ và Trang Tất cả Sản phẩm
 * @param {object} product 
 * @param {string} targetCatSlug 
 * @param {Array} categories 
 * @returns {boolean}
 */
export function isProductMatchingCategory(product, targetCatSlug, categories = []) {
  if (!product || !targetCatSlug || targetCatSlug === "all") return true;
  const s = String(targetCatSlug).toLowerCase().trim();
  const name = String(product.name || product.title || "").toLowerCase();
  const catSlug = String(product.categorySlug || product.category?.slug || "").toLowerCase();
  const catName = String(product.categoryName || product.category?.name || "").toLowerCase();
  const pCatId = (product.category?._id || product.category || "").toString();

  // 1. Kiểm tra khớp chính xác ID hoặc slug từ Database Category nếu có
  if (Array.isArray(categories) && categories.length > 0) {
    const targetCatObj = categories.find(
      (c) => (c.slug || "").toLowerCase() === s || (c._id || "").toString() === s
    );
    if (targetCatObj) {
      if (pCatId && targetCatObj._id && pCatId === targetCatObj._id.toString()) return true;
      if (catSlug === targetCatObj.slug.toLowerCase()) return true;
    }
  }

  // Loại trừ sớm nếu bị gán nhầm:
  const isPCBuild = name.startsWith("bộ máy") || name.startsWith("pc ") || name.startsWith("máy tính để bàn") || name.startsWith("máy tính aio");
  const isLaptopOrMacbook = (name.startsWith("laptop") || name.startsWith("macbook") || name.includes("thinkpad") || name.includes("surface") || name.includes("latitude") || name.includes("zenbook") || name.includes("vivobook")) && !isPCBuild;
  const isMonitor = (name.startsWith("màn hình") || name.startsWith("lcd ") || name.includes("ultragear") || name.includes("odyssey g")) && !name.includes("card màn hình");
  const isKeyboard = name.includes("bàn phím") || name.startsWith("bàn phím");
  const isMouse = name.includes("chuột") || name.startsWith("chuột");

  // --- LAPTOP SUBCATEGORIES ---
  if (s === "laptop-gaming") {
    if (isPCBuild || isMonitor || isKeyboard || isMouse) return false;
    return (
      isLaptopOrMacbook &&
      (name.includes("gaming") || name.includes("tuf") || name.includes("rog") || name.includes("nitro") || name.includes("loq") || name.includes("legion") || name.includes("victus") || name.includes("predator") || name.includes("alienware") || name.includes("omen") || name.includes("g15") || name.includes("rtx") || name.includes("gtx"))
    );
  }
  if (s === "laptop-van-phong") {
    if (isPCBuild || isMonitor || isKeyboard || isMouse) return false;
    return (
      isLaptopOrMacbook &&
      (name.includes("văn phòng") || name.includes("thinkpad") || name.includes("latitude") || name.includes("zenbook") || name.includes("vivobook") || name.includes("inspiron") || name.includes("vostro") || name.includes("pavilion") || name.includes("surface") || name.includes("xps") || name.includes("gram") || name.includes("swift") || name.includes("ideapad"))
    );
  }
  if (s === "macbook") {
    if (isPCBuild || isMonitor || isKeyboard || isMouse) return false;
    return name.includes("macbook") || name.includes("apple") || catSlug.includes("macbook");
  }
  if (s === "laptop-cu" || s === "laptop") {
    if (isPCBuild || isMonitor || isKeyboard || isMouse) return false;
    return isLaptopOrMacbook;
  }

  // --- PC SUBCATEGORIES ---
  if (s === "pc-gaming") {
    if (isLaptopOrMacbook || isMonitor || isKeyboard || isMouse) return false;
    return (
      isPCBuild &&
      (name.includes("gaming") || name.includes("rtx") || name.includes("gtx") || name.includes("rx ") || name.includes("bể cá") || name.includes("fan led") || name.includes("b650m") || name.includes("b760m") || name.includes("b550m") || name.includes("h510m") || name.includes("b450m"))
    );
  }
  if (s === "pc-do-hoa") {
    if (isLaptopOrMacbook || isMonitor || isKeyboard || isMouse) return false;
    return (
      isPCBuild &&
      (name.includes("đồ họa") || name.includes("i7") || name.includes("i9") || name.includes("ryzen 9") || name.includes("ryzen 7") || name.includes("workstation") || name.includes("32gb") || name.includes("64gb") || name.includes("quadro") || name.includes("7800x3d") || name.includes("5700x3d"))
    );
  }
  if (s === "pc-van-phong") {
    if (isLaptopOrMacbook || isMonitor || isKeyboard || isMouse) return false;
    return (
      isPCBuild &&
      (name.includes("văn phòng") || name.includes("i3") || name.includes("i5") || name.includes("5500gt") || name.includes("h610") || name.includes("h510") || name.includes("h410") || name.includes("h81") || name.includes("h110") || name.includes("vostro") || name.includes("optiplex") || name.includes("prodesk") || name.includes("aio"))
    );
  }
  if (s === "pc" || s === "pc-cu") {
    if (isLaptopOrMacbook || isMonitor || isKeyboard || isMouse) return false;
    return isPCBuild;
  }

  // --- MÀN HÌNH ---
  if (s === "man-hinh" || s === "man-hinh-may-tinh" || s.includes("màn hình")) {
    if (isKeyboard || isMouse || isPCBuild || isLaptopOrMacbook) return false;
    return isMonitor;
  }

  // --- GEAR (BÀN PHÍM & CHUỘT) ---
  if (s === "ban-phim") return isKeyboard;
  if (s === "chuot") return isMouse;

  // --- LINH KIỆN ---
  if (s.includes("mainboard") || s.includes("bo-mach")) return name.startsWith("main") || name.startsWith("bo mạch") || catSlug.includes("mainboard");
  if (s.includes("psu") || s.includes("nguon")) return name.startsWith("nguồn") || name.startsWith("psu") || catSlug.includes("psu");
  if (s.includes("cpu")) return (name.startsWith("cpu") || name.startsWith("vi xử lý") || catSlug.includes("cpu")) && !isPCBuild;
  if (s.includes("vga")) return (name.startsWith("vga") || name.startsWith("card màn hình") || catSlug.includes("vga")) && !isPCBuild;
  if (s.includes("ram")) return (name.startsWith("ram") || catSlug.includes("ram")) && !isPCBuild;
  if (s.includes("ssd") || s.includes("hdd") || s.includes("o-cung")) return (name.startsWith("ssd") || name.startsWith("hdd") || name.startsWith("ổ cứng") || catSlug.includes("o-cung")) && !isPCBuild;
  if (s.includes("case")) return (name.startsWith("case") || name.startsWith("vỏ") || catSlug.includes("case")) && !isPCBuild;
  if (s.includes("tan-nhiet") || s.includes("cooling")) return (name.startsWith("tản nhiệt") || name.startsWith("tản") || catSlug.includes("tan-nhiet")) && !isPCBuild;

  return catSlug.includes(s) || catName.includes(s) || name.includes(s);
}
