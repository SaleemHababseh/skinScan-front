import { create } from "zustand";
import {
  getDoctorAppointments,
  getDoctorPatients,
  sendMedicalReport,
  updateAppointmentStatus,
} from "../api/doctor";

const useDoctorStore = create((set) => ({
  appointments: [],
  patients: [],
  isLoading: false,
  error: null,

  // Load doctor appointments
  loadAppointments: async (doctorId) => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await getDoctorAppointments(doctorId);
      set({ appointments, isLoading: false });
      return appointments;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Load doctor patients
  loadPatients: async (doctorId) => {
    set({ isLoading: true, error: null });
    try {
      const patients = await getDoctorPatients(doctorId);
      set({ patients, isLoading: false });
      return patients;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Send medical report
  sendReport: async (reportData) => {
    set({ isLoading: true, error: null });
    try {
      const report = await sendMedicalReport(reportData);
      set({ isLoading: false });
      return report;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update appointment status (accept/decline)
  updateAppointment: async (appointmentId, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAppointment = await updateAppointmentStatus(
        appointmentId,
        status
      );
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === appointmentId ? updatedAppointment : apt
        ),
        isLoading: false,
      }));
      return updatedAppointment;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  loadDoctorData :async ()=> {
    set({ isLoading: true, error: null });
    try {
      const doctorData = await getDoctorPatients();
      set({ doctorData, isLoading: false });
      return doctorData;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  
  // Clear errors
  clearError: () => set({ error: null }),
}));

export default useDoctorStore;
