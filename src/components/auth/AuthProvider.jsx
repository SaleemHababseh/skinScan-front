import React, { useEffect } from 'react';
import useAuthStore from '../../store/auth-store';

const AuthProvider = ({ children }) => {
  const { refreshToken, isAuthenticated} = useAuthStore();

  useEffect(() => {
    // Check for existing authentication on app load
    const initAuth = async () => {
      try {
        // Check if user is already authenticated
        if (!isAuthenticated) {
          // Try to refresh token to restore authentication state
          await refreshToken();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Error is already handled in the store, so we don't need to do anything else
      }
    };

    initAuth();
  }, [refreshToken, isAuthenticated]);

  // Show loading spinner during authentication initialization
  if (false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
