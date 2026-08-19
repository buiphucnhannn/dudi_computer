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
