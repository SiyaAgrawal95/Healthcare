import TestHistoryRow from "./TestHistoryRow";

function TestHistory({ tests }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>Test History</h2>
        <span>{tests.length} tests</span>
      </div>
      {tests.length === 0 ? (
        <div className="empty">No previous urine tests found.</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Date</th><th>Glucose</th><th>Protein</th><th>pH</th><th>Ketones</th><th>Blood</th></tr></thead>
            <tbody>{tests.map((test, index) => <TestHistoryRow key={index} test={test} />)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TestHistory;
