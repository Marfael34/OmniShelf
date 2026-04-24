import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:8013/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour injecter automatiquement le token JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log("API Request:", config.url, "Token present:", !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;