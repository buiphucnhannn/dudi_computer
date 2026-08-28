/**
 * Hệ thống Fallback hình ảnh thương hiệu DUDI SOFTWARE
 * Đảm bảo 100% hình ảnh trên website khi bị link hỏng, lỗi mạng hoặc bị xóa
 * đều hiển thị ảnh dự phòng chuẩn xác, chuyên nghiệp, không vỡ layout.
 */

export const DEFAULT_FALLBACK_IMAGE = "/images/dudi/dudisoftware4.webp";
export const NEWS_FALLBACK_IMAGE = "/images/dudi/dudisoftware1.webp";
export const BANNER_FALLBACK_IMAGE = "/images/dudi/dudisoftware3.webp";

/**
 * Xử lý lỗi load ảnh an toàn (Chống lặp vô tận onError loop)
 * @param {React.SyntheticEvent<HTMLImageElement, Event>} e
 * @param {string} fallbackSrc - URL ảnh dự phòng (mặc định là logo DUDI SOFTWARE)
 */
export const handleImageError = (e, fallbackSrc = DEFAULT_FALLBACK_IMAGE) => {
  if (!e || !e.currentTarget) return;
  // Ngăn chặn trigger lại onError nếu chính ảnh fallback cũng bị lỗi
  e.currentTarget.onerror = null;
  e.currentTarget.src = fallbackSrc;
};
