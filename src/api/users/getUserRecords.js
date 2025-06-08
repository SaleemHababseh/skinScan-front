import { baseURL } from "../config.js";

export const getUserRecords = async (token) => {
    try {
        const response = await fetch(`${baseURL}users/user/record`, {
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
            throw new Error(data.detail || "Failed to get user records");
        }

        return data;
    } catch (error) {
        console.error("User records error:", error);
        throw error;
    }
};
