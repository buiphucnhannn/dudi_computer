import { feedbackRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

export class FeedbackService {
  async createFeedback(data, ipAddress = "") {
    const { fullName, email, phone, content } = data;

    if (!fullName || !fullName.trim()) {
      throw new ApiError(400, "Vui lòng nhập họ và tên của bạn");
    }

    if (!email || !email.trim()) {
      throw new ApiError(400, "Vui lòng nhập địa chỉ email của bạn");
    }

    if (!content || !content.trim()) {
      throw new ApiError(400, "Vui lòng nhập nội dung góp ý & phản hồi");
    }

    const feedback = await feedbackRepository.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "",
      content: content.trim(),
      ipAddress: ipAddress || "",
    });

    return feedback;
  }

  async getAllFeedbacks({ page = 1, limit = 20, status } = {}) {
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [feedbacks, total] = await Promise.all([
      feedbackRepository.find(filter, { createdAt: -1 }, skip, Number(limit)),
      feedbackRepository.count(filter),
    ]);

    return {
      feedbacks,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }
}

export const feedbackService = new FeedbackService();
