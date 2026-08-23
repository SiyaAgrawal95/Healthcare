import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const QUALITATIVE_SCALE = {
  Negative: 0,
  Trace: 1,
  Small: 2,
  Moderate: 3,
  Large: 4,
};

const PARAMETERS = [
  { key: "glucose", name: "Glucose" },
  { key: "protein", name: "Protein" },
  { key: "ph", name: "pH" },
  { key: "ketones", name: "Ketones" },
  { key: "blood", name: "Blood" },
];

function ComparisonChart({ earlierTest, latestTest, comparisonData }) {
  const [selectedParameter, setSelectedParameter] = useState("glucose");

  const getNumericValue = (value, parameterKey) => {
    if (parameterKey === "ph") {
      return Number(value);
    }
    return QUALITATIVE_SCALE[value] || 0;
  };

  const getDisplayValue = (value, parameterKey) => {
    if (parameterKey === "ph") {
      return value;
    }
    return value;
  };

  const getChangeDirection = (parameterKey) => {
    const paramComparison = comparisonData.find((c) => c.key === parameterKey);
    if (paramComparison) {
      return paramComparison.change;
    }
    return "No Change";
  };

  const getChangeIcon = (change) => {
    if (change === "Increased") return "↑";
    if (change === "Decreased") return "↓";
    return "—";
  };

  const getChangeColor = (change) => {
    if (change === "Increased") return "#dc2626";
    if (change === "Decreased") return "#2563eb";
    return "#16a34a";
  };

  const chartData = earlierTest && latestTest ? [
    {
      name: "Earlier",
      earlier: getNumericValue(earlierTest[selectedParameter], selectedParameter),
      latest: getNumericValue(latestTest[selectedParameter], selectedParameter),
      earlierDisplay: getDisplayValue(earlierTest[selectedParameter], selectedParameter),
      latestDisplay: getDisplayValue(latestTest[selectedParameter], selectedParameter),
    },
  ] : [];

  const changeDirection = getChangeDirection(selectedParameter);
  const changeIcon = getChangeIcon(changeDirection);
  const changeColor = getChangeColor(changeDirection);

  return (
    <div className="comparison-chart-section">
      <div className="section-header">
        <h2>Visual Comparison</h2>
        <p>See how the selected parameter changed between tests</p>
      </div>

      <div className="chart-controls">
        <label htmlFor="parameter-select">Select Parameter</label>
        <select
          id="parameter-select"
          value={selectedParameter}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => setSelectedParameter(e.target.value)}
        >
          {PARAMETERS.map((param) => (
            <option key={param.key} value={param.key}>
              {param.name}
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 && (
        <>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  domain={selectedParameter === "ph" ? [0, 14] : [0, 4]} 
                  stroke="#64748b" 
                />
                <YAxis type="category" dataKey="name" stroke="#64748b" width={80} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "earlier") return [chartData[0].earlierDisplay, "Earlier"];
                    if (name === "latest") return [chartData[0].latestDisplay, "Latest"];
                    return [value, name];
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="rect"
                />
                <Bar dataKey="earlier" fill="#94a3b8" radius={[0, 4, 4, 0]} name="Earlier" />
                <Bar dataKey="latest" fill="#0F4C81" radius={[0, 4, 4, 0]} name="Latest" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-status" style={{ color: changeColor }}>
            <span className="change-icon">{changeIcon}</span>
            <span className="change-text">{changeDirection}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default ComparisonChart;
