import { baseURL } from "../config.js";

export const uploadProfilePicture = async (file , token) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${baseURL}users/upload-profile-picture/`, {
            method: "POST",
            body: formData,
            headers: {
                'authorization': `Bearer ${token}`,
            },
            "ngrok-skip-browser-warning": "true",
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Profile picture upload failed");
        }

        return data;
    } catch (error) {
        console.error("Profile picture upload error:", error);
        throw error;
    }
};
