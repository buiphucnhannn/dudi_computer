import { newsCategoryService } from "../services/newsCategoryService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllNewsCategories = async (req, res, next) => {
  try {
    const onlyActive = req.query.active === "true";
    const categories = await newsCategoryService.getAllCategories(onlyActive);
    return res
      .status(200)
      .json(new ApiResponse(200, categories, "Lấy danh sách danh mục tin tức thành công"));
  } catch (error) {
    next(error);
  }
};

export const getAdminNewsCategories = async (req, res, next) => {
  try {
    const categories = await newsCategoryService.getAdminCategories();
    return res
      .status(200)
      .json(new ApiResponse(200, categories, "Lấy danh sách danh mục quản trị thành công"));
  } catch (error) {
    next(error);
  }
};

export const getNewsCategoryById = async (req, res, next) => {
  try {
    const category = await newsCategoryService.getCategoryById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Lấy chi tiết danh mục tin tức thành công"));
  } catch (error) {
    next(error);
  }
};

export const createNewsCategory = async (req, res, next) => {
  try {
    const category = await newsCategoryService.createCategory(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, category, "Tạo danh mục tin tức mới thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateNewsCategory = async (req, res, next) => {
  try {
    const category = await newsCategoryService.updateCategory(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, category, "Cập nhật danh mục tin tức thành công"));
  } catch (error) {
    next(error);
  }
};

export const deleteNewsCategory = async (req, res, next) => {
  try {
    await newsCategoryService.deleteCategory(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Xóa danh mục tin tức thành công"));
  } catch (error) {
    next(error);
  }
};
