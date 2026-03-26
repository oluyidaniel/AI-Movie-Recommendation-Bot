import { Router } from "express";
import { z } from "zod";

import { registerUser, authenticateUser } from "../services/userService.js";
import { signToken }                       from "../middleware/auth.js";
import { validate }                        from "../middleware/validate.js";
import { authLimiter }                     from "../middleware/rateLimit.js";
import logger                              from "../config/logger.js";

const router = Router();

const CredentialsSchema = z.object({
  username: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/i, "Letters, numbers and _ only"),
  password: z.string().min(4).max(128),
});

// ── POST /auth/register ───────────────────────────────────────────────────────

router.post("/register", authLimiter, validate(CredentialsSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user  = await registerUser(username, password);
    const token = signToken(user.id);
    logger.info(`New user registered: ${user.username}`);
    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});

// ── POST /auth/login ──────────────────────────────────────────────────────────

router.post("/login", authLimiter, validate(CredentialsSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user  = await authenticateUser(username, password);
    const token = signToken(user.id);
    logger.info(`User logged in: ${user.username}`);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});

// ── GET /auth/me ──────────────────────────────────────────────────────────────

import { requireAuth } from "../middleware/auth.js";

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
