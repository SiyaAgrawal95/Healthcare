function TestSelector({
  availableTests,
  earlierTest,
  latestTest,
  onEarlierTestChange,
  onLatestTestChange,
  onCompare,
  isComparing,
}) {
  const handleCompareClick = () => {
    if (earlierTest && latestTest && earlierTest !== latestTest) {
      onCompare();
    }
  };

  const isCompareDisabled = !earlierTest || !latestTest || earlierTest === latestTest || isComparing;

  return (
    <div className="test-selector-section">
      <div className="section-header">
        <h2>Compare two tests</h2>
        <p>Select two different test results to compare</p>
      </div>

      <div className="test-selector-grid">
        <div className="test-selector-card">
          <label htmlFor="earlier-test">Earlier Test</label>
          <select
            id="earlier-test"
            value={earlierTest}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e) => onEarlierTestChange(e.target.value)}
            disabled={!availableTests || availableTests.length === 0}
          >
            <option value="">Select test</option>
            {availableTests &&
              availableTests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.date}
                </option>
              ))}
          </select>
        </div>

        <div className="vs-divider">
          <span>VS</span>
        </div>

        <div className="test-selector-card">
          <label htmlFor="latest-test">Latest Test</label>
          <select
            id="latest-test"
            value={latestTest}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e) => onLatestTestChange(e.target.value)}
            disabled={!availableTests || availableTests.length === 0}
          >
            <option value="">Select test</option>
            {availableTests &&
              availableTests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.date}
                </option>
              ))}
          </select>
        </div>
      </div>

      <button
        className="compare-button"
        onClick={handleCompareClick}
        disabled={isCompareDisabled}
      >
        {isComparing ? "Comparing..." : "Compare Results"}
      </button>

      {earlierTest && latestTest && earlierTest === latestTest && (
        <p className="validation-message">
          Please select two different tests to compare.
        </p>
      )}
    </div>
  );
}

export default TestSelector;
