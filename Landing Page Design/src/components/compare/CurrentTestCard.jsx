function CurrentTestCard({ results }) {

  return (
    <div className="test-card">

      <div className="card-top">

        <div>
          <span className="card-label">
            CURRENT TEST
          </span>

          <h2>
            {results?.date || "Awaiting test"}
          </h2>
        </div>

        <div className="card-icon current">
          C
        </div>

      </div>


      {results ? (

        <div className="test-values">

          <div>
            <span>Glucose</span>
            <strong>{results.glucose}</strong>
          </div>

          <div>
            <span>Protein</span>
            <strong>{results.protein}</strong>
          </div>

          <div>
            <span>pH</span>
            <strong>{results.ph}</strong>
          </div>

          <div>
            <span>Ketones</span>
            <strong>{results.ketones}</strong>
          </div>

          <div>
            <span>Blood</span>
            <strong>{results.blood}</strong>
          </div>

        </div>

      ) : (

        <div className="card-empty">
          Enter your latest test results
          below to analyze them.
        </div>

      )}

    </div>
  );
}

export default CurrentTestCard;
