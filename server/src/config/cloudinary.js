import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary SDK trực tiếp từ biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  console.log(
    `☁️ [Cloudinary] Đã kích hoạt kết nối Cloudinary thật (Cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`
  );
} else {
  console.error(
    "❌ [Cloudinary] Lỗi: Chưa cung cấp đủ CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong .env"
  );
}

/**
 * Upload file buffer trực tiếp lên Cloudinary (Không lưu file trên server)
 * @param {Buffer} buffer - Buffer của file tải lên
 * @param {string} folder - Thư mục lưu trữ trên Cloudinary (mặc định: 'dudi_software')
 * @param {string} resourceType - 'image' | 'auto' | 'raw'
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const uploadToCloudinary = async (
  buffer,
  folder = "dudi_software/products",
  resourceType = "image"
) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary chưa được cấu hình. Vui lòng kiểm tra các biến CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong server/.env"
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format: "webp",
        transformation: [
          { quality: "auto:good", fetch_format: "auto", width: 1600, height: 1600, crop: "limit" },
        ],
        timeout: 45000,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload Cloudinary:", error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Xóa file ảnh trên Cloudinary bằng public_id
 * @param {string} publicId - public_id của ảnh cần xóa trên Cloudinary
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("❌ Lỗi xóa ảnh trên Cloudinary:", error);
    return null;
  }
};

/**
 * Trích xuất public_id từ Cloudinary URL (bỏ qua version /v.../ và file extension)
 * @param {string} url - Cloudinary URL
 * @returns {string|null}
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.\?]+)(?:\.[a-zA-Z0-9]+)?/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    console.error("Lỗi trích xuất public_id từ URL Cloudinary:", e);
  }
  return null;
};

/**
 * Xóa 1 ảnh trên Cloudinary trực tiếp bằng URL
 * @param {string} url - Cloudinary URL
 * @returns {Promise<any>}
 */
export const deleteCloudinaryByUrl = async (url) => {
  if (!url) return null;
  const publicId = extractPublicIdFromUrl(url);
  if (publicId) {
    return await deleteFromCloudinary(publicId);
  }
  return null;
};

/**
 * Xóa nhiều ảnh trên Cloudinary bằng danh sách URLs cùng lúc
 * @param {string[]} urls - Danh sách Cloudinary URLs
 * @returns {Promise<any[]>}
 */
export const deleteManyCloudinaryByUrls = async (urls = []) => {
  if (!Array.isArray(urls) || urls.length === 0) return [];
  const validUrls = urls.filter((u) => typeof u === "string" && u.includes("cloudinary.com"));
  const promises = validUrls.map((u) => deleteCloudinaryByUrl(u));
  return await Promise.allSettled(promises);
};

export default cloudinary;

