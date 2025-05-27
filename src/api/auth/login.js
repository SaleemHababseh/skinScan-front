import { baseURL } from "../config.js"; // تأكد من تعديل المسار إذا لزم الأمر

const login = async ({ username, password, client_id, client_secret, scope = "" }) => {
  try {
    const body = new URLSearchParams({
      grant_type: "password",
      username,
      password,
      scope,
      client_id,
      client_secret
    });

    const response = await fetch(`${baseURL}auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data);
      throw new Error(data.detail || "Login failed");
    }

    return data; // سيُرجع التوكن
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Example usage
login({
  username: "saleemtestuser2@gmail.com",
  password: "newPassword123",
  client_id: "your-client-id", // استبدله بالـ client_id الفعلي
  client_secret: "your-client-secret" // استبدله بالـ client_secret الفعلي
}).then(data => {
  console.log("Login successful. Token received:");
  console.log(data);
}).catch(error => {
  console.error("Login failed:");
  console.error(error.message);
});
