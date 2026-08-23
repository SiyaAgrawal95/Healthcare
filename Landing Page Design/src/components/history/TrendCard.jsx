function TrendCard({ parameter, values, trend }) {
  return (
    <div className="trend-card">
      <div className="trend-header">
        <h3>{parameter}</h3>
        <span className={trend === "Stable" ? "trend-stable" : "trend-change"}>{trend}</span>
      </div>
      <div className="trend-values">
        {values.map((value, index) => <span key={index}>{value}{index < values.length - 1 && " → "}</span>)}
      </div>
    </div>
  );
}

export default TrendCard;
