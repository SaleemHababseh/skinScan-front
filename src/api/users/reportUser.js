import { baseURL } from "../config.js";

export const reportUser = async (report_type, description, reported_user_id, token) => {
    try {
        const response = await fetch(`${baseURL}users/report-user?report_type=${encodeURIComponent(report_type)}&description=${encodeURIComponent(description)}&reported_user_id=${reported_user_id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                 "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to report user");
        }

        return data;
    } catch (error) {
        console.error("Report user error:", error);
        throw error;
    }
};
