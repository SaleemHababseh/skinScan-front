import { baseURL } from "../config.js";

export const validateVerificationCode = async ({ email, verification_code }) => {
    try {
        const response = await fetch(
            `${baseURL}auth/validate-verification-code?email=${encodeURIComponent(email)}&verification_code=${encodeURIComponent(verification_code)}`,
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
            throw new Error(data.detail || "Verification failed");
        }
        
        return data;
    } catch (error) {
        console.log("Verification error:", error);
        throw error;
    }
};