import { baseURL } from "../config.js";

export const createAppointment = async (doctor_id, token) => {
    try {
        const response = await fetch(`${baseURL}users/create-Appointments?doctor_id=${doctor_id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to create appointment");
        }

        return data;
    } catch (error) {
        console.error("Create appointment error:", error);
        throw error;
    }
};
