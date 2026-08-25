import axios from "axios";

const getBaseUrl = () => {
  // Trình duyệt (Client-side): Dùng relative path "/api/v1" để Next.js proxy nội bộ, hoạt động 100% trên cả localhost, IP mạng LAN và thiết bị điện thoại
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  }
  // Server-side (SSR / Server Component): Gọi trực tiếp backend qua localhost:5000
  return process.env.INTERNAL_API_URL || "http://localhost:5000/api/v1";
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
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
          localStorage.removeItem("dudi_user");
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
  create: (data) =>
    apiClient.post("/products", data, {
      headers:
        typeof FormData !== "undefined" && data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),
  update: (id, data) =>
    apiClient.put(`/products/${id}`, data, {
      headers:
        typeof FormData !== "undefined" && data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),
  delete: (id) => apiClient.delete(`/products/${id}`),
  updateStock: (id, stock) => apiClient.patch(`/products/${id}/stock`, { stock }),
};

export const orderAPI = {
  getAll: (params) => apiClient.get("/orders", { params }),
  getMyOrders: (params) => apiClient.get("/orders/my-orders", { params }),
  getByCode: (codeOrId) => apiClient.get(`/orders/track/${codeOrId}`),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (data) => apiClient.post("/orders", data),
  updateStatus: (id, status, note = "") =>
    apiClient.patch(`/orders/${id}/status`, { status, note }),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};

export const categoryAPI = {
  getAll: () => apiClient.get("/categories"),
};

export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  verifyRegistrationOtp: (data) => apiClient.post("/auth/verify-registration-otp", data),
  resendVerificationOtp: (data) => apiClient.post("/auth/resend-verification-otp", data),
  login: (data) => apiClient.post("/auth/login", data),
  googleLogin: (data) => apiClient.post("/auth/google", data),
  forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
  resetPassword: (data) => apiClient.post("/auth/reset-password", data),
  refreshToken: () => apiClient.post("/auth/refresh-token"),
  logout: () => apiClient.post("/auth/logout"),
  getProfile: () => apiClient.get("/auth/profile"),
  updateProfile: (data) => apiClient.put("/auth/profile", data),
};

export const feedbackAPI = {
  create: (data) => apiClient.post("/contacts", { ...data, type: "feedback" }),
  getAll: (params) => apiClient.get("/contacts", { params: { ...params, type: "feedback" } }),
};

export const cartAPI = {
  get: () => apiClient.get("/cart"),
  sync: (items) => apiClient.post("/cart/sync", { items }),
  addItem: (productId, quantity = 1) =>
    apiClient.post("/cart/items", { productId, quantity }),
  updateQuantity: (productId, quantity) =>
    apiClient.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`),
  clear: () => apiClient.delete("/cart/clear"),
};

export const wishlistAPI = cartAPI;

export const newsAPI = {
  getAll: (params) => apiClient.get("/news", { params }),
  getBySlug: (slug) => apiClient.get(`/news/${slug}`),
  getFeatured: (limit = 4) => apiClient.get("/news/featured", { params: { limit } }),
};

export const contactAPI = {
  create: (data) => apiClient.post("/contacts", data),
  getAll: (params) => apiClient.get("/contacts", { params }),
  getStats: () => apiClient.get("/contacts/stats"),
  updateStatus: (id, data) => apiClient.patch(`/contacts/${id}/status`, data),
  delete: (id) => apiClient.delete(`/contacts/${id}`),
};

export const jobAPI = {
  getAll: (params) => apiClient.get("/jobs", { params }),
  getAdminAll: (params) => apiClient.get("/jobs/admin/all", { params }),
  getById: (id) => apiClient.get(`/jobs/detail/${id}`),
  getBySlug: (slug) => apiClient.get(`/jobs/${slug}`),
  create: (data) => apiClient.post("/jobs", data),
  update: (id, data) => apiClient.put(`/jobs/${id}`, data),
  delete: (id) => apiClient.delete(`/jobs/${id}`),
  toggleStatus: (id) => apiClient.patch(`/jobs/${id}/toggle`),
};

export const statisticAPI = {
  getSummary: () => apiClient.get("/statistics/summary"),
  getRevenueChart: (period) => apiClient.get("/statistics/revenue-chart", { params: { period } }),
  getSalesRatio: () => apiClient.get("/statistics/sales-ratio"),
  getTopProducts: (params) => apiClient.get("/statistics/top-products", { params }),
};

export const notificationAPI = {
  getAll: (params) => apiClient.get("/notifications", { params }),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
};

export const promotionAPI = {
  getFlashSale: () => apiClient.get("/promotions/flash-sale"),
  getActive: (params) => apiClient.get("/promotions", { params }),
  getAll: (params) => apiClient.get("/promotions/admin/all", { params }),
  getById: (id) => apiClient.get(`/promotions/${id}`),
  create: (data) => apiClient.post("/promotions", data),
  update: (id, data) => apiClient.put(`/promotions/${id}`, data),
  toggle: (id) => apiClient.patch(`/promotions/${id}/toggle`),
  delete: (id) => apiClient.delete(`/promotions/${id}`),
};

export const bannerAPI = {
  getAll: (params) => apiClient.get("/banners", { params }),
  getByPosition: (position, params) =>
    apiClient.get(`/banners/position/${position}`, { params }),
  getById: (id) => apiClient.get(`/banners/${id}`),
  create: (data) => apiClient.post("/banners", data),
  update: (id, data) => apiClient.put(`/banners/${id}`, data),
  toggleStatus: (id) => apiClient.patch(`/banners/${id}/status`),
  delete: (id) => apiClient.delete(`/banners/${id}`),
};

export const uploadAPI = {
  single: (file, folder = "banners") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);
    return apiClient.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

