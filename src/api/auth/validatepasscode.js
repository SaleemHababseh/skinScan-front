import { baseURL } from "../config.js"; // Adjust the path if needed

export const validatePassCode = async ({ email, validate_code, new_password }) => {
    try {
        const response = await fetch(`${baseURL}auth/validatePassCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                validate_code,
                new_password
            })
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

