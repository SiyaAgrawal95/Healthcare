import { Router } from "express";
import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import UrineTest from "../models/UrineTest.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/patients/:patientId/tests", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.patientId)) return res.status(400).json({ error: "Invalid patient ID." });
    if (req.params.patientId !== req.patientId.toString()) return res.status(403).json({ error: "You may only access your own test records." });
    const patient = await Patient.findById(req.patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found." });
    const { from, to, limit = 50, page = 1 } = req.query;
    const filter = { patient: req.patientId };
    if (from || to) {
      filter.observedAt = {};
      if (from) filter.observedAt.$gte = new Date(from);
      if (to) filter.observedAt.$lte = new Date(to);
      if (Object.values(filter.observedAt).some((date) => Number.isNaN(date.getTime()))) return res.status(400).json({ error: "from/to must be valid dates." });
    }
    const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const [tests, total] = await Promise.all([
      UrineTest.find(filter).sort({ observedAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
      UrineTest.countDocuments(filter),
    ]);
    res.json({ tests, page: safePage, limit: safeLimit, total });
  } catch (error) { next(error); }
});

router.post("/patients/:patientId/tests", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.patientId)) return res.status(400).json({ error: "Invalid patient ID." });
    if (req.params.patientId !== req.patientId.toString()) return res.status(403).json({ error: "You may only create records for your own patient account." });
    const test = await UrineTest.create({ ...req.body, patient: req.patientId });
    res.status(201).json({ test });
  } catch (error) { next(error); }
});

router.get("/tests/:testId", async (req, res, next) => {
  try {
    const test = await UrineTest.findOne({ _id: req.params.testId, patient: req.patientId });
    if (!test) return res.status(404).json({ error: "Test not found." });
    res.json({ test });
  } catch (error) { next(error); }
});

router.patch("/tests/:testId", async (req, res, next) => {
  try {
    const allowed = ["observedAt", "sampleCollectedAt", "stripManufacturer", "stripLotNumber", "image", "device", "parameters", "analysis", "notes", "source"];
    const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (!Object.keys(update).length) return res.status(400).json({ error: "No editable test fields supplied." });
    const test = await UrineTest.findOneAndUpdate({ _id: req.params.testId, patient: req.patientId }, update, { new: true, runValidators: true });
    if (!test) return res.status(404).json({ error: "Test not found." });
    res.json({ test });
  } catch (error) { next(error); }
});

router.delete("/tests/:testId", async (req, res, next) => {
  try {
    const test = await UrineTest.findOneAndDelete({ _id: req.params.testId, patient: req.patientId });
    if (!test) return res.status(404).json({ error: "Test not found." });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;
