import { baseURL } from "../config.js";

export const uploadCV = async (file, token) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${baseURL}users/upload-cv`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                 "ngrok-skip-browser-warning": "true",
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "CV upload failed");
        }

        return data;
    } catch (error) {
        console.error("CV upload error:", error);
        throw error;
    }
};
