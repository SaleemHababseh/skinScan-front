import { baseURL } from "./config.js";
import { tokenStorage } from "./auth";

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = tokenStorage.getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Upload skin image for analysis
export const uploadSkinImage = async (imageFile, patientId) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('patient_id', patientId);

    const token = tokenStorage.getAccessToken();
    const response = await fetch(`${baseURL}patient/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading skin image:', error);
    throw error;
  }
};

// Get skin analysis results
export const getSkinAnalysis = async (imageId) => {
  try {
    const response = await fetch(`${baseURL}patient/analysis/${imageId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting skin analysis:', error);
    throw error;
  }
};

// Book appointment with doctor
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await fetch(`${baseURL}patient/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

// Get patient's uploaded images
export const getPatientImages = async (patientId) => {
  try {
    const response = await fetch(`${baseURL}patient/${patientId}/images`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting patient images:', error);
    throw error;
  }
};

// Get patient's appointments
export const getPatientAppointments = async (patientId) => {
  try {
    const response = await fetch(`${baseURL}patient/${patientId}/appointments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting patient appointments:', error);
    throw error;
  }
};

// Get patient profile
export const getPatientProfile = async (patientId) => {
  try {
    const response = await fetch(`${baseURL}patient/${patientId}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting patient profile:', error);
    throw error;
  }
};

// Update patient profile
export const updatePatientProfile = async (patientId, profileData) => {
  try {
    const response = await fetch(`${baseURL}patient/${patientId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating patient profile:', error);
    throw error;
  }
};
