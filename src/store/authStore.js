import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: ({ accessToken, user }) => {
    set({
      accessToken,
      user,
      isAuthenticated: !!accessToken && !!user,
      isInitialized: true,
    });
  },

  setAccessToken: (accessToken) => {
    set((state) => ({
      accessToken,
      isAuthenticated: !!accessToken && !!state.user,
    }));
  },

  setUser: (user) => {
    set((state) => ({
      user,
      isAuthenticated: !!state.accessToken && !!user,
    }));
  },

  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },

  setInitialized: (isInitialized = true) => {
    set({ isInitialized });
  },
}));
