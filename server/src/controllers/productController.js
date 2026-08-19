import { productService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const { products, pagination } = await productService.getProducts(req.query);
    return res.status(200).json(
      new ApiResponse(
        200,
        { products, pagination },
        "Lấy danh sách sản phẩm thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const data = await productService.getProductBySlug(slug);

    return res.status(200).json(
      new ApiResponse(
        200,
        data,
        "Lấy chi tiết sản phẩm thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getFlashSaleProducts = async (req, res, next) => {
  try {
    const products = await productService.getFlashSaleProducts(req.query.limit);
    return res
      .status(200)
      .json(new ApiResponse(200, products, "Lấy danh sách Flash Sale thành công"));
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, product, "Thêm sản phẩm thành công"));
  } catch (error) {
    next(error);
  }
};
