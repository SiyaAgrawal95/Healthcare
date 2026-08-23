function TestUpload({
  formData,
  onInputChange,
  onImageChange,
  onSubmit,
  stripImage,
}) {
  return (
    <section className="upload-section">

      <div className="section-title">

        <div>
          <span className="eyebrow">
            NEW ANALYSIS
          </span>

          <h2>Enter Current Test</h2>

          <p>
            Enter the latest AI-analyzed urine
            test values.
          </p>
        </div>

      </div>


      <form onSubmit={onSubmit}>

        <div className="form-grid">

          <div className="form-group">

            <label>Test Date</label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={onInputChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Glucose</label>

            <select
              name="glucose"
              value={formData.glucose}
              onChange={onInputChange}
              required
            >

              <option value="">
                Select result
              </option>

              <option value="Negative">
                Negative
              </option>

              <option value="Trace">
                Trace
              </option>

              <option value="Small">
                Small
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Large">
                Large
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>Protein</label>

            <select
              name="protein"
              value={formData.protein}
              onChange={onInputChange}
              required
            >

              <option value="">
                Select result
              </option>

              <option value="Negative">
                Negative
              </option>

              <option value="Trace">
                Trace
              </option>

              <option value="Small">
                Small
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Large">
                Large
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>pH</label>

            <input
              type="number"
              name="ph"
              min="0"
              max="14"
              step="0.1"
              placeholder="0 - 14"
              value={formData.ph}
              onChange={onInputChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Ketones</label>

            <select
              name="ketones"
              value={formData.ketones}
              onChange={onInputChange}
              required
            >

              <option value="">
                Select result
              </option>

              <option value="Negative">
                Negative
              </option>

              <option value="Trace">
                Trace
              </option>

              <option value="Small">
                Small
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Large">
                Large
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>Blood</label>

            <select
              name="blood"
              value={formData.blood}
              onChange={onInputChange}
              required
            >

              <option value="">
                Select result
              </option>

              <option value="Negative">
                Negative
              </option>

              <option value="Trace">
                Trace
              </option>

              <option value="Small">
                Small
              </option>

              <option value="Moderate">
                Moderate
              </option>

              <option value="Large">
                Large
              </option>

            </select>

          </div>

        </div>


        <div className="upload-area">

          <div className="upload-symbol">
            ↑
          </div>

          <div>

            <strong>
              Upload strip image
            </strong>

            <p>
              PNG, JPG or JPEG
            </p>

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />

          {stripImage && (
            <span className="file-name">
              {stripImage.name}
            </span>
          )}

        </div>


        <button
          type="submit"
          className="compare-button"
        >
          Analyze & Compare
          <span>→</span>
        </button>

      </form>

    </section>
  );
}

export default TestUpload;
