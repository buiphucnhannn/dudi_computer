/**
 * Tiện ích kiểm tra định dạng và chuẩn hóa dữ liệu
 * Đặc thù: Số điện thoại di động Việt Nam chuẩn
 */

/**
 * Danh sách đầu số di động hợp lệ tại Việt Nam:
 * - Viettel: 086, 096, 097, 098, 032, 033, 034, 035, 036, 037, 038, 039
 * - Mobifone: 089, 090, 093, 070, 076, 077, 078, 079
 * - Vinaphone: 088, 091, 094, 081, 082, 083, 084, 085
 * - Vietnamobile: 092, 056, 058, 052
 * - Gmobile: 099, 059
 * - Itelecom: 087
 * - Wintel: 055
 */
export const VIETNAMESE_PHONE_REGEX =
  /^(0|\+84|84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;

/**
 * Chuẩn hóa số điện thoại: loại bỏ khoảng trắng, dấu gạch nối, đưa +84/84 về đầu 0
 */
export const normalizeVietnamesePhone = (phone) => {
  if (!phone) return "";
  return String(phone)
    .trim()
    .replace(/[\s.-]/g, "")
    .replace(/^(\+84|84)/, "0");
};

/**
 * Kiểm tra xem chuỗi có phải là số điện thoại di động hợp lệ ở Việt Nam hay không
 */
export const isValidVietnamesePhone = (phone) => {
  if (!phone) return false;
  const clean = normalizeVietnamesePhone(phone);
  return VIETNAMESE_PHONE_REGEX.test(clean);
};
