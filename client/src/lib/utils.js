import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format số tiền sang định dạng tiền Việt Nam (VNĐ)
 * @param {number} amount
 * @returns {string} ví dụ: "15.990.000 ₫"
 */
export function formatVND(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format ngày tháng sang định dạng chuẩn dd/mm/yyyy
 * @param {string|Date|number} dateInput
 * @returns {string} ví dụ: "24/08/2026"
 */
export function formatDate(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format ngày giờ sang định dạng chuẩn HH:mm dd/mm/yyyy
 * @param {string|Date|number} dateInput
 * @returns {string} ví dụ: "14:30 24/08/2026"
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

/**
 * Cuộn mượt mà phần tử với thời gian và gia tốc mượt mà tùy chỉnh (Ease In-Out)
 * @param {HTMLElement} element 
 * @param {number} distance Khoảng cách cần cuộn (px)
 * @param {number} duration Thời gian lướt (ms), mặc định 500ms
 */
export function smoothScrollBy(element, distance, duration = 500) {
  if (!element) return;
  const start = element.scrollLeft;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    element.scrollLeft = start + distance * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
