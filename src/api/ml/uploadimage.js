import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

async function uploadSampleImage(access_token, imagePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath), {
      contentType: 'image/jpeg',
      filename: 'image.jpg',
    });

    const response = await fetch('https://5e1b-87-236-233-66.ngrok-free.app/scan/scan-sample-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'accept': 'application/json',
        // لا تضف Content-Type هنا لأنه يتم تعيينه تلقائيًا من form-data مع boundary
        ...form.getHeaders(),
      },
      body: form,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Upload failed:", result);
      throw new Error(result.detail || 'Failed to upload image');
    }

    console.log("✅ Upload successful:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// استدعاء الدالة
uploadSampleImage(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImlkIjoxMCwicm9sZSI6InBhdGllbnQiLCJleHAiOjE3NDgzNTYwNjF9.gbV0LHLI_aaxWg-Pwg-KOWGpP0Ss19VS8lrrlssYjys', // access_token
  'C:/users/salee/Downloads/11.jpg' // path to image
);
