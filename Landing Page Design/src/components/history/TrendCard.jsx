function TrendCard({ parameter, values, trend }) {
  const getTrendClass = (t) => {
    if (t === "Increasing") return "trend-increasing";
    if (t === "Decreasing") return "trend-decreasing";
    if (t === "Stable") return "trend-stable";
    return "trend-change";
  };

  const getTrendIcon = (t) => {
    if (t === "Increasing") return "↑";
    if (t === "Decreasing") return "↓";
    if (t === "Stable") return "✓";
    return "•";
  };

  return (
    <div className="trend-card">
      <div className="trend-header">
        <h3>{parameter}</h3>
        <span className={`trend-badge ${getTrendClass(trend)}`}>
          <span className="trend-icon">{getTrendIcon(trend)}</span>
          {trend}
        </span>
      </div>
      <div className="trend-values">
        {values.map((value, index) => (
          <span key={index}>
            {value}
            {index < values.length - 1 && <span className="trend-arrow"> → </span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TrendCard;
