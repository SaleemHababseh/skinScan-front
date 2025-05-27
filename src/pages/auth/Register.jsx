import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/auth-store';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, error, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const validateFinalForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && validateEmail()) {
      setStep(2);
    } else if (step === 2 && validateCode()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFinalForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'patient'
      };
      await register(userData);
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start managing your skin health"
      type="register"
    >
      <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
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
                placeholder="Enter the code sent to your email"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">First Name</label>
                <div className="mt-1">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={formErrors.firstName}
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Last Name</label>
                <div className="mt-1">
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={formErrors.lastName}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirm Password</label>
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
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {step === 3 ? 'Create Account' : step === 2 ? 'Verify Code' : 'Next'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
