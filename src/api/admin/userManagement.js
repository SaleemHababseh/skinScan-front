import { baseURL } from "../config.js";

// Toggle user suspension (suspend/reactivate)
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
            throw new Error(data.detail || "Failed to toggle user suspension");
        }

        return data;
    } catch (error) {
        console.error("Error toggling user suspension:", error);
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

// Get doctor CV by ID
export const getDoctorCV = async (doctorId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/doctor-info/get-doctor-cv/${doctorId}`, {
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
            throw new Error(data.detail || "Failed to get doctor CV");
        }

        return data;
    } catch (error) {
        console.error("Error getting doctor CV:", error);
        throw error;
    }
};
