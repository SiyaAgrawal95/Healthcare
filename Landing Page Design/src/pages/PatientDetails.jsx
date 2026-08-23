import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import FormInput from "../components/FormInput";
import "../styles/PatientDetails.css";

function PatientDetails() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    patientId: currentUser?.patientId || "",
    fullName: currentUser?.fullName || "",
    age: "",
    email: currentUser?.email || "",
    phone: currentUser?.phoneNumber || "",
    bloodGroup: "",
    gender: currentUser?.gender || "",
    allergies: [],
    symptoms: "",
    testDate: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const allergyOptions = [
    { value: "none", label: "None" },
    { value: "medication", label: "Medication" },
    { value: "food", label: "Food" },
    { value: "environmental", label: "Environmental" },
    { value: "other", label: "Other" },
  ];

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

  const handleAllergyChange = (allergyValue, checked) => {
    setFormData((prev) => {
      const newAllergies = checked
        ? [...prev.allergies, allergyValue]
        : prev.allergies.filter((a) => a !== allergyValue);
      return { ...prev, allergies: newAllergies };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 0 || formData.age > 120) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood group is required";
    }

    if (!formData.testDate) {
      newErrors.testDate = "Test date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      // Store patient details in localStorage
      try {
        localStorage.setItem(
          `patient_details_${formData.patientId}`,
          JSON.stringify(formData)
        );
      } catch (error) {
        console.error("Error saving patient details:", error);
      }
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      patientId: currentUser?.patientId || "",
      fullName: currentUser?.fullName || "",
      age: "",
      email: currentUser?.email || "",
      phone: currentUser?.phoneNumber || "",
      bloodGroup: "",
      gender: currentUser?.gender || "",
      allergies: [],
      symptoms: "",
      testDate: "",
      additionalNotes: "",
    });
    setErrors({});
    setSuccess(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="patient-details-page">
      <div className="patient-details-container">
        <div className="page-header">
          <h1>Patient Details</h1>
          <p>Complete your medical information for accurate health monitoring</p>
        </div>

        {success ? (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Patient Details Saved Successfully</h2>
            <p>Your medical information has been recorded.</p>
            <button
              className="continue-button"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => navigate("/dashboard")}
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="patient-details-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <FormInput
                label="Patient ID"
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={() => {}}
                disabled
              />

              <FormInput
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={() => {}}
                disabled
              />

              <FormInput
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={(value) => handleInputChange("age", value)}
                placeholder="Enter your age"
                required
                error={errors.age}
                min={0}
                max={120}
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={() => {}}
                disabled
              />

              <FormInput
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={() => {}}
                disabled
              />
            </div>

            <div className="form-section">
              <h3>Medical Information</h3>

              <FormInput
                label="Blood Group"
                type="select"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={(value) => handleInputChange("bloodGroup", value)}
                placeholder="Select blood group"
                required
                error={errors.bloodGroup}
                options={bloodGroupOptions}
              />

              <div className="form-group">
                <label>Gender</label>
                <input
                  type="text"
                  value={formData.gender}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Allergies</label>
                <div className="checkbox-group">
                  {allergyOptions.map((option) => (
                    <label key={option.value} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={formData.allergies.includes(option.value)}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => handleAllergyChange(option.value, e.target.checked)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormInput
                label="Symptoms"
                type="textarea"
                name="symptoms"
                value={formData.symptoms}
                onChange={(value) => handleInputChange("symptoms", value)}
                placeholder="Describe any current symptoms"
              />

              <FormInput
                label="Test Date"
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={(value) => handleInputChange("testDate", value)}
                required
                error={errors.testDate}
              />

              <FormInput
                label="Additional Notes"
                type="textarea"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={(value) => handleInputChange("additionalNotes", value)}
                placeholder="Any additional information"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Details"}
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;
