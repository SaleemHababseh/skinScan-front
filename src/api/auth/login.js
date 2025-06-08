import { baseURL } from "../config.js";

const login = async ({
  username,
  password,
  client_id = "",
  client_secret = "",
  scope = "",
}) => {
  try {
    const body = new URLSearchParams({
      grant_type: "password",
      username,
      password,
      scope,
      client_id,
      client_secret,
    });

    const response = await fetch(`${baseURL}auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 401) {
        throw new Error("Invalid email or password. Please check your credentials and try again.");
      }
      
      if (response.status === 404) {
        throw new Error("Authentication service not available. Please try again later.");
      }
      
      if (response.status === 422) {
        throw new Error("Invalid login format. Please check your email and password.");
      }
      
      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      
      // Fallback error message
      throw new Error(data.detail || data.message || "Login failed. Please try again.");
    }

    // Validate response structure
    if (!data.access_token) {
      throw new Error("Invalid response from server. Please try again.");
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    }
    
    // Re-throw API errors as-is (they already have user-friendly messages)
    throw error;
  }
};

// login({
//   username: "husam.a.awadi@outlook.com",
//   password: "husam@2001",
//   client_id: "your_client_id",
//   client_secret: "your_client_secret",
//   scope: "your_scope",
// })
//   .then((data) => console.log("Login successful:", data))
//   .catch((error) => console.error("Login error:", error.message));

export { login };
