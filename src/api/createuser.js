import { baseURL } from "./config.js";

const createUser = async ({
    f_name,
    l_name,
    email,
    role,
    age,
    password,
    sex
}) => {
    try {
        const response = await fetch(`${baseURL}/users/create-account/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                f_name,
                l_name,
                email,
                role,
                age,
                password,
                sex
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "networkerror");
        }

        return data;
    } catch (error) {
        console.log("Caught error:", error);
        throw error;
    }
};

createUser({
    f_name: "DR.Saleem",
    l_name: "Hababsah",
    email: "syntaxbootcamp@gmail.com",
    role: "doctor",
    age: 25,
    password: "strongPassword123",
    sex: "male"
}).then(data => {
    console.log("✅ User created successfully:");
    console.log(data);
}).catch(error => {
    console.error("❌ Failed to create user:");
    console.error(error.message);
});
