import { baseURL } from "../config.js";

export const rateDoctor = async (doctor_id, rate, token) => {
    try {
        const response = await fetch(`${baseURL}users/rate/doctor-rating/${doctor_id}/${rate}`, {
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
            throw new Error(data.detail || "Failed to rate doctor");
        }

        return data;
    } catch (error) {
        console.error("Rate doctor error:", error);
        throw error;
    }
};
