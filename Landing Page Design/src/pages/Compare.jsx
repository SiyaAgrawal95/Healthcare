import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getPatientTestHistory, getTestById } from "../services/urineTestApi";
import TestSelector from "../components/compare/TestSelector";
import ComparisonSummary from "../components/compare/ComparisonSummary";
import ComparisonChart from "../components/compare/ComparisonChart";
import ComparisonInsight from "../components/compare/ComparisonInsight";
import ComparisonCard from "../components/compare/ComparisonCard";
import "../styles/Compare.css";

function Compare() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [patient, setPatient] = useState(currentUser?._id || "");
  const [availableTests, setAvailableTests] = useState([]);
  const [earlierTest, setEarlierTest] = useState("");
  const [latestTest, setLatestTest] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCompared, setHasCompared] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setPatient(currentUser._id);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (patient) {
      loadPatientTests();
    }
  }, [patient]);

  const loadPatientTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const tests = await getPatientTestHistory(patient);
      setAvailableTests(tests);
      
      if (tests.length >= 2) {
        setEarlierTest(tests[0].testId);
        setLatestTest(tests[tests.length - 1].testId);
      }
    } catch (err) {
      setError("Failed to load patient test history");
    } finally {
      setLoading(false);
    }
  };

  const createComparison = (earlier, latest) => {
    const parameters = ["glucose", "protein", "ph", "ketones", "blood"];
    const comparison = [];
    
    let changedCount = 0;
    let stableCount = 0;
    let improvedCount = 0;

    parameters.forEach((param) => {
      const earlierValue = earlier[param];
      const latestValue = latest[param];
      
      let change = "No Change";
      
      if (param === "ph") {
        const earlierNum = Number(earlierValue);
        const latestNum = Number(latestValue);
        
        if (latestNum > earlierNum) {
          change = "Increased";
          changedCount++;
        } else if (latestNum < earlierNum) {
          change = "Decreased";
          improvedCount++;
        } else {
          stableCount++;
        }
      } else {
        const qualitativeScale = {
          Negative: 0,
          Trace: 1,
          Small: 2,
          Moderate: 3,
          Large: 4,
        };
        
        const earlierNum = qualitativeScale[earlierValue] || 0;
        const latestNum = qualitativeScale[latestValue] || 0;
        
        if (latestNum > earlierNum) {
          change = "Increased";
          changedCount++;
        } else if (latestNum < earlierNum) {
          change = "Decreased";
          improvedCount++;
        } else {
          stableCount++;
        }
      }
      
      comparison.push({
        key: param,
        parameter: param.charAt(0).toUpperCase() + param.slice(1),
        previous: earlierValue,
        current: latestValue,
        change,
      });
    });

    return {
      comparison,
      summary: {
        changed: changedCount,
        stable: stableCount,
        improved: improvedCount,
      },
    };
  };

  const handleCompare = async () => {
    if (!earlierTest || !latestTest) {
      setError("Please select both tests to compare");
      return;
    }

    if (earlierTest === latestTest) {
      setError("Please select different tests to compare");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [earlierData, latestData] = await Promise.all([
        getTestById(patient, earlierTest),
        getTestById(patient, latestTest),
      ]);

      const result = createComparison(earlierData, latestData);
      setComparisonData(result);
      setHasCompared(true);
    } catch (err) {
      setError("Failed to compare tests");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="compare-page">
      <div className="dashboard">
        <div className="topbar">
          <div className="brand">
            <div className="brand-icon">U</div>
            <div>
              <h2>URINEX</h2>
              <span>AI Health Monitoring</span>
            </div>
          </div>
          <div className="system-status">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>

        <div className="page-intro">
          <div>
            <span className="eyebrow">Compare Results</span>
            <h1>Compare Urine Test Results</h1>
            <p>Select two tests to compare and analyze changes</p>
          </div>
        </div>

        {loading && (
          <div className="loading-banner">
            <span className="spinner"></span>
            Loading test history...
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>!</span>
            {error}
          </div>
        )}

        {patient && availableTests.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Tests Found</h3>
            <p>This patient has no test records available for comparison.</p>
          </div>
        )}

        {patient && availableTests.length > 0 && (
          <>
            <div className="patient-info">
              <h2>{currentUser.fullName}</h2>
              <p>Patient ID: {currentUser.patientId} • {availableTests.length} test records available</p>
              {availableTests.some((test) => test.source === "demo") && <p>Synthetic demo values are included and are not clinical readings.</p>}
            </div>

            <div className="test-selector-section">
              <div className="section-header">
                <h2>Select Tests to Compare</h2>
                <p>Choose an earlier test and a latest test to compare</p>
              </div>
              <TestSelector
                availableTests={availableTests}
                earlierTest={earlierTest}
                latestTest={latestTest}
                onEarlierTestChange={setEarlierTest}
                onLatestTestChange={setLatestTest}
                onCompare={handleCompare}
              />
            </div>

            {hasCompared && comparisonData && (
              <>
                <div className="comparison-summary-section">
                  <div className="section-header">
                    <h2>Comparison Summary</h2>
                    <p>Quick overview of parameter changes</p>
                  </div>
                  <ComparisonSummary
                    changedCount={comparisonData.summary.changed}
                    stableCount={comparisonData.summary.stable}
                    improvedCount={comparisonData.summary.improved}
                  />
                </div>

                <div className="comparison-section">
                  <div className="section-header">
                    <h2>What Changed?</h2>
                    <p>Detailed comparison of each parameter</p>
                  </div>
                  <div className="comparison-cards">
                    {comparisonData.comparison.map((item) => (
                      <ComparisonCard
                        key={item.key}
                        parameter={item.parameter}
                        previous={item.previous}
                        current={item.current}
                        change={item.change}
                      />
                    ))}
                  </div>
                </div>

                <ComparisonChart
                  earlierTest={availableTests.find((t) => t.id === earlierTest)}
                  latestTest={availableTests.find((t) => t.id === latestTest)}
                  comparisonData={comparisonData.comparison}
                />

                <ComparisonInsight comparisonData={comparisonData.comparison} />

                <div className="overall-summary-section">
                  <div className="section-header">
                    <h2>Overall Summary</h2>
                    <p>Complete analysis of test comparison</p>
                  </div>
                  <div className="overall-summary-text">
                    {comparisonData.summary.changed > 0 ? (
                      <>
                        {comparisonData.summary.changed} parameter(s) changed between these tests.{" "}
                        {comparisonData.summary.improved > 0 && (
                          `${comparisonData.summary.improved} parameter(s) showed improvement. `
                        )}
                        {comparisonData.summary.stable > 0 && (
                          `${comparisonData.summary.stable} parameter(s) remained stable. `
                        )}
                      </>
                    ) : (
                      "All parameters remained stable between these two tests."
                    )}
                  </div>
                  <div className="changed-parameters-list">
                    {comparisonData.comparison
                      .filter((item) => item.change !== "No Change")
                      .map((item) => (
                        <div key={item.key} className="changed-parameter-item">
                          <span className="change-icon">
                            {item.change === "Increased" ? "↑" : "↓"}
                          </span>
                          <span className="parameter-name">{item.parameter}</span>
                          <span className="parameter-change">
                            {item.previous} → {item.current}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="disclaimer">
                  <p>
                    <strong>Disclaimer:</strong> This comparison is for informational purposes only and
                    should not be used for medical diagnosis. Please consult a healthcare professional
                    for proper medical advice and interpretation of your test results.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Compare;
