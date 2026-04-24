import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      login: (userData, token, refreshToken) => set({ 
        isAuthenticated: true, 
        user: userData, 
        token: token,
        refreshToken: refreshToken
      }),
      setToken: (token) => set({ token }),
      logout: () => set({ 
        isAuthenticated: false, 
        user: null, 
        token: null,
        refreshToken: null
      }),
    }),
    {
      name: 'omnishelf-auth',
    }
  )
);