import { create } from "zustand";
import { getDoctorAppointments } from "../api/users/getDoctorAppointments";
import { getDoctorBio } from "../api/users/getDoctorBio";
import { acceptAppointment } from "../api/users/acceptAppointment";
import { cancelAppointment } from "../api/users/cancelAppointment";
import { getUserRecords } from "../api/users/getUserRecords";
import { updateBio } from "../api/users/updatebio";
import useAuthStore from "./auth-store";

const useDoctorStore = create((set, get) => ({
  // State
  appointments: [],
  patientRecords: [],
  pendingDiagnoses: [],
  patients: [],
  doctorStats: {
    totalPatients: 0,
    pendingDiagnoses: 0,
    todayAppointments: 0,
    completedDiagnoses: 0,
  },
  isLoading: false,
  error: null,

  // Get auth token from auth store
  getToken: () => {
    return useAuthStore.getState().token;
  },

  // Load doctor appointments
  loadDoctorAppointments: async () => {
    const token = get().getToken();
    if (!token) {
      set({ error: "No authentication token available" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const appointments = await getDoctorAppointments(token);
      
      // Extract unique patients from appointments
      const patients = appointments ? appointments.reduce((acc, appointment) => {
        const patientName = appointment.patientName || appointment.patient_name || 'Unknown Patient';
        const patient = {
          id: appointment.patientId || appointment.patient_id,
          firstName: patientName.split(' ')[0] || 'Unknown',
          lastName: patientName.split(' ').slice(1).join(' ') || '',
          email: appointment.patientEmail || appointment.patient_email || '',
          lastAppointment: appointment.dateTime || appointment.date_time,
          totalAppointments: appointments.filter(apt => 
            (apt.patientId || apt.patient_id) === (appointment.patientId || appointment.patient_id)
          ).length,
          status: appointment.status,
        };
        
        if (!acc.find(p => p.id === patient.id)) {
          acc.push(patient);
        }
        return acc;
      }, []) : [];

      // Calculate today's appointments
      const today = new Date();
      const todayAppointments = appointments?.filter(apt => {
        const aptDate = new Date(apt.dateTime || apt.date_time);
        return aptDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
      }) || [];

      // Update stats
      const doctorStats = {
        totalPatients: patients.length,
        pendingDiagnoses: get().pendingDiagnoses.length,
        todayAppointments: todayAppointments.length,
        completedDiagnoses: get().patientRecords.filter(record => record.status === 'completed').length,
      };

      set({ 
        appointments, 
        patients, 
        doctorStats,
        isLoading: false 
      });
      return appointments;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Load patient records (for diagnosis review)
  loadPatientRecords: async () => {
    const token = get().getToken();
    if (!token) {
      set({ error: "No authentication token available" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const records = await getUserRecords(token);
      
      // Separate pending and completed diagnoses
      const pendingDiagnoses = records?.filter(record => 
        record.status === 'pending' || record.diagnosis_status === 'pending'
      ) || [];
      
      set({ 
        patientRecords: records || [],
        pendingDiagnoses,
        isLoading: false 
      });
      
      // Update stats
      const currentStats = get().doctorStats;
      set({
        doctorStats: {
          ...currentStats,
          pendingDiagnoses: pendingDiagnoses.length,
          completedDiagnoses: records?.filter(record => 
            record.status === 'completed' || record.diagnosis_status === 'completed'
          ).length || 0,
        }
      });
      
      return records;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Accept appointment
  acceptAppointment: async (appointmentId) => {
    const token = get().getToken();
    if (!token) {
      set({ error: "No authentication token available" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await acceptAppointment(appointmentId, token);
      
      // Update appointments list
      set((state) => ({
        appointments: state.appointments.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'confirmed' }
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

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    const token = get().getToken();
    if (!token) {
      set({ error: "No authentication token available" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await cancelAppointment(appointmentId, token);
      
      // Update appointments list
      set((state) => ({
        appointments: state.appointments.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' }
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

  // Update doctor bio
  updateDoctorBio: async (bioData) => {
    const token = get().getToken();
    if (!token) {
      set({ error: "No authentication token available" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const result = await updateBio(bioData, token);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get patient by ID
  getPatientById: (patientId) => {
    const patients = get().patients;
    return patients.find(patient => patient.id === patientId);
  },

  // Get patient records by patient ID
  getPatientRecords: (patientId) => {
    const records = get().patientRecords;
    return records.filter(record => 
      record.patientId === patientId || record.patient_id === patientId
    );
  },

  // Get today's appointments
  getTodayAppointments: () => {
    const appointments = get().appointments;
    const today = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime || apt.date_time);
      return aptDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    });
  },

  // Get urgent cases (high priority diagnoses)
  getUrgentCases: () => {
    const pendingDiagnoses = get().pendingDiagnoses;
    return pendingDiagnoses.filter(diagnosis => 
      diagnosis.urgency === 'high' || diagnosis.priority === 'high'
    ).slice(0, 5);
  },

  // Load all doctor data
  loadDoctorData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().loadDoctorAppointments(),
        get().loadPatientRecords(),
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    appointments: [],
    patientRecords: [],
    pendingDiagnoses: [],
    patients: [],
    doctorStats: {
      totalPatients: 0,
      pendingDiagnoses: 0,
      todayAppointments: 0,
      completedDiagnoses: 0,
    },
    isLoading: false,
    error: null,
  }),
}));

export default useDoctorStore;
