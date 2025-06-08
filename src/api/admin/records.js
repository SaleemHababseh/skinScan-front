import { baseURL } from "../config.js";

export const getAllRecords = async (token) => {
    try {
        const response = await fetch(`${baseURL}admin/get-all-records`, {
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
            throw new Error(data.detail || "Failed to get all records");
        }

        return data;
    } catch (error) {
        console.error("Error getting all records:", error);
        throw error;
    }
};

export const getRecordsByUserId = async (userId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/user/record/${userId}`, {
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
            throw new Error(data.detail || "Failed to get records by user ID");
        }

        return data;
    } catch (error) {
        console.error("Error getting records by user ID:", error);
        throw error;
    }
};

export const getRecordByImageId = async (imgId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/image/${imgId}`, {
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
            throw new Error(data.detail || "Failed to get record by image ID");
        }

        return data;
    } catch (error) {
        console.error("Error getting record by image ID:", error);
        throw error;
    }
};

export const removeRecordByImageId = async (imgId, token) => {
    try {
        const response = await fetch(`${baseURL}admin/remove/${imgId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to remove record");
        }

        return data;
    } catch (error) {
        console.error("Error removing record:", error);
        throw error;
    }
};
