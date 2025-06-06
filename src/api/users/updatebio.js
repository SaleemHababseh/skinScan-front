import { baseURL } from "../config.js";  // Adjust the path if needed

const updateBio = async ({ bio, token }) => {
  try {
    const response = await fetch(`${baseURL}users/UpdateBio?bio=${encodeURIComponent(bio)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(response);

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to update bio");
    }

    return data;
  } catch (error) {
    console.error("Bio update failed:", error.message);
    throw error;
  }
};

// // Example usage:
// updateBio({
//   bio: "This is my new bio",
//   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIiwiaWQiOjEwLCJyb2xlIjoicGF0aWVudCIsImV4cCI6MTc0NTUyNjkzMX0.IhVCSzTtfCk0H2xx5B1plhpu8lfRdKW9BBOLKv1u13A",  // Replace with an actual token
// }).then(data => {
//   console.log("✅ Bio updated successfully:");
//   console.log(data);
// }).catch(error => {
//   console.error("Bio update failed:");
//   console.error(error.message);
// });
