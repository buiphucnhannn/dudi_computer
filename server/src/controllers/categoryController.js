import { categoryService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res
      .status(200)
      .json(new ApiResponse(200, categories, "Lấy danh sách danh mục thành công"));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Lấy thông tin danh mục thành công"));
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Tạo danh mục thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Cập nhật danh mục thành công"));
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { force, softDelete } = req.query;
    const result = await categoryService.deleteCategory(req.params.id, {
      force: force === "true" || force === true,
      softDelete: softDelete === "true" || softDelete === true,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, result, result.message || "Xóa danh mục thành công"));
  } catch (error) {
    next(error);
  }
};

export const getPCPartTypes = async (req, res, next) => {
  try {
    const types = categoryService.getPCPartTypes();
    return res
      .status(200)
      .json(new ApiResponse(200, types, "Lấy danh sách loại linh kiện thành công"));
  } catch (error) {
    next(error);
  }
};
