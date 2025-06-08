import { baseURL } from "../config.js";

export const refreshAccessToken = async (refresh_token, access_token) => {
  try {
    const url = `${baseURL}auth/refresh/token/?refresh_token=${encodeURIComponent(refresh_token)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      body: "", 
    });

    const data = await response.json();
    console.log("🔄 Refreshing access token:", data);
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 404) {
        throw new Error("Authentication service not available. Please try again later.");
      }
      
      if (data.detail && data.detail.includes('jose.exceptions.JWTError')) {
        throw new Error("Your session has expired. Please log in again.");
      }
      
      if (data.detail && data.detail.includes('JWT')) {
        throw new Error("Invalid session token. Please log in again.");
      }
      
      throw new Error(data.detail || data.message || "Failed to refresh session");
    }

    // Validate response structure
    if (!data.access_token) {
      throw new Error("Invalid response from authentication server");
    }

    return data;
  } catch (error) {
    // Re-throw with more specific error messages
    if (error.message.includes('fetch')) {
      throw new Error("Network error. Please check your connection and try again.");
    }
    
    throw error;
  }
};
