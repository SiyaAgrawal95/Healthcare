import mongoose from "mongoose";

const parameterNames = ["glucose", "bilirubin", "ketones", "specificGravity", "blood", "ph", "protein", "urobilinogen", "nitrite", "leukocytes"];
const qualitativeValues = ["negative", "trace", "small", "moderate", "large", "positive", "normal", "abnormal", "not_readable"];

const colorReadingSchema = new mongoose.Schema({
  colorHex: { type: String, match: /^#[0-9a-fA-F]{6}$/ },
  red: { type: Number, min: 0, max: 255 },
  green: { type: Number, min: 0, max: 255 },
  blue: { type: Number, min: 0, max: 255 },
  intensity: { type: Number, min: 0, max: 1 },
  lab: {
    l: { type: Number, min: 0, max: 100 },
    a: { type: Number, min: -128, max: 127 },
    b: { type: Number, min: -128, max: 127 },
  },
  referenceColor: { type: String, match: /^#[0-9a-fA-F]{6}$/ },
  deltaE: { type: Number, min: 0 },
}, { _id: false });

const parameterSchema = new mongoose.Schema({
  name: { type: String, enum: parameterNames, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  unit: { type: String, trim: true, maxlength: 30 },
  interpretation: { type: String, enum: qualitativeValues },
  status: { type: String, enum: ["normal", "abnormal", "borderline", "not_readable"], default: "not_readable" },
  color: { type: colorReadingSchema, default: undefined },
  confidence: { type: Number, min: 0, max: 1 },
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  status: { type: String, enum: ["pending", "complete", "needs_review", "failed"], default: "pending" },
  summary: { type: String, maxlength: 2000 },
  flags: [{ type: String, trim: true, maxlength: 200 }],
  recommendations: [{ type: String, trim: true, maxlength: 500 }],
  confidence: { type: Number, min: 0, max: 1 },
  modelName: { type: String, trim: true, maxlength: 120 },
  modelVersion: { type: String, trim: true, maxlength: 80 },
  analyzedAt: Date,
}, { _id: false });

const urineTestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
  observedAt: { type: Date, required: true, default: Date.now, index: true },
  sampleCollectedAt: Date,
  stripManufacturer: { type: String, trim: true, maxlength: 120 },
  stripLotNumber: { type: String, trim: true, maxlength: 80 },
  image: {
    storageKey: { type: String, trim: true, maxlength: 500 },
    mimeType: { type: String, enum: ["image/jpeg", "image/png", "image/webp"] },
    sha256: { type: String, match: /^[a-f0-9]{64}$/i },
  },
  device: {
    deviceId: { type: String, trim: true, maxlength: 120 },
    calibrationId: { type: String, trim: true, maxlength: 120 },
    ambientLight: { type: Number, min: 0 },
    temperatureC: { type: Number, min: -20, max: 80 },
  },
  parameters: {
    type: [parameterSchema],
    validate: {
      validator(items) { return items.length <= parameterNames.length && new Set(items.map((item) => item.name)).size === items.length; },
      message: "Parameters must be unique and contain at most one reading for each strip pad.",
    },
  },
  analysis: { type: analysisSchema, default: () => ({}) },
  notes: { type: String, trim: true, maxlength: 2000 },
  source: { type: String, enum: ["manual", "image", "device"], default: "manual" },
}, { timestamps: true });

urineTestSchema.index({ patient: 1, observedAt: -1 });
export { parameterNames };
export default mongoose.model("UrineTest", urineTestSchema);
