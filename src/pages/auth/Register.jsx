import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import useAuthStore from "../../store/auth-store";
import useAppointmentsStore from "../../store/appointments-store";
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
  const [formErrors, setFormErrors] = useState({});  const { sendVerificationCode, validateVerificationCode, error, clearError } =
    useAuthStore();
  const { reset: resetAppointments } = useAppointmentsStore();

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

    try {      if (step === 1 && validateEmail()) {
        console.log("📧 Sending verification code to:", formData.email);
        // Send verification code
        await sendVerificationCode({ email: formData.email });
        console.log("✅ Verification code sent successfully");
        setStep(2);
      } else if (step === 2 && validateCode()) {
        console.log("🔍 Validating verification code:", formData.verificationCode);
        // Validate verification code
        await validateVerificationCode({
          email: formData.email,
          verification_code: formData.verificationCode
        });
        console.log("✅ Verification code validated successfully");
        setStep(3);
      }
    } catch (err) {
      console.error("❌ Step validation failed:", {
        step,
        error: err.message,
        email: formData.email
      });
    } finally {
      setIsLoading(false);
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFinalForm()) return;

    setIsLoading(true);
    
    try {
      const result = await createUser({
        f_name: formData.firstName,
        l_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        age: parseInt(formData.age),
        hashed_password: formData.password,
        sex: formData.sex,
      });
      
      console.log("✅ User registration successful:", result);
      resetAppointments(); // Reset appointments state when registering
      
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.error("❌ Registration failed:", err);
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
          <Link to="/" className="flex items-center space-x-2">            <div className="h-14 w-14">
              <img src="/logo.jpg" alt="SkinScan Logo" className="h-full w-full" />
            </div>
            <span className="text-2xl font-bold">
              Skin<span className="text-primary-500">Scan</span>
            </span>
          </Link>
        </div>

        <div className="mt-6">
          <div className="bg-white px-6 py-8 shadow-md sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-neutral-900">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                Sign up to start managing your skin health
              </p>
            </div>

            <form
              onSubmit={step === 3 ? handleSubmit : handleNext}
              className="space-y-5"
            >
              {error && (
                <div className="rounded-md bg-error-50 p-4">
                  <p className="text-sm text-error-500">
                    {error}
                  </p>
                </div>
              )}
              {step === 1 && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700"
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
                      placeholder="skinscanteam@gmail.com"
                      required
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-neutral-700"
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
                  {" "}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Gender
                      </label>
                      <div className="mt-1">
                        <select
                          id="sex"
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
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
                      className="block text-sm font-medium text-neutral-700"
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
                      className="block text-sm font-medium text-neutral-700"
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
                        className="mr-2 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <label className="text-sm text-neutral-700">
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
              <p className="text-neutral-600">
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
