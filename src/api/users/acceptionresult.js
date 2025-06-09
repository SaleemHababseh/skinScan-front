import { baseURL } from "../config.js"; // تأكد من المسار

const checkAcception = async ({ doctor_id, token }) => {
  try {
    const response = await fetch(
      `${baseURL}users/Acceptionresult?doctor_id=${doctor_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error response:", data);
      throw new Error(data.detail || "Failed to check acception result");
    }

    // Modify the return statement to handle the response correctly
    return data.Result === true;
  } catch (error) {
    console.error("Acception check failed:", error.message);
    throw error;
  }
};

// // Example usage:
// checkAcception({
//   doctor_id: 5,  // حط ID الطبيب هون
//   token: "ضع_التوكن_هون"
// }).then(data => {
//   console.log("✅ Acception result:");
//   console.log(data);
// }).catch(error => {
//   console.error("Acception check failed:");
//   console.error(error.message);
// });
