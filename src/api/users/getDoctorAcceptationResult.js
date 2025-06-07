import { baseURL } from "../config.js";

export const getDoctorAcceptationResult = async (token) => {
    try {
        const response = await fetch(`${baseURL}users/doctor-acceptation-result`, {
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
            throw new Error(data.detail || "Failed to get doctor acceptation result");
        }

        return data;
    } catch (error) {
        console.error("Doctor acceptation result error:", error);
        throw error;
    }
};
