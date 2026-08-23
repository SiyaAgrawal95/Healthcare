import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import Header from "../components/history/Header";
import TestHistory from "../components/history/TestHistory";
import TrendCard from "../components/history/TrendCard";
import TrendGraph from "../components/history/TrendGraph";
import MonitoringSummary from "../components/history/MonitoringSummary";
import { getTestHistory } from "../services/historyUrineTestApi";
import "../styles/History.css";

export default function History() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  const [testHistory, setTestHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [status, setStatus] = useState("Stable");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [timePeriod, setTimePeriod] = useState("monthly");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const loadTestHistory = useCallback(async () => {
    if (!currentUser?.patientId) {
      setTestHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getTestHistory(currentUser.patientId);
      setTestHistory(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      setError("Unable to retrieve test history.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.patientId]);

  useEffect(() => {
    loadTestHistory();
  }, [loadTestHistory]);

  const getLevel = (value) => ({ Negative: 0, Trace: 1, Small: 1, Moderate: 2, Large: 3 }[value] ?? 0);

  const calculateTrend = (values) => {
    if (values.length < 2) return "Stable";
    const first = values[0];
    const last = values[values.length - 1];
    if (typeof first === "number" && typeof last === "number") {
      if (last > first) return "Increasing";
      if (last < first) return "Decreasing";
      return "Stable";
    }
    const firstLevel = getLevel(first);
    const lastLevel = getLevel(last);
    if (lastLevel > firstLevel) return "Increasing";
    if (lastLevel < firstLevel) return "Decreasing";
    return "Stable";
  };

  useEffect(() => {
    if (testHistory.length === 0) {
      setTrends([]);
      setStatus("Stable");
      return;
    }
    const parameters = [
      { name: "Glucose", values: testHistory.map((test) => test.glucose) },
      { name: "Protein", values: testHistory.map((test) => test.protein) },
      { name: "pH", values: testHistory.map((test) => test.ph) },
      { name: "Ketones", values: testHistory.map((test) => test.ketones) },
      { name: "Blood", values: testHistory.map((test) => test.blood) },
    ];
    const calculatedTrends = parameters.map((parameter) => ({ ...parameter, parameter: parameter.name, trend: calculateTrend(parameter.values) }));
    setTrends(calculatedTrends);
    setStatus(calculatedTrends.some((item) => item.trend !== "Stable") ? "Changes Detected" : "Stable");
  }, [testHistory]);

  const changedParameters = trends.filter((trend) => trend.trend !== "Stable").map((trend) => trend.parameter);

  if (!currentUser) {
    return null;
  }

  const getFilteredTests = () => {
    if (!testHistory || testHistory.length === 0) return [];
    
    const now = new Date();
    const filtered = testHistory.filter((test) => {
      try {
        const testDate = new Date(test.date);
        const daysAgo = (now.getTime() - testDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (timePeriod === "weekly") return daysAgo <= 7;
        if (timePeriod === "monthly") return daysAgo <= 30;
        if (timePeriod === "annual") return daysAgo <= 365;
        return true;
      } catch {
        return true;
      }
    });
    
    return filtered.length > 0 ? filtered : testHistory;
  };

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const displayedTests = getFilteredTests();

  return (
    <div className="history-monitor">
      <div className="app">
        <Header status={status} />
        <div className="controls">
          <div className="time-period-selector">
            <label>View Period</label>
            <div className="period-buttons">
              <button 
                className={timePeriod === "weekly" ? "active" : ""}
                onClick={() => handleTimePeriodChange("weekly")}
              >
                Weekly
              </button>
              <button 
                className={timePeriod === "monthly" ? "active" : ""}
                onClick={() => handleTimePeriodChange("monthly")}
              >
                Monthly
              </button>
              <button 
                className={timePeriod === "annual" ? "active" : ""}
                onClick={() => handleTimePeriodChange("annual")}
              >
                Annual
              </button>
            </div>
          </div>
          <button onClick={loadTestHistory} disabled={loading}>
            {loading ? "Retrieving..." : "↻ Refresh History"}
          </button>
        </div>
        {loading && <div className="message loading">Retrieving test history...</div>}
        {error && <div className="message error">{error}<br />Please try again.</div>}
        {!loading && !error && testHistory.length > 0 && <>
          <div className="stats">
            <div className="stat-card"><span>Total Tests ({timePeriod})</span><strong>{displayedTests.length}</strong></div>
            <div className="stat-card"><span>First Test</span><strong>{displayedTests[0]?.date || 'N/A'}</strong></div>
            <div className="stat-card"><span>Latest Test</span><strong>{displayedTests[displayedTests.length - 1]?.date || 'N/A'}</strong></div>
          </div>
          <TestHistory tests={displayedTests} />
          <section className="section">
            <div className="section-header"><div><h2>Trend Analysis</h2><p>Parameter changes across previous tests</p></div></div>
            <div className="trend-grid">{trends.map((trend) => <TrendCard key={trend.parameter} parameter={trend.parameter} values={trend.values} trend={trend.trend} />)}</div>
          </section>
          <TrendGraph tests={testHistory} />
          <MonitoringSummary status={status} changedParameters={changedParameters} />
          <div className="updated">Last Updated: {lastUpdated}</div>
        </>}
        {currentUser && !loading && !error && testHistory.length === 0 && <div className="message">No previous urine tests found.</div>}
      </div>
    </div>
  );
}
