import { jobRepository } from "../repositories/jobRepository.js";
import { ApiError } from "../utils/apiError.js";

export const jobService = {
  getJobs: async (params = {}) => {
    const query = { isActive: true };
    if (params.department && params.department !== "all" && params.department !== "Tất cả") {
      query.department = params.department;
    }
    return await jobRepository.find(query, params);
  },

  getJobBySlug: async (slug) => {
    const job = await jobRepository.findBySlug(slug);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng yêu cầu");
    }
    return job;
  },

  createJob: async (data) => {
    return await jobRepository.create(data);
  },
};
