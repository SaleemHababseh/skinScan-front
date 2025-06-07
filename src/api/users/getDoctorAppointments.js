import { baseURL } from "../config.js";

export const getDoctorAppointments = async (token) => {
    try {
        const response = await fetch(`${baseURL}users/doctor-appointments`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to get doctor appointments");
        }

        return data;
    } catch (error) {
        console.error("Doctor appointments error:", error);
        throw error;
    }
};
