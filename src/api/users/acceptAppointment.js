import { baseURL } from "../config.js";

export const acceptAppointment = async (appointment_id, token) => {
    try {
        const response = await fetch(`${baseURL}users/accept/${appointment_id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to accept appointment");
        }

        return data;
    } catch (error) {
        console.error("Accept appointment error:", error);
        throw error;
    }
};
