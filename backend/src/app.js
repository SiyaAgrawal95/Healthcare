import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import testRoutes from "./routes/tests.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",").map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "urinex-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api", testRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
