function ComparisonInsight({ parameter, earlierValue, latestValue, change }) {
  const generateInsight = () => {
    if (change === "No Change") {
      return `${parameter} remained unchanged between the selected tests.`;
    }

    const direction = change === "Increased" ? "increased" : "decreased";
    return `${parameter} ${direction} from ${earlierValue} to ${latestValue} between the selected tests.`;
  };

  return (
    <div className="comparison-insight-section">
      <div className="insight-card">
        <div className="insight-icon">
          {change === "Increased" && "↑"}
          {change === "Decreased" && "↓"}
          {change === "No Change" && "—"}
        </div>
        <div className="insight-text">
          <h3>What changed?</h3>
          <p>{generateInsight()}</p>
        </div>
      </div>
    </div>
  );
}

export default ComparisonInsight;
