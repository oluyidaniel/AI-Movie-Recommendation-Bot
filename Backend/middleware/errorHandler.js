import logger from "../config/logger.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status  = err.status  || 500;
  const message = err.message || "Internal server error.";

  if (status >= 500) {
    logger.error(`[${req.method}] ${req.path} → ${status}: ${message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`[${req.method}] ${req.path} → ${status}: ${message}`);
  }

  res.status(status).json({ error: message });
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
}
