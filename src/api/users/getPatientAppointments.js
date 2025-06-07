import { baseURL } from "../config.js";

export const getPatientAppointments = async (token) => {
    try {
        const response = await fetch(`${baseURL}users/get-patient-appointments`, {
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
            throw new Error(data.detail || "Failed to get patient appointments");
        }

        return data;
    } catch (error) {
        console.error("Patient appointments error:", error);
        throw error;
    }
};
