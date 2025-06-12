import React, { useState, useEffect, useCallback } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ReportModal = ({ isOpen, onClose, onSubmit, systemReportsOnly = false }) => {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const reportTypes = [
    { value: "abuse", label: "Abuse/Harassment", category: "user" },
    { value: "spam", label: "Spam", category: "user" },
    { value: "Application_Error", label: "Application Error", category: "system" },
    { value: "terms_violation", label: "Terms Violation", category: "system" },
    { value: "other", label: "Other", category: "system" },
  ];

  // Filter report types based on systemReportsOnly prop
  const availableReportTypes = systemReportsOnly 
    ? reportTypes.filter(type => type.category === "system")
    : reportTypes;

  const resetForm = () => {
    setReportType("");
    setDescription("");
    setError("");
    setShowSuccess(false);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!reportType || !description.trim()) {
      setError("Please select a report type and provide a description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSubmit(reportType, description);
      setShowSuccess(true);
      
      // Auto-close after showing success message
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Report submission error:', error);
      setError(error.message || "Failed to submit report. Please try again.");
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
      resetForm();
    }
  }, [isLoading, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            {showSuccess ? "Report Submitted" : "Report Issue"}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {showSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-900 mb-2">
              Report Submitted Successfully
            </h4>
            <p className="text-sm text-neutral-600">
              Thank you for your feedback. We'll review your report and take appropriate action.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select a reason</option>
                  {systemReportsOnly ? (
                    // For system reports only (navbar), show only system issues
                    availableReportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))
                  ) : (
                    // For chat reports, show grouped options
                    <>
                      <optgroup label="User Issues">
                        {reportTypes.filter(type => type.category === "user").map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Application Issues">
                        {reportTypes.filter(type => type.category === "system").map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </optgroup>
                    </>
                  )}
                </select>
                {reportType && !systemReportsOnly && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {reportTypes.find(type => type.value === reportType)?.category === "user" 
                      ? "This report relates to the user you're chatting with"
                      : "This report relates to the application or general issues"
                    }
                  </p>
                )}
                {reportType && systemReportsOnly && (
                  <p className="text-xs text-neutral-500 mt-1">
                    This report relates to the application or general issues
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about the issue..."
                  rows={4}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-neutral-900 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  maxLength={500}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reportType || !description.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;

