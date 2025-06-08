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
            // Handle specific status codes
            if (response.status === 400 || response.status === 422) {
                throw new Error("Invalid or expired verification code. Please check the code and try again.");
            }
            
            if (response.status === 404) {
                throw new Error("Verification service not available. Please try again later.");
            }
            
            if (response.status === 429) {
                throw new Error("Too many verification attempts. Please wait before trying again.");
            }
            
            if (response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            }
            
            throw new Error(data.detail || data.message || "Verification code validation failed");
        }
        
        return data;
    } catch (error) {
        // Handle network errors
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }
        
        console.error("Verification error:", error.message);
        throw error;
    }
};