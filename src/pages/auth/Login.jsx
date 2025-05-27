import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, error, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    if (error) clearError();
  };
  
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const user = await login(formData.email, formData.password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo account logins
  const loginAsDemoAccount = async (role) => {
    setIsLoading(true);
    
    let email = '';
    let password = 'password123';
    
    switch (role) {
      case 'patient':
        email = 'patient@example.com';
        break;
      case 'doctor':
        email = 'doctor@example.com';
        break;
      case 'admin':
        email = 'admin@example.com';
        break;
      default:
        email = 'patient@example.com';
    }
    
    try {
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Log in to your account to continue"
      type="login"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-error-50 p-4 dark:bg-error-900/30">
            <p className="text-sm text-error-500 dark:text-error-400">{error}</p>
          </div>
        )}
        
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              autoComplete="email"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Password
          </label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-primary-500 hover:text-primary-600">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Log in
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => loginAsDemoAccount('patient')}
            disabled={isLoading}
          >
            Patient Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => loginAsDemoAccount('doctor')}
            disabled={isLoading}
          >
            Doctor Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => loginAsDemoAccount('admin')}
            disabled={isLoading}
          >
            Admin Demo
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;