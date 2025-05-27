import { delay } from '../utils';
import { mockUsers, mockAppointments, mockSystemLogs } from './mockData';

// Get all users
export const getAllUsers = async () => {
  await delay(800);
  return mockUsers.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  await delay(600);
  
  const user = mockUsers.find(user => user.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Handle different status actions
  switch (status) {
    case 'activate':
      user.status = 'active';
      break;
    case 'suspend':
      user.status = 'suspended';
      break;
    case 'delete':
      // In a real app, we might soft delete or remove from the array
      user.status = 'deleted';
      break;
    default:
      throw new Error('Invalid status action');
  }
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all appointments
export const getAllAppointments = async () => {
  await delay(1000);
  return mockAppointments;
};

// Get system logs
export const getSystemLogs = async () => {
  await delay(1200);
  return mockSystemLogs;
};

// Send global notification
export const sendNotification = async (message) => {
  await delay(500);
  return { success: true, message: 'Notification sent successfully' };
};