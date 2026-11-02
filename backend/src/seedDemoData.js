import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Patient from "./models/Patient.js";
import UrineTest from "./models/UrineTest.js";

const DEMO_EMAIL = "demo@urinex.local";
const DEMO_PASSWORD = "DemoPass123!";
const uri = process.env.MONGODB_URI;

if (!uri) throw new Error("MONGODB_URI is required. Configure backend/.env first.");
const mongoUrl = new URL(uri);
const databaseName = decodeURIComponent(mongoUrl.pathname.replace(/^\/+/, ""));
if (process.env.NODE_ENV === "production" || !["localhost", "127.0.0.1"].includes(mongoUrl.hostname) || databaseName !== "urinex") {
  throw new Error("Demo seeding is restricted to the local urinex database. No records were written.");
}

const colorReading = (hex, intensity) => ({
  colorHex: hex,
  red: Number.parseInt(hex.slice(1, 3), 16),
  green: Number.parseInt(hex.slice(3, 5), 16),
  blue: Number.parseInt(hex.slice(5, 7), 16),
  intensity,
});

const parameter = (name, value, status, hex, intensity, unit = undefined) => ({
  name,
  value,
  status,
  ...(unit ? { unit } : {}),
  ...(typeof value === "string" && ["negative", "trace", "small", "moderate", "large", "positive"].includes(value)
    ? { interpretation: value }
    : {}),
  confidence: 0.96,
  color: colorReading(hex, intensity),
});

const buildParameters = (traceLevel = 0) => [
  parameter("glucose", traceLevel > 0 ? "trace" : "negative", traceLevel > 0 ? "borderline" : "normal", traceLevel > 0 ? "#d9b274" : "#e5f0d0", traceLevel > 0 ? 0.73 : 0.42, "mg/dL"),
  parameter("bilirubin", "negative", "normal", "#eee6c8", 0.38),
  parameter("ketones", "negative", "normal", "#e9e3c1", 0.4, "mg/dL"),
  parameter("specificGravity", [1.018, 1.021, 1.024][traceLevel], "normal", "#e5cb52", 0.62),
  parameter("blood", "negative", "normal", "#dacc50", 0.48),
  parameter("ph", [6.0, 6.2, 6.4][traceLevel], "normal", "#b3c36a", 0.51, "pH"),
  parameter("protein", traceLevel > 1 ? "trace" : "negative", traceLevel > 1 ? "borderline" : "normal", traceLevel > 1 ? "#d9b274" : "#d9c95c", traceLevel > 1 ? 0.7 : 0.44, "mg/dL"),
  parameter("urobilinogen", 0.2, "normal", "#ebc94b", 0.5, "mg/dL"),
  parameter("nitrite", "negative", "normal", "#f3e8cf", 0.35),
  parameter("leukocytes", "negative", "normal", "#ede3d0", 0.37),
];

try {
  await mongoose.connect(uri);
  let patient = await Patient.findOne({ email: DEMO_EMAIL }).select("+passwordHash");
  if (patient && !patient.isDemo) {
    throw new Error(`${DEMO_EMAIL} already belongs to a non-demo account; refusing to modify it.`);
  }

  if (!patient) {
    patient = await Patient.create({
      fullName: "URINEX Demo Patient (Synthetic Data)",
      email: DEMO_EMAIL,
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 12),
      dateOfBirth: "1990-01-01",
      gender: "prefer-not-to-say",
      phoneNumber: "0000000000",
      isDemo: true,
    });
  } else {
    patient.passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    patient.isActive = true;
    await patient.save();
  }

  const observations = [
    { observedAt: new Date("2026-10-11T08:00:00.000Z"), level: 0 },
    { observedAt: new Date("2026-10-19T08:00:00.000Z"), level: 1 },
    { observedAt: new Date("2026-10-27T08:00:00.000Z"), level: 2 },
  ];

  for (const observation of observations) {
    await UrineTest.findOneAndUpdate(
      { patient: patient._id, source: "demo", observedAt: observation.observedAt },
      {
        patient: patient._id,
        observedAt: observation.observedAt,
        source: "demo",
        stripManufacturer: "Synthetic demo strip",
        stripLotNumber: "DEMO-NOT-CLINICAL",
        parameters: buildParameters(observation.level),
        analysis: {
          status: "complete",
          summary: "SYNTHETIC DEMONSTRATION DATA. This is not a clinical result or medical assessment.",
          flags: observation.level > 0 ? ["demo-only simulated variation"] : [],
          recommendations: [],
          confidence: 0.96,
          modelName: "demo-seed",
          modelVersion: "1.0",
          analyzedAt: observation.observedAt,
        },
        notes: "Synthetic seeded preview data only. Not from a patient or analyzer.",
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  console.info("Seeded one synthetic demo patient and three demo urine tests in the local urinex database.");
  console.info(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
} finally {
  await mongoose.disconnect();
}
