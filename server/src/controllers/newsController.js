import { newsService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllNews = async (req, res, next) => {
  try {
    const { items, pagination } = await newsService.getNews(req.query);
    return res.status(200).json(
      new ApiResponse(
        200,
        { news: items, pagination },
        "Lấy danh sách tin tức thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const data = await newsService.getNewsBySlug(slug);

    return res.status(200).json(
      new ApiResponse(
        200,
        data,
        "Lấy chi tiết bài viết thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getFeaturedNews = async (req, res, next) => {
  try {
    const limit = req.query.limit || 4;
    const articles = await newsService.getFeaturedNews(limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        articles,
        "Lấy danh sách tin tức nổi bật thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getAdminNews = async (req, res, next) => {
  try {
    const { items, pagination } = await newsService.getAdminNews(req.query);
    return res.status(200).json(
      new ApiResponse(
        200,
        { news: items, pagination },
        "Lấy danh sách tin tức quản trị thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getNewsById = async (req, res, next) => {
  try {
    const article = await newsService.getNewsById(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, article, "Lấy thông tin bài viết thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const article = await newsService.createNews(req.body);
    return res.status(201).json(
      new ApiResponse(
        201,
        article,
        "Tạo bài viết tin tức thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const article = await newsService.updateNews(req.params.id, req.body);
    return res.status(200).json(
      new ApiResponse(200, article, "Cập nhật bài viết thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    await newsService.deleteNews(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, null, "Xóa bài viết thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const togglePublish = async (req, res, next) => {
  try {
    const article = await newsService.togglePublish(req.params.id);
    return res.status(200).json(
      new ApiResponse(200, article, "Cập nhật trạng thái xuất bản thành công")
    );
  } catch (error) {
    next(error);
  }
};
