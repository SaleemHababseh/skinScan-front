import { delay } from '../utils';
import { mockAppointments, mockPatients, mockReports } from './mockData';

// Get doctor appointments
export const getDoctorAppointments = async (doctorId) => {
  await delay(800);
  return mockAppointments.filter(apt => apt.doctorId === doctorId);
};

// Get doctor's patients
export const getDoctorPatients = async (doctorId) => {
  await delay(1000);
  const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === doctorId);
  const patientIds = [...new Set(doctorAppointments.map(apt => apt.patientId))];
  return mockPatients.filter(patient => patientIds.includes(patient.id));
};

// Send medical report
export const sendMedicalReport = async (reportData) => {
  await delay(1200);
  
  const newReport = {
    id: String(mockReports.length + 1),
    ...reportData,
    createdAt: new Date().toISOString()
  };
  
  mockReports.push(newReport);
  
  return newReport;
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId, status) => {
  await delay(600);
  
  const appointment = mockAppointments.find(apt => apt.id === appointmentId);
  
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  appointment.status = status;
  
  return { ...appointment };
};