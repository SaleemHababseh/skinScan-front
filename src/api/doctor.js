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

// Get doctor's appointments
export const getDoctorAppointments = async (doctorId) => {
  try {
    const response = await fetch(`${baseURL}doctor/${doctorId}/appointments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    throw error;
  }
};

// Get doctor's patients
export const getDoctorPatients = async (doctorId) => {
  try {
    const response = await fetch(`${baseURL}doctor/${doctorId}/patients`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting doctor patients:', error);
    throw error;
  }
};

// Send medical report to patient
export const sendMedicalReport = async (reportData) => {
  try {
    const response = await fetch(`${baseURL}doctor/medical-report`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending medical report:', error);
    throw error;
  }
};

// Update appointment status (accept/decline)
export const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await fetch(`${baseURL}doctor/appointments/${appointmentId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

// Get doctor profile
export const getDoctorProfile = async (doctorId) => {
  try {
    const response = await fetch(`${baseURL}doctor/${doctorId}/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    throw error;
  }
};

// Update doctor profile
export const updateDoctorProfile = async (doctorId, profileData) => {
  try {
    const response = await fetch(`${baseURL}doctor/${doctorId}/profile`, {
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
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

// Get patient details for doctor
export const getPatientDetails = async (patientId) => {
  try {
    const response = await fetch(`${baseURL}doctor/patients/${patientId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting patient details:', error);
    throw error;
  }
};

// Get patient's medical history
export const getPatientMedicalHistory = async (patientId) => {
  try {
    const response = await fetch(`${baseURL}doctor/patients/${patientId}/history`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting patient medical history:', error);
    throw error;
  }
};
