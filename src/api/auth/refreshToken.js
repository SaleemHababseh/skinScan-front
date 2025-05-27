import { baseURL } from "../config.js";

export const refreshAccessToken = async (refresh_token , access_token) => {
  try {
    //const refresh_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImV4cCI6MTc0ODgxNDkyNSwianRpIjoiNzY4NzlmMzAtZDRlYS00OTg0LWE0MzctZjEyNjY0MTY3NDFlIn0.OW8UUnCw7xiXv0O-MStbxVv34QRrtdCTvMwp9UdeIPs";
    
    //const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImlkIjoxMCwicm9sZSI6InBhdGllbnQiLCJleHAiOjE3NDgyMTEwMjV9.CqNC580Io7mrnE4avO8YE3osr8V93gRYUgC23mSJJ0M";

    const url = `${baseURL}auth/refresh/token/?refresh_token=${encodeURIComponent(refresh_token)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
      body: "", 
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Refresh token failed:", data);
      throw new Error(data.detail || "Failed to refresh token");
    }

    return data;
  } catch (error) {
    console.error("Refresh error:", error.message);
    throw error;
  }
};

refreshAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImV4cCI6MTc0ODk1OTkyMSwianRpIjoiY2E4OGFhMjAtMDJkNC00Yjg4LWJlN2YtMTVhZDg1Y2UxN2NmIn0.GN2njMYRaHSdzne9jpTxxkqKNsWnbTb-ttskzLj3q4A",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImlkIjoxMCwicm9sZSI6InBhdGllbnQiLCJleHAiOjE3NDgzNTYwMjF9.rC0KmwrEBKvfEaQ8dcrH-3RyWx9_-ddUzbqUqVhK5ho"
)
  .then((newAccessToken) => {
    console.log("✅ New access token:", newAccessToken);
  })
  .catch((err) => {
    console.error("❌ Error refreshing token:", err.message);
  });
