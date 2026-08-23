import { useEffect, useState } from "react";
import "../styles/AIExplanation.css";

const urineParameters = [
  {
    name: "Glucose",
    value: "Trace",
    status: "Abnormal",
  },
  {
    name: "Protein",
    value: "Negative",
    status: "Normal",
  },
  {
    name: "pH",
    value: "6.5",
    status: "Normal",
  },
  {
    name: "Ketones",
    value: "Moderate",
    status: "Abnormal",
  },
  {
    name: "Blood",
    value: "Negative",
    status: "Normal",
  },
  {
    name: "Nitrite",
    value: "Positive",
    status: "Abnormal",
  },
  {
    name: "Leukocytes",
    value: "Trace",
    status: "Abnormal",
  },
];

const explanationData = {
  Glucose: {
    explanation:
      "Glucose in urine may occur when blood glucose levels are elevated or in certain other conditions. A trace result should be interpreted together with other test findings.",
    factors: [
      "Elevated blood glucose",
      "Dietary factors",
      "Certain medications",
      "Other metabolic conditions",
    ],
    guidance:
      "Discuss persistent or significant glucose results with a healthcare professional.",
  },

  Ketones: {
    explanation:
      "Ketones are substances produced when the body uses stored fat as an energy source. Ketones may appear in urine under several circumstances.",
    factors: [
      "Fasting",
      "Prolonged exercise",
      "Reduced carbohydrate intake",
      "Certain metabolic conditions",
    ],
    guidance:
      "Persistent or significant ketone results should be discussed with a healthcare professional.",
  },

  Nitrite: {
    explanation:
      "A positive nitrite result can occur when certain bacteria convert nitrates into nitrites in the urinary tract.",
    factors: [
      "Certain bacterial activity",
      "Urinary tract conditions",
      "Sample-related factors",
      "Other urinary findings",
    ],
    guidance:
      "Discuss a positive nitrite result, especially when accompanied by symptoms or other abnormal findings, with a healthcare professional.",
  },

  Leukocytes: {
    explanation:
      "Leukocytes are white blood cells. Their presence in urine may indicate inflammation or other changes in the urinary tract.",
    factors: [
      "Urinary tract inflammation",
      "Certain infections",
      "Sample contamination",
      "Other urinary conditions",
    ],
    guidance:
      "Discuss persistent leukocyte findings with a healthcare professional, particularly when symptoms are present.",
  },
};

function getExplanation(parameter) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: parameter.name,
        value: parameter.value,
        ...explanationData[parameter.name],
      });
    }, 1200);
  });
}

function App() {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abnormalParameters = urineParameters.filter(
    (parameter) => parameter.status === "Abnormal"
  );

  const loadExplanation = async (parameter) => {
    setSelectedParameter(parameter);
    setExplanation(null);
    setError("");
    setLoading(true);

    try {
      const data = await getExplanation(parameter);
      setExplanation(data);
    } catch (err) {
      setError("Unable to retrieve explanation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplanation(abnormalParameters[0]);
  }, []);

  return (
    <div className="ai-explanation-page">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>AI Urine Result Explanation System</h1>
          <p>AI-Assisted Abnormal Parameter Analysis</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Analysis Active
        </div>
      </header>

      {/* PATIENT INFO */}
      <section className="patient-card">
        <div>
          <span>Patient ID</span>
          <strong>P001</strong>
        </div>

        <div>
          <span>Patient Name</span>
          <strong>Sample Patient</strong>
        </div>

        <div>
          <span>Test Date</span>
          <strong>17/08/2026</strong>
        </div>

        <div>
          <span>Analysis Status</span>
          <strong className="abnormal-text">Abnormal Findings</strong>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section">
        <div className="section-title">
          <div>
            <h2>Urine Test Results</h2>
            <p>AI-generated urine analysis parameters</p>
          </div>

          <span className="count">
            {abnormalParameters.length} Abnormal
          </span>
        </div>

        <div className="result-grid">
          {urineParameters.map((parameter) => (
            <div
              key={parameter.name}
              className={`parameter-card ${
                parameter.status === "Abnormal" ? "abnormal-card" : ""
              } ${
                selectedParameter?.name === parameter.name
                  ? "selected-card"
                  : ""
              }`}
              onClick={() =>
                parameter.status === "Abnormal" &&
                loadExplanation(parameter)
              }
            >
              <div className="parameter-top">
                <span className="parameter-name">{parameter.name}</span>

                <span
                  className={`badge ${
                    parameter.status === "Abnormal"
                      ? "badge-abnormal"
                      : "badge-normal"
                  }`}
                >
                  {parameter.status}
                </span>
              </div>

              <div className="parameter-value">{parameter.value}</div>

              {parameter.status === "Abnormal" && (
                <span className="click-text">Click to explain →</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SELECTOR */}
      <section className="selector-section">
        <div>
          <h2>Select an Abnormal Parameter</h2>
          <p>Choose an abnormal result to view its AI-assisted explanation.</p>
        </div>

        <select
          value={selectedParameter?.name || ""}
          onChange={(e) => {
            const parameter = abnormalParameters.find(
              (item) => item.name === e.target.value
            );

            if (parameter) {
              loadExplanation(parameter);
            }
          }}
        >
          <option value="" disabled>
            Select parameter
          </option>

          {abnormalParameters.map((parameter) => (
            <option key={parameter.name} value={parameter.name}>
              {parameter.name}
            </option>
          ))}
        </select>
      </section>

      {/* EXPLANATION */}
      {selectedParameter && (
        <section className="explanation-section">
          <div className="section-title">
            <div>
              <h2>Parameter Explanation</h2>
              <p>Educational information based on the selected result</p>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading AI explanation...</p>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {!loading && explanation && (
            <div className="explanation-grid">
              {/* MAIN EXPLANATION */}
              <div className="explanation-card main-explanation">
                <div className="explanation-header">
                  <div>
                    <span className="small-label">Selected Parameter</span>
                    <h3>{explanation.name}</h3>
                  </div>

                  <div className="detected">
                    <span>Detected Result</span>
                    <strong>{explanation.value}</strong>
                  </div>
                </div>

                <div className="content-block">
                  <h4>What does it mean?</h4>
                  <p>{explanation.explanation}</p>
                </div>

                <div className="content-block">
                  <h4>Possible Factors</h4>

                  <ul>
                    {explanation.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* GUIDANCE */}
              <div className="guidance-card">
                <div className="guidance-icon">!</div>

                <div>
                  <h3>What to Discuss</h3>
                  <p>{explanation.guidance}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <p>
          This system provides educational information and does not provide a
          medical diagnosis.
        </p>
      </footer>
    </div>
  );
}

export default App;