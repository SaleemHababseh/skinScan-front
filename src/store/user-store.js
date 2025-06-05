import { create } from 'zustand';
import { 
  createAccount,
  uploadProfilePicture,
  updateBasicInformation,
  updateUserPassword,
  updateForgetPassword,
  updateBio,
  getDoctorAcceptationResult,
  getDoctorBio,
  getUserProfilePicture,
  getUserBasicInfo,
  createAppointment,
  getUserAppointments,
  acceptAppointment,
  rateDoctor,
  getTopRatedDoctors,
  uploadCV
} from '../api/users';

const useUserStore = create((set) => ({
  // State
  userInfo: null,
  appointments: [],
  topRatedDoctors: [],
  doctorAcceptationResult: null,
  profilePicture: null,
  isLoading: false,
  error: null,

  // Actions
  // Create new account
  createUserAccount: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createAccount(userData);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Upload profile picture
  uploadUserProfilePicture: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadProfilePicture(file);
      set({ isLoading: false, profilePicture: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update basic information
  updateUserBasicInfo: async (firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateBasicInformation(firstName, lastName);
      set(state => ({
        isLoading: false,
        userInfo: state.userInfo ? { ...state.userInfo, f_name: firstName, l_name: lastName } : null
      }));
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update password
  updatePassword: async (oldPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateUserPassword(oldPassword, newPassword);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update forget password
  resetPassword: async (email, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateForgetPassword(email, newPassword);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Update bio
  updateUserBio: async (bio) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateBio(bio);
      set(state => ({
        isLoading: false,
        userInfo: state.userInfo ? { ...state.userInfo, bio } : null
      }));
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get doctor acceptation result
  fetchDoctorAcceptationResult: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getDoctorAcceptationResult();
      set({ isLoading: false, doctorAcceptationResult: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get doctor bio
  fetchDoctorBio: async (doctorId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getDoctorBio(doctorId);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get user profile picture
  fetchUserProfilePicture: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getUserProfilePicture(userId);
      set({ isLoading: false, profilePicture: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get user basic info
  fetchUserBasicInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getUserBasicInfo();
      set({ isLoading: false, userInfo: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Create appointment
  createUserAppointment: async (doctorId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createAppointment(doctorId);
      set(state => ({
        isLoading: false,
        appointments: [...state.appointments, result]
      }));
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get user appointments
  fetchUserAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getUserAppointments();
      set({ isLoading: false, appointments: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Accept appointment
  acceptUserAppointment: async (appointmentId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await acceptAppointment(appointmentId);
      set(state => ({
        isLoading: false,
        appointments: state.appointments.map(apt => 
          apt.appointment_id === appointmentId ? result : apt
        )
      }));
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Rate doctor
  rateDoctorById: async (doctorId, rate) => {
    set({ isLoading: true, error: null });
    try {
      const result = await rateDoctor(doctorId, rate);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Get top rated doctors
  fetchTopRatedDoctors: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getTopRatedDoctors();
      set({ isLoading: false, topRatedDoctors: result });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Upload CV
  uploadUserCV: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadCV(file);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    userInfo: null,
    appointments: [],
    topRatedDoctors: [],
    doctorAcceptationResult: null,
    profilePicture: null,
    isLoading: false,
    error: null
  })
}));

export default useUserStore;
