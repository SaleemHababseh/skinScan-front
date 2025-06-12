import React, { useEffect, useState } from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import { createPortal } from "react-dom";

const ErrorModal = ({
  isOpen,
  onClose,
  onRetry,
  title = "Error",
  message,
  error,
  showRetry = false,
  retryText = "Try Again",
  closeText = "Close",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return document.body ? (
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-md">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-error-100">
              <AlertCircle className="h-6 w-6 text-error-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {message}
              </p>
              {error && (
                <div className="mt-3 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-md">
                  <p className="text-xs text-error-700 dark:text-error-300 font-mono">
                    {typeof error === 'string' ? error : error.message || 'Unknown error occurred'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              {closeText}
            </Button>
            {showRetry && onRetry && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="bg-error-600 hover:bg-error-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryText}
              </Button>
            )}
          </div>
        </Card>
      </div>,
      document.body
    )
  ) : null;
};

export default ErrorModal;
