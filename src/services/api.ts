import axios, { AxiosRequestConfig } from "axios";
import toast from "@/lib/toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

const withAuth = (config: AxiosRequestConfig = {}) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(config.headers || {}),
    },
  };
};

const handleTokenError = (message: string) => {
  if (typeof window !== "undefined") {
    toast.error(message, { duration: 3000 });
    
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 3000);
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error === "Token inválido" || 
        error.response?.data?.message === "O token fornecido é inválido ou expirou") {
      handleTokenError(error.response.data.message || "Sessão expirada. Redirecionando para login...");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

const API = {
  get: async (endpoint: string, config = {}) => {
    return axios.get(`${API_URL}${endpoint}`, withAuth(config));
  },
  post: async (endpoint: string, data: unknown, config = {}) => {
    return axios.post(`${API_URL}${endpoint}`, data, withAuth(config));
  },
  put: async (endpoint: string, data: unknown, config = {}) => {
    return axios.put(`${API_URL}${endpoint}`, data, withAuth(config));
  },
  patch: async (endpoint: string, data: unknown, config = {}) => {
    return axios.patch(`${API_URL}${endpoint}`, data, withAuth(config));
  },
  delete: async (endpoint: string, config = {}) => {
    return axios.delete(`${API_URL}${endpoint}`, withAuth(config));
  },
};

export default API;