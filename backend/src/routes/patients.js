import { Router } from "express";
import Patient from "../models/Patient.js";
import UrineTest from "../models/UrineTest.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/me", async (req, res, next) => {
  try { res.json({ patient: await Patient.findById(req.patientId) }); }
  catch (error) { next(error); }
});

router.patch("/me", async (req, res, next) => {
  try {
    const allowed = ["fullName", "dateOfBirth", "gender", "phoneNumber", "age", "bloodGroup", "allergies", "symptoms", "testDate", "additionalNotes"];
    const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (Object.keys(update).length === 0) return res.status(400).json({ error: "Provide at least one editable profile field." });
    const patient = await Patient.findByIdAndUpdate(req.patientId, update, { new: true, runValidators: true });
    res.json({ patient });
  } catch (error) { next(error); }
});

router.delete("/me", async (req, res, next) => {
  try {
    await Patient.findByIdAndUpdate(req.patientId, { isActive: false });
    res.status(204).end();
  } catch (error) { next(error); }
});

router.get("/me/tests", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const tests = await UrineTest.find({ patient: req.patientId }).sort({ observedAt: -1 }).limit(limit);
    res.json({ tests, count: tests.length });
  } catch (error) { next(error); }
});

export default router;
