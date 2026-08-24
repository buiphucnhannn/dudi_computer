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
