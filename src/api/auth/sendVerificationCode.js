import { baseURL } from "../config.js";

export const sendVerificationCode = async ({ email }) => {
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
      
      // Handle specific status codes
      if (response.status === 404) {
        throw new Error("Verification service not available. Please try again later.");
      }
      
      if (response.status === 422) {
        throw new Error("Invalid email format. Please check your email address.");
      }
      
      if (response.status === 429) {
        throw new Error("Too many verification attempts. Please wait before trying again.");
      }
      
      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      
      throw new Error(errorData.detail || errorData.message || "Failed to send verification code");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    
    console.error("Send verification code error:", error.message);
    throw error;
  }
};
