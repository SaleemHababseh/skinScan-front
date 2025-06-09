import React, { useState, useEffect, useCallback } from 'react';
import { Upload, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { uploadCV } from '../../api/users/uploadCV';
import { getDoctorAcceptationResult } from '../../api/users/getDoctorAcceptationResult';
import { useToast } from '../../hooks/useToast';
import useAuthStore from '../../store/auth-store';

const DoctorCVSection = () => {
  const { user, token } = useAuthStore();
  const { showSuccess, showError } = useToast();
  
  const [selectedCV, setSelectedCV] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [acceptationStatus, setAcceptationStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const fetchAcceptationStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const result = await getDoctorAcceptationResult(token);
      setAcceptationStatus(result);
    } catch (error) {
      console.error('Error fetching acceptation status:', error);
      // Don't show error toast here as this might be expected for new doctors
    } finally {
      setIsLoadingStatus(false);
    }
  }, [token]);

  useEffect(() => {
    if (user?.role === 'doctor' && token) {
      fetchAcceptationStatus();
    }
  }, [user?.role, token, fetchAcceptationStatus]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        showError('Please select a PDF file');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }
      
      setSelectedCV(file);
    }
  };

  const handleUploadCV = async () => {
    if (!selectedCV || !token) return;

    setIsUploading(true);
    try {
      await uploadCV(selectedCV, token);
      showSuccess('CV uploaded successfully! Your application is under review.');
      setSelectedCV(null);
      // Reset file input
      const fileInput = document.getElementById('cv-upload');
      if (fileInput) fileInput.value = '';
      
      // Refresh acceptation status
      await fetchAcceptationStatus();
    } catch (error) {
      showError(error.message || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoadingStatus) return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    
    if (!acceptationStatus) return <Upload className="h-5 w-5 text-blue-500" />;
    
    switch (acceptationStatus.status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'false':
      case false:
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    if (isLoadingStatus) return 'Loading status...';
    
    if (!acceptationStatus) return 'If you have submitted your CV, please wait for review. If not, please submit your CV below.';
    
    switch (acceptationStatus.status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return 'Your doctor application has been approved!';
      case 'rejected':
      case 'denied':
        return 'Your application was not accepted. Please contact support or submit a new CV.';
      case 'pending':
      case 'under_review':
        return 'Your CV has been submitted and is under review. Please wait for approval.';
      case 'false':
      case false:
        return 'You are not accepted yet. If you have submitted your CV, please wait for the review process to complete.';
      default:
        return 'Your doctor application is under review. Please wait for approval.';
    }
  };

  const getStatusColor = () => {
    if (isLoadingStatus) return 'text-gray-600 dark:text-gray-400';
    
    if (!acceptationStatus) return 'text-blue-600 dark:text-blue-400';
    
    switch (acceptationStatus.status?.toLowerCase()) {
      case 'accepted':
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'rejected':
      case 'denied':
        return 'text-red-600 dark:text-red-400';
      case 'pending':
      case 'under_review':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'false':
      case false:
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  // Only show this section for doctors
  if (user?.role !== 'doctor') {
    return null;
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Doctor Verification
          </h3>
        </div>

        {/* Acceptation Status */}
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon()}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              Verification Status
            </span>
          </div>
          <p className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          
          {acceptationStatus?.message && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              <strong>Note:</strong> {acceptationStatus.message}
            </p>
          )}
          
          {/* Additional guidance based on status */}
          {!acceptationStatus && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              💡 You can submit or resubmit your CV using the upload section below.
            </p>
          )}
          
          {acceptationStatus && (acceptationStatus.status === false || acceptationStatus.status === 'false') && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              ⏳ If you have recently submitted your CV, please allow 2-3 business days for review.
            </p>
          )}
        </div>

        {/* CV Upload Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Upload CV (PDF only)
            </label>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
              Please upload your CV to verify your medical credentials. Maximum file size: 10MB.
            </p>
            
            <div className="flex flex-col space-y-3">
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="block w-full text-sm text-neutral-500 dark:text-neutral-400
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                         file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700
                         hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300
                         dark:hover:file:bg-primary-800"
              />
              
              {selectedCV && (
                <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-sm text-primary-700 dark:text-primary-300">
                      {selectedCV.name}
                    </span>
                    <span className="text-xs text-primary-600 dark:text-primary-400">
                      ({(selectedCV.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={handleUploadCV}
                    disabled={isUploading}
                    className="ml-3"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Information about the verification process */}
          <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
            <p className="font-medium mb-1">Verification Process:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upload your CV with medical credentials and experience</li>
              <li>Our team will review your application within 2-3 business days</li>
              <li>You'll be able to start consulting with patients after approval</li>
              <li>You can check your verification status on this page</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DoctorCVSection;
