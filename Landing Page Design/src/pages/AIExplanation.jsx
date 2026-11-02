import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getPatientTestHistory } from "../services/urineTestApi";
import "../styles/AIExplanation.css";

const PARAMETER_LABELS = {
  glucose: "Glucose",
  protein: "Protein",
  ph: "pH",
  ketones: "Ketones",
  blood: "Blood",
  nitrite: "Nitrite",
  leukocytes: "Leukocytes",
  specificGravity: "Specific Gravity",
  bilirubin: "Bilirubin",
  urobilinogen: "Urobilinogen",
};

const formatParameter = (parameter) => {
  const rawValue = parameter.value;
  const value = typeof rawValue === "string"
    ? rawValue.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : String(rawValue);
  const statusLabels = { normal: "Normal", abnormal: "Abnormal", borderline: "Borderline", not_readable: "Not Readable" };
  return {
    name: PARAMETER_LABELS[parameter.name] || parameter.name,
    value: parameter.unit ? `${value} ${parameter.unit}` : value,
    status: statusLabels[parameter.status] || "Not Readable",
  };
};

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
        ...(explanationData[parameter.name] || {
          explanation: `${parameter.name} should be interpreted using the reference ranges for the specific test strip and the rest of the test results.`,
          factors: ["Strip manufacturer reference ranges", "Sample handling and timing", "Other clinical context"],
          guidance: "This educational summary is not a diagnosis. Discuss persistent or concerning findings with a healthcare professional.",
        }),
      });
    }, 1200);
  });
}

function App() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [testRecord, setTestRecord] = useState(null);
  const [urineParameters, setUrineParameters] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testLoading, setTestLoading] = useState(true);

  const abnormalParameters = urineParameters.filter((parameter) => ["Abnormal", "Borderline"].includes(parameter.status));

  useEffect(() => {
    if (!currentUser?._id) {
      navigate("/login");
      return;
    }
    let cancelled = false;
    const loadLatestTest = async () => {
      setTestLoading(true);
      setError("");
      try {
        const tests = await getPatientTestHistory(currentUser._id);
        if (cancelled) return;
        const latest = tests.at(-1) || null;
        setTestRecord(latest);
        const parameters = (latest?.parameters || []).map(formatParameter);
        setUrineParameters(parameters);
        setSelectedParameter(parameters.find((item) => ["Abnormal", "Borderline"].includes(item.status)) || null);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Unable to load saved urine test results.");
      } finally {
        if (!cancelled) setTestLoading(false);
      }
    };
    loadLatestTest();
    return () => { cancelled = true; };
  }, [currentUser?._id, navigate]);

  const loadExplanation = async (parameter) => {
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
    if (selectedParameter) loadExplanation(selectedParameter);
    else setExplanation(null);
  }, [selectedParameter]);

  return (
    <div className="ai-explanation-page">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Urine Test Result Explanation</h1>
          <p>Educational context for your latest saved test</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          {testRecord?.source === "demo" ? "Synthetic Demo Record" : "Saved Test Record"}
        </div>
      </header>

      {/* PATIENT INFO */}
      {testRecord && <section className="patient-card">
        <div>
          <span>Patient ID</span>
          <strong>{currentUser?.patientId || "—"}</strong>
        </div>

        <div>
          <span>Patient Name</span>
          <strong>{currentUser?.fullName || "—"}</strong>
        </div>

        <div>
          <span>Test Date</span>
          <strong>{testRecord.date}</strong>
        </div>

        <div>
          <span>Analysis Status</span>
          <strong>{testRecord.analysis?.status || "pending"}</strong>
        </div>
      </section>}

      {testLoading && <div className="loading"><div className="spinner"></div><p>Loading saved test results...</p></div>}
      {!testLoading && error && <div className="error" role="alert">{error}</div>}
      {!testLoading && !error && !testRecord && (
        <div className="empty-state">
          <h2>No saved urine test yet</h2>
          <p>Upload a strip and save a test record before viewing its explanation.</p>
        </div>
      )}

      {/* RESULTS */}
      {testRecord && <section className="section">
        <div className="section-title">
          <div>
            <h2>Urine Test Results</h2>
            <p>Values loaded from your latest MongoDB test record</p>
          </div>

          <span className="count">
            {abnormalParameters.length} Abnormal or Borderline
          </span>
        </div>

        {testRecord.analysis?.summary && <div className="error" role="note">{testRecord.analysis.summary}</div>}

        <div className="result-grid">
          {urineParameters.map((parameter) => (
            <div
              key={parameter.name}
              className={`parameter-card ${
                ["Abnormal", "Borderline"].includes(parameter.status) ? "abnormal-card" : ""
              } ${
                selectedParameter?.name === parameter.name
                  ? "selected-card"
                  : ""
              }`}
              onClick={() =>
                ["Abnormal", "Borderline"].includes(parameter.status) &&
                setSelectedParameter(parameter)
              }
            >
              <div className="parameter-top">
                <span className="parameter-name">{parameter.name}</span>

                <span
                  className={`badge ${
                    ["Abnormal", "Borderline"].includes(parameter.status)
                      ? "badge-abnormal"
                      : "badge-normal"
                  }`}
                >
                  {parameter.status}
                </span>
              </div>

              <div className="parameter-value">{parameter.value}</div>

              {["Abnormal", "Borderline"].includes(parameter.status) && (
                <span className="click-text">Click to explain →</span>
              )}
            </div>
          ))}
        </div>
      </section>}

      {/* SELECTOR */}
      {testRecord && abnormalParameters.length > 0 && <section className="selector-section">
        <div>
          <h2>Select an Abnormal Parameter</h2>
          <p>Choose an abnormal or borderline result to view educational context.</p>
        </div>

        <select
          value={selectedParameter?.name || ""}
          onChange={(e) => {
            const parameter = abnormalParameters.find(
              (item) => item.name === e.target.value
            );

            if (parameter) {
              setSelectedParameter(parameter);
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
      </section>}
      {testRecord && abnormalParameters.length === 0 && <div className="empty-state">No abnormal or borderline parameters are recorded for this test.</div>}

      {/* EXPLANATION */}
      {selectedParameter && (
        <section className="explanation-section">
          <div className="section-title">
            <div>
              <h2>Parameter Explanation</h2>
              <p>Static educational guidance based on the selected saved result</p>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading educational reference...</p>
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
