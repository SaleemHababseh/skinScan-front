import React from 'react';
import  Button  from './Button';

const AuthErrorDisplay = ({ 
  error, 
  onRetry, 
  onGoToLogin, 
  className = "" 
}) => {
  if (!error) return null;

  const getErrorIcon = () => {
    if (error.includes('Network') || error.includes('connection')) {
      return (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      );
    }
    
    if (error.includes('expired') || error.includes('session')) {
      return (
        <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  const getErrorTitle = () => {
    if (error.includes('Network') || error.includes('connection')) {
      return "Connection Problem";
    }
    
    if (error.includes('expired') || error.includes('session')) {
      return "Session Expired";
    }
    
    if (error.includes('Invalid') || error.includes('password')) {
      return "Authentication Failed";
    }
    
    return "Error";
  };

  const shouldShowRetry = () => {
    return error.includes('Network') || 
           error.includes('Server error') || 
           error.includes('try again');
  };

  const shouldShowLoginButton = () => {
    return error.includes('expired') || 
           error.includes('session') || 
           error.includes('log in again');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto ${className}`}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getErrorIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {getErrorTitle()}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {error}
        </p>
        
        <div className="flex gap-2 justify-center">
          {shouldShowRetry() && onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          )}
          
          {shouldShowLoginButton() && onGoToLogin && (
            <Button 
              onClick={onGoToLogin}
              size="sm"
            >
              Go to Login
            </Button>
          )}
          
          {!shouldShowRetry() && !shouldShowLoginButton() && onGoToLogin && (
            <Button 
              onClick={onGoToLogin}
              size="sm"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthErrorDisplay;
