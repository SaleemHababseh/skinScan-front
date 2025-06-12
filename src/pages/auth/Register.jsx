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
  const [showPolicy, setShowPolicy] = useState(false);
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
    agreedToPolicy: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const { sendVerificationCode, validateVerificationCode, error, clearError } =
    useAuthStore();
  const { reset: resetAppointments } = useAppointmentsStore();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        await sendVerificationCode({ email: formData.email });
        setStep(2);
      } else if (step === 2 && validateCode()) {
        await validateVerificationCode({
          email: formData.email,
          verification_code: formData.verificationCode,
        });
        setStep(3);
      }
    } catch (err) {
      console.error("Step validation failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
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
        agreed_to_policy: formData.agreedToPolicy,
      });

      resetAppointments();
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
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-14 w-14">
              <img src="/logo.jpg" alt="SkinScan Logo" className="h-full w-full" />
            </div>
            <span className="text-2xl font-bold">
              Skin<span className="text-primary-500">Scan</span>
            </span>
          </Link>
        </div>

        <div className="bg-white px-6 py-8 shadow-md sm:rounded-lg sm:px-10">
          <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
            {error && (
              <div className="rounded-md bg-error-50 p-4">
                <p className="text-sm text-error-500">{error}</p>
              </div>
            )}

            {step === 1 && (
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                label="Email"
                placeholder="example@email.com"
                required
              />
            )}

            {step === 2 && (
              <Input
                id="verificationCode"
                name="verificationCode"
                type="text"
                value={formData.verificationCode}
                onChange={handleChange}
                error={formErrors.verificationCode}
                label="Verification Code"
                placeholder="Enter the code sent to your email"
                required
              />
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={formErrors.firstName}
                    label="First Name"
                    placeholder="John"
                    required
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={formErrors.lastName}
                    label="Last Name"
                    placeholder="Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    error={formErrors.age}
                    label="Age"
                    placeholder="25"
                    required
                  />
                  <div>
                    <label htmlFor="sex" className="block text-sm font-medium text-neutral-700">
                      Gender
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {formErrors.sex && (
                      <p className="mt-1 text-sm text-error-500">{formErrors.sex}</p>
                    )}
                  </div>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  label="Password"
                  placeholder="••••••••"
                  required
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                  label="Confirm Password"
                  placeholder="••••••••"
                  required
                />

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
                  <label className="text-sm text-neutral-700">Register as Doctor</label>
                </div>

                <div className="mt-4 flex items-start">
                  <input
                    id="agreedToPolicy"
                    name="agreedToPolicy"
                    type="checkbox"
                    checked={formData.agreedToPolicy}
                    onChange={handleChange}
                    className="mt-1 mr-2 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    required
                  />
                  <label htmlFor="agreedToPolicy" className="text-sm text-neutral-700">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowPolicy(!showPolicy)}
                      className="text-primary-500 underline"
                    >
                      Privacy Policy
                    </button>{" "}
                    and Terms of Use.
                  </label>
                </div>

                {showPolicy && (
                  <div className="mt-4 rounded-md bg-neutral-100 p-4 text-sm text-neutral-800 max-h-[300px] overflow-y-auto border">
                    <h3 className="font-semibold mb-2">Privacy Policy - Skin Scan</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>We collect only images that indicate possible cancer.</li>
                      <li>Your data is encrypted and protected.</li>
                      <li>We never share your private info with third parties.</li>
                      <li>This platform is a support tool, not a replacement for medical advice.</li>
                      <li>Chats with doctors are confidential but may be monitored for abuse.</li>
                      <li>Violation of terms leads to account termination and data loss.</li>
                      <li>We are not liable for misuse or misinterpretation of AI results.</li>
                    </ul>
                    <p className="mt-2">
                      By continuing, you confirm you’ve read and agreed to this policy.
                    </p>
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {step === 3 ? "Create Account" : step === 2 ? "Verify Code" : "Next"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-neutral-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
