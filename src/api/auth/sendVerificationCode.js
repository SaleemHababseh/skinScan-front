import { baseURL } from "../config.js";

export const sendVerificationCode = async ({ email }) => {
  try {
    const response = await fetch(
      `${baseURL}auth/send-verification-code?email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Raw response body:", errorText);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

sendVerificationCode ({ email: "syntaxbootkjcamp@gmail.com" })
  .then((res) => {
    console.log("Success:", res);
  })
  .catch((err) => {
    console.log("error:", err);
  });
