import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import db from "../db/database.js";

const SALT_ROUNDS = 12;

// === Register ===
export async function registerUser(username, password) {
  username = username.toLowerCase();

  // Check if user exists
  const existing = await db.get(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (existing) {
    throw Object.assign(new Error("Username already taken."), { status: 409 });
  }

  // Hash password and insert
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id   = uuid();

  await db.run(
    "INSERT INTO users (id, username, password) VALUES (?, ?, ?)",
    [id, username, hash]
  );

  return { id, username };
}

// === Login ===
export async function authenticateUser(username, password) {
  username = username.toLowerCase();

  const user = await db.get(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!user) {
    throw Object.assign(new Error("Invalid credentials."), { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Object.assign(new Error("Invalid credentials."), { status: 401 });
  }

  return { id: user.id, username: user.username };
}

// === Find ===
export async function getUserById(id) {
  const user = await db.get(
    "SELECT id, username, created_at FROM users WHERE id = ?",
    [id]
  );

  return user || null;
}