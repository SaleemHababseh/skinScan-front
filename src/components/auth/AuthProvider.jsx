import React, { useEffect } from 'react';
import useAuthStore from '../../store/auth-store';

const AuthProvider = ({ children }) => {
  const { initialize, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check for existing authentication on app load
    const initAuth = async () => {
      try {
        // First check local storage for existing auth
        const hasAuth = checkAuth();
        
        // If no local auth found, try to initialize from API
        if (!hasAuth) {
          await initialize();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };

    initAuth();
  }, [initialize, checkAuth]);

  return <>{children}</>;
};

export default AuthProvider;
