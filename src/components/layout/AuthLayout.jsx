import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const AuthLayout = ({ children, title, subtitle, type = 'login' }) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M6 11a4 4 0 0 1 4-4c2 0 4 3 8 3a4 4 0 0 0 4-4" />
                <path d="M6 21a4 4 0 0 1 4-4c2 0 4 3 8 3a4 4 0 0 0 4-4" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Skin<span className="text-primary-500">Scan</span></span>
          </Link>
        </div>
        
        <div className="mt-6">
          <div className="bg-white px-6 py-8 shadow-md dark:bg-neutral-800 sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
              {subtitle && (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {subtitle}
                </p>
              )}
            </div>
            
            {children}
            
            <div className="mt-6 text-center text-sm">
              {type === 'login' ? (
                <p className="text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
                    Sign up
                  </Link>
                </p>
              ) : (
                <p className="text-neutral-600 dark:text-neutral-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;