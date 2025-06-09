import { baseURL } from './config';

export const createChatWebSocket = (recipientId, token, appointmentId = null) => {
  const wsBaseUrl = baseURL.replace('https://', 'wss://').replace('http://', 'ws://').replace(/\/$/, '');
  let wsUrl = `${wsBaseUrl}/chat/ws/${recipientId}?token=${encodeURIComponent(token)}`;
  
  if (appointmentId) {
    wsUrl += `&appointment_id=${appointmentId}`;
  }
  
  return new WebSocket(wsUrl);
};

export const fetchChatHistory = async (chatPartnerId, token) => {
  try {
    const response = await fetch(`${baseURL}chat/history/${chatPartnerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.History?.history || data.history || [];
    } else {
      console.error('Failed to fetch chat history:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const sendChatMessage = (webSocket, recipientId, message) => {
  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket not connected');
  }
  
  const sendStr = `${recipientId}: ${message.trim()}`;
  webSocket.send(sendStr);
};

export const rateDoctor = async (doctorId, rating, token) => {
  try {
    const response = await fetch(`${baseURL}users/rate/doctor-rating/${doctorId}/${rating}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.detail || 'Failed to rate doctor');
    }

    return data;
  } catch (error) {
    console.error('Rate doctor error:', error);
    throw error;
  }
};

export const reportUser = async (reportType, description, reportedUserId, token) => {
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
      throw new Error(data.detail || 'Failed to report user');
    }

    return data;
  } catch (error) {
    console.error('Report user error:', error);
    throw error;
  }
};
