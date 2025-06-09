import { baseURL } from "../config.js";

export const reportUser = async (report_type, description, reported_user_id, token) => {
    try {
        // Build URL with conditional reported_user_id parameter
        let url = `${baseURL}users/report-user?report_type=${encodeURIComponent(report_type)}&description=${encodeURIComponent(description)}`;
        
        // Only add reported_user_id if it's provided (for user-specific reports like abuse/spam)
        if (reported_user_id !== null && reported_user_id !== undefined) {
            url += `&reported_user_id=${reported_user_id}`;
        }
        
        const response = await fetch(url, {
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
