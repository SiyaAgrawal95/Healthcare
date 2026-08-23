const patientData = {
  "Patient 001": [
    { date: "12 Aug 2026", glucose: "Negative", protein: "Negative", ph: 6.0, ketones: "Negative", blood: "Negative" },
    { date: "15 Aug 2026", glucose: "Trace", protein: "Negative", ph: 6.2, ketones: "Trace", blood: "Negative" },
    { date: "17 Aug 2026", glucose: "Trace", protein: "Trace", ph: 6.5, ketones: "Moderate", blood: "Negative" },
  ],
  "Patient 002": [
    { date: "10 Aug 2026", glucose: "Negative", protein: "Negative", ph: 6.1, ketones: "Negative", blood: "Negative" },
    { date: "14 Aug 2026", glucose: "Negative", protein: "Trace", ph: 6.0, ketones: "Negative", blood: "Negative" },
    { date: "18 Aug 2026", glucose: "Negative", protein: "Negative", ph: 6.2, ketones: "Negative", blood: "Negative" },
  ],
  "Patient 003": [
    { date: "11 Aug 2026", glucose: "Trace", protein: "Negative", ph: 5.8, ketones: "Trace", blood: "Negative" },
    { date: "15 Aug 2026", glucose: "Negative", protein: "Negative", ph: 6.0, ketones: "Negative", blood: "Negative" },
    { date: "18 Aug 2026", glucose: "Negative", protein: "Negative", ph: 6.1, ketones: "Negative", blood: "Negative" },
  ],
  "Patient 004": [],
};

export const getTestHistory = (patient) => new Promise((resolve) => {
  setTimeout(() => resolve(patientData[patient] || []), 1000);
});
