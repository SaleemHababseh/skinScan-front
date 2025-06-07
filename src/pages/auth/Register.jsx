import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import useAuthStore from "../../store/auth-store";
import { createUser } from "../../api/createuser";

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    age: "",
    sex: "",
    role: "patient",
  });
  const [formErrors, setFormErrors] = useState({});
  const { sendVerificationCode, validateVerificationCode, error, clearError } =
    useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) clearError();
  };

  const validateEmail = () => {
    let errors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateCode = () => {
    let errors = {};
    let isValid = true;

    if (!formData.verificationCode.trim()) {
      errors.verificationCode = "Verification code is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const validateFinalForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      isValid = false;
    }
    if (!formData.age || formData.age < 1) {
      errors.age = "Please enter a valid age";
      isValid = false;
    }
    if (!formData.sex) {
      errors.sex = "Please select your gender";
      isValid = false;
    }
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (step === 1 && validateEmail()) {
        // Send verification code
        await sendVerificationCode(formData.email);
        setStep(2);
      } else if (step === 2 && validateCode()) {
        // Validate verification code
        await validateVerificationCode(
          formData.email,
          formData.verificationCode
        );
        setStep(3);
      }
    } catch (err) {
      console.error("Step validation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFinalForm()) return;

    setIsLoading(true);
    try {
      // Register user
      await createUser({
        f_name: formData.firstName,
        l_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        age: parseInt(formData.age),
        hashed_password: formData.password,
        sex: formData.sex,
      }); // Navigate to login page after successful registration
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
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
            <span className="text-2xl font-bold">
              Skin<span className="text-primary-500">Scan</span>
            </span>
          </Link>
        </div>

        <div className="mt-6">
          <div className="bg-white px-6 py-8 shadow-md dark:bg-neutral-800 sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Sign up to start managing your skin health
              </p>
            </div>

            <form
              onSubmit={step === 3 ? handleSubmit : handleNext}
              className="space-y-5"
            >
              {error && (
                <div className="rounded-md bg-error-50 p-4 dark:bg-error-900/30">
                  <p className="text-sm text-error-500 dark:text-error-400">
                    {error}
                  </p>
                </div>
              )}
              {step === 3 && (
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
              {step === 1 && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        First Name
                      </label>
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
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Last Name
                      </label>
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Age
                      </label>
                      <div className="mt-1">
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          error={formErrors.age}
                          placeholder="25"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="sex"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="sex"
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.sex && (
                          <p className="mt-1 text-sm text-error-500">
                            {formErrors.sex}
                          </p>
                        )}
                      </div>
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
                      Confirm Password
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
                    <div className="mt-2 flex items-center">  
                      <input
                        type="checkbox"
                        name="role"
                        value="doctor"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.checked ? "doctor" : "patient",
                          })
                        }
                        className="mr-2 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:focus:ring-primary-500"
                      />
                      <label className="text-sm text-neutral-700 dark:text-neutral-300">
                        Register as Doctor
                      </label>
                    </div>
                  </div>
                </>
              )}{" "}
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  {step === 3
                    ? "Create Account"
                    : step === 2
                    ? "Verify Code"
                    : "Next"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-500 hover:text-primary-600"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
