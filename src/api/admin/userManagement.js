import { baseURL } from "../config.js";

export const suspendUser = async (userId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/user/suspend/${userId}`, {
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
            throw new Error(data.detail || "Failed to suspend user");
        }

        return data;
    } catch (error) {
        console.error("Error suspending user:", error);
        throw error;
    }
};

export const acceptDoctor = async (doctorId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/doctor/accept/${doctorId}`, {
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
            throw new Error(data.detail || "Failed to accept doctor");
        }

        return data;
    } catch (error) {
        console.error("Error accepting doctor:", error);
        throw error;
    }
};

export const getNotAcceptedDoctors = async (acception = false, token) => {
    try {
        const response = await fetch(`${baseURL}admin/not-accepted-doctor?acception=${acception}`, {
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
            throw new Error(data.detail || "Failed to get doctors by acception");
        }

        return data;
    } catch (error) {
        console.error("Error getting doctors by acception:", error);
        throw error;
    }
};
