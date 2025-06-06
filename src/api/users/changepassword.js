import { baseURL } from "../config.js"; // Ensure the correct path for config

const changePassword = async ({ oldPass, newPass, token }) => {
  try {
    const response = await fetch(`${baseURL}users/ChangePass`, {  // Correct URL for ChangePass
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Ensure token is passed correctly
      },
      body: JSON.stringify({ old_pass: oldPass, new_pass: newPass }), // Pass old and new password in body
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to change password");
    }

    return data;
  } catch (error) {
    console.error("Change password failed:", error.message);
    throw error;
  }
};

// // Example usage:
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIiwiaWQiOjEwLCJyb2xlIjoicGF0aWVudCIsImV4cCI6MTc0NjM3NTkxNX0.fEEsbb5h6dN_1bKmn_-eY-ccZ0pg7g95eWNVVTDEJZM";  // Replace with actual token
// changePassword({
//   oldPass: "newPassword123",  // Provide the current password
//   newPass: "newPassword123",  // Provide the new password
//   token: token
// }).then(data => {
//   console.log("✅ Password changed successfully:", data);
// }).catch(error => {
//   console.error("Password change failed:", error.message);
// });
