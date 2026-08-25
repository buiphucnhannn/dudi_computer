import { bannerService } from "../services/bannerService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getBanners(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, banners, "Lấy danh sách banner thành công"));
  } catch (error) {
    next(error);
  }
};

export const getBannersByPosition = async (req, res, next) => {
  try {
    const { position } = req.params;
    const onlyActive = req.query.all !== "true";
    const banners = await bannerService.getBannersByPosition(position, onlyActive);
    return res
      .status(200)
      .json(new ApiResponse(200, banners, `Lấy danh sách banner vùng ${position} thành công`));
  } catch (error) {
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const banner = await bannerService.getBannerById(id);
    return res
      .status(200)
      .json(new ApiResponse(200, banner, "Lấy thông tin banner thành công"));
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const newBanner = await bannerService.createBanner(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, newBanner, "Tạo mới banner quảng cáo thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await bannerService.updateBanner(id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Cập nhật banner thành công"));
  } catch (error) {
    next(error);
  }
};

export const toggleBannerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await bannerService.toggleBannerStatus(id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updated,
          updated.isActive
            ? "Đã bật hiển thị banner trên website"
            : "Đã tắt hiển thị banner trên website"
        )
      );
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await bannerService.deleteBanner(id);
    return res
      .status(200)
      .json(new ApiResponse(200, deleted, "Xóa banner quảng cáo thành công"));
  } catch (error) {
    next(error);
  }
};
