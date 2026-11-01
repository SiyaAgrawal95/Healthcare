import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is required. Copy .env.example to .env and configure it.");
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set to a private value of at least 32 characters.");
  process.exit(1);
}

try {
  await mongoose.connect(mongoUri);
  console.info("Connected to MongoDB");
  const server = app.listen(port, () => console.info(`URINEX API listening on port ${port}`));

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
