import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, index: true },
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other", "prefer-not-to-say"], default: "prefer-not-to-say" },
  phoneNumber: { type: String, trim: true, maxlength: 30 },
  age: { type: Number, min: 0, max: 120 },
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""] },
  allergies: [{ type: String, trim: true, maxlength: 100 }],
  symptoms: { type: String, trim: true, maxlength: 2000 },
  testDate: Date,
  additionalNotes: { type: String, trim: true, maxlength: 2000 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; return ret; } } });

patientSchema.pre("validate", function assignPatientId() {
  if (!this.patientId && this._id) this.patientId = `PAT-${this._id.toString().slice(-8).toUpperCase()}`;
});

export default mongoose.model("Patient", patientSchema);
