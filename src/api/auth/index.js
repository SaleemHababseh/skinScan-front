import { baseURL } from "../config.js";

// Utility function to handle token storage
const tokenStorage = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Login function that works with the API
export const loginUser = async (username, password, client_id = "", client_secret = "") => {
  try {
    const body = new URLSearchParams({
      grant_type: "password",
      username,
      password,
      scope: "",
      client_id,
      client_secret
    });

    const response = await fetch(`${baseURL}auth/token`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: body.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data);
      throw new Error(data.detail || "Login failed");
    }

    // Store tokens
    if (data.access_token) {
      tokenStorage.setTokens(data.access_token, data.refresh_token);
      
      // Get user info from token or API call
      const user = await getCurrentUser();
      return { user, tokens: data };
    }

    return data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Register function
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${baseURL}users/create-account/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: userData.email,
        f_name: userData.firstName,
        l_name: userData.lastName,
        hashed_password: userData.password,
        role: userData.role || "patient",
        age: userData.age,
        sex: userData.sex
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Registration failed:", data);
      throw new Error(data.detail || "Registration failed");
    }

    return { user: data };
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
};

// Send verification code
export const sendVerificationCode = async (email) => {
  try {
    const response = await fetch(
      `${baseURL}auth/send-verification-code?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Send verification code error:", error);
    throw error;
  }
};

// Send forget password code
export const sendForgetPasswordCode = async (email) => {
  try {
    const response = await fetch(
      `${baseURL}auth/verification-code/forget-password?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to send forget password code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Send forget password code error:", error);
    throw error;
  }
};

// Validate verification code
export const validateVerificationCode = async (email, verificationCode) => {
  try {
    const response = await fetch(
      `${baseURL}auth/validate-verification-code?email=${encodeURIComponent(email)}&verification_code=${encodeURIComponent(verificationCode)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Validate verification code error:", error);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      `${baseURL}auth/refresh/token/?refresh_token=${encodeURIComponent(refreshToken)}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${tokenStorage.getAccessToken()}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to refresh token");
    }

    const data = await response.json();
    
    // Update stored tokens
    if (data.access_token) {
      tokenStorage.setTokens(data.access_token, data.refresh_token || refreshToken);
    }
    
    return data;
  } catch (error) {
    console.error("Refresh token error:", error);
    // If refresh fails, clear all tokens
    tokenStorage.clearTokens();
    throw error;
  }
};

// Get current user (mock implementation - you may need to adjust based on your API)
export const getCurrentUser = async () => {
  try {
    const storedUser = tokenStorage.getUser();
    const accessToken = tokenStorage.getAccessToken();
    
    if (!accessToken) {
      return null;
    }
    
    if (storedUser) {
      return storedUser;
    }
    
    // If no stored user but have token, you might need to decode JWT or call user info endpoint
    // For now, return a basic user structure - you'll need to implement based on your API
    const mockUser = {
      email: "user@example.com",
      role: "patient",
      id: 1
    };
    
    tokenStorage.setUser(mockUser);
    return mockUser;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    // Clear all stored data
    tokenStorage.clearTokens();
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// API request interceptor for adding auth headers
export const apiRequest = async (url, options = {}) => {
  const accessToken = tokenStorage.getAccessToken();
  
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...options.headers
  };
  
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle token refresh if access token expired
    if (response.status === 401) {
      try {
        await refreshAccessToken();
        // Retry request with new token
        const newAccessToken = tokenStorage.getAccessToken();
        if (newAccessToken) {
          headers.Authorization = `Bearer ${newAccessToken}`;
          return await fetch(url, {
            ...options,
            headers
          });
        }
      } catch {
        // Refresh failed, redirect to login
        tokenStorage.clearTokens();
        throw new Error("Session expired. Please login again.");
      }
    }
    
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

export { tokenStorage };
