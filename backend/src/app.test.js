import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import mongoose from "mongoose";
import app from "./app.js";

const testDatabase = `urinex_test_${Date.now()}`;
let server;
let api;
let patient;
let token;
let testId;
let secondPatient;
let secondToken;

async function request(path, { method = "GET", body, authToken } = {}) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return {
    status: response.status,
    data: response.status === 204 ? null : await response.json(),
  };
}

describe("URINEX API integration", { concurrency: false }, () => {
  before(async () => {
    assert.ok(process.env.MONGODB_URI, "Set MONGODB_URI in backend/.env before testing.");
    assert.ok(process.env.JWT_SECRET?.length >= 32, "Set a JWT_SECRET with at least 32 characters.");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: testDatabase,
      serverSelectionTimeoutMS: 5000,
    });
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
    api = `http://127.0.0.1:${server.address().port}/api`;
  });

  after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  it("reports API health", async () => {
    const result = await request("/health");
    assert.equal(result.status, 200);
    assert.equal(result.data.status, "ok");
  });

  it("registers patients with an opaque password hash and patient ID", async () => {
    const result = await request("/auth/register", {
      method: "POST",
      body: {
        fullName: "Test Patient One",
        email: `patient-one-${testDatabase}@example.test`,
        password: "StrongTestPassword123",
        dateOfBirth: "1993-04-12",
        gender: "prefer-not-to-say",
        phoneNumber: "5551234567",
      },
    });
    assert.equal(result.status, 201);
    assert.ok(result.data.token);
    assert.match(result.data.patient.patientId, /^PAT-/);
    assert.equal("passwordHash" in result.data.patient, false);
    patient = result.data.patient;
    token = result.data.token;
  });

  it("rejects duplicate email registration and incorrect passwords", async () => {
    const duplicate = await request("/auth/register", {
      method: "POST",
      body: {
        fullName: "Duplicate Patient",
        email: patient.email,
        password: "StrongTestPassword123",
        dateOfBirth: "1993-04-12",
      },
    });
    assert.equal(duplicate.status, 409);

    const invalidLogin = await request("/auth/login", {
      method: "POST",
      body: { email: patient.email, password: "incorrect-password" },
    });
    assert.equal(invalidLogin.status, 401);
  });

  it("authenticates patients and protects profile routes", async () => {
    const unauthenticated = await request("/patients/me");
    assert.equal(unauthenticated.status, 401);

    const login = await request("/auth/login", {
      method: "POST",
      body: { email: patient.email, password: "StrongTestPassword123" },
    });
    assert.equal(login.status, 200);
    assert.equal(login.data.patient._id, patient._id);
    token = login.data.token;

    const profile = await request("/patients/me", { authToken: token });
    assert.equal(profile.status, 200);
    assert.equal(profile.data.patient.email, patient.email);
  });

  it("updates and reloads patient clinical profile fields", async () => {
    const update = await request("/patients/me", {
      method: "PATCH",
      authToken: token,
      body: {
        age: 33,
        bloodGroup: "A+",
        allergies: ["medication"],
        symptoms: "Integration test symptom",
        testDate: "2026-10-19",
        additionalNotes: "Temporary test record",
      },
    });
    assert.equal(update.status, 200);
    assert.equal(update.data.patient.age, 33);
    assert.equal(update.data.patient.bloodGroup, "A+");

    const profile = await request("/patients/me", { authToken: token });
    assert.equal(profile.data.patient.symptoms, "Integration test symptom");
    assert.equal(profile.data.patient.additionalNotes, "Temporary test record");
  });

  it("creates patient-owned tests with colorimetry and analysis data", async () => {
    const result = await request(`/patients/${patient._id}/tests`, {
      method: "POST",
      authToken: token,
      body: {
        observedAt: "2026-10-19T08:30:00.000Z",
        source: "demo",
        parameters: [
          {
            name: "glucose",
            value: "trace",
            unit: "mg/dL",
            interpretation: "trace",
            status: "borderline",
            confidence: 0.94,
            color: {
              colorHex: "#d9b274",
              red: 217,
              green: 178,
              blue: 116,
              intensity: 0.73,
              lab: { l: 74.2, a: 4.1, b: 31.7 },
              referenceColor: "#d7b070",
              deltaE: 2.8,
            },
          },
          { name: "ph", value: 6.5, status: "normal", confidence: 0.98 },
        ],
        analysis: {
          status: "complete",
          summary: "Synthetic demo output; not measured from an uploaded image.",
          flags: ["glucose:trace"],
          recommendations: ["Follow-up recommendation"],
          confidence: 0.91,
          modelName: "test-reader",
          modelVersion: "1.0",
        },
      },
    });
    assert.equal(result.status, 201);
    assert.equal(result.data.test.parameters[0].color.intensity, 0.73);
    assert.deepEqual(result.data.test.parameters[0].color.lab, { l: 74.2, a: 4.1, b: 31.7 });
    assert.equal(result.data.test.analysis.status, "complete");
    testId = result.data.test._id;
  });

  it("lists, reads, and updates patient test records", async () => {
    const list = await request(`/patients/${patient._id}/tests?page=1&limit=10`, { authToken: token });
    assert.equal(list.status, 200);
    assert.equal(list.data.total, 1);
    assert.equal(list.data.tests[0]._id, testId);
    assert.equal(list.data.tests[0].source, "demo");

    const read = await request(`/tests/${testId}`, { authToken: token });
    assert.equal(read.status, 200);
    assert.equal(read.data.test.parameters[0].color.red, 217);

    const update = await request(`/tests/${testId}`, {
      method: "PATCH",
      authToken: token,
      body: { analysis: { status: "needs_review", flags: ["manual review"] } },
    });
    assert.equal(update.status, 200);
    assert.equal(update.data.test.analysis.status, "needs_review");
  });

  it("rejects duplicate strip pads and cross-patient access", async () => {
    const duplicatePad = await request(`/patients/${patient._id}/tests`, {
      method: "POST",
      authToken: token,
      body: { parameters: [{ name: "ph", value: 6 }, { name: "ph", value: 7 }] },
    });
    assert.equal(duplicatePad.status, 400);

    const registerSecond = await request("/auth/register", {
      method: "POST",
      body: {
        fullName: "Test Patient Two",
        email: `patient-two-${testDatabase}@example.test`,
        password: "StrongTestPassword123",
        dateOfBirth: "1992-02-10",
      },
    });
    assert.equal(registerSecond.status, 201);
    secondPatient = registerSecond.data.patient;
    secondToken = registerSecond.data.token;

    const otherTest = await request(`/tests/${testId}`, { authToken: secondToken });
    assert.equal(otherTest.status, 404);
    const otherHistory = await request(`/patients/${patient._id}/tests`, { authToken: secondToken });
    assert.equal(otherHistory.status, 403);
  });

  it("deletes tests and revokes tokens after patient deactivation", async () => {
    const deleted = await request(`/tests/${testId}`, { method: "DELETE", authToken: token });
    assert.equal(deleted.status, 204);
    const missing = await request(`/tests/${testId}`, { authToken: token });
    assert.equal(missing.status, 404);

    const deactivated = await request("/patients/me", { method: "DELETE", authToken: token });
    assert.equal(deactivated.status, 204);
    const revoked = await request("/patients/me", { authToken: token });
    assert.equal(revoked.status, 401);
  });
});
