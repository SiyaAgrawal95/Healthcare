import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, loginDemoUser } from "../services/authService";
import FormInput from "../components/FormInput";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const prefillEmail = location.state?.email;

  const [formData, setFormData] = useState({
    email: prefillEmail || "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    try {
      await loginUser(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ 
        submit: error.message || "Login failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    const result = await loginDemoUser();
    if (result.success) navigate("/dashboard");
    else setErrors({ submit: result.message });
  };

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
          <h1>Welcome Back</h1>
          <p>Log in to access your health monitoring dashboard</p>
        </div>

        {message && (
          <div className="success-banner">
            <span>✓</span>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && (
            <div className="error-banner">
              <span>!</span>
              {errors.submit}
            </div>
          )}

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
            placeholder="Enter your password"
            required
            error={errors.password}
          />

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </form>

        <div className="demo-section">
          <div className="demo-divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="demo-button"
            onClick={handleDemoLogin}
          >
            Try Demo Account
          </button>
          <p className="demo-note">
            Demo account with sample test data for demonstration only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
