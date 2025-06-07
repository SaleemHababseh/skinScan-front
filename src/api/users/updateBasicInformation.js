import { baseURL } from "../config.js";

export const updateBasicInformation = async (f_name, l_name, token) => {
    try {
        const response = await fetch(`${baseURL}users/update-basic-information/${encodeURIComponent(f_name)}/${encodeURIComponent(l_name)}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Basic information update failed");
        }

        return data;
    } catch (error) {
        console.error("Basic information update error:", error);
        throw error;
    }
};
