export function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// Central error handler: normalizes Mongoose/validation errors into clean JSON.
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    status = 400;
    message = `Invalid value for ${err.path}`;
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for: ${field}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(status).json({ message });
}
