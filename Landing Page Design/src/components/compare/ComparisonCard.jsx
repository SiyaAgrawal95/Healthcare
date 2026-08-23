function ComparisonCard({
  parameter,
  previous,
  current,
  change,
}) {
  const getChangeClass = (change) => {
    if (change === "Increased") return "increased";
    if (change === "Decreased") return "decreased";
    return "no-change";
  };

  const getCardClass = (change) => {
    if (change === "Increased") return "card-increased";
    if (change === "Decreased") return "card-decreased";
    return "card-no-change";
  };

  const getChangeIcon = (change) => {
    if (change === "Increased") return "↑";
    if (change === "Decreased") return "↓";
    return "—";
  };

  const getDescription = (parameter, previous, current, change) => {
    if (change === "No Change") {
      return `Your ${parameter.toLowerCase()} reading remained the same between these two tests.`;
    }
    const direction = change === "Increased" ? "increased" : "decreased";
    return `Your ${parameter.toLowerCase()} reading ${direction} from ${previous} to ${current} between these two tests.`;
  };

  return (
    <div className={`comparison-card ${getCardClass(change)}`}>
      <div className="comparison-card-header">
        <h3>{parameter}</h3>
      </div>
      <div className="comparison-card-body">
        <div className="comparison-value">
          <span>Earlier</span>
          <strong>{previous}</strong>
        </div>
        <div className="comparison-value">
          <span>Latest</span>
          <strong>{current}</strong>
        </div>
        <div className={`comparison-change ${getChangeClass(change)}`}>
          <span>{getChangeIcon(change)}</span>
          <span>{change}</span>
        </div>
      </div>
      <div className="comparison-description">
        {getDescription(parameter, previous, current, change)}
      </div>
    </div>
  );
}

export default ComparisonCard;
