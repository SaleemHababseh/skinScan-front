import { baseURL } from "../config.js";

export const updateUserPassword = async (old_password, new_password, token) => {
    try {
        const response = await fetch(`${baseURL}users/update/password/${encodeURIComponent(old_password)}/${encodeURIComponent(new_password)}`, {
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
            throw new Error(data.detail || "Password update failed");
        }

        return data;
    } catch (error) {
        console.error("Password update error:", error);
        throw error;
    }
};
