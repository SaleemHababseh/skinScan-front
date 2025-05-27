import { delay } from '../utils';

// Mock skin images
const mockSkinImages = [
  {
    id: '1',
    patientId: '1',
    imageUrl: '',
    uploadDate: '2024-05-10T14:30:00Z',
    bodyPart: 'Arm',
    concernDescription: 'Red rash that appeared 3 days ago',
    diagnosisStatus: 'completed'
  },
  {
    id: '2',
    patientId: '1',
    imageUrl: '',
    uploadDate: '2024-04-25T09:15:00Z',
    bodyPart: 'Face',
    concernDescription: 'Dark spot growing in size',
    diagnosisStatus: 'completed'
  }
];

// Mock analysis results
const mockAnalysisResults = {
  '1': {
    imageId: '1',
    aiDiagnosis: 'Eczema (78% confidence)',
    possibleConditions: [
      { name: 'Eczema', probability: 0.78 },
      { name: 'Contact Dermatitis', probability: 0.15 },
      { name: 'Psoriasis', probability: 0.07 }
    ],
    recommendedActions: [
      'Apply hydrocortisone cream',
      'Avoid scratching the affected area',
      'Consult with a dermatologist for proper treatment'
    ],
    severity: 'Moderate',
    analysisDate: '2024-05-10T14:35:00Z'
  },
  '2': {
    imageId: '2',
    aiDiagnosis: 'Benign melanocytic nevus (95% confidence)',
    possibleConditions: [
      { name: 'Benign melanocytic nevus', probability: 0.95 },
      { name: 'Seborrheic keratosis', probability: 0.04 },
      { name: 'Melanoma', probability: 0.01 }
    ],
    recommendedActions: [
      'Monitor for changes in size, shape, or color',
      'Regular skin examinations are recommended',
      'Use sunscreen to prevent further sun damage'
    ],
    severity: 'Low',
    analysisDate: '2024-04-25T09:20:00Z'
  }
};

// Mock appointments
const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    dateTime: '2024-05-20T10:00:00Z',
    status: 'confirmed',
    imageId: '1',
    notes: 'Follow-up for eczema diagnosis',
    createdAt: '2024-05-11T08:30:00Z'
  }
];

// Get all patient skin images
export const getPatientImages = async (patientId) => {
  await delay(800);
  return mockSkinImages.filter(image => image.patientId === patientId);
};

// Upload skin image
export const uploadSkinImage = async (imageFile, patientId) => {
  await delay(1500); // Simulate upload time
  
  const newImageId = String(mockSkinImages.length + 1);
  
  // In a real app, this would upload to a server and return the URL
  // Here we're just using the File object's name and a mock URL
  const newImage = {
    id: newImageId,
    patientId,
    imageUrl: 'https://images.pexels.com/photos/4047418/pexels-photo-4047418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    uploadDate: new Date().toISOString(),
    bodyPart: imageFile.bodyPart || 'Unknown',
    concernDescription: imageFile.concernDescription || '',
    diagnosisStatus: 'processing'
  };
  
  mockSkinImages.push(newImage);
  
  return newImage;
};

// Get skin analysis based on image
export const getSkinAnalysis = async (imageId) => {
  await delay(2000); // Simulate AI processing time
  
  // Return existing analysis or create a mock one
  if (mockAnalysisResults[imageId]) {
    return mockAnalysisResults[imageId];
  }
  
  // Create a new mock analysis
  const newAnalysis = {
    imageId,
    aiDiagnosis: 'Atopic Dermatitis (85% confidence)',
    possibleConditions: [
      { name: 'Atopic Dermatitis', probability: 0.85 },
      { name: 'Contact Dermatitis', probability: 0.10 },
      { name: 'Psoriasis', probability: 0.05 }
    ],
    recommendedActions: [
      'Keep the area moisturized',
      'Avoid potential irritants',
      'Consult with a dermatologist for prescription treatment'
    ],
    severity: 'Moderate',
    analysisDate: new Date().toISOString()
  };
  
  mockAnalysisResults[imageId] = newAnalysis;
  
  // Update the image status
  const image = mockSkinImages.find(img => img.id === imageId);
  if (image) {
    image.diagnosisStatus = 'completed';
  }
  
  return newAnalysis;
};

// Book appointment
export const bookAppointment = async (appointmentData) => {
  await delay(1000);
  
  const newAppointment = {
    id: String(mockAppointments.length + 1),
    ...appointmentData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockAppointments.push(newAppointment);
  
  return newAppointment;
};

// Get patient appointments
export const getPatientAppointments = async (patientId) => {
  await delay(800);
  return mockAppointments.filter(apt => apt.patientId === patientId);
};