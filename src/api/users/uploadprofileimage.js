// uploadprofileimage.js

import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";
import { baseURL } from "../config.js"; // تأكد من صحة المسار لهذا الملف

const uploadProfileImage = async () => {
  const filePath = "C:/Users/salee/Downloads/pp.png";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIiwiaWQiOjEwLCJyb2xlIjoicGF0aWVudCIsImV4cCI6MTc0Njk4MDg1M30.enhKAvd8iCTxhDT0PLAizRV81XmMMXs5q4Y5ZTl0lC8";

  const form = new FormData();
  form.append("file", fs.createReadStream(filePath)); // ✅ يرفع الصورة فعليًا

  try {
    const response = await fetch(`${baseURL}users/upload-profile-picture/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders() // مهم جداً حتى يتعرف السيرفر على الـ multipart
      },
      body: form,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(" Upload failed:", data);
      throw new Error(data.detail || "Upload failed");
    }

    console.log("Image uploaded successfully:");
    console.log(data);
  } catch (error) {
    console.error("Error uploading image:", error.message);
  }
};


uploadProfileImage();
