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
