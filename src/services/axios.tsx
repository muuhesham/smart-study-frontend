import axios from "axios";
import toast from "react-hot-toast";
import { backendUrl } from "../constants/backendUrl";

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth");
      toast.error("Session expired. Please login again!");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
    return Promise.reject(error);
  },
);

export default api;
