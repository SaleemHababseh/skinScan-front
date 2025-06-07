import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/auth-store";

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

  useEffect(() => {
    const attemptTokenRefresh = async () => {
      // Only attempt refresh if we have a token and it's expired
      if (token && isTokenExpired(token) && !refreshAttempted) {
        setIsRefreshing(true);
        setRefreshAttempted(true);
        
        try {
          await refreshToken();
          console.log("Token refreshed successfully");
        } catch (error) {
          console.error("Failed to refresh token:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    attemptTokenRefresh();
  }, [token, refreshToken, refreshAttempted]);

  // Show loading while refreshing token
  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

