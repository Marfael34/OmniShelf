import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false, // Passer à true pour visualiser l'état connecté en dev
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));