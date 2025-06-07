import { baseURL } from "../config.js";

export const getUserProfilePicture = async (user_id) => {
    try {
        const response = await fetch(`${baseURL}users/get/user-profile-picture?user_id=${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to get user profile picture");
        }

        return data;
    } catch (error) {
        console.error("User profile picture error:", error);
        throw error;
    }
};
