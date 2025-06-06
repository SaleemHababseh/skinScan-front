import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi } from "../api/auth/login";
import { sendVerificationCode } from "../api/auth/sendVerificationCode";
import { sendForgetPasswordCode } from "../api/auth/forgetpassword";
import { refreshAccessToken } from "../api/auth/refreshToken";
import { validateVerificationCode } from "../api/auth/validatecode";
import {validatePassCode} from "../api/auth/validatepasscode";

// Helper function to safely decode JWT token
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        id: null,
        email: null,
        role: null,
        name: null,
        profilePicture: null,
      },
      token: null,
      refreshTokenValue: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      verificationStep: null,      login: async (
        username,
        password,
        client_id = "",
        client_secret = "",
        scope = ""
      ) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginApi({
            username,
            password,
            client_id,
            client_secret,
            scope,
          });

          // Decode the access token to get user information
          const tokenPayload = decodeJWT(data.access_token);
          
          if (!tokenPayload) {
            throw new Error("Invalid access token received");
          }

          // Update store with user data and tokens (persist will handle storage automatically)
          set({
            user: {
              id: tokenPayload.id || null,
              email: username,
              role: tokenPayload.role || null,
              name: tokenPayload.sub || null,
              profilePicture: null,
            },
            token: data.access_token,
            refreshTokenValue: data.refresh_token,
            role: tokenPayload.role || null,
            isAuthenticated: true,
            isLoading: false,
          });

          return data;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      sendVerificationCode: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await sendVerificationCode({ email });
          set({ isLoading: false, verificationStep: "code_sent" });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      sendForgetPasswordCode: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const result = await sendForgetPasswordCode({ email });
          set({ isLoading: false, verificationStep: "reset_code_sent" });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      validateVerificationCode: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const result = await validateVerificationCode({
            email,
            verification_code: code,
          });
          set({ isLoading: false, verificationStep: "verified" });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },      validatePassCode: async (email, validate_code, new_password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await validatePassCode({
            email,
            validate_code,
            new_password,
          });
          
          // If the response includes authentication tokens, update the auth state
          if (result.access_token && result.refresh_token) {
            // Decode the token to get user information
            const tokenPayload = decodeJWT(result.access_token);
            
            if (tokenPayload) {
              set({
                user: {
                  id: tokenPayload.id || null,
                  email: email,
                  role: tokenPayload.role || null,
                  name: tokenPayload.sub || null,
                  profilePicture: null,
                },
                token: result.access_token,
                refreshTokenValue: result.refresh_token,
                role: tokenPayload.role || null,
                isAuthenticated: true,
                isLoading: false,
                verificationStep: "password_reset_complete",
              });
            } else {
              set({ isLoading: false, verificationStep: "password_reset" });
            }
          } else {
            set({ isLoading: false, verificationStep: "password_reset" });
          }
          
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },      refreshToken: async () => {
        const { refreshTokenValue, token } = get();
        if (!refreshTokenValue || !token) {
          throw new Error("No refresh token available");
        }

        set({ isLoading: true, error: null });
        try {
          const result = await refreshAccessToken(refreshTokenValue, token);

          // Decode the new access token to get user information
          const tokenPayload = decodeJWT(result.access_token);
          
          if (tokenPayload) {
            // Update tokens and user info in store (persist will handle storage automatically)
            set({
              user: {
                id: tokenPayload.id || null,
                email: get().user.email, // Keep existing email
                role: tokenPayload.role || null,
                name: tokenPayload.sub || null,
                profilePicture: get().user.profilePicture, // Keep existing profile picture
              },
              token: result.access_token,
              refreshTokenValue: result.refresh_token || refreshTokenValue,
              role: tokenPayload.role || null,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid access token received");
          }

          return result;
        } catch (error) {
          // Clear auth state on refresh failure
          set({
            user: {
              id: null,
              email: null,
              role: null,
              name: null,
              profilePicture: null,
            },
            token: null,
            refreshTokenValue: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // Clear all auth state (persist will handle storage automatically)
          set({
            user: {
              id: null,
              email: null,
              role: null,
              name: null,
              profilePicture: null,
            },
            token: null,
            refreshTokenValue: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            verificationStep: null,
          });
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },      clearError: () => set({ error: null }),

      resetVerificationStep: () => set({ verificationStep: null }),

      // Helper function to manually set authentication state (useful for testing)
      setAuthState: (authData) => {
        const tokenPayload = decodeJWT(authData.access_token);
        
        if (tokenPayload) {
          set({
            user: {
              id: tokenPayload.id || null,
              email: authData.email || null,
              role: tokenPayload.role || null,
              name: tokenPayload.sub || null,
              profilePicture: null,
            },
            token: authData.access_token,
            refreshTokenValue: authData.refresh_token,
            role: tokenPayload.role || null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage-skin-scan", // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshTokenValue: state.refreshTokenValue,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
