import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,   // 15 minutes
  max:              20,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: "Too many requests. Please try again later." },
});

export const chatLimiter = rateLimit({
  windowMs:         60 * 1000,         // 1 minute
  max:              30,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: "Too many messages. Slow down a little." },
});
