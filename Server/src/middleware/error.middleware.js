
export function notFound(req, res, next) {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  res.status(status).json({
    error: err.message || "Internal server error",
    details: err.details || null,
  });
}
