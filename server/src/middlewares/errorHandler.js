import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    if (error.name === "CastError") {
      statusCode = 400;
      message = `Giá trị không hợp lệ cho trường ${error.path}: ${error.value}`;
    } else if (error.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(", ");
    } else if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue || {})[0] || "dữ liệu";
      message = `${field} đã tồn tại trong hệ thống`;
    } else if (error.name === "MulterError") {
      statusCode = 400;
      message = `Lỗi tải lên tệp: ${error.message}`;
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    data: error.data || null,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Không tìm thấy đường dẫn: ${req.originalUrl}`);
  next(error);
};
