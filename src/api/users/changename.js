import { baseURL } from "../config.js"; // Ensure the correct path for config

const changeName = async ({ firstName, lastName, token }) => {
  try {
    const response = await fetch(`${baseURL}users/ChangeName`, {
      // Correct URL from Swagger
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is passed correctly
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ firstName, lastName }), // Pass firstName and lastName in body
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to change name");
    }

    return data;
  } catch (error) {
    console.error("Change name failed:", error.message);
    throw error;
  }
};

// // Example usage:
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTYWxlZW0iLCJpZCI6MTAsInJvbGUiOiJwYXRpZW50IiwiZXhwIjoxNzQ1NTI0OTEzfQ.jOZCNFwHBbLy72gxmAqG6hkfZsxg7o4AoKLZx5ZyId0";  // Replace with actual token
// changeName({
//   firstName: "John",
//   lastName: "Doe",
//   token: token
// }).then(data => {
//   console.log("✅ Name changed successfully:", data);
// }).catch(error => {
//   console.error("Name change failed:", error.message);
// });
