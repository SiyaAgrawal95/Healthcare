import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../services/authService";
import FormInput from "../components/FormInput";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);

    try {
      const { confirmPassword, ...userData } = formData;
      const savedUser = await saveUser(userData);
      setSuccess(savedUser);
      
      // Auto-login after successful signup
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please log in with your credentials.",
            email: formData.email 
          } 
        });
      }, 3000);
    } catch (error) {
      setErrors({ 
        submit: error.message || "Failed to register. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">U</div>
            <div>
              <h2>URINEX</h2>
              <span>AI Health Monitoring</span>
            </div>
          </div>
          <h1>Create Your Account</h1>
          <p>Join us to monitor your health with AI-powered urine analysis</p>
        </div>

        {success ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Registration Successful</h2>
            <p>Welcome, {success.fullName}</p>
            <div className="patient-id-display">
              <span className="patient-id-label">Your Patient ID:</span>
              <span className="patient-id-value">{success.patientId}</span>
            </div>
            <p className="redirect-text">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.submit && (
              <div className="error-banner">
                <span>!</span>
                {errors.submit}
              </div>
            )}

            <FormInput
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              placeholder="Enter your full name"
              required
              error={errors.fullName}
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              placeholder="Enter your email address"
              required
              error={errors.email}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Create a password (min 8 characters)"
              required
              error={errors.password}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange("confirmPassword", value)}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(value) => handleInputChange("dateOfBirth", value)}
              required
              error={errors.dateOfBirth}
            />

            <div className="form-group">
              <label>
                Gender
                <span className="required">*</span>
              </label>
              <div className="radio-group">
                {genderOptions.map((option) => (
                  <label key={option.value} className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      // eslint-disable-next-line react/jsx-no-bind
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>

            <FormInput
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(value) => handleInputChange("phoneNumber", value)}
              placeholder="Enter 10-digit phone number"
              required
              error={errors.phoneNumber}
            />

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="link-button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
