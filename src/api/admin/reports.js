import { baseURL } from "../config.js";

export const getReportsByStatus = async (status = "pending", token) => {
    try {
        const validStatuses = ["pending", "in_progress", "resolved"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status. Must be 'pending', 'in_progress', or 'resolved'");
        }

        // Try both formats for better API compatibility
        let apiStatus = status;
        let response;
        let lastError;

        // First try with underscore format
        try {
            response = await fetch(`${baseURL}admin/get-reports-by-status?status=${encodeURIComponent(apiStatus)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true",
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            }
            
            lastError = await response.text();
        } catch (error) {
            lastError = error;
        }

        // If first attempt fails and status is in_progress, try with space format
        if (status === 'in_progress') {
            try {
                apiStatus = 'in progress';
                response = await fetch(`${baseURL}admin/get-reports-by-status?status=${encodeURIComponent(apiStatus)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "ngrok-skip-browser-warning": "true",
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    return data;
                }
            } catch (error) {
                lastError = error;
            }
        }

        // If both attempts fail, throw the last error
        throw new Error(typeof lastError === 'string' ? lastError : lastError?.message || "Failed to get reports by status");

    } catch (error) {
        console.error("Error getting reports by status:", error);
        throw error;
    }
};
