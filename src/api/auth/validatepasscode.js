import { baseURL } from "../config.js";

export const validatePassCode = async ({ email, validate_code, new_password }) => {
    try {
        const response = await fetch(`${baseURL}users/info/update-forget-password?new_password=${new_password}&email=${email}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",

            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(    data.detail || "Validation failed");
        }

        return data;
    } catch (error) {
        console.error("Password reset validation failed:", error.message);
        throw error;
    }
};

// validatePassCode({
//     email: "saleemtestuser2@gmail.com", // User's email for the password reset
//     validate_code: "141915", // The validation code received by the user
//     new_password: "newStrongPassword123" // The new password the user wants to set
// }).then(data => {
//     console.log("Password reset successful:");
//     console.log(data);
// }).catch(error => {
//     console.error(" Password reset failed:");
//     console.error(error.message);
// });

