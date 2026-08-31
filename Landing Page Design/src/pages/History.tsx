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
    const filteredTests = getFilteredTests();

    if (filteredTests.length === 0) {
      setTrends([]);
      setStatus("Stable");
      return;
    }
    const parameters = [
      { name: "Glucose", values: filteredTests.map((test) => test.glucose) },
      { name: "Protein", values: filteredTests.map((test) => test.protein) },
      { name: "pH", values: filteredTests.map((test) => test.ph) },
      { name: "Ketones", values: filteredTests.map((test) => test.ketones) },
      { name: "Blood", values: filteredTests.map((test) => test.blood) },
    ];
    const calculatedTrends = parameters.map((parameter) => ({ ...parameter, parameter: parameter.name, trend: calculateTrend(parameter.values) }));
    setTrends(calculatedTrends);
    setStatus(calculatedTrends.some((item) => item.trend !== "Stable") ? "Changes Detected" : "Stable");
  }, [testHistory, timePeriod]);

  const changedParameters = trends.filter((trend) => trend.trend !== "Stable").map((trend) => trend.parameter);

  if (!currentUser) {
    return null;
  }

  const getFilteredTests = () => {
    if (!testHistory || testHistory.length === 0) return [];

    const monthIndexes = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const parseTestDate = (date) => {
      if (typeof date !== "string") return null;
      const match = /^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/.exec(date.trim());
      if (!match || monthIndexes[match[2]] === undefined) return null;

      const year = Number(match[3]);
      const month = monthIndexes[match[2]];
      const day = Number(match[1]);
      const timestamp = new Date(Date.UTC(year, month, day));

      if (
        timestamp.getUTCFullYear() !== year ||
        timestamp.getUTCMonth() !== month ||
        timestamp.getUTCDate() !== day
      ) return null;

      return timestamp;
    };

    const datedTests = testHistory
      .map((test) => ({ test, date: parseTestDate(test.date) }))
      .filter(({ date }) => date !== null);

    if (datedTests.length === 0) return [];

    const latestDate = new Date(Math.max(...datedTests.map(({ date }) => date.getTime())));
    const daysInPeriod = { weekly: 7, monthly: 30, annual: 365 }[timePeriod];
    const startDate = new Date(latestDate);
    startDate.setUTCDate(latestDate.getUTCDate() - (daysInPeriod - 1));

    return datedTests
      .filter(({ date }) => date >= startDate && date <= latestDate)
      .map(({ test }) => test);
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
          <TrendGraph tests={displayedTests} />
          <MonitoringSummary status={status} changedParameters={changedParameters} />
          <div className="updated">Last Updated: {lastUpdated}</div>
        </>}
        {currentUser && !loading && !error && testHistory.length === 0 && <div className="message">No previous urine tests found.</div>}
      </div>
    </div>
  );
}
