import React from 'react';
import { Loader2 } from 'lucide-react';
import Button from './Button';

const LoadingButton = ({ 
  isLoading = false, 
  children, 
  loadingText = 'Loading...', 
  ...props 
}) => {
  return (
    <Button 
      disabled={isLoading || props.disabled} 
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton;
