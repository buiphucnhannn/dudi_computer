/**
 * Tiện ích tối ưu hóa hình ảnh động
 * - Tự động inject f_auto,q_auto,w_xxx vào URL Cloudinary để giảm dung lượng 90-98%
 * - Ép định dạng WebP/AVIF cho ảnh tải từ server/CDN
 */

export function optimizeImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url || "";

  // 1. Tối ưu URL Cloudinary
  if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")) {
    // Nếu đã có transformation, trả về nguyên bản
    if (
      url.includes("/image/upload/f_auto") ||
      url.includes("/image/upload/q_auto") ||
      url.includes("/image/upload/w_")
    ) {
      return url;
    }

    const { width = 1200, quality = "auto:good" } = options;
    const transform = `f_auto,q_${quality},w_${width},c_limit`;

    // Chèn transformation vào sau /upload/
    let optimized = url.replace("/image/upload/", `/image/upload/${transform}/`);

    // Chuyển đuôi sang .webp nếu đang là png/jpg
    if (/\.(png|jpg|jpeg)$/i.test(optimized)) {
      optimized = optimized.replace(/\.(png|jpg|jpeg)$/i, ".webp");
    }

    return optimized;
  }

  return url;
}
