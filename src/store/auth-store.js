import { create } from 'zustand';
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  getCurrentUser,
  sendVerificationCode,
  sendForgetPasswordCode,
  validateVerificationCode,
  refreshAccessToken,
  tokenStorage
} from '../api/auth';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  verificationStep: null, // For tracking verification process
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

  login: async (email, password, clientId = "", clientSecret = "") => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await loginUser(email, password, clientId, clientSecret);
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
      set({ user, role: user.role, isAuthenticated: true, isLoading: false, verificationStep: 'verification_sent' });
      return user;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  sendVerificationCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const result = await sendVerificationCode(email);
      set({ isLoading: false, verificationStep: 'code_sent' });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  sendForgetPasswordCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const result = await sendForgetPasswordCode(email);
      set({ isLoading: false, verificationStep: 'reset_code_sent' });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  validateVerificationCode: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const result = await validateVerificationCode(email, code);
      set({ isLoading: false, verificationStep: 'verified' });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  refreshToken: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await refreshAccessToken();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ 
        user: null, 
        role: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: error.message 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutUser();
      set({ 
        user: null, 
        role: null, 
        isAuthenticated: false, 
        isLoading: false, 
        verificationStep: null 
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  
  resetVerificationStep: () => set({ verificationStep: null }),

  // Check if user is authenticated and token is valid
  checkAuth: () => {
    const accessToken = tokenStorage.getAccessToken();
    const user = tokenStorage.getUser();
    
    if (accessToken && user) {
      set({ user, role: user.role, isAuthenticated: true, isLoading: false });
      return true;
    } else {
      set({ user: null, role: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },
}));

export default useAuthStore;