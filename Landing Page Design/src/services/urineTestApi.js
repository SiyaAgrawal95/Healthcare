const patientTestHistory = {
  // DEMO PATIENT - For demonstration purposes only
  "PAT-1000": [
    {
      id: "test-1000-001",
      date: "20 Jul 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 5.8,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-1000-002",
      date: "27 Jul 2026",
      glucose: "Negative",
      protein: "Trace",
      ph: 6.0,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-1000-003",
      date: "03 Aug 2026",
      glucose: "Trace",
      protein: "Trace",
      ph: 6.2,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-1000-004",
      date: "10 Aug 2026",
      glucose: "Trace",
      protein: "Negative",
      ph: 6.1,
      ketones: "Negative",
      blood: "Trace",
    },
    {
      id: "test-1000-005",
      date: "17 Aug 2026",
      glucose: "Moderate",
      protein: "Trace",
      ph: 6.4,
      ketones: "Negative",
      blood: "Trace",
    },
  ],
  "Patient 001": [
    {
      id: "test-001-001",
      date: "08 Aug 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 6.0,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-001-002",
      date: "15 Aug 2026",
      glucose: "Trace",
      protein: "Negative",
      ph: 6.2,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-001-003",
      date: "23 Aug 2026",
      glucose: "Small",
      protein: "Trace",
      ph: 6.1,
      ketones: "Negative",
      blood: "Negative",
    },
  ],
  "Patient 002": [
    {
      id: "test-002-001",
      date: "05 Aug 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 6.5,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-002-002",
      date: "12 Aug 2026",
      glucose: "Trace",
      protein: "Negative",
      ph: 6.8,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-002-003",
      date: "20 Aug 2026",
      glucose: "Small",
      protein: "Trace",
      ph: 6.6,
      ketones: "Trace",
      blood: "Negative",
    },
  ],
  "Patient 003": [
    {
      id: "test-003-001",
      date: "02 Aug 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 6.0,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-003-002",
      date: "10 Aug 2026",
      glucose: "Negative",
      protein: "Trace",
      ph: 6.0,
      ketones: "Small",
      blood: "Negative",
    },
    {
      id: "test-003-003",
      date: "18 Aug 2026",
      glucose: "Trace",
      protein: "Small",
      ph: 5.8,
      ketones: "Small",
      blood: "Trace",
    },
  ],
  "Patient 004": [
    {
      id: "test-004-001",
      date: "01 Aug 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 7.0,
      ketones: "Negative",
      blood: "Negative",
    },
    {
      id: "test-004-002",
      date: "09 Aug 2026",
      glucose: "Negative",
      protein: "Negative",
      ph: 7.0,
      ketones: "Negative",
      blood: "Trace",
    },
    {
      id: "test-004-003",
      date: "17 Aug 2026",
      glucose: "Negative",
      protein: "Trace",
      ph: 6.8,
      ketones: "Negative",
      blood: "Small",
    },
  ],
};

export const getPatientTestHistory = (patient) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (patientTestHistory[patient]) {
        resolve(patientTestHistory[patient]);
      } else {
        reject(new Error("Patient data not found"));
      }
    }, 1000);
  });
};

export const getTestById = (patient, testId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tests = patientTestHistory[patient];
      if (tests) {
        const test = tests.find((t) => t.id === testId);
        if (test) {
          resolve(test);
        } else {
          reject(new Error("Test not found"));
        }
      } else {
        reject(new Error("Patient data not found"));
      }
    }, 500);
  });
};

export const getPreviousTestResults = (patient) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tests = patientTestHistory[patient];
      if (tests && tests.length > 0) {
        resolve(tests[tests.length - 1]);
      } else {
        reject(new Error("Patient data not found"));
      }
    }, 1200);
  });
};

export const analyzeCurrentTest = (currentTest) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentTest);
    }, 1500);
  });
};
