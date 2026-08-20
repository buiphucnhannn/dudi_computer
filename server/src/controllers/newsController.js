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
