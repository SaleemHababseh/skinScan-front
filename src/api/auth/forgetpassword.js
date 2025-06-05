import { baseURL } from "../config.js";

export const sendForgetPasswordCode = async ({ email }) => {
    try {
        const response = await fetch(
            `${baseURL}auth/verification-code/forget-password?email=${encodeURIComponent(email)}`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to send forget password code");
        }

        return data;
    } catch (error) {
        console.error("Forget password error:", error.message);
        throw error;
    }
};
