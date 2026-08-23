function Header({ status }) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">HEALTH MONITORING</p>
        <h1>Urine Test History & Trend Monitor</h1>
        <p className="subtitle">
          View previous urine test results and monitor parameter changes over time.
        </p>
      </div>
      <div className={`status-badge ${status === "Stable" ? "stable-badge" : "warning-badge"}`}>
        {status === "Stable" ? "✓ Stable" : "⚠ Changes Detected"}
      </div>
    </header>
  );
}

export default Header;
