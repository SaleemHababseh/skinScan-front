import { baseURL } from "../config.js";

export const getDoctorBio = async (doctor_id) => {
    try {
        const response = await fetch(`${baseURL}users/info/doctor-bio?doctor_id=${doctor_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to get doctor bio");
        }

        return data;
    } catch (error) {
        console.error("Doctor bio error:", error);
        throw error;
    }
};
