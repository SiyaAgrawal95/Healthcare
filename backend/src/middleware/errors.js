export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Validation failed.", details: Object.values(error.errors).map((item) => item.message) });
  }
  if (error.name === "CastError") return res.status(400).json({ error: "Invalid identifier or field value." });
  if (error.code === 11000) return res.status(409).json({ error: "A record with that unique value already exists." });
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
}
