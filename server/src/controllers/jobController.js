import { jobService } from "../services/jobService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const data = await jobService.getJobs(req.query);
    return res.status(200).json(
      new ApiResponse(200, data, "Lấy danh sách vị trí tuyển dụng thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const getJobBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const job = await jobService.getJobBySlug(slug);
    return res.status(200).json(
      new ApiResponse(200, job, "Lấy chi tiết vị trí tuyển dụng thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body);
    return res.status(201).json(
      new ApiResponse(201, job, "Tạo vị trí tuyển dụng mới thành công")
    );
  } catch (error) {
    next(error);
  }
};
