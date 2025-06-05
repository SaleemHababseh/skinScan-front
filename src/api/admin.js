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

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${baseURL}admin/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Update user status (activate, suspend, delete)
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await fetch(`${baseURL}admin/users/${userId}/status`, {
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
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const response = await fetch(`${baseURL}admin/appointments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting all appointments:', error);
    throw error;
  }
};

// Get system logs
export const getSystemLogs = async () => {
  try {
    const response = await fetch(`${baseURL}admin/logs`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting system logs:', error);
    throw error;
  }
};

// Send global notification
export const sendNotification = async (message) => {
  try {
    const response = await fetch(`${baseURL}admin/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Get admin dashboard statistics
export const getAdminStats = async () => {
  try {
    const response = await fetch(`${baseURL}admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
};

// Get system reports
export const getSystemReports = async (reportType = 'all') => {
  try {
    const response = await fetch(`${baseURL}admin/reports?type=${reportType}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting system reports:', error);
    throw error;
  }
};
