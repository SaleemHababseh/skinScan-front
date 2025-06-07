import { baseURL } from "../config.js";

export const updateForgetPassword = async (new_password, email) => {
    try {
        const response = await fetch(`${baseURL}users/info/update-forget-password?new_password=${encodeURIComponent(new_password)}&email=${encodeURIComponent(email)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Forget password update failed");
        }

        return data;
    } catch (error) {
        console.error("Forget password update error:", error);
        throw error;
    }
};
