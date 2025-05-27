import { create } from 'zustand';
import { 
  uploadSkinImage, 
  getSkinAnalysis, 
  bookAppointment,
  getPatientImages,
  getPatientAppointments
} from '../api/patient';

const usePatientStore = create((set, get) => ({
  skinImages: [],
  appointments: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,

  // Load patient data
  loadPatientData: async (patientId) => {
    set({ isLoading: true, error: null });
    try {
      const [skinImages, appointments] = await Promise.all([
        getPatientImages(patientId),
        getPatientAppointments(patientId)
      ]);
      set({ 
        skinImages, 
        appointments, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  // Upload skin image and get analysis
  uploadImage: async (imageFile, patientId) => {
    set({ isLoading: true, error: null });
    try {
      const uploadResult = await uploadSkinImage(imageFile, patientId);
      const analysis = await getSkinAnalysis(uploadResult.imageId);
      
      set(state => ({ 
        skinImages: [uploadResult, ...state.skinImages],
        currentAnalysis: analysis,
        isLoading: false 
      }));
      
      return analysis;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Book an appointment
  bookAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const appointment = await bookAppointment(appointmentData);
      set(state => ({ 
        appointments: [appointment, ...state.appointments],
        isLoading: false 
      }));
      return appointment;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear current analysis
  clearAnalysis: () => {
    set({ currentAnalysis: null });
  },

  // Clear errors
  clearError: () => set({ error: null }),
}));

export default usePatientStore;