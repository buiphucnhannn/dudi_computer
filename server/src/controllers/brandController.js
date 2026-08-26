import { brandService } from "../services/brandService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await brandService.getAllBrands(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, brands, "Lấy danh sách thương hiệu thành công"));
  } catch (error) {
    next(error);
  }
};

export const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await brandService.getAdminBrands(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, brands, "Lấy danh sách thương hiệu quản trị thành công"));
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (req, res, next) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, brand, "Lấy thông tin thương hiệu thành công"));
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const brand = await brandService.createBrand(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, brand, "Tạo thương hiệu thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, brand, "Cập nhật thương hiệu thành công"));
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { force, softDelete } = req.query;
    const result = await brandService.deleteBrand(req.params.id, {
      force: force === "true" || force === true,
      softDelete: softDelete === "true" || softDelete === true,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message || "Xóa thương hiệu thành công"));
  } catch (error) {
    next(error);
  }
};
