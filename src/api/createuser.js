import { baseURL } from "./config.js";

export const createUser = async ({
    f_name,
    l_name,
    email,
    role,
    age,
    hashed_password,
    sex
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
                sex
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Registration failed");
        }

        return data;    } catch (error) {
        console.log("Registration error:", error);
        throw error;
    }
};
