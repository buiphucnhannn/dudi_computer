import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Cho phép trình duyệt tự động gửi và nhận HttpOnly Cookie
  withCredentials: true,
});

// Response Interceptor: Tự động refresh Access Token khi nhận lỗi 401 Unauthorized
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và không phải đang gọi chính API refresh/login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API cấp mới Access Token từ HttpOnly Refresh Token
        await apiClient.post("/auth/refresh-token");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Xóa thông tin profile client nếu refresh token hết hạn
        if (typeof window !== "undefined") {
          localStorage.removeItem("zcomputer_user");
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const productAPI = {
  getAll: (params) => apiClient.get("/products", { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
};

export const categoryAPI = {
  getAll: () => apiClient.get("/categories"),
};

export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get("/auth/profile"),
};

export const orderAPI = {
  create: (data) => apiClient.post("/orders", data),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
};

export const feedbackAPI = {
  create: (data) => apiClient.post("/feedbacks", data),
  getAll: (params) => apiClient.get("/feedbacks", { params }),
};
