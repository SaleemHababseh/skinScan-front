import React from 'react';
import { useToast } from '../../hooks/useToast';

const Toast = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastStyles = (type) => {
    const baseStyles = "rounded-md p-4 shadow-lg transition-all duration-300 border";
    const typeStyles = {
      success: "bg-success-50 border-success-200",
      error: "bg-error-50 border-error-200",
      warning: "bg-warning-50 border-warning-200",
      info: "bg-info-50 border-info-200"
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  const getIconStyles = (type) => {
    const iconStyles = {
      success: "text-success-600",
      error: "text-error-600",
      warning: "text-warning-600",
      info: "text-info-600"
    };
    return iconStyles[type] || iconStyles.info;
  };

  const getTextStyles = (type) => {
    const textStyles = {
      success: "text-success-800",
      error: "text-error-800",
      warning: "text-warning-800",
      info: "text-info-800"
    };
    return textStyles[type] || textStyles.info;
  };

  const getButtonStyles = (type) => {
    const buttonStyles = {
      success: "text-success-500 hover:bg-success-100 focus:ring-success-600",
      error: "text-error-500 hover:bg-error-100 focus:ring-error-600",
      warning: "text-warning-500 hover:bg-warning-100 focus:ring-warning-600",
      info: "text-info-500 hover:bg-info-100 focus:ring-info-600"
    };
    return buttonStyles[type] || buttonStyles.info;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles(toast.type)}>
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${getIconStyles(toast.type)}`}>
          {getIcon(toast.type)}
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${getTextStyles(toast.type)}`}>
            {toast.message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => removeToast(toast.id)}
            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonStyles(toast.type)}`}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
