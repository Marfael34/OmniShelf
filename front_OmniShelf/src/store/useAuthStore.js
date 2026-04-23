import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // null when not logged in, object when logged in
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
