import { baseURL } from "../config.js";

export const sendVerificationCode = async ({ email }) => {
  try {
    const response = await fetch(
      `${baseURL}auth/send-verification-code?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Raw response body:", errorData);
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Send verification code error:", error);
    throw error;
  }
};
