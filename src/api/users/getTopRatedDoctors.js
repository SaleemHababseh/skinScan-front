import { baseURL } from "../config.js";

export const getTopRatedDoctors = async (token) => {
  try {
    console.log("Fetching top rated doctors with token:", token);
    const response = await fetch(`${baseURL}users/top-rated-doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true", // Skip ngrok browser warning
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Failed to get top rated doctors: ${response.status}`);
    }

    const data = await response.json();
    console.log("Top rated doctors data:", data);
    return data;
  } catch (error) {
    console.error("Top rated doctors error:", error);
    throw error;
  }
};

