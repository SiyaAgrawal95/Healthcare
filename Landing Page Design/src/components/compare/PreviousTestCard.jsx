function PreviousTestCard({ results }) {

  return (
    <div className="test-card">

      <div className="card-top">

        <div>
          <span className="card-label">
            PREVIOUS TEST
          </span>

          <h2>
            {results?.date || "No test selected"}
          </h2>
        </div>

        <div className="card-icon previous">
          P
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
          Select a patient to retrieve
          previous results.
        </div>

      )}

    </div>
  );
}

export default PreviousTestCard;
