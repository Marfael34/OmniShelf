import api from "../api";

export const login = async (email, password) => {
  const response = await api.post("/login_check", { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await api.post("/register", { email, password });
  return response.data;
};
