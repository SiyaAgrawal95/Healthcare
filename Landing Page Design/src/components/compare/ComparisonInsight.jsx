function ComparisonInsight({ comparisonData }) {
  if (!comparisonData || comparisonData.length === 0) {
    return null;
  }

  // Find the first parameter that changed
  const changedItem = comparisonData.find((item) => item.change !== "No Change");

  if (!changedItem) {
    return null;
  }

  const generateInsight = () => {
    if (changedItem.change === "No Change") {
      return `${changedItem.parameter} remained unchanged between the selected tests.`;
    }

    const direction = changedItem.change === "Increased" ? "increased" : "decreased";
    return `${changedItem.parameter} ${direction} from ${changedItem.previous} to ${changedItem.current} between the selected tests.`;
  };

  return (
    <div className="comparison-insight-section">
      <div className="section-header">
        <h2>Key Insight</h2>
        <p>Notable parameter change detected</p>
      </div>
      <div className="insight-card">
        <div className="insight-icon">
          {changedItem.change === "Increased" && "↑"}
          {changedItem.change === "Decreased" && "↓"}
          {changedItem.change === "No Change" && "—"}
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
