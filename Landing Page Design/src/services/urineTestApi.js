import { apiRequest } from "./apiClient";

const QUALITATIVE_LABELS = {
  negative: "Negative",
  trace: "Trace",
  small: "Small",
  moderate: "Moderate",
  large: "Large",
  positive: "Positive",
  normal: "Normal",
  abnormal: "Abnormal",
  not_readable: "Not readable",
};

const asUiValue = (value) => {
  if (typeof value !== "string") return value ?? null;
  return QUALITATIVE_LABELS[value.toLowerCase()] || value;
};

export function normalizeTest(test) {
  const values = Object.fromEntries((test.parameters || []).map((parameter) => [parameter.name, asUiValue(parameter.value)]));
  const observedAt = test.observedAt;
  const date = observedAt
    ? new Date(observedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "Date unavailable";

  return {
    ...values,
    id: test._id,
    testId: test._id,
    date,
    observedAt,
    source: test.source,
    notes: test.notes,
    glucose: values.glucose ?? null,
    protein: values.protein ?? null,
    ph: values.ph == null || !Number.isFinite(Number(values.ph)) ? null : Number(values.ph),
    ketones: values.ketones ?? null,
    blood: values.blood ?? null,
    parameters: test.parameters || [],
    analysis: test.analysis,
  };
}

export async function getPatientTestHistory(patientMongoId) {
  if (!patientMongoId) throw new Error("Patient account is unavailable. Please log in again.");
  const { tests } = await apiRequest(`/patients/${encodeURIComponent(patientMongoId)}/tests?limit=100`);
  return tests.map(normalizeTest).sort((a, b) => new Date(a.observedAt) - new Date(b.observedAt));
}

export async function getTestById(_patientMongoId, testId) {
  const { test } = await apiRequest(`/tests/${encodeURIComponent(testId)}`);
  return normalizeTest(test);
}

export async function getPreviousTestResults(patientMongoId) {
  const tests = await getPatientTestHistory(patientMongoId);
  if (!tests.length) throw new Error("No previous test results found.");
  return tests[tests.length - 1];
}

export async function saveUrineTest(patientMongoId, testData) {
  const { test } = await apiRequest(`/patients/${encodeURIComponent(patientMongoId)}/tests`, {
    method: "POST",
    body: JSON.stringify(testData),
  });
  return normalizeTest(test);
}

export async function updateUrineTest(testId, updates) {
  const { test } = await apiRequest(`/tests/${encodeURIComponent(testId)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  return normalizeTest(test);
}
