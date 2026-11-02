import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Patient from "../models/Patient.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false });
const issueToken = (patient) => jwt.sign({ sub: patient._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
const publicPatient = (patient) => ({ _id: patient._id, patientId: patient.patientId, fullName: patient.fullName, email: patient.email, dateOfBirth: patient.dateOfBirth, gender: patient.gender, phoneNumber: patient.phoneNumber, bloodGroup: patient.bloodGroup, allergies: patient.allergies, isDemo: patient.isDemo });

router.post("/register", authLimiter, async (req, res, next) => {
  try {
    const { fullName, email, password, dateOfBirth, gender, phoneNumber } = req.body;
    if (!fullName?.trim() || !email?.trim() || !password || !dateOfBirth) return res.status(400).json({ error: "fullName, email, password, and dateOfBirth are required." });
    if (typeof password !== "string" || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Enter a valid email and password." });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
    const passwordHash = await bcrypt.hash(password, 12);
    const patient = await Patient.create({ fullName, email, passwordHash, dateOfBirth, gender, phoneNumber });
    res.status(201).json({ patient: publicPatient(patient), token: issueToken(patient) });
  } catch (error) { next(error); }
});

router.post("/login", authLimiter, async (req, res, next) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const patient = await Patient.findOne({ email, isActive: true }).select("+passwordHash");
    if (!patient || !await bcrypt.compare(req.body.password || "", patient.passwordHash)) return res.status(401).json({ error: "Invalid email or password." });
    res.json({ patient: publicPatient(patient), token: issueToken(patient) });
  } catch (error) { next(error); }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.patientId);
    res.json({ patient: publicPatient(patient) });
  } catch (error) { next(error); }
});

export default router;
