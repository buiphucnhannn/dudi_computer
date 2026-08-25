import { settingService } from "../services/settingService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getSettings();
    return res
      .status(200)
      .json(new ApiResponse(200, settings, "Lấy cấu hình hệ thống thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updated = await settingService.updateSettings(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Cập nhật cài đặt hệ thống thành công"));
  } catch (error) {
    next(error);
  }
};

export const createBackup = async (req, res, next) => {
  try {
    const backup = await settingService.generateBackup();
    return res
      .status(200)
      .json(new ApiResponse(200, backup, "Tạo bản sao lưu hệ thống thành công"));
  } catch (error) {
    next(error);
  }
};

export const clearCache = async (req, res, next) => {
  try {
    const result = await settingService.clearSystemCache();
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Đã làm sạch bộ nhớ đệm cache hệ thống thành công"));
  } catch (error) {
    next(error);
  }
};
