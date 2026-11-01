import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

function TrendGraph({ tests }) {
  if (!tests || tests.length === 0) return null;

  const chartData = tests.map((test) => ({
    date: test.date,
    ph: test.ph == null ? null : Number(test.ph),
  }));

  // Calculate dynamic domain with padding
  const phValues = chartData.map((d) => d.ph).filter((v) => Number.isFinite(v));
  const minPh = phValues.length > 0 ? Math.min(...phValues) : 5;
  const maxPh = phValues.length > 0 ? Math.max(...phValues) : 8;
  const yMin = Math.max(0, Math.floor((minPh - 0.5) * 10) / 10);
  const yMax = Math.min(14, Math.ceil((maxPh + 0.5) * 10) / 10);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>pH Trend Graph</h2>
          <p>pH values across previous test dates</p>
        </div>
      </div>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 25, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={{ stroke: "#cbd5e1" }}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              domain={[yMin, yMax]}
              stroke="#64748b"
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickLine={{ stroke: "#cbd5e1" }}
              axisLine={{ stroke: "#cbd5e1" }}
              allowDecimals={true}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="graph-tooltip">
                      <div className="graph-tooltip-date">{label}</div>
                      <div className="graph-tooltip-val">
                        <span className="graph-tooltip-dot" />
                        pH: <strong>{payload[0].value}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="ph"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#1d4ed8",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            >
              <LabelList
                dataKey="ph"
                position="top"
                offset={10}
                style={{ fill: "#1e293b", fontSize: "13px", fontWeight: "700" }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default TrendGraph;
