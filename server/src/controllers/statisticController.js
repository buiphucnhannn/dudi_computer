import { statisticService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await statisticService.getDashboardSummary();
    return res.status(200).json(
      new ApiResponse(200, summary, "Lấy tổng quan số liệu thống kê thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const getRevenueChart = async (req, res, next) => {
  try {
    const { period = "7d" } = req.query;
    const chartData = await statisticService.getRevenueChart(period);
    return res.status(200).json(
      new ApiResponse(200, chartData, "Lấy biểu đồ doanh thu thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const getSalesRatio = async (req, res, next) => {
  try {
    const salesRatio = await statisticService.getSalesRatio();
    return res.status(200).json(
      new ApiResponse(200, salesRatio, "Lấy tỷ lệ bán hàng theo danh mục thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const topProducts = await statisticService.getTopProducts(limit);
    return res.status(200).json(
      new ApiResponse(200, topProducts, "Lấy top sản phẩm bán chạy thành công")
    );
  } catch (error) {
    next(error);
  }
};
