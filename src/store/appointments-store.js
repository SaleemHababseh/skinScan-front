import { create } from "zustand";
import { createAppointment } from "../api/users/createAppointment";
import { getDoctorAppointments } from "../api/users/getDoctorAppointments";
import { getPatientAppointments } from "../api/users/getPatientAppointments";
import { acceptAppointment } from "../api/users/acceptAppointment";
import { cancelAppointment } from "../api/users/cancelAppointment";
import { rateDoctor } from "../api/users/rateDoctor";
import { getTopRatedDoctors } from "../api/users/getTopRatedDoctors";
import { getDoctorBio } from "../api/users/getDoctorBio";
import { getDoctorAcceptationResult } from "../api/users/getDoctorAcceptationResult";
import { uploadCV } from "../api/users/uploadCV";
import { reportUser } from "../api/users/reportUser";

const useUserStore = create((set, get) => ({
  appointments: [],
  doctors: [],
  isLoading: false,
  error: null,

  // Appointment management
  createNewAppointment: async (doctor_id, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createAppointment(doctor_id, token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchDoctorAppointments: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getDoctorAppointments(token);
      set({ appointments, isLoading: false });
      return appointments;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchPatientAppointments: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getPatientAppointments(token);
      set({ appointments, isLoading: false });
      return appointments;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  acceptPatientAppointment: async (appointment_id, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await acceptAppointment(appointment_id, token);
      
      // Update the appointment in the store
      set(state => ({
        appointments: state.appointments.map(apt => 
          apt.appointment_id === appointment_id 
            ? { ...apt, status: 'accepted' }
            : apt
        ),
        isLoading: false
      }));

      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  cancelPatientAppointment: async (appointment_id, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cancelAppointment(appointment_id, token);
      
      // Remove the appointment from the store
      set(state => ({
        appointments: state.appointments.filter(apt => 
          apt.appointment_id !== appointment_id
        ),
        isLoading: false
      }));

      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Doctor management
  rateDoctorById: async (doctor_id, rate, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await rateDoctor(doctor_id, rate, token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchTopRatedDoctors: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const doctors = await getTopRatedDoctors(token);
      set({ doctors, isLoading: false });
      return doctors;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchDoctorBio: async (doctor_id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getDoctorBio(doctor_id);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  fetchDoctorAcceptationResult: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getDoctorAcceptationResult(token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // File uploads
  uploadDoctorCV: async (file, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadCV(file, token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Reporting
  reportUserById: async (report_type, description, reported_user_id, token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await reportUser(report_type, description, reported_user_id, token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Utility functions
  clearError: () => set({ error: null }),
  
  clearAppointments: () => set({ appointments: [] }),
  
  clearDoctors: () => set({ doctors: [] }),
}));

export default useUserStore;
