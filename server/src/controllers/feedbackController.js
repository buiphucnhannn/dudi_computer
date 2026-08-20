import { feedbackService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body, req.ip);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          feedback,
          "Gửi góp ý & phản hồi thành công! Cảm ơn quý khách đã đóng góp ý kiến."
        )
      );
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (req, res, next) => {
  try {
    const result = await feedbackService.getAllFeedbacks(req.query);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "Lấy danh sách phản hồi thành công"
        )
      );
  } catch (error) {
    next(error);
  }
};
