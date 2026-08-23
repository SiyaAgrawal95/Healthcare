function PatientSelector({ patient, setPatient, onRefresh, loading }) {
  const patients = ["Patient 001", "Patient 002", "Patient 003", "Patient 004"];

  return (
    <div className="controls">
      <div className="patient-control">
        <label>Select Patient</label>
        <select value={patient} onChange={(e) => setPatient(e.target.value)}>
          <option value="">Select a patient</option>
          {patients.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <button onClick={onRefresh} disabled={!patient || loading}>
        {loading ? "Retrieving..." : "↻ Refresh History"}
      </button>
    </div>
  );
}

export default PatientSelector;
