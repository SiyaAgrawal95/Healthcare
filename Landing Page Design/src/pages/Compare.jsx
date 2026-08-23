import { useEffect, useState } from "react";

import PatientSelector from "../components/compare/PatientSelector";
import TestSelector from "../components/compare/TestSelector";
import ComparisonSummary from "../components/compare/ComparisonSummary";
import ComparisonCard from "../components/compare/ComparisonCard";
import ComparisonChart from "../components/compare/ComparisonChart";
import ComparisonInsight from "../components/compare/ComparisonInsight";

import { getPatientTestHistory, getTestById } from "../services/urineTestApi";

import "../styles/Compare.css";

function Compare() {
  // =========================
  // STATE
  // =========================

  const [patient, setPatient] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const [earlierTest, setEarlierTest] = useState("");
  const [latestTest, setLatestTest] = useState("");
  const [earlierTestData, setEarlierTestData] = useState(null);
  const [latestTestData, setLatestTestData] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  // =========================
  // LOAD PATIENT TEST HISTORY
  // =========================

  useEffect(() => {
    if (!patient) {
      setAvailableTests([]);
      setEarlierTest("");
      setLatestTest("");
      setEarlierTestData(null);
      setLatestTestData(null);
      setComparisonData([]);
      setHasCompared(false);
      setError("");
      return;
    }

    const loadTestHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const tests = await getPatientTestHistory(patient);
        setAvailableTests(tests);
        
        // Auto-select earliest and latest tests
        if (tests.length >= 2) {
          setEarlierTest(tests[0].id);
          setLatestTest(tests[tests.length - 1].id);
        }
      } catch (err) {
        setError("Unable to retrieve test history.");
      } finally {
        setLoading(false);
      }
    };

    loadTestHistory();
  }, [patient]);

  // =========================
  // COMPARISON LOGIC
  // =========================

  const compareValues = (previous, current, parameterKey) => {
    if (previous === current) {
      return "No Change";
    }

    // Numerical comparison for pH
    if (parameterKey === "ph") {
      const previousNumber = Number(previous);
      const currentNumber = Number(current);

      if (!Number.isNaN(previousNumber) && !Number.isNaN(currentNumber)) {
        if (currentNumber > previousNumber) return "Increased";
        if (currentNumber < previousNumber) return "Decreased";
      }
    }

    // Urine strip qualitative scale
    const levels = ["Negative", "Trace", "Small", "Moderate", "Large"];
    const previousIndex = levels.indexOf(previous);
    const currentIndex = levels.indexOf(current);

    if (previousIndex !== -1 && currentIndex !== -1) {
      if (currentIndex > previousIndex) return "Increased";
      if (currentIndex < previousIndex) return "Decreased";
    }

    return "No Change";
  };

  const createComparison = (earlier, latest) => {
    const parameters = [
      { name: "Glucose", key: "glucose" },
      { name: "Protein", key: "protein" },
      { name: "pH", key: "ph" },
      { name: "Ketones", key: "ketones" },
      { name: "Blood", key: "blood" },
    ];

    return parameters.map((parameter) => {
      const earlierValue = earlier[parameter.key];
      const latestValue = latest[parameter.key];
      const change = compareValues(earlierValue, latestValue, parameter.key);

      return {
        key: parameter.key,
        name: parameter.name,
        earlier: earlierValue,
        latest: latestValue,
        change,
      };
    });
  };

  // =========================
  // HANDLE COMPARE
  // =========================

  const handleCompare = async () => {
    if (!earlierTest || !latestTest || earlierTest === latestTest) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [earlier, latest] = await Promise.all([
        getTestById(patient, earlierTest),
        getTestById(patient, latestTest),
      ]);

      setEarlierTestData(earlier);
      setLatestTestData(latest);

      const comparison = createComparison(earlier, latest);
      setComparisonData(comparison);
      setHasCompared(true);
    } catch (err) {
      setError("Unable to compare test results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CALCULATE SUMMARY
  // =========================

  const changedCount = comparisonData.filter((c) => c.change !== "No Change").length;
  const stableCount = comparisonData.filter((c) => c.change === "No Change").length;
  const improvedCount = comparisonData.filter((c) => c.change === "Decreased").length;

  // =========================
  // RENDER
  // =========================

  return (
    <div className="compare-page">

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">U</div>
          <div>
            <h2>URINEX</h2>
            <span>AI Health Monitoring</span>
          </div>
        </div>
        <div className="system-status">
          <span className="status-dot"></span>
          System Active
        </div>
      </header>

      <main className="dashboard">

        {/* PAGE INTRO */}
        <section className="page-intro">
          <div>
            <span className="eyebrow">TEST COMPARISON</span>
            <h1>Compare Test Results</h1>
            <p>See how your urine test results have changed between two tests.</p>
          </div>
          <PatientSelector patient={patient} onPatientChange={setPatient} />
        </section>

        {/* LOADING STATE */}
        {loading && (
          <div className="loading-banner">
            <span className="spinner"></span>
            Loading test results...
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="error-banner">
            <span>!</span>
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!patient && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Select a patient to begin</h3>
            <p>Choose a patient to view their test history and compare results.</p>
          </div>
        )}

        {/* INSUFFICIENT TESTS STATE */}
        {patient && availableTests.length > 0 && availableTests.length < 2 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Not enough tests</h3>
            <p>At least two test results are needed for comparison.</p>
          </div>
        )}

        {/* MAIN CONTENT */}
        {patient && availableTests.length >= 2 && !loading && (
          <>
            {/* PATIENT INFO */}
            <div className="patient-info">
              <h2>{patient}</h2>
              <p>Test comparison</p>
            </div>

            {/* TEST SELECTOR */}
            <TestSelector
              availableTests={availableTests}
              earlierTest={earlierTest}
              latestTest={latestTest}
              onEarlierTestChange={setEarlierTest}
              onLatestTestChange={setLatestTest}
              onCompare={handleCompare}
              isComparing={loading}
            />

            {/* COMPARISON RESULTS */}
            {hasCompared && comparisonData.length > 0 && (
              <>
                {/* COMPARISON SUMMARY */}
                <ComparisonSummary
                  changedCount={changedCount}
                  stableCount={stableCount}
                  improvedCount={improvedCount}
                />

                {/* PARAMETER COMPARISON CARDS */}
                <section className="comparison-section">
                  <div className="section-header">
                    <h2>What changed?</h2>
                    <p>Detailed comparison of each parameter</p>
                  </div>

                  <div className="comparison-cards">
                    {comparisonData.map((item) => (
                      <ComparisonCard
                        key={item.key}
                        parameter={item.name}
                        previous={item.earlier}
                        current={item.latest}
                        change={item.change}
                      />
                    ))}
                  </div>
                </section>

                {/* VISUAL CHART */}
                <ComparisonChart
                  earlierTest={earlierTestData}
                  latestTest={latestTestData}
                  comparisonData={comparisonData}
                />

                {/* COMPARISON INSIGHT */}
                <ComparisonInsight
                  parameter={comparisonData[0]?.name || ""}
                  earlierValue={comparisonData[0]?.earlier || ""}
                  latestValue={comparisonData[0]?.latest || ""}
                  change={comparisonData[0]?.change || ""}
                />

                {/* OVERALL SUMMARY */}
                <section className="overall-summary-section">
                  <div className="section-header">
                    <h2>Overall comparison</h2>
                  </div>
                  <p className="overall-summary-text">
                    {changedCount} parameter{changedCount !== 1 ? "s" : ""} changed between these tests. {stableCount} parameter{stableCount !== 1 ? "s" : ""} remained stable.
                  </p>
                  <div className="changed-parameters-list">
                    {comparisonData
                      .filter((c) => c.change !== "No Change")
                      .map((item) => (
                        <div key={item.key} className="changed-parameter-item">
                          <span className="change-icon">
                            {item.change === "Increased" && "↑"}
                            {item.change === "Decreased" && "↓"}
                          </span>
                          <span className="parameter-name">{item.name}</span>
                          <span className="parameter-change">
                            {item.earlier} → {item.latest}
                          </span>
                        </div>
                      ))}
                  </div>
                </section>

                {/* DISCLAIMER */}
                <div className="disclaimer">
                  <p>
                    This comparison shows changes in your recorded test results. It is provided for informational purposes and does not constitute a medical diagnosis. If you have concerns about your results, discuss them with a healthcare professional.
                  </p>
                </div>
              </>
            )}
          </>
        )}

      </main>

    </div>
  );
}

export default Compare;
