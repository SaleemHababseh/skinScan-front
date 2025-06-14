import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Calendar,
  Users,
  FileText,
  UserPlus,
  HelpCircle,
  Clipboard,
  Grid,
  Activity,
  User,
  BarChart,
  Upload
} from 'lucide-react';
import useAuthStore from '../../store/auth-store';
import Navbar from './Navbar';
import Footer from './Footer';

const DashboardLayout = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();
  const [initialAuthCheck, setInitialAuthCheck] = useState(true);
  
  useEffect(() => {
    // Only show loading for initial auth check, not subsequent API calls
    const timer = setTimeout(() => {
      setInitialAuthCheck(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle loading state only for initial authentication check
  if (initialAuthCheck && isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const getSidebarLinks = () => {
    if (user?.role === 'patient') {
      return [
        { name: 'Dashboard', href: '/patient/dashboard', icon: Home },
        { name: 'My Diagnoses', href: '/patient/diagnoses', icon: FileText },
        { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
        { name: 'Upload Image', href: '/patient/upload', icon: Clipboard },
        { name: 'Medical News', href: '/news', icon: Activity },
        { name: 'Profile', href: '/profile', icon: User },
      ];
    }    if (user?.role === 'doctor') {
      return [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: Home },
        { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
        { name: 'Diagnoses', href: '/doctor/diagnoses', icon: FileText },
        { name: 'Upload Image', href: '/doctor/upload', icon: Upload },
        { name: 'News', href: '/news', icon: Activity },
        { name: 'Profile', href: '/profile', icon: User },
      ];
    }if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'New Doctors', href: '/admin/new-doctors', icon: UserPlus },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
      ];
    }
    
    return [];
  };
    const sidebarLinks = getSidebarLinks();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 bg-neutral-100">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 mt-16 hidden w-64 transform overflow-y-auto border-r border-neutral-200 bg-white pt-5 transition-all md:block">
          <div className="space-y-1 px-2">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-500'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-neutral-500 group-hover:text-neutral-700'
                  }`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </aside>
        
        {/* Mobile menu */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-2 md:hidden">
          {sidebarLinks.slice(0, 5).map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-neutral-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{link.name}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Main content */}
        <div className="ml-0 flex flex-1 flex-col md:ml-64">
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;