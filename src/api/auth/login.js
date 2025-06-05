import { baseURL } from "../config.js";

const login = async ({
  username,
  password,
  client_id = "",
  client_secret = "",
  scope = "",
}) => {
  try {
    const body = new URLSearchParams({
      grant_type: "password",
      username,
      password,
      scope,
      client_id,
      client_secret,
    });

    const response = await fetch(`${baseURL}auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data);
      throw new Error(data.detail || "Login failed");
    }

    return data; // Returns the token data
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

login({
  username: "husam.a.awadi@outlook.com",
  password: "husam@2001",
  client_id: "your_client_id",
  client_secret: "your_client_secret",
  scope: "your_scope",
})
  .then((data) => console.log("Login successful:", data))
  .catch((error) => console.error("Login error:", error.message));

export { login };
