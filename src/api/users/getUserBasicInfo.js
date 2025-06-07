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
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to get user basic info");
        }

        return data;
    } catch (error) {
        console.error("User basic info error:", error);
        throw error;
    }
};
