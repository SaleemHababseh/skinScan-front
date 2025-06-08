import { baseURL } from "../config.js";  // تأكد من صحة المسار

const getNews = async ({ token }) => {
  try {
    const response = await fetch(`${baseURL}users/news/api`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to fetch news");
    }

    return data;
  } catch (error) {
    console.error("News fetch failed:", error.message);
    throw error;
  }
};

// // Example usage:
// getNews({
//   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYWhtb3VkIHp1cmlxaSIsImlkIjo1LCJyb2xlIjoicGF0aWVudCIsImV4cCI6MTc0OTMxNzM1OX0.Qik4aqE03DrnWJO7QOFk90mvNohho3VRhYvriLmvFCU"
// }).then(data => {
//   console.log("✅ News fetched successfully:");
//   console.log(data.keys());
// }).catch(error => {
//   console.error("News fetch failed:");
//   console.error(error.message);
// });
