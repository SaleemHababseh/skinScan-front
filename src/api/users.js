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

// Utility function to get auth headers for form data
const getAuthHeadersFormData = () => {
  const token = tokenStorage.getAccessToken();
  return {
    'Authorization': `Bearer ${token}`
  };
};

// Create user account
export const createAccount = async (userData) => {
  try {
    const response = await fetch(`${baseURL}users/create-account/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseURL}users/upload-profile-picture/`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Update basic information
export const updateBasicInformation = async (firstName, lastName) => {
  try {
    const response = await fetch(`${baseURL}users/update-basic-information/${encodeURIComponent(firstName)}/${encodeURIComponent(lastName)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating basic information:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${baseURL}users/update/password/${encodeURIComponent(oldPassword)}/${encodeURIComponent(newPassword)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update forget password
export const updateForgetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${baseURL}users/info/update-forget-password?new_password=${encodeURIComponent(newPassword)}&email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating forget password:', error);
    throw error;
  }
};

// Update bio
export const updateBio = async (bio) => {
  try {
    const response = await fetch(`${baseURL}users/update-bio/${encodeURIComponent(bio)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating bio:', error);
    throw error;
  }
};

// Get doctor acceptation result
export const getDoctorAcceptationResult = async () => {
  try {
    const response = await fetch(`${baseURL}users/doctor-acceptation-result`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting doctor acceptation result:', error);
    throw error;
  }
};

// Get doctor bio
export const getDoctorBio = async (doctorId) => {
  try {
    const response = await fetch(`${baseURL}users/info/doctor-bio?doctor_id=${doctorId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting doctor bio:', error);
    throw error;
  }
};

// Get user profile picture
export const getUserProfilePicture = async (userId) => {
  try {
    const response = await fetch(`${baseURL}users/get/user-profile-picture?user_id=${userId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user profile picture:', error);
    throw error;
  }
};

// Get user basic information
export const getUserBasicInfo = async () => {
  try {
    const response = await fetch(`${baseURL}users/get/user-info/get-user-basic-info`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user basic info:', error);
    throw error;
  }
};

// Create appointment
export const createAppointment = async (doctorId) => {
  try {
    const response = await fetch(`${baseURL}users/create-Appointments?doctor_id=${doctorId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get user appointments
export const getUserAppointments = async () => {
  try {
    const response = await fetch(`${baseURL}users/doctor-appointments`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user appointments:', error);
    throw error;
  }
};

// Accept appointment
export const acceptAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${baseURL}users/accept/${appointmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error accepting appointment:', error);
    throw error;
  }
};

// Rate doctor
export const rateDoctor = async (doctorId, rate) => {
  try {
    const response = await fetch(`${baseURL}users/rate/doctor-rating/${doctorId}/${rate}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rating doctor:', error);
    throw error;
  }
};

// Get top rated doctors
export const getTopRatedDoctors = async () => {
  try {
    const response = await fetch(`${baseURL}users/top-rated-doctors`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting top rated doctors:', error);
    throw error;
  }
};

// Upload CV
export const uploadCV = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${baseURL}users/upload-cv`, {
      method: 'POST',
      headers: getAuthHeadersFormData(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};
