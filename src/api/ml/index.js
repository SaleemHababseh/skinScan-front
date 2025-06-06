import { baseURL } from "../config.js";
import useAuthStore from "../../store/auth-store.js";

// Utility function to get auth headers for form data
const getAuthHeadersFormData = () => {
  const token = useAuthStore.getState().token;
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Scan sample image using ML model
export const scanSampleImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${baseURL}scan/scan-sample-image`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      body: formData
    });

    if (!response.ok) {
      // Handle error response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // Handle successful response - API returns a JSON object with response and ratio
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data; // Return the full object with response and ratio
    } else {
      // Fallback to text response
      const text = await response.text();
      return { response: text, ratio: null };
    }
  } catch (error) {
    console.error('Error scanning image:', error);
    throw error;
  }
};

// Helper function to validate image file
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    throw new Error('No file selected');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Please select an image smaller than 10MB.');
  }

  return true;
};

// Convert file to base64 for preview
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
