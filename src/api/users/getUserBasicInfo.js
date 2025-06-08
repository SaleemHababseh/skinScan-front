import { baseURL } from "../config.js";

export const getUserBasicInfo = async (token) => {
    try {
        const response = await fetch(`${baseURL}users/get/user-info/get-user-basic-info`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 404) {
                throw new Error("User information service not available. Please try again later.");
            }
            
            if (response.status === 401) {
                throw new Error("Your session has expired. Please log in again.");
            }
            
            if (response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            }
            
            throw new Error(data.detail || data.message || "Failed to get user information");
        }

        return data;
    } catch (error) {
        // Handle network errors
        if (error.message.includes('fetch') || error.name === 'NetworkError') {
            throw new Error("Network error. Please check your connection and try again.");
        }
        
        console.error("User basic info error:", error.message);
        throw error;
    }
};
