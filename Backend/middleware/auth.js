import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { getUserById } from "../services/userService.js";

/**
 * Protect routes — verifies the Bearer JWT and attaches req.user.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing." });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const user    = getUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please sign in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
}

/**
 * Sign a JWT for a user.
 */
export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}
