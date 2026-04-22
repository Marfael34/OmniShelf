import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const response = await api.post("/login_check", { username: email, password });
        set({ token: response.data.token, isAuthenticated: true });
      },
      
      register: async (email, password) => {
        await api.post("/register", { email, password });
      },
      
      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    { name: "auth-storage" }
  )
);

export default useAuthStore;