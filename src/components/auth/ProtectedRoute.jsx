import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/auth-store";
import AuthErrorDisplay from "../ui/AuthErrorDisplay";

// Global refresh state to prevent multiple simultaneous refresh attempts
let globalRefreshPromise = null;
let globalRefreshInProgress = false;

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

const ProtectedRoute = ({
  children,
  requiredRole = null,
  redirectTo = "/auth/login",
}) => {
  const { isAuthenticated, user, token, refreshToken } = useAuthStore();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);
  const [authError, setAuthError] = useState(null);
  const tokenRef = useRef(token);
  
  // Track token changes to detect when refresh completes
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // Only attempt refresh if we have a token and it's expired and not already refreshing
      if (token && isTokenExpired(token) && !refreshAttempted && !globalRefreshInProgress) {
        globalRefreshInProgress = true;
        setIsRefreshing(true);
        setRefreshAttempted(true);
        setAuthError(null);
        
        try {
          // Create or reuse existing refresh promise to prevent duplicate requests
          if (!globalRefreshPromise) {
            globalRefreshPromise = refreshToken();
          }
          
          await globalRefreshPromise;
        } catch (error) {
          console.error("Token refresh failed:", error.message);
          setAuthError(error.shouldRedirectToLogin ? error.message : "Session expired. Please log in again.");
        } finally {
          setIsRefreshing(false);
          globalRefreshInProgress = false;
          globalRefreshPromise = null;
        }
      }
    };

    // Only attempt refresh if token hasn't changed recently (prevents re-triggering after successful refresh)
    const timeoutId = setTimeout(() => {
      if (tokenRef.current === token) {
        attemptTokenRefresh();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [token, refreshToken, refreshAttempted]);

  // Show loading while refreshing token
  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Refreshing session...</p>
        </div>
      </div>
    );
  }

  // Show auth error if refresh failed
  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AuthErrorDisplay
          error={authError}
          onRetry={() => {
            setAuthError(null);
            setRefreshAttempted(false);
          }}
          onGoToLogin={() => window.location.href = redirectTo}
        />
      </div>
    );
  }

  // Redirect to login if not authenticated (after refresh attempt)
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const roleDashboards = {
      patient: "/patient/dashboard",
      doctor: "/doctor/dashboard", 
      admin: "/admin/dashboard",
    };

    const userDashboard = roleDashboards[user.role] || "/";
    return <Navigate to={userDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;

