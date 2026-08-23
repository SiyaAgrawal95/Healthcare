function PatientSelector({
  patient,
  onPatientChange,
}) {
  return (
    <div className="patient-selector">

      <label htmlFor="patient">
        Patient
      </label>

      <select
        id="patient"
        value={patient}
        onChange={(e) =>
          onPatientChange(e.target.value)
        }
      >

        <option value="">
          Select patient
        </option>

        <option value="Patient 001">
          Patient 001
        </option>

        <option value="Patient 002">
          Patient 002
        </option>

        <option value="Patient 003">
          Patient 003
        </option>

        <option value="Patient 004">
          Patient 004
        </option>

      </select>

    </div>
  );
}

export default PatientSelector;
