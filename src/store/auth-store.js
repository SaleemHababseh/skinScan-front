import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi } from "../api/auth/login";
import { sendVerificationCode } from "../api/auth/sendVerificationCode";
import { sendForgetPasswordCode } from "../api/auth/forgetpassword";
import { refreshAccessToken } from "../api/auth/refreshToken";
import { validateVerificationCode } from "../api/auth/validatecode";
import { validatePassCode } from "../api/auth/validatepasscode";
import { updateBasicInformation } from "../api/users/updateBasicInformation";
import { updateUserPassword } from "../api/users/updateUserPassword";
import { updateBio } from "../api/users/updatebio";
import { uploadProfilePicture } from "../api/users/uploadProfilePicture";
import { getUserBasicInfo } from "../api/users/getUserBasicInfo";
import { getUserProfilePicture } from "../api/users/getUserProfilePicture";

// Helper function to safely decode JWT token
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
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
      verificationStep: null,
      login: async (
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
            throw new Error("Invalid access token received from server");
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
            error: null,
          });

          return data;
        } catch (error) {
          // Provide user-friendly error messages
          let errorMessage = error.message;

          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            errorMessage = "Invalid email or password. Please try again.";
          } else if (error.message.includes("404")) {
            errorMessage =
              "Authentication service is currently unavailable. Please try again later.";
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (!error.message || error.message === "Failed to fetch") {
            errorMessage =
              "Unable to connect to the server. Please try again later.";
          }

          set({ isLoading: false, error: errorMessage });
          throw new Error(errorMessage);
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
      },
      validatePassCode: async (email, validate_code, new_password) => {
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
      },
      refreshToken: async () => {
        const { refreshTokenValue, token } = get();

        if (!refreshTokenValue) {
          const error = new Error(
            "No refresh token available - please log in again"
          );
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
              error: null,
            });
            return result;
          } else {
            throw new Error("Invalid access token received from server");
          }
        } catch (error) {
          // Clear auth state on refresh failure
          const errorMessage = error.message.includes(
            "jose.exceptions.JWTError"
          )
            ? "Your session has expired. Please log in again."
            : error.message.includes("404")
            ? "Authentication service temporarily unavailable. Please try again later."
            : error.message || "Session refresh failed. Please log in again.";

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
            error: errorMessage,
          });

          // Create a more user-friendly error
          const userError = new Error(errorMessage);
          userError.shouldRedirectToLogin = true;
          throw userError;
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
      },
      clearError: () => set({ error: null }),

      resetVerificationStep: () => set({ verificationStep: null }), // Helper function to manually set authentication state (useful for testing)
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

      // User profile management functions
      updateProfile: async (f_name, l_name) => {
        const { token } = get();
        if (!token) throw new Error("No authentication token");

        set({ isLoading: true, error: null });
        try {
          const result = await updateBasicInformation(f_name, l_name, token);

          // Update user name in store
          set((state) => ({
            user: {
              ...state.user,
              name: `${f_name} ${l_name}`,
            },
            isLoading: false,
          }));

          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      updatePassword: async (old_password, new_password) => {
        const { token } = get();
        if (!token) throw new Error("No authentication token");

        set({ isLoading: true, error: null });
        try {
          const result = await updateUserPassword(
            old_password,
            new_password,
            token
          );
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      updateUserBio: async (bio) => {
        const { token } = get();
        if (!token) throw new Error("No authentication token");

        set({ isLoading: true, error: null });
        try {
          const result = await updateBio(bio, token);
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      uploadUserProfilePicture: async (file) => {
        const { token } = get();
        if (!token) throw new Error("No authentication token");

        set({ isLoading: true, error: null });
        try {
          const result = await uploadProfilePicture(file, token);
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },
      fetchUserBasicInfo: async () => {
        const { token } = get();
        if (!token) throw new Error("No authentication token");

        set({ isLoading: true, error: null });
        try {
          const result = await getUserBasicInfo(token);

          // Update user data in store
          set((state) => ({
            user: {
              ...state.user,
              ...result, // Merge the fetched user data
            },
            isLoading: false,
          }));

          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      fetchUserProfilePicture: async (user_id) => {
        set({ isLoading: true, error: null });
        try {
          const result = await getUserProfilePicture(user_id);
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
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
