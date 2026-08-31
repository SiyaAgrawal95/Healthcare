function Header({ status }) {
  const isWarning = status !== "Stable";

  return (
    <header className="header">
      <div>
        <p className="eyebrow">HEALTH MONITORING</p>
        <h1>Urine Test History & Trend Monitor</h1>
        <p className="subtitle">
          View previous urine test results and monitor parameter changes over time.
        </p>
      </div>
      <div className={`status-badge ${isWarning ? "warning-badge" : "stable-badge"}`}>
        <span className="status-badge-icon">
          {isWarning ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )}
        </span>
        <div className="status-badge-text">
          <span className="status-badge-label">STATUS</span>
          <span className="status-badge-title">{isWarning ? "Changes Detected" : "Stable"}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
