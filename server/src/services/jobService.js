import { jobRepository } from "../repositories/jobRepository.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";

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
    if (!job || !job.isActive) {
      throw new ApiError(404, "Vị trí tuyển dụng không tồn tại hoặc đã tạm dừng nhận hồ sơ");
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
    const updated = await jobRepository.update(id, data);

    if (data.isActive !== undefined) {
      sessionManager.broadcastResourceUpdate({
        action: data.isActive ? "publish" : "hide",
        resourceType: "career",
        id: updated._id,
        slug: updated.slug,
        name: updated.title,
        message: data.isActive ? `Tin tuyển dụng "${updated.title}" đã được mở.` : `Tin tuyển dụng "${updated.title}" đã tạm đóng.`,
      });
    }

    return updated;
  },

  deleteJob: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng cần xóa");
    }
    const deleted = await jobRepository.delete(id);

    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "career",
      id: job._id,
      slug: job.slug,
      name: job.title,
      message: `Tin tuyển dụng "${job.title}" đã kết thúc và được xóa khỏi hệ thống.`,
    });

    return deleted;
  },

  toggleJobStatus: async (id) => {
    const job = await jobRepository.findById(id);
    if (!job) {
      throw new ApiError(404, "Không tìm thấy vị trí tuyển dụng");
    }
    job.isActive = !job.isActive;
    await job.save();

    sessionManager.broadcastResourceUpdate({
      action: job.isActive ? "publish" : "hide",
      resourceType: "career",
      id: job._id,
      slug: job.slug,
      name: job.title,
      message: job.isActive ? `Tin tuyển dụng "${job.title}" đã được mở.` : `Tin tuyển dụng "${job.title}" đã tạm đóng.`,
    });

    return job;
  },
};
