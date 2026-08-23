function ComparisonSummary({ changedCount, stableCount, improvedCount }) {
  return (
    <div className="comparison-summary-section">
      <div className="section-header">
        <h2>Comparison Summary</h2>
        <p>Overview of parameter changes between the two tests</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card changed">
          <div className="summary-count">{changedCount}</div>
          <div className="summary-label">Changed</div>
        </div>

        <div className="summary-card stable">
          <div className="summary-count">{stableCount}</div>
          <div className="summary-label">Stable</div>
        </div>

        <div className="summary-card improved">
          <div className="summary-count">{improvedCount}</div>
          <div className="summary-label">Improved</div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonSummary;
