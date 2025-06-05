import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code verification, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    sendForgetPasswordCode, 
    validateVerificationCode,
    error, 
    clearError 
  } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    if (error) clearError();
  };

  const validateEmail = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateCode = () => {
    let errors = {};
    let isValid = true;

    if (!formData.verificationCode.trim()) {
      errors.verificationCode = 'Verification code is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validatePassword = () => {
    let errors = {};
    let isValid = true;

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await sendForgetPasswordCode(formData.email);
      setStep(2);
    } catch (err) {
      console.error('Failed to send reset code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!validateCode()) return;

    setIsLoading(true);
    try {
      await validateVerificationCode(formData.email, formData.verificationCode);
      setStep(3);
    } catch (err) {
      console.error('Failed to verify code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Note: You'll need to implement the actual password reset API call
      // This is just a placeholder for the UI flow
      console.log('Resetting password with:', {
        email: formData.email,
        code: formData.verificationCode,
        newPassword: formData.newPassword
      });
      
      alert('Password reset successful! Please login with your new password.');
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Failed to reset password:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmitHandler = () => {
    switch (step) {
      case 1: return handleSendCode;
      case 2: return handleVerifyCode;
      case 3: return handleResetPassword;
      default: return handleSendCode;
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 1: return 'Send Reset Code';
      case 2: return 'Verify Code';
      case 3: return 'Reset Password';
      default: return 'Send Reset Code';
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1: return 'Forgot your password?';
      case 2: return 'Enter verification code';
      case 3: return 'Set new password';
      default: return 'Forgot your password?';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 1: return 'Enter your email address and we\'ll send you a code to reset your password.';
      case 2: return 'Enter the verification code sent to your email.';
      case 3: return 'Enter your new password below.';
      default: return 'Enter your email address and we\'ll send you a code to reset your password.';
    }
  };

  return (
    <AuthLayout 
      title={getTitle()} 
      subtitle={getSubtitle()}
      type="forgot-password"
    >
      <form onSubmit={getSubmitHandler()} className="space-y-6">
        {error && (
          <div className="rounded-md bg-error-50 p-4 dark:bg-error-900/30">
            <p className="text-sm text-error-500 dark:text-error-400">{error}</p>
          </div>
        )}

        {step === 1 && (
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
        )}

        {step === 2 && (
          <div>
            <label 
              htmlFor="verificationCode" 
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Verification Code
            </label>
            <div className="mt-1">
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                value={formData.verificationCode}
                onChange={handleChange}
                error={formErrors.verificationCode}
                placeholder="Enter the code from your email"
                required
              />
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Code sent to: {formData.email}
            </p>
          </div>
        )}

        {step === 3 && (
          <>
            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                New Password
              </label>
              <div className="mt-1">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={formErrors.newPassword}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            {getButtonText()}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Remember your password?{' '}
            <Link 
              to="/auth/login" 
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
