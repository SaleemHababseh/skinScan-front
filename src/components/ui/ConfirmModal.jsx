import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import { createPortal } from "react-dom";
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
  isLoading = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "text-error-600 dark:text-error-400";
      case "info":
        return "text-info-600 dark:text-info-400";
      case "warning":
      default:
        return "text-warning-600 dark:text-warning-400";
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case "danger":
        return "bg-error-100 dark:bg-error-900/30";
      case "info":
        return "bg-info-100 dark:bg-info-900/30";
      case "warning":
      default:
        return "bg-warning-100 dark:bg-warning-900/30";
    }
  };

  return document.body ? (
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 m-0">
        <Card className="w-full max-w-md">
          <div className="flex items-start space-x-4">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getIconBackground()}`}
            >
              <AlertTriangle className={`h-6 w-6 ${getIconColor()}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                  disabled={isLoading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={type === "danger" ? "destructive" : "primary"}
              onClick={onConfirm}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>,
      document.body
    )
  ) : null;
};

export default ConfirmModal;

