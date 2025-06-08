import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, AlertCircle, Brain, CheckCircle, Camera, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useMLStore from '../../store/ml-store';
import { fileToBase64 } from '../../api/ml';

// Helper function to get user-friendly classification names
const getClassificationDisplay = (classification) => {
  const classificationMap = {
    'bcc': 'Basal Cell Carcinoma (BCC)',
    'mel': 'Melanoma',
    'nv': 'Nevus (Mole)',
    'bkl': 'Benign Keratosis-like Lesion',
    'akiec': 'Actinic Keratosis',
    'vasc': 'Vascular Lesion',
    'df': 'Dermatofibroma'
  };
  
  return classificationMap[classification?.toLowerCase()] || classification?.toUpperCase() || 'Unknown';
};

const DoctorUpload = () => {
  const { 
    selectedImage,
    imagePreview,
    scanResult,
    isScanning,
    error,
    scanHistory,
    setSelectedImage,
    scanImage,
    clearSelectedImage,
    clearScanResult,
    clearError
  } = useMLStore();
  const navigate = useNavigate();
    const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      try {
        // Convert file to base64 for preview
        const preview = await fileToBase64(file);
        setSelectedImage(file, preview);
        clearError();
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  }, [setSelectedImage, clearError]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });
  
  const handleScanImage = async () => {
    if (!selectedImage) {
      return;
    }
    
    try {
      await scanImage();
    } catch (error) {
      console.error('Error scanning image:', error);
    }
  };
  
  const handleNewUpload = () => {
    clearSelectedImage();
    clearScanResult();
  };
  
  const handleBookAppointment = () => {
    // Navigate to appointment booking with pre-filled analysis data
    navigate('/doctor/appointments', { state: { scanResult } });
  };
    return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload Skin Image</h1>
      
      {scanResult ? (
        <div className="space-y-6 animate-fade-in">
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={imagePreview}
                  alt="Uploaded skin"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                  <span className="px-3 py-1 rounded-full bg-success-50 text-success-500 text-sm dark:bg-success-900/30">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Completed
                  </span>
                </div>                <div className="mb-6">
                  <h3 className="font-medium mb-2">ML Analysis Result</h3>
                  <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Classification:</span>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                          {getClassificationDisplay(scanResult.response)}
                        </p>
                      </div>
                      {scanResult.ratio && (
                        <div>
                          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Confidence Level:</span>
                          <div className="mt-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{(scanResult.ratio * 100).toFixed(1)}%</span>
                              <span className={`font-medium ${
                                scanResult.ratio >= 0.8 ? 'text-success-600' : 
                                scanResult.ratio >= 0.6 ? 'text-warning-600' : 
                                'text-error-600'
                              }`}>
                                {scanResult.ratio >= 0.8 ? 'High' : 
                                 scanResult.ratio >= 0.6 ? 'Medium' : 'Low'}
                              </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2 dark:bg-neutral-700">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  scanResult.ratio >= 0.8 ? 'bg-success-500' : 
                                  scanResult.ratio >= 0.6 ? 'bg-warning-500' : 
                                  'bg-error-500'
                                }`}
                                style={{ width: `${(scanResult.ratio * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
      ) : (        <div className="space-y-6">
          <Card>
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Skin Image</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
                      : 'border-neutral-300 dark:border-neutral-700'
                  } ${imagePreview ? 'bg-neutral-50 dark:bg-neutral-800' : ''}`}
                >
                  <input {...getInputProps()} />
                  
                  {imagePreview ? (
                    <div className="relative mx-auto max-w-xs">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto max-h-48 rounded-lg object-contain" 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSelectedImage();
                        }}
                        className="absolute -right-2 -top-2 rounded-full bg-error-500 p-1 text-white hover:bg-error-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-12 w-12 text-neutral-400 mb-3" />
                      <p className="text-base">
                        Drag and drop an image, or <span className="text-primary-500">browse</span>
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 dark:text-neutral-400">
                        Supported formats: JPEG, PNG, WebP (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
                
                {error && (
                  <p className="mt-2 text-sm text-error-500">{error}</p>
                )}
              </div>
              
              {/* Scan Button */}
              {selectedImage && (
                <div>
                  <Button
                    onClick={handleScanImage}
                    className="w-full"
                    isLoading={isScanning}
                    disabled={!selectedImage || isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
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

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <Card>
              <h3 className="font-medium mb-4">Recent Scans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                {scanHistory.slice(0, 6).map((scan) => (
                  <div key={scan.id} className="border rounded-lg p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                    <img 
                      src={scan.imagePreview} 
                      alt={scan.fileName}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <p className="text-sm font-medium truncate">{scan.fileName}</p>
                    <p className="text-xs text-neutral-500 mb-1">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </p>
                    {scan.result && (
                      <div className="text-xs space-y-1">                        <p className="text-neutral-600 dark:text-neutral-400">
                          <span className="font-medium">Result:</span> {getClassificationDisplay(scan.result.response)}
                        </p>
                        {scan.result.ratio && (
                          <p className="text-neutral-600 dark:text-neutral-400">
                            <span className="font-medium">Confidence:</span> {(scan.result.ratio * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorUpload;
