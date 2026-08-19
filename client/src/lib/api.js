import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Tự động đính kèm Token nếu có lưu trong localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("zcomputer_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

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
  getProfile: () => apiClient.get("/auth/profile"),
};

export const orderAPI = {
  create: (data) => apiClient.post("/orders", data),
  getMyOrders: () => apiClient.get("/orders/my-orders"),
};
