import { create } from 'zustand';
import { scanSampleImage, validateImageFile } from '../api/ml';

const useMLStore = create((set, get) => ({
  // State
  scanResult: null,
  selectedImage: null,
  imagePreview: null,
  isScanning: false,
  error: null,
  scanHistory: [],

  // Actions
  // Set selected image for scanning
  setSelectedImage: (file, preview) => {
    try {
      validateImageFile(file);
      set({ 
        selectedImage: file, 
        imagePreview: preview, 
        error: null 
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear selected image
  clearSelectedImage: () => {
    set({ 
      selectedImage: null, 
      imagePreview: null, 
      error: null 
    });
  },

  // Scan the selected image
  scanImage: async () => {
    const { selectedImage } = get();
    
    if (!selectedImage) {
      const error = 'No image selected for scanning';
      set({ error });
      throw new Error(error);
    }

    set({ isScanning: true, error: null });
    
    try {
      const result = await scanSampleImage(selectedImage);
      
      // Add to scan history
      const newScan = {
        id: Date.now(),
        image: selectedImage,
        imagePreview: get().imagePreview,
        result,
        timestamp: new Date().toISOString(),
        fileName: selectedImage.name,
        description: `Analysis: ${result.response || 'Unknown'} (${result.ratio ? (result.ratio * 100).toFixed(1) + '%' : 'N/A'})`
      };

      set(state => ({
        scanResult: result,
        isScanning: false,
        scanHistory: [newScan, ...state.scanHistory.slice(0, 9)] // Keep last 10 scans
      }));

      return result;
    } catch (error) {
      set({ 
        isScanning: false, 
        error: error.message 
      });
      throw error;
    }
  },

  // Clear scan result
  clearScanResult: () => {
    set({ scanResult: null });
  },

  // Clear scan history
  clearScanHistory: () => {
    set({ scanHistory: [] });
  },

  // Remove specific scan from history
  removeScanFromHistory: (scanId) => {
    set(state => ({
      scanHistory: state.scanHistory.filter(scan => scan.id !== scanId)
    }));
  },

  // Clear all errors
  clearError: () => {
    set({ error: null });
  },

  // Reset entire store
  reset: () => {
    set({
      scanResult: null,
      selectedImage: null,
      imagePreview: null,
      isScanning: false,
      error: null,
      scanHistory: []
    });
  }
}));

export default useMLStore;
