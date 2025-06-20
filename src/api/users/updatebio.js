import { baseURL } from "../config.js";

export const updateBio = async (bio, token) => {
    try {
        const response = await fetch(`${baseURL}users/update-bio/${encodeURIComponent(bio)}`, {
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
            throw new Error(data.detail || "Bio update failed");
        }

        return data;
    } catch (error) {
        console.error("Bio update error:", error);
        throw error;
    }
};
