function MonitoringSummary({ status, changedParameters }) {
  const hasChanges = status === "Changes Detected";
  return (
    <section className={`summary ${hasChanges ? "summary-warning" : "summary-stable"}`}>
      <div className="summary-icon">{hasChanges ? "⚠" : "✓"}</div>
      <div>
        <h2>{hasChanges ? "Changes Detected" : "No Significant Changes Detected"}</h2>
        {hasChanges ? <p>Recent changes detected in <strong>{changedParameters.join(", ")}</strong>.<br />Please review the test history with a healthcare professional.</p> : <p>No significant changes detected in recent urine tests.</p>}
      </div>
    </section>
  );
}

export default MonitoringSummary;
