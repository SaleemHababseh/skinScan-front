import { baseURL } from './config';

/**
 * Submit a report to the system
 * @param {string} reportType - Type of report (abuse, spam, Application_Error, terms_violation, other)
 * @param {string} description - Description of the issue
 * @param {number|null} reportedUserId - ID of reported user (null for system reports)
 * @param {string} token - Authentication token
 * @returns {Promise} Response from the server
 */
export const submitReport = async (reportType, description, reportedUserId = null, token) => {
  try {
    // Build URL with conditional reported_user_id parameter
    let url = `${baseURL}users/report-user?report_type=${encodeURIComponent(reportType)}&description=${encodeURIComponent(description)}`;
    
    // Only add reported_user_id if it's provided (for user-specific reports like abuse/spam)
    if (reportedUserId !== null && reportedUserId !== undefined) {
      url += `&reported_user_id=${reportedUserId}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.detail || 'Failed to submit report');
    }

    return data;
  } catch (error) {
    console.error('Submit report error:', error);
    throw error;
  }
};

/**
 * Submit a user-specific report (abuse, spam)
 * @param {string} reportType - Type of report
 * @param {string} description - Description of the issue
 * @param {number} reportedUserId - ID of the reported user
 * @param {string} token - Authentication token
 * @returns {Promise} Response from the server
 */
export const reportUser = async (reportType, description, reportedUserId, token) => {
  if (!reportedUserId) {
    throw new Error('User ID is required for user reports');
  }
  return submitReport(reportType, description, reportedUserId, token);
};

/**
 * Submit a system-level report (Application_Error, terms_violation, other)
 * @param {string} reportType - Type of report
 * @param {string} description - Description of the issue
 * @param {string} token - Authentication token
 * @returns {Promise} Response from the server
 */
export const reportSystem = async (reportType, description, token) => {
  return submitReport(reportType, description, null, token);
};

/**
 * Check if a report type requires a user ID
 * @param {string} reportType - Type of report
 * @returns {boolean} Whether the report type requires a user ID
 */
export const requiresUserId = (reportType) => {
  const userSpecificReports = ['abuse', 'spam'];
  return userSpecificReports.includes(reportType);
};
