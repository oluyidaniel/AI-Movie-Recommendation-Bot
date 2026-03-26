import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";

const SALT_ROUNDS = 12;

const stmts = {
  findByUsername: db.prepare("SELECT * FROM users WHERE username = ?"),
  findById:       db.prepare("SELECT id, username, created_at FROM users WHERE id = ?"),
  insert:         db.prepare(
    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)"
  ),
};

// ── Register ──────────────────────────────────────────────────────────────

export async function registerUser(username, password) {
  const existing = stmts.findByUsername.get(username.toLowerCase());
  if (existing) {
    throw Object.assign(new Error("Username already taken."), { status: 409 });
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id   = uuid();
  stmts.insert.run(id, username.toLowerCase(), hash);
  return { id, username: username.toLowerCase() };
}

// ── Login ─────────────────────────────────────────────────────────────────

export async function authenticateUser(username, password) {
  const user = stmts.findByUsername.get(username.toLowerCase());
  if (!user) {
    throw Object.assign(new Error("Invalid credentials."), { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Object.assign(new Error("Invalid credentials."), { status: 401 });
  }

  return { id: user.id, username: user.username };
}

// ── Find ──────────────────────────────────────────────────────────────────

export function getUserById(id) {
  return stmts.findById.get(id) || null;
}
