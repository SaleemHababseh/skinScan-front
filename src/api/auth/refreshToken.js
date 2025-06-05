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

    if (!response.ok) {
      console.error("Refresh token failed:", data);
      throw new Error(data.detail || "Failed to refresh token");
    }

    return data;
  } catch (error) {
    console.error("Refresh error:", error.message);
    throw error;
  }
};
