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

  getAdminJobs: async (params = {}) => {
    const query = {};
    if (params.department && params.department !== "all" && params.department !== "Tất cả") {
      query.department = params.department;
    }
    if (params.isActive !== undefined && params.isActive !== "all") {
      query.isActive = params.isActive === "true" || params.isActive === true;
    }
    if (params.search && params.search.trim()) {
      query.title = { $regex: params.search.trim(), $options: "i" };
    }
    return await jobRepository.find(query, params);
  },

  getJobById: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng yêu cầu");
    }
    return job;
  },

  getJobBySlug: async (slug) => {
    const job = await jobRepository.findBySlug(slug);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng yêu cầu");
    }
    return job;
  },

  createJob: async (data) => {
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    return await jobRepository.create(data);
  },

  updateJob: async (id, data) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng cần cập nhật");
    }
    return await jobRepository.update(id, data);
  },

  deleteJob: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng cần xóa");
    }
    return await jobRepository.delete(id);
  },

  toggleJobStatus: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng");
    }
    job.isActive = !job.isActive;
    await job.save();
    return job;
  },
};
