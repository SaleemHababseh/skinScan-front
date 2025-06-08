import { baseURL } from "../config.js";

export const getUserInfoById = async (userId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/info/${userId}`, {
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
            throw new Error(data.detail || "Failed to get user info");
        }

        return data;
    } catch (error) {
        console.error("Error getting user info:", error);
        throw error;
    }
};

export const getAllUsersInfo = async (token) => {
    try {
        const response = await fetch(`${baseURL}admin/all-users-info`, {
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
            throw new Error(data.detail || "Failed to get all users info");
        }

        return data;
    } catch (error) {
        console.error("Error getting all users info:", error);
        throw error;
    }
};

export const getUserInfoByRole = async (role, token) => {
    try {
        const response = await fetch(`${baseURL}admin/role/${role}`, {
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
            throw new Error(data.detail || "Failed to get user info by role");
        }

        return data;
    } catch (error) {
        console.error("Error getting user info by role:", error);
        throw error;
    }
};
