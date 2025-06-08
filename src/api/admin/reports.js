import { baseURL } from "../config.js";

export const getReportsByStatus = async (status = "pending", token) => {
    try {
        const validStatuses = ["pending", "in progress", "resolved"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status. Must be 'pending', 'in progress', or 'resolved'");
        }

        const response = await fetch(`${baseURL}admin/get-reports-by-status?status=${encodeURIComponent(status)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Server error response:", data);
            throw new Error(data.detail || "Failed to get reports by status");
        }

        return data;
    } catch (error) {
        console.error("Error getting reports by status:", error);
        throw error;
    }
};
