import { create } from 'zustand';
import { loginUser, logoutUser, registerUser, getCurrentUser } from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ user, role: user.role, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, role: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ 
        user: null, 
        role: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: error.message 
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await loginUser(email, password);
      set({ user, role: user.role, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await registerUser(userData);
      set({ user, role: user.role, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
      set({ user: null, role: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;