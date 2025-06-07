import { baseURL } from "../config.js";

export const cancelAppointment = async (appointment_id, token) => {
  try {
    const response = await fetch(
      `${baseURL}users/cancel-appointments?appointment_id=${appointment_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to cancel appointment");
    }

    return data;
  } catch (error) {
    console.error("Cancel appointment error:", error);
    throw error;
  }
};

