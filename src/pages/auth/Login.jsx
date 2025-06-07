import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import useAuthStore from "../../store/auth-store";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { login, error, clearError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const registrationMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) clearError();
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
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

      // Navigate based on user role
      const roleDashboards = {
        patient: "/patient/dashboard",
        doctor: "/doctor/dashboard",
        admin: "/admin/dashboard",
      };

      const destination = roleDashboards[user.role] || "/patient/dashboard";
      navigate(destination);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };  return (
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
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Welcome back</h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Log in to your account to continue
              </p>
            </div>

      <form onSubmit={handleSubmit} className="space-y-6">{" "}
        {registrationMessage && (
          <div className="rounded-md bg-success-50 p-4 dark:bg-success-900/30">
            <p className="text-sm text-success-600 dark:text-success-400">
              {registrationMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-error-50 p-4 dark:bg-error-900/30">
            <p className="text-sm text-error-500 dark:text-error-400">
              {error}
            </p>
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
        </div>        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot your password?
            </Link>
          </div>
        </div><div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Log in
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-neutral-600 dark:text-neutral-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
            Sign up
          </Link>
        </p>
      </div>
      
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
