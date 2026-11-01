import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: "Authentication required." });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findById(payload.sub).select("_id isActive");
    if (!patient?.isActive) return res.status(401).json({ error: "Invalid or inactive account." });
    req.patientId = patient._id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
