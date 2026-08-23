function MonitoringAlert({
  status,
  changedParameters,
}) {
  if (!status) {
    return null;
  }

  if (status === "Stable") {
    return (
      <div className="monitoring-alert stable">

        <div className="alert-symbol">
          ✓
        </div>

        <div>
          <h3>
            No Significant Changes
          </h3>

          <p>
            The latest test results show no
            significant changes from the previous
            test.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="monitoring-alert attention">

      <div className="alert-symbol">
        !
      </div>

      <div>
        <h3>
          Changes Detected
        </h3>

        <p>
          Changes detected in{" "}
          <strong>
            {changedParameters.join(", ")}
          </strong>
          .
        </p>

        <span>
          Please review the latest results with a
          healthcare professional.
        </span>
      </div>

    </div>
  );
}

export default MonitoringAlert;
