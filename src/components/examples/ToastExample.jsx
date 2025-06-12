import React from "react";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";

const ExampleComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess("Operation completed successfully!");
  };

  const handleError = () => {
    showError("Something went wrong. Please try again.");
  };

  const handleWarning = () => {
    showWarning("Please be aware of this important information.");
  };

  const handleInfo = () => {
    showInfo("Here is some useful information for you.");
  };

  const handleCustomDuration = () => {
    // Custom duration (10 seconds instead of default 5)
    showSuccess("This notification will stay for 10 seconds!", 10000);
  };

  const handlePersistent = () => {
    // Persistent notification (duration = 0 means it won't auto-dismiss)
    showError("This notification will stay until manually dismissed.", 0);
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Toast Notification Examples</h2>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleSuccess} variant="outline">
          Show Success
        </Button>

        <Button onClick={handleError} variant="outline">
          Show Error
        </Button>

        <Button onClick={handleWarning} variant="outline">
          Show Warning
        </Button>

        <Button onClick={handleInfo} variant="outline">
          Show Info
        </Button>

        <Button onClick={handleCustomDuration} variant="outline">
          Custom Duration (10s)
        </Button>

        <Button onClick={handlePersistent} variant="outline">
          Persistent Notification
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Usage:</h3>
        <pre className="text-sm">
          {`import { useToast } from '../hooks/useToast';

const { showSuccess, showError, showWarning, showInfo } = useToast();

// Basic usage
showSuccess('Success message');
showError('Error message');
showWarning('Warning message');
showInfo('Info message');

// With custom duration (in milliseconds)
showSuccess('Custom duration message', 10000);

// Persistent (won't auto-dismiss)
showError('Persistent message', 0);`}
        </pre>
      </div>
    </div>
  );
};

export default ExampleComponent;

