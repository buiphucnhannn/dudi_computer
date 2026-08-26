/**
 * Validator utilities for Vietnamese mobile phone numbers
 */

export const VIETNAMESE_PHONE_REGEX =
  /^(0|\+84|84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

export const normalizeVietnamesePhone = (phone) => {
  if (!phone) return "";
  return String(phone)
    .trim()
    .replace(/[\s.-]/g, "")
    .replace(/^(\+84|84)/, "0");
};

export const isValidVietnamesePhone = (phone) => {
  if (!phone) return false;
  const clean = normalizeVietnamesePhone(phone);
  return VIETNAMESE_PHONE_REGEX.test(clean);
};
