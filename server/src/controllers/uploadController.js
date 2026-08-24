import { uploadToCloudinary } from "../config/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const uploadController = {
  // Upload 1 ảnh đơn lẻ (thumbnail, avatar, category image, etc.)
  uploadSingleImage: async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, "Vui lòng chọn file ảnh để tải lên");
      }

      const folder = req.body.folder || "dudi_software";
      const result = await uploadToCloudinary(req.file.buffer, folder, "image");

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            url: result.url,
            public_id: result.public_id,
            isFallback: result.isFallback || false,
          },
          result.isFallback
            ? "Tải ảnh thành công (Chế độ Fallback: Vui lòng điền CLOUDINARY_KEY trong .env để lưu vĩnh viễn)"
            : "Tải ảnh lên Cloudinary thành công!"
        )
      );
    } catch (error) {
      next(error);
    }
  },

  // Upload nhiều ảnh cùng lúc
  uploadMultipleImages: async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Vui lòng chọn ít nhất 1 file ảnh để tải lên");
      }

      const folder = req.body.folder || "dudi_software";
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, folder, "image")
      );

      const results = await Promise.all(uploadPromises);

      return res.status(200).json(
        new ApiResponse(
          200,
          results.map((r) => ({
            url: r.url,
            public_id: r.public_id,
            isFallback: r.isFallback || false,
          })),
          "Tải danh sách ảnh thành công!"
        )
      );
    } catch (error) {
      next(error);
    }
  },
};
