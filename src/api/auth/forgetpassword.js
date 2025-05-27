import { baseURL } from "../config.js"; // Adjust the path if needed

const forgetPassword = async ({ email }) => {
    try {
        const response = await fetch(`${baseURL}auth/verification-code/forget-password?email=${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Validation failed");
        }

        return data;
    } catch (error) {
        console.error("Password validation failed:", error.message);
        throw error;
    }
};

forgetPassword({
    email: "saleemalmohidi@gmail.com" // Replace with the email to validate
}).then(data => {
    console.log("Password validation successful:");
    console.log(data);
}).catch(error => {
    console.error(" Password validation failed:");
    console.error(error.message);
});
