import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import useAuthStore from '../../store/auth-store';
import usePatientStore from '../../store/patient-store';

const BODY_PARTS = [
  'Face', 'Scalp', 'Neck', 'Chest', 'Back', 'Arms', 
  'Hands', 'Abdomen', 'Legs', 'Feet', 'Other'
];

const PatientUpload = () => {
  const { user } = useAuthStore();
  const { uploadImage, isLoading, error, clearError } = usePatientStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bodyPart: '',
    concernDescription: '',
    otherBodyPart: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError('');
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setUploadError('Please upload an image');
      return;
    }
    
    if (!formData.bodyPart) {
      setUploadError('Please select a body part');
      return;
    }
    
    const bodyPart = formData.bodyPart === 'Other' ? formData.otherBodyPart : formData.bodyPart;
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Create a file object with additional properties
      const fileWithMetadata = {
        ...imageFile,
        bodyPart,
        concernDescription: formData.concernDescription
      };
      
      // Upload the image and get analysis
      setIsAnalyzing(true);
      const result = await uploadImage(fileWithMetadata, user.id);
      
      // Complete the progress bar
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      // Show the analysis result
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadError('Failed to upload image: ' + error.message);
      setIsAnalyzing(false);
    }
  };
  
  const handleNewUpload = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    setFormData({
      bodyPart: '',
      concernDescription: '',
      otherBodyPart: '',
    });
  };
  
  const handleBookAppointment = () => {
    // Navigate to appointment booking with pre-filled analysis data
    navigate('/patient/appointments', { state: { analysisResult } });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Skin Image</h1>
      
      {analysisResult ? (
        <div className="space-y-6 animate-fade-in">
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={previewUrl}
                  alt="Uploaded skin"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                  <span className="px-3 py-1 rounded-full bg-success-50 text-success-500 text-sm dark:bg-success-900/30">Completed</span>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">AI Diagnosis</h3>
                  <p className="text-lg font-semibold">{analysisResult.aiDiagnosis}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Possible Conditions</h3>
                  <div className="space-y-2">
                    {analysisResult.possibleConditions.map((condition, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{condition.name}</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-neutral-200 rounded-full mr-2 dark:bg-neutral-700">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${condition.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{(condition.probability * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Recommended Actions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.recommendedActions.map((action, index) => (
                      <li key={index} className="text-neutral-700 dark:text-neutral-300">{action}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Severity</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    analysisResult.severity === 'Low' 
                      ? 'bg-success-50 text-success-500 dark:bg-success-900/30' 
                      : analysisResult.severity === 'Moderate'
                      ? 'bg-warning-50 text-warning-500 dark:bg-warning-900/30'
                      : 'bg-error-50 text-error-500 dark:bg-error-900/30'
                  }`}>
                    {analysisResult.severity}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button 
                    onClick={handleBookAppointment}
                    className="flex-1"
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNewUpload}
                    className="flex-1"
                  >
                    Upload New Image
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <h3 className="font-medium mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-primary-500" />
              Disclaimer
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This AI analysis is for informational purposes only and does not constitute medical advice. 
              Please consult with a healthcare professional for proper diagnosis and treatment. 
              The accuracy of the analysis is not guaranteed and should be verified by a healthcare provider.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Skin Image</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                      : 'border-neutral-300 dark:border-neutral-700'
                  } ${previewUrl ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`}
                >
                  <input {...getInputProps()} />
                  
                  {previewUrl ? (
                    <div className="relative mx-auto max-w-xs">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="mx-auto max-h-48 rounded-lg object-contain" 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1 text-white hover:bg-error-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-12 w-12 text-neutral-400 mb-3" />
                      <p className="text-base">
                        Drag and drop an image, or <span className="text-primary-500">browse</span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 dark:text-neutral-400">
                        Supported formats: JPEG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                
                {uploadError && (
                  <p className="mt-2 text-sm text-error-500">{uploadError}</p>
                )}
              </div>
              
              {/* Form Fields */}
              <div>
                <label htmlFor="bodyPart" className="block text-sm font-medium mb-2">
                  Body Part
                </label>
                <select
                  id="bodyPart"
                  name="bodyPart"
                  value={formData.bodyPart}
                  onChange={handleChange}
                  className="input w-full"
                  required
                >
                  <option value="">Select body part</option>
                  {BODY_PARTS.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
                
                {formData.bodyPart === 'Other' && (
                  <div className="mt-3">
                    <label htmlFor="otherBodyPart" className="block text-sm font-medium mb-2">
                      Specify Body Part
                    </label>
                    <Input
                      id="otherBodyPart"
                      name="otherBodyPart"
                      value={formData.otherBodyPart}
                      onChange={handleChange}
                      placeholder="Please specify"
                      required={formData.bodyPart === 'Other'}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="concernDescription" className="block text-sm font-medium mb-2">
                  Describe Your Concern
                </label>
                <textarea
                  id="concernDescription"
                  name="concernDescription"
                  value={formData.concernDescription}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                  placeholder="Describe your skin concern, when it appeared, any symptoms, etc."
                  required
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing Image...' : 'Upload & Analyze'}
                </Button>
                
                {/* Upload Progress */}
                {(uploadProgress > 0 && uploadProgress < 100) && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Card>
          
          <Card className="bg-neutral-50 dark:bg-neutral-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <Image className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium">Image Guidelines</h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>Take a clear, well-lit photo of the affected area</li>
                  <li>Include the full area of concern and some surrounding skin</li>
                  <li>Avoid using filters or editing the image</li>
                  <li>Take multiple angles if possible</li>
                  <li>Place a common object next to the area for size reference (like a coin)</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientUpload;