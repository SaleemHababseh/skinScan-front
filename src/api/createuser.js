import { baseURL } from "./config.js";

export const createUser = async ({
    f_name,
    l_name,
    email,
    role,
    age,
    hashed_password,
    sex,
    agreed_to_policy
}) => {
    try {
        const response = await fetch(`${baseURL}users/create-account/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email,
                f_name,
                l_name,
                hashed_password,
                role,
                age,
                sex,
                agreed_to_policy
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 400 || response.status === 422) {
                if (data.detail && data.detail.includes('email')) {
                    throw new Error("This email address is already registered. Please use a different email or try logging in.");
                }
                throw new Error("Invalid registration data. Please check all fields and try again.");
            }

            if (response.status === 404) {
                throw new Error("Registration service not available. Please try again later.");
            }

            if (response.status >= 500) {
                throw new Error("Server error. Please try again later.");
            }

            throw new Error(data.detail || data.message || "Registration failed. Please try again.");
        }

        return data;
    } catch (error) {
        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }

        console.error("Registration error:", error.message);
        throw error;
    }
};
