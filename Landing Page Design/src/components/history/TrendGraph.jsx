function TrendGraph({ tests }) {
  if (tests.length === 0) return null;

  return (
    <section className="section">
      <div className="section-header"><div><h2>pH Trend Graph</h2><p>pH values across previous test dates</p></div></div>
      <div className="graph">
        {tests.map((test, index) => {
          const height = (test.ph / 14) * 100;
          return <div className="graph-column" key={index}>
            <div className="graph-value">{test.ph}</div>
            <div className="graph-bar-container"><div className="graph-bar" style={{ height: `${height}%` }} /></div>
            <div className="graph-date">{test.date}</div>
          </div>;
        })}
      </div>
    </section>
  );
}

export default TrendGraph;
