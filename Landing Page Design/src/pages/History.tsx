import { useEffect, useState } from "react";
import Header from "../components/history/Header";
import PatientSelector from "../components/history/PatientSelector";
import TestHistory from "../components/history/TestHistory";
import TrendCard from "../components/history/TrendCard";
import TrendGraph from "../components/history/TrendGraph";
import MonitoringSummary from "../components/history/MonitoringSummary";
import { getTestHistory } from "../services/historyUrineTestApi";
import "../styles/History.css";

export default function History() {
  const [patient, setPatient] = useState("");
  const [testHistory, setTestHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [status, setStatus] = useState("Stable");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const loadTestHistory = async () => {
    if (!patient) {
      setTestHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getTestHistory(patient);
      setTestHistory(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      setError("Unable to retrieve test history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestHistory();
  }, [patient]);

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

  return (
    <div className="history-monitor">
      <div className="app">
        <Header status={status} />
        <PatientSelector patient={patient} setPatient={setPatient} onRefresh={loadTestHistory} loading={loading} />
        {!patient && <div className="message">Please select a patient to view their urine test history.</div>}
        {patient && loading && <div className="message loading">Retrieving test history...</div>}
        {error && <div className="message error">{error}<br />Please try again.</div>}
        {patient && !loading && !error && testHistory.length > 0 && <>
          <div className="stats">
            <div className="stat-card"><span>Total Tests</span><strong>{testHistory.length}</strong></div>
            <div className="stat-card"><span>First Test</span><strong>{testHistory[0].date}</strong></div>
            <div className="stat-card"><span>Latest Test</span><strong>{testHistory[testHistory.length - 1].date}</strong></div>
          </div>
          <TestHistory tests={testHistory} />
          <section className="section">
            <div className="section-header"><div><h2>Trend Analysis</h2><p>Parameter changes across previous tests</p></div></div>
            <div className="trend-grid">{trends.map((trend) => <TrendCard key={trend.parameter} parameter={trend.parameter} values={trend.values} trend={trend.trend} />)}</div>
          </section>
          <TrendGraph tests={testHistory} />
          <MonitoringSummary status={status} changedParameters={changedParameters} />
          <div className="updated">Last Updated: {lastUpdated}</div>
        </>}
        {patient && !loading && !error && testHistory.length === 0 && <div className="message">No previous urine tests found.</div>}
      </div>
    </div>
  );
}
